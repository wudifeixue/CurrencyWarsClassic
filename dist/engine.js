import {CHARACTERS,CLASSIC_ROSTER,EQUIPMENT,STRATEGIES,RECIPES,LEVEL_XP,SHOP_ODDS,MAX_LEVEL,BENCH_CAPACITY,FRONT_CAPACITY,ROUND_COUNT,TRAITS,resolveEquipment} from './data.js?v=6.7.0';
import {simulateCombat,getEnemyLineup,getBattleStats,getBattleSynergies} from './combat.js?v=6.7.0';
import {initializeLoot,queueRewards,makeChest,makeRoleChest,getConsumable,validateLoot} from './loot.js?v=6.7.0';
import {initProgression,migrateProgression,validateProgression,onNodeEntry,onBattleResolved,onRosterChanged,onManagementAction,refreshProgression,applyProgressionAction,getEffectiveCharacterCost,getProgressionShopModifiers} from './classic-progression.js?v=6.7.0';
import {RUN_MODES,DIFFICULTIES,CLASSIC_LEVEL_XP,ZERO_SUM_LEVEL_XP,START_LEVEL,BOSS_MIN_PROGRESS,usesVerifiedRules,usesRevision3,getNodeBaseIncome,getNodeEntryGold,getNodeXp,getDefeatPenaltyParts,getStreakGold,getClassicSellPrice,initFlow,validateFlow,isClassicRun,getRunMode,getRunNodes,getCurrentNode,getRunLength,usesRevision4,getRank,RANKS,HIGH_RANK_LEVEL_XP,getStartingHp,getMinProgress,getNodeCountdown,getReviveCountdownLoss,usesRevision5,usesRevision6,RANK_ENEMY_SCALE} from './classic-flow.js?v=6.7.0';
import {initEnvironment,chooseEnvironment,rerollEnvironments,onEnvironmentEvent,getEnvironmentShopWeight,getEnvironmentShopOdds,getEnvironmentRefreshCost,getEnvironmentStrategyRarity,getEnvironmentRules,validateEnvironment} from './classic-environments.js?v=6.7.0';
import {combineInventoryItems,equipCraftingItem,getSmeltingPool} from './classic-crafting.js?v=6.7.0';
export {getEnemyLineup,simulateCombat} from './combat.js?v=6.7.0';
export {RUN_MODES,DIFFICULTIES,BOSS_MIN_PROGRESS,RANKS,getRunMode,getRunNodes,getCurrentNode,getRunLength,usesVerifiedRules,usesRevision3,usesRevision4,usesRevision5,usesRevision6,getRank,getMinProgress,getNodeCountdown,getNodeBaseIncome,getNodeXp};

const characters = new Map(CHARACTERS.map(c=>[c.id,c]));
const strategyIds = new Set(STRATEGIES.map(s=>s.id));
const clone = value => JSON.parse(JSON.stringify(value));
const fail = message => ({ok:false,message});
const success = message => ({ok:true,message});
const has = (state,id) => state.strategies.includes(id);
const strategies = new Map(STRATEGIES.map(s=>[s.id,s]));
const effects = state => state.strategies.map(id=>({id,...strategies.get(id)?.effect}));
const sumEffect = (state,key) => effects(state).reduce((sum,e)=>sum+(Number(e[key])||0),0);
const meta = (state,id) => state.strategyState[id] ||= {acquiredRound:state.round,nodes:0,purchasedCosts:[]};
const spend = (state,amount) => {state.gold-=amount;state.goldSpentThisNode+=amount;};
const deployed = state => state.units.filter(u=>u.zone!=='bench');
const baseItemId=id=>getEquipment(id)?.baseId||id;
const daySlots=(state,uid)=>Object.values(state.progression?.day?.assignments||{}).filter(target=>target===uid).length;
const unitCost=(state,unit)=>getEffectiveCharacterCost(state,unit.characterId,unit);
export const getCharacter = id => characters.get(String(id));
export const getEquipment = resolveEquipment;
export const getMaxHp = state => 100+(state.bonusMaxHp||0)+sumEffect(state,'maxHp');
export const getPopulationLimit = state => state.level+(state.consumables||[]).filter(c=>c.id==='wealth-gem').length+(state.inventory||[]).filter(id=>id==='wealth-gem').length+(state.units||[]).reduce((n,u)=>n+u.items.filter(id=>id==='wealth-gem').length,0);
export {getEffectiveCharacterCost};
// Board slots. The front row has 4 places and the back row 6; the back row grows (to 9 at most, the
// old client's maximum) only when Wealth Gems raise the team size past 10. The bench has 9.
const ZONES=['front','back','bench'];
export const getBackCapacity=state=>Math.min(9,Math.max(6,getPopulationLimit(state)-FRONT_CAPACITY));
export const getZoneCapacity=(state,zone)=>zone==='front'?FRONT_CAPACITY:zone==='back'?getBackCapacity(state):BENCH_CAPACITY;
// 武装箱 and 聘用书 are grid items: each one stands in a bench slot until it is opened, so it counts
// against the 9 bench places just like a character.
const benchChests=state=>(state.chests||[]).filter(c=>Number.isInteger(c.slot));
export const getBenchCount=state=>state.units.filter(u=>u.zone==='bench').length+benchChests(state).length;
const chestAt=(state,slot)=>benchChests(state).find(c=>c.slot===slot);
function freeSlot(state,zone,except) {
  const taken=new Set(state.units.filter(u=>u!==except&&u.zone===zone&&Number.isInteger(u.slot)).map(u=>u.slot));
  if(zone==='bench')for(const c of benchChests(state))if(c!==except)taken.add(c.slot);
  let slot=0;while(taken.has(slot))slot++;return slot;
}
// Every unit stands in a numbered slot of its row. Units that arrive without a valid one take the
// first free slot, and each row's units are kept in slot order so left-to-right order is the same
// for the board, the battle line-up and "leftmost" effects.
function settleSlots(state) {
  if(!Array.isArray(state.units))return;
  const chests=Array.isArray(state.chests)?state.chests:[],chestSlots=new Set(),loose=[];
  for(const chest of chests){if(Number.isInteger(chest.slot)&&chest.slot>=0&&chest.slot<BENCH_CAPACITY&&!chestSlots.has(chest.slot))chestSlots.add(chest.slot);else loose.push(chest);}
  for(const zone of ZONES) {
    const capacity=getZoneCapacity(state,zone),row=state.units.filter(u=>u?.zone===zone),taken=new Set(zone==='bench'?chestSlots:[]),pending=[];
    for(const unit of row){if(Number.isInteger(unit.slot)&&unit.slot>=0&&unit.slot<capacity&&!taken.has(unit.slot))taken.add(unit.slot);else pending.push(unit);}
    for(const unit of pending){let slot=0;while(taken.has(slot))slot++;unit.slot=slot;taken.add(slot);}
    // Chests from saves made before they lived on the bench take the free slots that remain; with a
    // full bench they go back onto the board as a crystal, so nothing is lost.
    if(zone==='bench')for(const chest of loose) {
      let slot=0;while(taken.has(slot))slot++;
      if(slot<BENCH_CAPACITY){chest.slot=slot;taken.add(slot);continue;}
      delete chest.slot;state.chests.splice(state.chests.indexOf(chest),1);if(state.activeChest===chest.uid)state.activeChest=null;
      state.loot.push({uid:`loot-${state.nextLootUid++}`,quality:chest.kind==='role'?'blue':['advanced','gold'].includes(chest.quality)?'gold':['prismatic','privileged'].includes(chest.quality)?'prismatic':'blue',source:'武装箱',contents:[{kind:'chest',chest}]});
    }
    const places=state.units.map((u,i)=>u?.zone===zone?i:-1).filter(i=>i>=0),ordered=[...row].sort((a,b)=>a.slot-b.slot);
    places.forEach((index,n)=>{state.units[index]=ordered[n];});
  }
}
// 无法上阵同名角色 (old client text): the field — 前台 and 后台 together — holds one copy of each
// character. Only a unit coming up from the bench is checked, so a field already holding two copies
// from an older save can still be rearranged.
export const fieldHasCopy=(state,unit,except=null)=>isClassicRun(state)&&state.units.some(u=>u!==unit&&u!==except&&u.zone!=='bench'&&u.characterId===unit.characterId);
const entersFieldAsCopy=(state,unit,zone,except=null)=>unit.zone==='bench'&&zone!=='bench'&&fieldHasCopy(state,unit,except);
function swapUnits(state,a,b) {
  if(entersFieldAsCopy(state,a,b.zone,b)||entersFieldAsCopy(state,b,a.zone,a))return fail('无法上阵同名角色');
  const ia=state.units.indexOf(a),ib=state.units.indexOf(b),zone=a.zone,slot=a.slot;
  state.units[ia]=b;state.units[ib]=a;a.zone=b.zone;a.slot=b.slot;b.zone=zone;b.slot=slot;
  const ca=getCharacter(a.characterId),cb=getCharacter(b.characterId);
  return success(a.zone===b.zone?'已调整站位':`已交换${ca.name}与${cb.name}的位置`);
}
export const getLevelXp=state=>(isClassicRun(state)?usesVerifiedRules(state)?getRank(state)>=5?HIGH_RANK_LEVEL_XP:ZERO_SUM_LEVEL_XP:CLASSIC_LEVEL_XP:LEVEL_XP)[state.level]||0;
export const getSellPrice=(state,unit)=>!unit?0:usesVerifiedRules(state)?getClassicSellPrice(unitCost(state,unit),unit.star):unitCost(state,unit)*3**(unit.star-1);
export function getShopOdds(state) {
  const odds=[...SHOP_ODDS[state.level]],bonus=getProgressionShopModifiers(state).fiveCostOddsBonus*100;
  if(bonus){odds[0]-=bonus;odds[4]+=bonus;}
  return getEnvironmentShopOdds(state,odds);
}
export const getRefreshCost = state => state.freeRefreshes>0?0:getEnvironmentRefreshCost(state,has(state,'discount')?1:2);
export function getInterest(state) {
  if(!getRunMode(state).interest)return 0;
  if(effects(state).some(e=>e.noInterest))return 0;
  return Math.min(Math.max(has(state,'compound')?8:5,...effects(state).map(e=>e.interestCap||0)),Math.floor(state.gold/10));
}

function random(state) {
  let value = state.rng >>> 0;
  value ^= value << 13; value ^= value >>> 17; value ^= value << 5;
  state.rng = value >>> 0;
  return state.rng / 4294967296;
}

function pick(state,list) { return list[Math.floor(random(state)*list.length)]; }
function addUnit(state,characterId,zone='bench',star=1,cost=getEffectiveCharacterCost(state,String(characterId))) {
  const unit={uid:`u${state.nextUid++}`,characterId:String(characterId),star,zone,slot:freeSlot(state,zone),items:[],recruitCost:cost};
  state.units.push(unit);
  return unit;
}

// A character the player already has at 3 stars stops being offered (revision 6): it cannot be
// upgraded any further, so a copy in the shop or supply would only be a dead card.
export const isMaxedCharacter=(state,id)=>usesRevision6(state)&&state.units.some(u=>u.characterId===String(id)&&u.star>=3);
function offerPool(state,cost){
  const all=CLASSIC_ROSTER.filter(c=>getEffectiveCharacterCost(state,c.id)===cost),open=all.filter(c=>!isMaxedCharacter(state,c.id));
  return open.length?open:all;
}
function rollShop(state) {
  state.shop = Array.from({length:5},()=>{
    let roll=random(state)*100;
    let cost=1;
    for(const chance of getShopOdds(state)) {if(roll<chance) break;roll-=chance;cost++;}
    const pool=offerPool(state,cost);
    let weight=random(state)*pool.reduce((total,c)=>total+getEnvironmentShopWeight(state,c),0);
    return (pool.find(c=>(weight-=getEnvironmentShopWeight(state,c))<0)||pool.at(-1)).id;
  });
}

function addXp(state,amount) {
  state.xp+=amount;
  while(state.level<MAX_LEVEL && state.xp>=getLevelXp(state)) {
    state.xp-=getLevelXp(state);state.level++;
  }
  if(state.level===MAX_LEVEL) state.xp=0;
}

function retainCompatibleItems(state,unit,items) {
  unit.items=[];
  for(const id of items) {
    const item=getEquipment(id);
    if(unit.items.length+daySlots(state,unit.uid)>=3||unit.items.some(key=>getEquipment(key)?.exclusiveSlots)||(item?.exclusiveSlots&&(unit.items.length||daySlots(state,unit.uid)))||(item?.unique&&unit.items.some(key=>baseItemId(key)===baseItemId(id))))state.inventory.push(id);
    else unit.items.push(id);
  }
}

function mergeUnits(state) {
  const merges=[];
  for(let star=1;star<=2;star++) {
    for(const character of CHARACTERS) {
      const costs=[...new Set(state.units.filter(u=>u.characterId===character.id&&u.star===star).map(u=>unitCost(state,u)))];
      for(const cost of costs){
      let copies=state.units.filter(u=>u.characterId===character.id&&u.star===star&&unitCost(state,u)===cost);
      while(copies.length>=3) {
        copies.sort((a,b)=>({front:0,back:1,bench:2}[a.zone]-{front:0,back:1,bench:2}[b.zone]));
        const group=copies.slice(0,3), survivor=group[0];
        survivor.extraTraits=[...new Set(group.flatMap(u=>u.extraTraits||[]))];
        for(const [id,uid] of Object.entries(state.progression.day.assignments))if(group.some(u=>u.uid===uid))state.progression.day.assignments[id]=survivor.uid;
        for(const [id,uid] of Object.entries(state.progression.gamer.accessoryOwners||{}))if(group.some(u=>u.uid===uid))state.progression.gamer.accessoryOwners[id]=survivor.uid;
        const allItems=group.flatMap(u=>u.items);
        survivor.star++;
        retainCompatibleItems(state,survivor,allItems);
        const removed=new Set(group.slice(1).map(u=>u.uid));
        state.units=state.units.filter(u=>!removed.has(u.uid));
        merges.push(`${character.name}升至${survivor.star}星`);
        copies=state.units.filter(u=>u.characterId===character.id&&u.star===star&&unitCost(state,u)===cost);
      }
      }
    }
  }
  return merges;
}

export function createGame(seed=Date.now(),options={}) {
  const normalized=(Number(seed)>>>0)||197706;
  const state={version:3,ruleset:'zero-sum',seed:normalized,rng:normalized,round:1,hp:100,gold:16,level:4,xp:0,nextUid:1,
    units:[],shop:[],locked:false,inventory:[],strategies:[],phase:'prep',
    choices:[],choiceKind:null,streak:0,wins:0,losses:0,lastBattle:null,history:[],result:null,
    freeRefreshes:0,goldSpentThisNode:0,strategyState:{},progression:initProgression()};
  initializeLoot(state,true);
  addUnit(state,'1013','front');addUnit(state,'1009','front');addUnit(state,'1108','front');addUnit(state,'1001','back');
  state.shop=['1013','1001','1013','1202','1201'];
  if(options.mode){
    // Verified opening: level 3, nothing deployed, an unrolled shop and no gold until the
    // Starting Supplies arrive with the chosen investment environment.
    state.flow=initFlow(options.mode,options.difficulty,options.rank);
    state.hp=getStartingHp(state);
    state.level=START_LEVEL;state.gold=0;state.units=[];state.loot=[];state.shop=Array(5).fill(null);
    initEnvironment(state,{enabled:true});state.phase='environment';
  }
  return state;
}

export const getSynergies = getBattleSynergies;

export function getUnitStats(state,unit) {
  const stats=getBattleStats(state,unit);
  const power=Math.round((stats.attack*2.2+stats.hp*.18)*(stats.speed/100));
  const efficiency=unit.zone==='front'?1:unit.zone==='back'?(has(state,'backline')?1:.72):0;
  return {...stats,power,contribution:Math.round(power*efficiency)};
}

export function getTeamPower(state) {return deployed(state).reduce((sum,u)=>sum+getUnitStats(state,u).contribution,0);}

export function getEnemy(state) {
  const enemies=[
    ['裂界巡逻队',1050,'踏出第一步，检验你的初始阵容。'],
    ['虚卒突袭小队',1430,'敌方开始集结，升星能带来显著提升。'],
    ['永冬军团',1750,'稳定的前台和后台支援同样重要。'],
    ['金人司阍',2180,'第一位面首领。完善装备，建立你的核心阵容。'],
    ['丰饶孽物',2450,'更多人口，让羁绊彼此呼应。'],
    ['银鬃铁卫精锐',2780,'中期强敌，投资策略将开始发挥作用。'],
    ['反物质军团',3120,'考验阵容的成长速度与经济运营。'],
    ['史瓦罗',3580,'第二位面首领。强大的机械防线正在逼近。'],
    ['药王秘传',3920,'把闲置装备交给主力，争取每一点战力。'],
    ['虚卒·践踏者',4270,'最终位面，寻找高费角色补强阵容。'],
    ['末日军团',4630,'决战前的最后试炼。准备好你的最终阵容。'],
    ['末日兽',5100,'最终首领。击败它，完成这场经典远征。'],
  ];
  const node=getCurrentNode(state),[name,power,description]=enemies[Math.max(0,Math.min(11,(node?.combatRound||state.round)-1))];
  const difficulty=usesRevision6(state)?RANK_ENEMY_SCALE[getRank(state)]||RANK_ENEMY_SCALE[0]:DIFFICULTIES[state.flow?.difficulty||0],encounter=state.flow?.selectedEncounter;
  // Simulator tuning: a full standard route earns far more equipment and copies
  // than the historical web prototype. These are not original server stats.
  const routeHp=[0,1+(node?.index||1)*.2,5+(node?.index||1)*.5,10+(node?.index||1)*.9][node?.plane||1];
  const routeAttack=[0,1.05,1.35,1.7][node?.plane||1];
  const hpFactor=isClassicRun(state)?routeHp*difficulty.hpMultiplier*(encounter?.hpMultiplier||1)*(node.type==='reward'?.2:1):1;
  const attackFactor=isClassicRun(state)?routeAttack*difficulty.attackMultiplier*(encounter?.attackMultiplier||1)*(node.type==='reward'?.45:1):1;
  const units=getEnemyLineup(node?.combatRound||state.round).map(e=>({...e,maxHp:Math.round(e.maxHp*hpFactor),hp:Math.round(e.hp*hpFactor),attack:Math.round(e.attack*attackFactor)}));
  return {name:node?.type==='reward'?'奖励节点 · 战利品守卫':name,power:Math.round(power*hpFactor),boss:node?.boss||false,description,units,node};
}

function choicesFor(state,kind) {
  const candidates=kind==='strategy'?STRATEGIES.filter(s=>!s.legacy&&!has(state,s.id)&&s.planes.includes(getCurrentNode(state)?.plane||Math.ceil(state.round/4))):EQUIPMENT.filter(e=>e.tier===1);
  const pool=[...candidates];state.choices=[];
  while(state.choices.length<3&&pool.length) {
    const rarity=getEnvironmentStrategyRarity(state,(state.flow?.strategySelections||0)+1,state.choices.length);
    const eligible=pool.filter(s=>!rarity||s.rarity===rarity);
    if(!eligible.length)break;
    const candidate=pick(state,eligible),index=pool.indexOf(candidate);
    state.choices.push({kind,id:pool.splice(index,1)[0].id});
  }
  if(state.flow)state.flow.strategyRerolls=Array(3).fill(1+(getEnvironmentRules(state).strategyRerollsBonus||0));
  state.choiceKind=kind;state.phase='choice';
}

function gainStrategy(state,id) {
  const e=strategies.get(id)?.effect||{};
  state.strategies.push(id);meta(state,id);
  state.gold+=(e.gold||0)+(e.goldFromLostHp?Math.max(0,getMaxHp(state)-state.hp):0);
  state.freeRefreshes+=e.freeRefreshes||0;
  addXp(state,e.xp||0);
  state.hp=Math.min(getMaxHp(state),state.hp+(e.heal||0));
  queueRewards(state,(e.items||[]).map(id=>({kind:'item',id})),'投资策略');
  queueRewards(state,e.rewards||[],'投资策略');
  if(id==='compound')state.gold+=8;
  if(id==='growth')addXp(state,8);
}

function enterNode(state) {
  for(const e of effects(state)) {
    const record=meta(state,e.id);record.nodes++;
    if(!e.nodeGoldLimit||record.nodes<=e.nodeGoldLimit)state.gold+=e.nodeGold||0;
    if(!e.nodeRewardLimit||record.nodes<=e.nodeRewardLimit)queueRewards(state,e.nodeRewards||[],'投资策略');
    state.freeRefreshes+=(e.nodeFreeRefreshes||0)+(state.goldSpentThisNode===0?(e.unspentFreeRefreshes||0):0);
    addXp(state,e.nodeXp||0);
    if(e.benchXp&&state.units.filter(u=>u.zone==='bench').length<=e.benchMaxForXp)addXp(state,e.benchXp);
    if(getCurrentNode(state)?.index===1) {addXp(state,e.planeXp||0);state.freeRefreshes+=e.planeFreeRefreshes||0;}
    if(getCurrentNode(state)?.boss)state.gold+=e.bossGold||0;
  }
  state.goldSpentThisNode=0;
  for(const unit of state.units.filter(u=>u.items.includes('wealth-gem'))) {
    unit.wealthNodes=(unit.wealthNodes||0)+1;
    if(unit.wealthNodes%3===0)queueRewards(state,[{kind:'gold',amount:unit.items.filter(id=>id==='wealth-gem').length}],'财富宝钻');
  }
  queueRewards(state,onNodeEntry(state),'羁绊成长');
  if(isClassicRun(state)){
    state.gold+=getNodeEntryGold(state);
    const node=getCurrentNode(state);queueRewards(state,onEnvironmentEvent(state,{...node,node,type:'node',key:String(state.round)}),'投资环境');
  }
}

// Supply nodes (revision 5). Four recorded supply screens, all at A7 (REC1 1-5, 2-3 and 3-3, REC2
// 1-5): on the first plane the five characters cost 1–4, about the shop's odds for the player's
// level; 2-3 offered only 3- and 4-costs and 3-3 only 4- and 5-costs. Planes 1 and 2 paired them
// with basic equipment and plane 3 with advanced equipment, which matches Fandom's "higher levels
// will offer rarer characters with better equipment". The client keeps the supply pools on the
// server, so the plane 2 and 3 weights are estimates from those samples. Five packs, the one re-deal
// and the diamonds come from talents the recorded accounts had (额外补给, 补给刷新, 钻石闪耀); 1 diamond
// showed up in 25 recorded packs.
const SUPPLY_COST_ODDS=Object.freeze({2:[0,0,50,50,0],3:[0,0,0,60,40]});
export const SUPPLY_DIAMOND_CHANCE=.05;
export const getSupplyCostOdds=(state,plane=getCurrentNode(state)?.plane)=>SUPPLY_COST_ODDS[plane]||getShopOdds(state);
function supplyCharacter(state,cost,taken){
  const ofCost=c=>getEffectiveCharacterCost(state,c.id)===cost;
  const fresh=CLASSIC_ROSTER.filter(c=>ofCost(c)&&!taken.has(c.id)&&!isMaxedCharacter(state,c.id)),pool=fresh.length?fresh:CLASSIC_ROSTER.filter(ofCost);
  const list=pool.length?pool:CLASSIC_ROSTER.filter(c=>c.cost===cost);
  let weight=random(state)*list.reduce((total,c)=>total+getEnvironmentShopWeight(state,c),0);
  return list.find(c=>(weight-=getEnvironmentShopWeight(state,c))<0)||list.at(-1);
}
function makeSupplyOffers(state){
  const node=getCurrentNode(state),materials=EQUIPMENT.filter(e=>e.tier===1),count=getEnvironmentRules(state).supplyEquipmentCount||1;
  if(usesRevision5(state)){
    const odds=getSupplyCostOdds(state,node.plane),total=odds.reduce((a,b)=>a+b,0),gear=node.plane>=3?EQUIPMENT.filter(e=>e.tier===2):materials,taken=new Set();
    state.flow.supplyOffers=Array.from({length:5},(_,i)=>{
      let roll=random(state)*total,cost=5;for(let c=0;c<5;c++){roll-=odds[c];if(roll<0){cost=c+1;break;}}
      const character=supplyCharacter(state,cost,taken);taken.add(character.id);
      const itemId=random(state)<SUPPLY_DIAMOND_CHANCE?pick(state,['red-gem','blue-gem']):pick(state,gear).id,item=getEquipment(itemId);
      const rewards=[{kind:'character',id:character.id,star:1},{kind:'item',id:itemId,amount:count}];
      return {id:`supply-${state.round}-${i}`,name:`${character.name} · 补给包`,description:`获得${getEffectiveCharacterCost(state,character.id)}费${character.name}，以及${count===2?'2件':''}${item.name}。`,rewards};
    });
    state.phase='supply';return;
  }
  if(usesRevision4(state)){
    // Old-season supply (REC1 1-5, Fandom's node page): five packs, take one, one free re-flip. Each is
    // a character drawn with the player's shop odds plus one basic item; REC1 showed a Red Gem among
    // the five, so a diamond can stand in for the item (that 15% chance is an estimate).
    const odds=getShopOdds(state),taken=new Set();
    state.flow.supplyOffers=Array.from({length:5},(_,i)=>{
      let roll=random(state)*odds.reduce((a,b)=>a+b,0),cost=1;for(let c=0;c<5;c++){roll-=odds[c];if(roll<0){cost=c+1;break;}}
      const pool=CLASSIC_ROSTER.filter(c=>c.cost===cost&&!taken.has(c.id)),character=pick(state,pool.length?pool:CLASSIC_ROSTER.filter(c=>c.cost===cost));taken.add(character.id);
      const gem=random(state)<.15&&getEquipment('red-gem'),itemId=gem?pick(state,['red-gem','blue-gem']):pick(state,materials).id;
      const rewards=[{kind:'character',id:character.id,star:1},{kind:'item',id:itemId,amount:count}];
      return {id:`supply-${state.round}-${i}`,name:`${character.name} · 补给包`,description:`获得${character.cost}费${character.name}，以及${count===2?'2件':''}${getEquipment(itemId).name}。`,rewards};
    });
    state.phase='supply';return;
  }
  const cost=Math.min(5,node.plane+1),pool=CLASSIC_ROSTER.filter(c=>c.cost===cost);
  state.flow.supplyOffers=Array.from({length:3},(_,i)=>{
    const character=pick(state,pool),item=pick(state,materials);
    const rewards=[{kind:'character',id:character.id,star:1},{kind:'item',id:item.id,amount:count}];
    // Diamond supplies are original; the offer chance is simulator tuning.
    if(node.plane>=2&&i===2&&getEquipment('red-gem'))rewards[1]={kind:'item',id:pick(state,['red-gem','blue-gem']),amount:count};
    return {id:`supply-${state.round}-${i}`,name:`${character.name} · 补给包`,description:`获得${cost}费${character.name}，以及${rewards[1].amount===2?'2件':''}${getEquipment(rewards[1].id).name}。领取后以晶矿保留，可稍后开启。`,rewards};
  });
  state.phase='supply';
}
// Encounter rewards (revision 4). Fandom's node page: the player picks one of two fights, an easy and
// a hard one, out of four star tiers; low tiers pay token gold, EXP or free refreshes, higher tiers
// larger amounts plus basic equipment or 4/5-cost characters, and the 4-star tier Wealth Gems or an
// advanced equipment selector. The client adds +0 / +5 / +10 / +20 enemy difficulty by tier. Amounts
// below follow the client's value units and are estimates.
const ENCOUNTER_TIER_NAMES=['','一星挑战','二星挑战','三星挑战','四星挑战'];
function encounterRewards(state,level,plane){
  const pickOne=list=>list[Math.floor(random(state)*list.length)];
  if(level===1)return [pickOne([{kind:'gold',amount:2+plane},{kind:'xp',amount:4},{kind:'refresh',amount:2}])];
  if(level===2)return pickOne([[{kind:'gold',amount:3+plane},{kind:'refresh',amount:2}],[{kind:'xp',amount:6},{kind:'gold',amount:2+plane}]]);
  if(level===3)return pickOne([[{kind:'item',id:pick(state,EQUIPMENT.filter(e=>e.tier===1)).id},{kind:'gold',amount:2+plane}],[{kind:'character',id:pick(state,CLASSIC_ROSTER.filter(c=>c.cost===(plane>=3?5:4))).id}]]);
  return pickOne([[{kind:'item',id:'wealth-gem'},{kind:'gold',amount:2*plane}],[{kind:'chest',quality:plane>=3?'privileged':'advanced'},{kind:'gold',amount:2*plane}]]);
}
function makeEncounterOffers(state){
  const plane=getCurrentNode(state).plane;
  if(usesRevision4(state)){
    const low=1+Math.floor(random(state)*3);
    state.flow.encounterOffers=[low,low+1].map(level=>{
      const rewards=encounterRewards(state,level,plane);
      return {id:`encounter-${state.round}-${level}`,name:ENCOUNTER_TIER_NAMES[level],level,hpMultiplier:[0,1,1.15,1.3,1.6][level],attackMultiplier:[0,1,1.1,1.2,1.35][level],description:level===low?'较轻松的一场战斗，奖励较少。':'更强的敌人，奖励更好。',rewards};
    });state.phase='encounter';return;
  }
  state.flow.encounterOffers=[1,2,3].map(level=>{
    const rewards=level===1?[{kind:'gold',amount:6+plane*2}]:level===2?[{kind:'chest',quality:'basic'},{kind:'refresh',amount:5}]:[{kind:'chest',quality:plane===3?'privileged':'advanced'},{kind:'gold',amount:8+plane*2}];
    return {id:`encounter-${state.round}-${level}`,name:`难度 ${level}`,level,hpMultiplier:[0,.9,1.2,1.65][level],attackMultiplier:[0,.85,1.05,1.25][level],description:level===1?'较轻的战斗压力，获胜获得金币。':level===2?'更强的敌人，获胜获得简易武装箱与5次免费刷新。':'高难度敌人，获胜获得进阶武装箱和更多金币；第三位面升级为特权箱。',rewards};
  });state.phase='encounter';
}
function prepareClassicNode(state){
  const node=getCurrentNode(state),rules=getEnvironmentRules(state),flow=state.flow;
  state.choices=[];state.choiceKind=null;flow.pendingNodeKind=null;
  if(node.boss&&rules.extraBossSupply&&!flow.extraSupplyDone.includes(state.round)){
    flow.pendingNodeKind='prep';makeSupplyOffers(state);return;
  }
  if(rules.extraStrategyLabels?.includes(node.label)&&!flow.extraStrategyDone.includes(state.round)){
    flow.pendingNodeKind=node.type==='encounter'?'encounter':node.type==='supply'?'supply':'prep';choicesFor(state,'strategy');return;
  }
  if(node.type==='strategy')choicesFor(state,'strategy');
  else if(node.type==='supply')makeSupplyOffers(state);
  else if(node.type==='encounter')makeEncounterOffers(state);
  else state.phase='prep';
}
function finishRun(state){
  state.phase='ended';state.result=state.hp>0?'victory':'defeat';
  state.runSummary={mode:getRunMode(state).name,nodesCompleted:state.round,totalNodes:getRunLength(state),battles:state.history.length,wins:state.wins,losses:state.losses,rankGain:state.hp>0&&state.flow?.mode==='standard'?(state.hp>=70?3:state.hp>=40?2:1):0};
  return success(state.result==='victory'?'三个位面完成，对局胜利。':'本次博弈结束，下一次投资会更好。');
}
function advanceClassicNode(state){
  if(state.hp<=0||state.round>=getRunLength(state))return finishRun(state);
  const finished=getCurrentNode(state);state.round++;const flow=state.flow;flow.nodeComplete=false;flow.selectedEncounter=null;flow.supplyOffers=[];flow.encounterOffers=[];flow.supplyRerolls=1;flow.encounterRerolls=1;
  addXp(state,usesVerifiedRules(state)?getNodeXp(state,finished):getRunMode(state).nodeXp);enterNode(state);if(!state.locked)rollShop(state);prepareClassicNode(state);
  return success(`进入 ${getCurrentNode(state).label} · ${getCurrentNode(state).name}`);
}

// Reward-node crystals (revision 4). REC1's settlement pages show 2 white + 2 blue crystals at 1-1
// and 3 white + 2 blue at 1-2, and what came out was small: free refreshes, a 1-cost character and a
// couple of basic items; no 武装箱 and no large gold. The client prices rewards in one unit (1 gold
// = 1, a free refresh = 2, an N-cost character = N, a basic item = 6, a basic 武装箱 = 4, an advanced
// one = 14) and the crystal colour follows that value, but the crystal pools themselves are kept on
// the server. So: white ≈ 2–4, blue ≈ 6, gold ≈ 14, with the weights below as estimates. The later
// reward nodes (1-8, 2-6, 3-6 and Overclock's) were not read from footage and are scaled up by plane.
const weighted=(state,list)=>{let roll=random(state)*list.reduce((n,[w])=>n+w,0);for(const [w,value] of list){roll-=w;if(roll<0)return value;}return list.at(-1)[1];};
const rosterOf=(state,cost)=>pick(state,CLASSIC_ROSTER.filter(c=>c.cost===cost)).id;
const basicItem=state=>pick(state,EQUIPMENT.filter(e=>e.tier===1)).id;
const ORB_CONTENTS={
  white:state=>weighted(state,[[40,()=>[{kind:'refresh',amount:2}]],[30,()=>[{kind:'gold',amount:2}]],[30,()=>[{kind:'character',id:rosterOf(state,1)}]]])(),
  blue:state=>weighted(state,[[60,()=>[{kind:'item',id:basicItem(state)}]],[20,()=>[{kind:'character',id:rosterOf(state,2)}]],[20,()=>[{kind:'refresh',amount:3}]]])(),
  gold:state=>weighted(state,[[50,()=>[{kind:'chest',quality:'advanced'}]],[25,()=>[{kind:'item',id:basicItem(state)},{kind:'item',id:basicItem(state)}]],[25,()=>[{kind:'character',id:rosterOf(state,3)},{kind:'gold',amount:4}]]])(),
};
export function getRewardNodeLayout(state,node){
  const rewards=getRunNodes(state).filter(n=>n.type==='reward'),order=rewards.indexOf(rewards.find(n=>n.round===node.round));
  if(order===0)return {white:2,blue:2,gold:0};
  if(order===1&&node.plane===1)return {white:3,blue:2,gold:0};
  return [{white:3,blue:2,gold:1},{white:2,blue:3,gold:1},{white:2,blue:2,gold:2}][Math.max(0,Math.min(2,node.plane-1))];
}
function rewardNodeOrbs(state,node){
  const layout=getRewardNodeLayout(state,node);
  return Object.entries(layout).flatMap(([quality,count])=>Array.from({length:count},()=>({orbQuality:quality,contents:ORB_CONTENTS[quality](state)})));
}
function grantCharacter(state,id,star=1,cost=getEffectiveCharacterCost(state,id)) {
  if(!getCharacter(id))return fail('奖励角色不存在。');
  const copies=state.units.filter(u=>u.characterId===id&&u.star===star&&unitCost(state,u)===cost).length;
  if(getBenchCount(state)>=BENCH_CAPACITY&&(star>=3||copies<2))return fail('备战席已满，需要售卖备战区角色才可开启晶矿。');
  addUnit(state,id,'bench',star,cost);mergeUnits(state);return success('角色已加入备战席');
}
function placeChest(state,chest) {
  const slot=freeSlot(state,'bench',chest);
  if(slot>=BENCH_CAPACITY)return fail('备战席已满，需要售卖备战区角色才可开启晶矿。');
  chest.slot=slot;state.chests.push(chest);return success('武装箱已放入备战席');
}
function grantRewards(state,contents) {
  const names=[];
  for(const r of contents) {
    const n=r.amount??1;
    if(r.kind==='gold'){state.gold+=n;names.push(`${n}金币`);}
    else if(r.kind==='xp'){addXp(state,n);names.push(`${n}经验`);}
    else if(r.kind==='refresh'){state.freeRefreshes+=n;names.push(`${n}次免费刷新`);}
    else if(r.kind==='hp'){state.bonusMaxHp+=r.maxHp||0;state.hp=Math.min(getMaxHp(state),state.hp+n);names.push(`${n}小队生命`);}
    else if(r.kind==='chest'){const result=placeChest(state,r.chest||makeChest(state,r.quality,r.options));if(!result.ok)return result;names.push('武装箱');}
    else if(r.kind==='character') {
      for(let i=0;i<n;i++){const result=grantCharacter(state,String(r.id),r.star||1,r.cost);if(!result.ok)return result;}
      names.push(getCharacter(r.id).name);
    } else if(r.kind==='item') {
      for(let i=0;i<n;i++) {
        if(getEquipment(r.id))state.inventory.push(r.id);
        // 聘用书 are forge items: they wait on the bench and offer four characters of that cost.
        else if(/^hire-[1-5]$/.test(r.id)){const result=placeChest(state,makeRoleChest(state,Number(r.id.slice(5))));if(!result.ok)return result;}
        // Holding the reusable Precision Disassembly Wrench turns any further wrench into 1 gold.
        else if(['wrench','precision-wrench'].includes(r.id)&&state.consumables.some(c=>c.id==='precision-wrench'))state.gold+=1;
        else if(getConsumable(r.id))state.consumables.push({uid:`tool-${state.nextLootUid++}`,id:r.id,nodes:0});
        else return fail('奖励数据无法识别，晶矿已保留。');
      }
      names.push((getEquipment(r.id)||getConsumable(r.id)).name);
    }
  }
  return success(`已获得：${names.join('、')}`);
}
// Starting Supplies. The run opens with an empty board and the supplies already delivered: four
// one-star characters on the bench (two recordings and the old client constant), 3 or 4 gold, one
// basic equipment in the list and one more inside a crystal on the board. A concept environment
// turns two of the four into its own characters and supplies the equipment itself; contract
// environments add their characters on top.
// Cost spread (revision 4): the two full recordings that show all four, REC2 (1/2/1/2) and V1
// (1/1/1/3), both total 6, and REC1 kept two 1-costs beside its two environment characters. So the
// four are 1/1/2/2 or 1/1/1/3, and a concept environment replaces the two dearest. Earlier runs drew
// all four from the 1-cost pool.
export function getStarterCosts(state){
  if(!usesRevision4(state))return [1,1,1,1];
  return random(state)<.5?[1,1,2,2]:[1,1,1,3];
}
function grantStartingSupplies(state,environmentRewards=[]) {
  const concept=state.environment?.id?.startsWith('concept-'),fromEnvironment=environmentRewards.filter(r=>r.kind==='character').length;
  const taken=new Set(environmentRewards.filter(r=>r.kind==='character').map(r=>r.id)),characters=[];
  const costs=getStarterCosts(state).slice(0,Math.max(0,4-(concept?fromEnvironment:0))),basics=EQUIPMENT.filter(e=>e.tier===1);
  for(const cost of costs) {
    const pool=CLASSIC_ROSTER.filter(c=>c.cost===cost&&!taken.has(c.id)&&!characters.includes(c.id)).map(c=>c.id);
    if(pool.length)characters.push(pool[Math.floor(random(state)*pool.length)]);
  }
  const supplies=[...characters.map(id=>({kind:'character',id})),{kind:'gold',amount:3+Math.floor(random(state)*2)}];
  if(!environmentRewards.some(r=>r.kind==='item'))supplies.push({kind:'item',id:pick(state,basics).id});
  const granted=[],queued=[{kind:'item',id:pick(state,basics).id}];
  for(const reward of [...supplies,...environmentRewards]) {
    // Chests keep their own opening flow, and anything that does not fit stays on the board as a crystal.
    if(['character','gold','item'].includes(reward.kind)&&grantRewards(state,[reward]).ok)granted.push(reward);
    else queued.push(reward);
  }
  queueRewards(state,queued,'开局补给');
  // A0–A5 start with the reusable Precision Disassembly Wrench; from A6 the single-use one (old client rank notes).
  if(usesRevision3(state))state.consumables.push({uid:`tool-${state.nextLootUid++}`,id:getRank(state)>=6?'wrench':'precision-wrench',nodes:0});
  return granted;
}
function useConsumable(state,action) {
  const index=state.consumables.findIndex(c=>c.uid===action.uid),tool=state.consumables[index];
  if(!tool)return fail('道具不存在。');
  const definition=getConsumable(tool.id),unit=state.units.find(u=>u.uid===action.targetUid);
  if(definition.passive)return fail('财富宝钻持有即生效，无需使用。');
  if(definition.requiresTarget&&!unit)return fail('请先选择一名角色。');
  if(['wrench','precision-wrench'].includes(tool.id)) {
    if(!unit.items.length)return fail('这名角色没有穿戴装备。');
    state.inventory.push(...unit.items.splice(0));
    if(definition.reusable)return success(`已取下${getCharacter(unit.characterId).name}的全部装备`);
  } else if(['projector','perfect-projector'].includes(tool.id)) {
    if(tool.id==='projector'&&unitCost(state,unit)>3)return fail('员工投影仪只能复制1～3费角色。');
    const result=grantCharacter(state,unit.characterId,1,unitCost(state,unit));if(!result.ok)return result;
  } else if(tool.id.startsWith('hire-')) {
    const cost=Number(tool.id.slice(5)),id=pick(state,CLASSIC_ROSTER.filter(c=>getEffectiveCharacterCost(state,c.id)===cost)).id;
    const result=grantCharacter(state,id);if(!result.ok)return result;
  } else if(tool.id.startsWith('trait-')) {
    const trait=tool.id.slice(6);
    if(getCharacter(unit.characterId).traits.includes(trait)||unit.extraTraits?.includes(trait))return fail('该角色已经拥有此羁绊。');
    unit.extraTraits=[...(unit.extraTraits||[]),trait];
  } else if(tool.id==='smelter') {
    if(!unit.items.length)return fail('请为目标装备至少一件装备。');
    const pools=unit.items.map(getSmeltingPool);
    if(pools.some(pool=>!pool.length))return fail('目标含没有同类重铸候选的装备，请先卸下。');
    for(const pool of pools)state.inventory.push(pick(state,pool));
    unit.items=[];
  } else {
    const privileged=tool.id==='privilege-dice';
    const slot=unit.items.findIndex(id=>privileged?getEquipment(id)?.privileged===true:getEquipment(id)?.tier===2);
    if(slot<0)return fail(privileged?'请为目标装备一件特权装备。':'请为目标装备一件普通进阶装备。');
    if(tool.id==='privilege-card')unit.items[slot]=`privileged:${unit.items[slot]}`;
    else {
      const old=getEquipment(unit.items[slot]);
      const options=EQUIPMENT.filter(e=>e.tier===2&&e.id!==(old.baseId||old.id)&&!e.exclusiveSlots&&(!e.unique||!unit.items.some(id=>(getEquipment(id).baseId||id)===e.id)));
      unit.items[slot]=(privileged?'privileged:':'')+pick(state,options).id;
    }
  }
  state.consumables.splice(index,1);return success(`已使用${definition.name}`);
}

function runAction(state,action) {
  if(!action||typeof action.type!=='string')return fail('操作无效。');
  const indexKeys={buy:['index'],choose:['index'],'choose-chest':['index'],'choose-supply':['index'],'choose-encounter':['index'],'refresh-strategy':['index'],equip:['itemIndex'],unequip:['itemIndex'],combine:['indexA','indexB']}[action.type]||[];
  if(indexKeys.some(key=>!Number.isInteger(action[key])||action[key]<0))return fail('请选择有效的位置。');
  if(action.type==='choose-environment'){
    if(state.phase!=='environment')return fail('当前不在投资环境选择阶段。');
    const response=chooseEnvironment(state,action.id);if(!response.ok)return response;
    if(usesVerifiedRules(state)){
      response.supplies=grantStartingSupplies(state,response.rewards);
      enterNode(state);rollShop(state);prepareClassicNode(state);return response;
    }
    if(response.replaceStarter){state.units=[];state.loot=state.loot.filter(o=>o.source!=='初始补给');}
    queueRewards(state,response.rewards,'投资环境');enterNode(state);prepareClassicNode(state);return response;
  }
  if(action.type==='reroll-environment')return state.phase==='environment'?rerollEnvironments(state):fail('当前不在投资环境选择阶段。');
  if(action.type==='refresh-strategy'){
    if(state.phase!=='choice'||!state.flow||!state.flow.strategyRerolls[action.index])return fail('此选项没有剩余刷新次数。');
    const old=state.choices[action.index],rarity=getEnvironmentStrategyRarity(state,state.flow.strategySelections+1,action.index);
    const candidates=STRATEGIES.filter(s=>!s.legacy&&!has(state,s.id)&&s.planes.includes(getCurrentNode(state).plane)&&!state.choices.some(c=>c.id===s.id)&&(!rarity||s.rarity===rarity));
    if(!candidates.length)return fail('当前品级没有其他可选策略。');
    state.choices[action.index]={kind:'strategy',id:pick(state,candidates).id};state.flow.strategyRerolls[action.index]--;return success('投资策略已刷新');
  }
  if(action.type==='reroll-encounter')return fail('当前遭遇分支为固定难度与奖励，不提供无效刷新。');
  if(action.type==='reroll-supply'){
    if(state.phase!=='supply'||!state.flow?.supplyRerolls)return fail('没有剩余刷新次数。');
    state.flow.supplyRerolls--;makeSupplyOffers(state);return success('补给选项已刷新');
  }
  if(action.type==='choose-supply'){
    const offer=state.flow?.supplyOffers[action.index];if(state.phase!=='supply'||!offer)return fail('请选择有效补给。');
    if(usesRevision5(state)&&isClassicRun(state)){
      // Original (REC1 5:52, REC2 5:58): 确认 hands the character to the bench and the equipment to the
      // list at once, and the run goes straight on to the next node. With a full bench the pack is
      // kept whole as a crystal instead (the character comes first, so nothing is half-granted).
      const granted=grantRewards(state,offer.rewards);
      if(!granted.ok)queueRewards(state,offer.rewards,'补给包');
      const message=granted.ok?granted.message:'备战席已满，补给已化为晶矿，腾出位置后领取。';
      state.flow.supplyOffers=[];state.phase='prep';
      if(state.flow.pendingNodeKind){state.flow.extraSupplyDone.push(state.round);state.flow.pendingNodeKind=null;return success(message);}
      state.flow.nodeComplete=true;
      const moved=advanceClassicNode(state);
      return moved.ok?success(`${message}；${moved.message}`):moved;
    }
    queueRewards(state,offer.rewards,'补给包');state.flow.supplyOffers=[];
    if(state.flow.pendingNodeKind){state.flow.extraSupplyDone.push(state.round);state.flow.pendingNodeKind=null;state.phase='prep';}
    else {state.flow.nodeComplete=true;state.phase='prep';}
    return success('补给已化为晶矿，可领取后继续前进。');
  }
  if(action.type==='choose-encounter'){
    const offer=state.flow?.encounterOffers[action.index];if(state.phase!=='encounter'||!offer)return fail('请选择有效遭遇分支。');
    state.flow.selectedEncounter=clone(offer);state.flow.encounterOffers=[];state.phase='prep';return success(`已选择${offer.name}，调整阵容后出战。`);
  }
  if(action.type==='next-node'){
    if(state.phase!=='prep'||!state.flow?.nodeComplete||state.activeChest)return fail('请先完成当前节点。');
    return advanceClassicNode(state);
  }
  if(action.type==='next') {
    if(isClassicRun(state)){
      if(state.phase==='prep'&&state.flow.nodeComplete&&!state.activeChest)return advanceClassicNode(state);
      if(state.phase!=='result')return fail('请先完成当前节点。');
      return advanceClassicNode(state);
    }
    if(state.phase!=='result')return fail('请先完成本回合战斗。');
    if(state.hp<=0||state.round===ROUND_COUNT) {
      state.phase='ended';state.result=state.hp>0&&state.lastBattle.won?'victory':'defeat';
      return success(state.result==='victory'?'远征完成，经典仍在继续。':'本次远征结束，下一次投资会更好。');
    }
    state.round++;addXp(state,2);enterNode(state);
    if(!state.locked)rollShop(state);
    if([2,6,10].includes(state.round))choicesFor(state,'strategy');
    else {state.phase='prep';state.choices=[];state.choiceKind=null;}
    if([3,5,7,9,11].includes(state.round))queueRewards(state,[{kind:'chest',quality:'basic'}],'节点补给');
    return success(`进入第 ${state.round} 回合`);
  }
  if(action.type==='choose') {
    if(state.phase!=='choice')return fail('当前没有待选择的奖励。');
    const choice=state.choices[action.index];if(!choice)return fail('请选择有效奖励。');
    let name;
    if(choice.kind==='strategy') {
      gainStrategy(state,choice.id);name=strategies.get(choice.id).name;
      if(state.flow){state.flow.strategySelections++;queueRewards(state,onEnvironmentEvent(state,{type:'strategy',count:state.flow.strategySelections}),'投资环境');}
    } else {state.inventory.push(choice.id);name=getEquipment(choice.id).name;}
    state.choices=[];state.choiceKind=null;state.phase='prep';
    if(state.flow?.pendingNodeKind){const pending=state.flow.pendingNodeKind;state.flow.extraStrategyDone.push(state.round);state.flow.pendingNodeKind=null;if(pending==='supply')makeSupplyOffers(state);if(pending==='encounter')makeEncounterOffers(state);}
    return success(`已获得「${name}」`);
  }
  // 返回备战 (revision 4): while an investment strategy is still to be picked, the player may go back to
  // the preparation screen and keep managing the team (REC1 2:20); only the battle waits for the pick.
  const strategyPending=state.phase==='choice'&&state.choiceKind==='strategy'&&isClassicRun(state)&&usesRevision4(state);
  // The supply screen has the same 返回备战界面 button (revision 5): the team can be managed while
  // the pick waits.
  const supplyPending=state.phase==='supply'&&isClassicRun(state)&&usesRevision5(state);
  if(strategyPending&&action.type==='battle')return fail('请先选择投资策略。');
  if(supplyPending&&action.type==='battle')return fail('请先选择补给。');
  if(state.phase!=='prep'&&!strategyPending&&!supplyPending)return fail('请先完成当前结算或奖励选择。');
  if(state.activeChest&&!['cancel-chest','choose-chest','open-chest'].includes(action.type))return fail('请先选择装备或取消打开武装箱。');
  switch(action.type) {
    case 'collect-loot': {
      const index=state.loot.findIndex(o=>o.uid===action.uid);if(index<0)return fail('晶矿已经领取。');
      const result=grantRewards(state,state.loot[index].contents);if(!result.ok)return result;
      state.loot.splice(index,1);queueRewards(state,onEnvironmentEvent(state,{type:'collect-loot'}),'投资环境');return result;
    }
    case 'open-chest': {
      if(!state.chests.some(c=>c.uid===action.uid))return fail('武装箱不存在。');
      state.activeChest=action.uid;return success('请选择武装；也可以取消并保留箱子。');
    }
    case 'cancel-chest':state.activeChest=null;return success('武装箱已保留，可稍后继续选择。');
    case 'move-chest': {
      // Chests can be rearranged along the bench; dropping one on a benched character swaps them.
      const chest=state.chests.find(c=>c.uid===action.uid);
      if(!chest||!Number.isInteger(action.position)||action.position<0||action.position>=BENCH_CAPACITY)return fail('请选择有效的位置。');
      if(action.position===chest.slot)return success('武装箱已在该位置。');
      const other=chestAt(state,action.position),unit=state.units.find(u=>u.zone==='bench'&&u.slot===action.position);
      if(other)other.slot=chest.slot;else if(unit)unit.slot=chest.slot;
      chest.slot=action.position;return success('已调整武装箱位置');
    }
    case 'choose-chest': {
      const index=state.chests.findIndex(c=>c.uid===state.activeChest),chest=state.chests[index];
      if(!chest||!chest.options[action.index])return fail('请选择有效武装。');
      const id=chest.options[action.index];state.chests.splice(index,1);state.activeChest=null;
      // A 聘用书 frees its own bench slot first, so the recruit always has room.
      if(chest.kind==='role'){const result=grantCharacter(state,id,1);if(!result.ok)return result;return success(`已招募${getCharacter(id).name}`);}
      state.inventory.push(id);
      return success(`已获得${getEquipment(id).name}`);
    }
    case 'use-consumable':return useConsumable(state,action);
    case 'progression': {
      const result=applyProgressionAction(state,action);if(result.ok)queueRewards(state,result.rewards,'羁绊奖励');return result;
    }
    case 'buy': {
      const character=getCharacter(state.shop[action.index]);
      if(!character)return fail('这个位置没有可招募的角色。');
      const cost=getEffectiveCharacterCost(state,character.id);
      if(state.gold<cost)return fail('金币不足。');
      const copies=state.units.filter(u=>u.characterId===character.id&&u.star===1&&unitCost(state,u)===cost).length;
      if(getBenchCount(state)>=BENCH_CAPACITY&&copies<2)return fail('备战席已满，无法购买。');
      spend(state,cost);state.shop[action.index]=null;addUnit(state,character.id);
      for(const e of effects(state))if(e.purchaseXp&&!meta(state,e.id).purchasedCosts.includes(cost)) {
        addXp(state,e.purchaseXp[cost]);meta(state,e.id).purchasedCosts.push(cost);
      }
      const merges=mergeUnits(state);
      return success(merges.length?merges.join(' · '):`已招募${character.name}`);
    }
    case 'refresh': {
      const cost=getRefreshCost(state);
      if(state.gold<cost)return fail('刷新商店的金币不足。');
      if(cost) {spend(state,cost);addXp(state,sumEffect(state,'paidRefreshXp'));}
      else state.freeRefreshes--;
      rollShop(state);queueRewards(state,onEnvironmentEvent(state,{type:'refresh',paid:cost>0}),'投资环境');return success(cost?'商店已刷新':`免费刷新成功，剩余 ${state.freeRefreshes} 次`);
    }
    case 'lock':state.locked=!state.locked;return success(state.locked?'商店已锁定，下回合保留。':'已解除商店锁定');
    case 'exp': {
      if(state.level>=MAX_LEVEL)return fail('已达到最高等级。');
      if(state.gold<4)return fail('购买经验需要 4 金币。');
      spend(state,4);const previous=state.level;addXp(state,has(state,'growth')?6:4);
      if(effects(state).some(e=>e.expShopPromotion)) {
        const available=state.shop.map((id,index)=>({id,index})).filter(s=>s.id&&getCharacter(s.id).cost<5);
        if(available.length) {const slot=pick(state,available);state.shop[slot.index]=pick(state,CLASSIC_ROSTER.filter(c=>c.cost===getCharacter(slot.id).cost+1)).id;}
      }
      return success(state.level>previous?`提升至 ${state.level} 级，可以部署更多角色。`:'已获得经验');
    }
    case 'move': {
      const unit=state.units.find(u=>u.uid===action.uid);
      if(!unit||!ZONES.includes(action.zone))return fail('请选择有效角色和位置。');
      const capacity=getZoneCapacity(state,action.zone),c=getCharacter(unit.characterId);
      if(action.position!==undefined&&(!Number.isInteger(action.position)||action.position<0||action.position>=capacity))return fail('请选择有效的位置。');
      // A named slot that is taken means "trade places"; without a slot the unit takes the first free one.
      // A bench slot holding a chest is not free: the unit takes the first free slot instead.
      if(action.zone==='bench'&&action.position!==undefined&&chestAt(state,action.position))action={...action,position:undefined};
      const occupant=action.position===undefined?null:state.units.find(u=>u!==unit&&u.zone===action.zone&&u.slot===action.position);
      if(occupant)return swapUnits(state,unit,occupant);
      if(unit.zone===action.zone&&(action.position===undefined||action.position===unit.slot))return success('角色已在该位置。');
      if(unit.zone!==action.zone) {
        if(entersFieldAsCopy(state,unit,action.zone))return fail('无法上阵同名角色');
        const count=action.zone==='bench'?getBenchCount(state):state.units.filter(u=>u.zone===action.zone).length;
        if(action.zone==='front'&&count>=capacity)return fail('前台最多部署 4 人，请先调整阵容。');
        if(unit.zone==='bench'&&deployed(state).length>=getPopulationLimit(state))return fail('部署人数已达上限，购买经验可提升人口。');
        if(action.zone==='back'&&count>=capacity)return fail('后台格子已满，请先调整阵容。');
        if(action.zone==='bench'&&count>=capacity)return fail('备战席已满。');
      }
      unit.zone=action.zone;unit.slot=action.position??freeSlot(state,action.zone,unit);
      return success(`已将${c.name}移至${{front:'前台',back:'后台',bench:'备战席'}[action.zone]}${action.zone!=='bench'&&!c.allowedZones.includes(action.zone)?'；此位置无法激活角色赋能':''}`);
    }
    case 'swap': {
      // Dropping one unit onto another exchanges their rows and slots; counts per row never change.
      const a=state.units.find(u=>u.uid===action.uid),b=state.units.find(u=>u.uid===action.targetUid);
      if(!a||!b)return fail('请选择有效角色和位置。');
      if(a===b)return success('角色已在该位置。');
      return swapUnits(state,a,b);
    }
    case 'sell': {
      const index=state.units.findIndex(u=>u.uid===action.uid);if(index<0)return fail('角色不存在。');
      const unit=state.units[index],value=getSellPrice(state,unit);
      for(const [id,uid] of Object.entries(state.progression.day.assignments))if(uid===unit.uid)delete state.progression.day.assignments[id];
      for(const [id,uid] of Object.entries(state.progression.gamer.accessoryOwners||{}))if(uid===unit.uid)delete state.progression.gamer.accessoryOwners[id];
      state.gold+=value;state.inventory.push(...unit.items);state.units.splice(index,1);
      return success(`已出售，获得 ${value} 金币；装备已返还。`);
    }
    case 'equip': {
      const response=equipCraftingItem(state,action.uid,action.itemIndex);
      if(response.ok&&response.crafted)state.freeRefreshes+=sumEffect(state,'combineFreeRefreshes');return response;
    }
    case 'unequip': {
      const unit=state.units.find(u=>u.uid===action.uid);
      if(!unit||!getEquipment(unit.items[action.itemIndex]))return fail('请选择有效装备。');
      // Worn equipment only comes off with a Disassembly Wrench (in-game tutorial, consumable text).
      if(usesRevision3(state))return fail('穿戴后的装备不能直接取下，请把拆装扳手拖到角色身上。');
      state.inventory.push(unit.items.splice(action.itemIndex,1)[0]);return success('装备已放回物品栏');
    }
    case 'combine': {
      const response=combineInventoryItems(state,action.indexA,action.indexB);
      if(response.ok)state.freeRefreshes+=sumEffect(state,'combineFreeRefreshes');return response;
    }
    case 'battle': {
      if(isClassicRun(state)&&getCurrentNode(state).type==='supply')return fail('补给节点无需战斗，请领取补给并继续。');
      if(!state.units.some(u=>u.zone==='front'))return fail('至少部署一名前台角色才能开始战斗。');
      const enemy=getEnemy(state),playerPower=getTeamPower(state);
      const company=getSynergies(state).find(s=>s.id==='ipc');
      const companyGold=!enemy.boss&&company?.active?(company.count>=3?3:1):0;
      state.gold+=companyGold;
      const node=getCurrentNode(state),classic=isClassicRun(state),lootBefore=state.loot.length,hpBefore=state.hp;
      // Revision 4: the old countdown rule — nobody is knocked down; a fatal blow restores the character
      // and shortens what is left of the countdown instead.
      const countdown=classic&&usesRevision4(state)?{turns:getNodeCountdown(node),reviveLoss:getReviveCountdownLoss(getRank(state))}:null;
      const combat=simulateCombat(state,{enemyLineup:enemy.units,maxActions:node.type==='reward'?180:100,countdown});
      const won=combat.winner==='ally';
      const remainingHp=combat.final.filter(u=>u.side==='enemy').reduce((sum,u)=>sum+Math.max(0,u.hp),0),totalHp=enemy.units.reduce((sum,u)=>sum+u.maxHp,0);
      const progress=won?100:Math.max(0,Math.min(99,Math.floor((1-remainingHp/totalHp)*100)));
      const revision4=usesRevision4(state),minProgress=revision4?getMinProgress(node):node.boss?BOSS_MIN_PROGRESS:null;
      const penalty=usesRevision3(state)?getDefeatPenaltyParts(node,progress,{rank:getRank(state),revision4}):null;
      const damage=won?0:penalty?penalty.total:classic?Math.max(2,Math.ceil((1-progress/100)*(12+node.plane*6+(enemy.boss?6:0)))):Math.max(3,Math.round(9+state.round*1.4+(enemy.boss?5:0)-(has(state,'fortress')?4:0)));
      const interest=getInterest(state);
      const verified=usesVerifiedRules(state);
      // Reward nodes neither extend nor break the streak: 1-1 and 1-2 both settled at ×0, and a
      // streak survived the 1-8 reward node.
      if(!(verified&&node.type==='reward'))state.streak=won?Math.max(1,state.streak+1):classic?0:Math.min(-1,state.streak-1);
      const baseIncome=classic?verified?getNodeBaseIncome(node,state):5:8,victoryIncome=won?(classic?1:2):0;
      const streakBonus=verified?(won?getStreakGold(state.streak)-victoryIncome:0):Math.min(3,Math.floor(Math.abs(state.streak)/2));
      const xpGain=verified?getNodeXp(state,node):0;
      const income=baseIncome+interest+streakBonus+victoryIncome+(has(state,'dividend')?3:0)+(won&&has(state,'momentum')?3:0);
      let healing=(has(state,'recovery')?5:0)+sumEffect(state,'battleHeal');
      // A lethal defeat cannot be undone by post-battle healing.
      state.hp=state.hp-damage<=0?0:Math.min(getMaxHp(state),state.hp-damage+healing);
      state.gold+=income;state[won?'wins':'losses']++;
      const growthRewards=onBattleResolved(state,combat);
      queueRewards(state,growthRewards,'战后羁绊奖励');
      // Boss rewards. Revision 5 follows REC1: the boss settlement lists only the 5 base gold, the
      // streak gold and 10 EXP, with no crystal row, win (1-9) or loss (2-7). The 简易武装 talent the
      // recorded account had adds one random basic equipment after a first- or second-plane boss is
      // cleared (a new basic item was in the list at 2-1). Earlier runs keep their boss crystal.
      const revision5=classic&&usesRevision5(state),bossItem=won&&enemy.boss&&revision5&&node.plane<3?basicItem(state):null;
      if(bossItem)state.inventory.push(bossItem);
      if(won&&enemy.boss&&!revision5)queueRewards(state,[{kind:'chest',quality:node.plane>=2?'privileged':'advanced'},{kind:'gold',amount:5}],'首领晶矿');
      if(classic&&won&&node.type==='reward')queueRewards(state,usesRevision4(state)?rewardNodeOrbs(state,node):[{kind:'gold',amount:4+node.plane*2},{kind:'chest',quality:'basic'},{kind:'item',id:pick(state,EQUIPMENT.filter(e=>e.tier===1)).id}],'奖励节点晶矿');
      // Encounter rewards: a win before revision 4. Since then the reward follows the rank notes — below
      // A4 it is always paid, from A4 only when the 25% minimum progress was reached.
      const encounterPaid=revision4?(getRank(state)<4||progress>=minProgress):won;
      if(classic&&encounterPaid&&node.type==='encounter'&&state.flow.selectedEncounter)queueRewards(state,state.flow.selectedEncounter.rewards,'遭遇奖励');
      const logs=combat.events.map(event=>event.text);
      if(healing&&state.hp>0)logs.push(`战后恢复生效，回复 ${healing} 点小队生命（最高 ${getMaxHp(state)}）。`);
      const rewards=verified?[`基础金币 +${baseIncome}`,`连胜金币 +${streakBonus+victoryIncome}`,getRunMode(state).interest?`利息 +${interest}`:'超频模式无利息']:[`基础收入 +${baseIncome}`,getRunMode(state).interest?`利息 +${interest}`:'超频模式无利息',`连胜奖励 +${streakBonus}`];
      if(verified&&xpGain)rewards.push(`获得经验 +${xpGain}`);
      if(companyGold)rewards.push(`公司羁绊 +${companyGold}`);
      if(won&&!verified)rewards.push(`胜利奖励 +${victoryIncome}`);
      if(has(state,'dividend'))rewards.push('稳定分红 +3');
      if(won&&has(state,'momentum'))rewards.push('乘胜追投 +3');
      if(growthRewards.length)rewards.push(`羁绊产出 ${growthRewards.length} 枚晶矿，返回备战后领取`);
      if(bossItem)rewards.push(`简易武装：获得${getEquipment(bossItem).name}`);
      else if(won&&enemy.boss&&!revision5)rewards.push('首领晶矿已掉落，返回备战后领取');
      state.lastBattle={won,playerPower,enemyPower:enemy.power,damage,income,logs,rewards,enemy:enemy.name,healing,combat,nodeLabel:node.label,nodeType:node.type,progress};
      if(verified)Object.assign(state.lastBattle,{baseIncome,streakIncome:streakBonus+victoryIncome,interestIncome:interest,streak:state.streak,xpGain});
      if(penalty)Object.assign(state.lastBattle,{hpBefore,penalty:won?null:penalty,minProgress});
      if(countdown)Object.assign(state.lastBattle,{countdown:countdown.turns,revives:combat.revives||0,countdownLeft:combat.countdownLeft});
      state.history.push({round:state.round,nodeLabel:node.label,nodeType:node.type,won,damage,income,playerPower,enemyPower:enemy.power,turns:combat.turns,reason:combat.reason});
      queueRewards(state,onEnvironmentEvent(state,{type:'interest',amount:interest}),'投资环境');
      queueRewards(state,onEnvironmentEvent(state,{type:'battle',key:String(state.round),battle:state.lastBattle}),'投资环境');
      // Crystal ore dropped by this node, for the settlement screen.
      state.lastBattle.drops=state.loot.slice(lootBefore).map(orb=>orb.quality);
      state.phase='result';return success(won?'战斗胜利':'战斗结束');
    }
    default:return fail('未知操作。');
  }
}

export function act(state,action) {
  if(!state||typeof state!=='object')return fail('存档无效。');
  const draft=clone(state);settleSlots(draft);
  const response=runAction(draft,action);
  if(response.ok) {
    if(['buy','exp','refresh'].includes(action.type))queueRewards(draft,onManagementAction(draft,action,{goldSpent:Math.max(0,draft.goldSpentThisNode-state.goldSpentThisNode),xp:action.type==='exp'?(has(state,'growth')?6:4):0}),'圣杯试炼');
    else queueRewards(draft,onRosterChanged(draft),'羁绊奖励');
    queueRewards(draft,onEnvironmentEvent(draft,{type:'roster'}),'投资环境');
    refreshProgression(draft);settleSlots(draft);
    Object.assign(state,draft);
  }
  return response;
}

// Migrate without replaying acquisition rewards or changing saved units / results.
export function migrateState(saved) {
  if(!saved||![1,2,3].includes(saved.version))return null;
  const state=clone(saved);
  if(state.version===1) {
    state.version=2;state.ruleset='zero-sum';state.freeRefreshes=0;
    state.goldSpentThisNode=0;state.strategyState={};
    for(const id of state.strategies||[])meta(state,id);
    if(Array.isArray(state.units)&&Array.isArray(state.inventory))for(const unit of state.units)if(Array.isArray(unit?.items))retainCompatibleItems(state,unit,[...unit.items]);
  }
  if(state.version===2) {
    state.version=3;initializeLoot(state);migrateProgression(state);
    // Never recreate already earned drops. Preserve a pending old equipment selection as one cancellable chest.
    if(state.phase==='choice'&&state.choiceKind==='equipment') {
      state.chests.push(makeChest(state,'basic',state.choices.map(c=>c.id)));
      state.choices=[];state.choiceKind=null;state.phase='prep';
    }
  }
  if(state.progression?.gamer&&state.progression.gamer.accessoryOwners===undefined)state.progression.gamer.accessoryOwners={};
  // Saves from before v6.3 have no slots: units keep their order and stand side by side.
  try{settleSlots(state);}catch{return null;}
  return validateState(state)?state:null;
}

export function validateState(state) {
  if(!state||state.version!==3||state.ruleset!=='zero-sum'||!validateLoot(state)||!validateProgression(state)||!validateFlow(state)||!validateEnvironment(state))return false;
  if(!['prep','result','choice','ended','environment','supply','encounter'].includes(state.phase))return false;
  if(isClassicRun(state)){
    if(!state.environment)return false;
    if(state.phase==='environment'){
      if(state.round!==1||state.environment.id!==null||state.environment.choices.length!==3)return false;
    }else if(!state.environment.id)return false;
  }
  for(const key of ['round','hp','gold','level','xp','rng','seed','nextUid','streak','wins','losses','freeRefreshes','goldSpentThisNode'])if(!Number.isFinite(state[key])||!Number.isInteger(state[key]))return false;
  if(state.round<1||state.round>getRunLength(state)||state.hp<0||state.gold<0||state.level<(usesVerifiedRules(state)?START_LEVEL:4)||state.level>MAX_LEVEL||state.xp<0||state.freeRefreshes<0||state.goldSpentThisNode<0)return false;
  if(state.nextUid<1||state.wins<0||state.losses<0||(state.level<MAX_LEVEL&&state.xp>=getLevelXp(state))||(state.level===MAX_LEVEL&&state.xp!==0))return false;
  if(!Array.isArray(state.units)||state.units.length>getPopulationLimit(state)+BENCH_CAPACITY||!Array.isArray(state.inventory)||!Array.isArray(state.shop)||state.shop.length!==5)return false;
  if(!Array.isArray(state.strategies)||!state.strategies.every(id=>strategyIds.has(id))||new Set(state.strategies).size!==state.strategies.length)return false;
  if(state.hp>getMaxHp(state)||!state.strategyState||typeof state.strategyState!=='object'||Array.isArray(state.strategyState))return false;
  for(const record of Object.values(state.strategyState))if(!record||!Number.isInteger(record.acquiredRound)||record.acquiredRound<1||record.acquiredRound>state.round||!Number.isInteger(record.nodes)||record.nodes<0||!Array.isArray(record.purchasedCosts)||!record.purchasedCosts.every(n=>Number.isInteger(n)&&n>=1&&n<=5))return false;
  if(!Array.isArray(state.choices)||!Array.isArray(state.history)||typeof state.locked!=='boolean')return false;
  const ids=new Set(),slots=new Set();
  for(const unit of state.units) {
    if(!unit||typeof unit.uid!=='string'||ids.has(unit.uid)||!getCharacter(unit.characterId)||![1,2,3].includes(unit.star)||!['front','back','bench'].includes(unit.zone))return false;
    if(unit.slot!==undefined) {
      if(!Number.isInteger(unit.slot)||unit.slot<0||unit.slot>=(unit.zone==='front'?FRONT_CAPACITY:9)||slots.has(unit.zone+unit.slot))return false;
      slots.add(unit.zone+unit.slot);
    }
    if(unit.recruitCost!==undefined&&(!Number.isInteger(unit.recruitCost)||unit.recruitCost<1||unit.recruitCost>5))return false;
    if(!Array.isArray(unit.items)||unit.items.length>3||!unit.items.every(id=>getEquipment(id)))return false;
    if(unit.extraTraits!==undefined&&(!Array.isArray(unit.extraTraits)||!unit.extraTraits.every(id=>TRAITS.some(t=>t.id===id))||new Set(unit.extraTraits).size!==unit.extraTraits.length))return false;
    if(unit.items.some(id=>getEquipment(id).exclusiveSlots)&&unit.items.length>1)return false;
    if(unit.items.some(id=>getEquipment(id).unique&&unit.items.filter(key=>baseItemId(key)===baseItemId(id)).length>1))return false;
    ids.add(unit.uid);
  }
  for(const chest of state.chests||[])if(Number.isInteger(chest.slot)){if(slots.has('bench'+chest.slot))return false;slots.add('bench'+chest.slot);}
  if(state.units.filter(u=>u.zone==='front').length>FRONT_CAPACITY||getBenchCount(state)>BENCH_CAPACITY||deployed(state).length>getPopulationLimit(state))return false;
  if(Object.values(state.progression.day.assignments).some(uid=>!ids.has(uid)))return false;
  if(state.units.some(u=>u.items.length+daySlots(state,u.uid)>3||daySlots(state,u.uid)>0&&u.items.some(id=>getEquipment(id).exclusiveSlots)))return false;
  if(!state.inventory.every(id=>getEquipment(id))||!state.shop.every(id=>id===null||getCharacter(id)))return false;
  for(const choice of state.choices)if(!choice||!['strategy','equipment'].includes(choice.kind)||(choice.kind==='strategy'?!strategyIds.has(choice.id):!getEquipment(choice.id)))return false;
  if(state.phase==='choice'&&state.choices.length!==3)return false;
  if(state.phase!=='choice'&&state.choices.length!==0)return false;
  if(state.lastBattle!==null) {
    const battle=state.lastBattle;
    if(!battle||typeof battle.won!=='boolean'||!Array.isArray(battle.logs)||!Array.isArray(battle.rewards))return false;
    if(!battle.logs.every(line=>typeof line==='string')||!battle.rewards.every(line=>typeof line==='string'))return false;
    if(!['playerPower','enemyPower','damage','income'].every(key=>Number.isFinite(battle[key])&&battle[key]>=0))return false;
  }
  if(state.phase==='result'&&(!state.lastBattle||typeof state.lastBattle.won!=='boolean'))return false;
  if(state.phase==='ended'&&!['victory','defeat'].includes(state.result))return false;
  return true;
}
