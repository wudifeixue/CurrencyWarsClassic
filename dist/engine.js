import {CHARACTERS,CLASSIC_ROSTER,EQUIPMENT,STRATEGIES,RECIPES,LEVEL_XP,SHOP_ODDS,MAX_LEVEL,BENCH_CAPACITY,FRONT_CAPACITY,ROUND_COUNT,TRAITS,resolveEquipment} from './data.js?v=5.0.0';
import {simulateCombat,getEnemyLineup,getBattleStats,getBattleSynergies} from './combat.js?v=5.0.0';
import {initializeLoot,queueRewards,makeChest,getConsumable,validateLoot} from './loot.js?v=5.0.0';
import {initProgression,migrateProgression,validateProgression,onNodeEntry,onBattleResolved,onRosterChanged,onManagementAction,refreshProgression,applyProgressionAction,getEffectiveCharacterCost,getProgressionShopModifiers} from './classic-progression.js?v=5.0.0';
export {getEnemyLineup,simulateCombat} from './combat.js?v=5.0.0';

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
export function getShopOdds(state) {
  const odds=[...SHOP_ODDS[state.level]],bonus=getProgressionShopModifiers(state).fiveCostOddsBonus*100;
  if(bonus){odds[0]-=bonus;odds[4]+=bonus;}
  return odds;
}
export const getRefreshCost = state => state.freeRefreshes>0?0:has(state,'discount')?1:2;
export function getInterest(state) {
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
  const unit={uid:`u${state.nextUid++}`,characterId:String(characterId),star,zone,items:[],recruitCost:cost};
  state.units.push(unit);
  return unit;
}

function rollShop(state) {
  state.shop = Array.from({length:5},()=>{
    let roll=random(state)*100;
    let cost=1;
    for(const chance of getShopOdds(state)) {if(roll<chance) break;roll-=chance;cost++;}
    return pick(state,CLASSIC_ROSTER.filter(c=>getEffectiveCharacterCost(state,c.id)===cost)).id;
  });
}

function addXp(state,amount) {
  state.xp+=amount;
  while(state.level<MAX_LEVEL && state.xp>=LEVEL_XP[state.level]) {
    state.xp-=LEVEL_XP[state.level];state.level++;
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

export function createGame(seed=Date.now()) {
  const normalized=(Number(seed)>>>0)||197706;
  const state={version:3,ruleset:'zero-sum',seed:normalized,rng:normalized,round:1,hp:100,gold:16,level:4,xp:0,nextUid:1,
    units:[],shop:[],locked:false,inventory:[],strategies:[],phase:'prep',
    choices:[],choiceKind:null,streak:0,wins:0,losses:0,lastBattle:null,history:[],result:null,
    freeRefreshes:0,goldSpentThisNode:0,strategyState:{},progression:initProgression()};
  initializeLoot(state,true);
  addUnit(state,'1013','front');addUnit(state,'1009','front');addUnit(state,'1108','front');addUnit(state,'1001','back');
  state.shop=['1013','1001','1013','1202','1201'];
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
  const [name,power,description]=enemies[Math.max(0,Math.min(11,state.round-1))];
  return {name,power,boss:state.round%4===0,description,units:getEnemyLineup(state.round)};
}

function choicesFor(state,kind) {
  const candidates=kind==='strategy'?STRATEGIES.filter(s=>!s.legacy&&!has(state,s.id)&&s.planes.includes(Math.ceil(state.round/4))):EQUIPMENT.filter(e=>e.tier===1);
  const pool=[...candidates];state.choices=[];
  while(state.choices.length<3&&pool.length) {
    const index=Math.floor(random(state)*pool.length);
    state.choices.push({kind,id:pool.splice(index,1)[0].id});
  }
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
  if(id==='compound')state.gold+=8;
  if(id==='growth')addXp(state,8);
}

function enterNode(state) {
  for(const e of effects(state)) {
    const record=meta(state,e.id);record.nodes++;
    if(!e.nodeGoldLimit||record.nodes<=e.nodeGoldLimit)state.gold+=e.nodeGold||0;
    state.freeRefreshes+=(e.nodeFreeRefreshes||0)+(state.goldSpentThisNode===0?(e.unspentFreeRefreshes||0):0);
    addXp(state,e.nodeXp||0);
    if(e.benchXp&&state.units.filter(u=>u.zone==='bench').length<=e.benchMaxForXp)addXp(state,e.benchXp);
    if(state.round%4===1) {addXp(state,e.planeXp||0);state.freeRefreshes+=e.planeFreeRefreshes||0;}
    if(state.round%4===0)state.gold+=e.bossGold||0;
  }
  state.goldSpentThisNode=0;
  for(const unit of state.units.filter(u=>u.items.includes('wealth-gem'))) {
    unit.wealthNodes=(unit.wealthNodes||0)+1;
    if(unit.wealthNodes%3===0)queueRewards(state,[{kind:'gold',amount:unit.items.filter(id=>id==='wealth-gem').length}],'财富宝钻');
  }
  queueRewards(state,onNodeEntry(state),'羁绊成长');
}

function grantCharacter(state,id,star=1,cost=getEffectiveCharacterCost(state,id)) {
  if(!getCharacter(id))return fail('奖励角色不存在。');
  const copies=state.units.filter(u=>u.characterId===id&&u.star===star&&unitCost(state,u)===cost).length;
  if(state.units.filter(u=>u.zone==='bench').length>=BENCH_CAPACITY&&(star>=3||copies<2))return fail('备战席已满，请先腾出位置；奖励会保留。');
  addUnit(state,id,'bench',star,cost);mergeUnits(state);return success('角色已加入备战席');
}
function grantRewards(state,contents) {
  const names=[];
  for(const r of contents) {
    const n=r.amount??1;
    if(r.kind==='gold'){state.gold+=n;names.push(`${n}金币`);}
    else if(r.kind==='xp'){addXp(state,n);names.push(`${n}经验`);}
    else if(r.kind==='refresh'){state.freeRefreshes+=n;names.push(`${n}次免费刷新`);}
    else if(r.kind==='hp'){state.bonusMaxHp+=r.maxHp||0;state.hp=Math.min(getMaxHp(state),state.hp+n);names.push(`${n}小队生命`);}
    else if(r.kind==='chest'){state.chests.push(r.chest||makeChest(state,r.quality,r.options));names.push('武装箱');}
    else if(r.kind==='character') {
      for(let i=0;i<n;i++){const result=grantCharacter(state,String(r.id),r.star||1,r.cost);if(!result.ok)return result;}
      names.push(getCharacter(r.id).name);
    } else if(r.kind==='item') {
      for(let i=0;i<n;i++) {
        if(getEquipment(r.id))state.inventory.push(r.id);
        else if(getConsumable(r.id))state.consumables.push({uid:`tool-${state.nextLootUid++}`,id:r.id,nodes:0});
        else return fail('奖励数据无法识别，晶矿已保留。');
      }
      names.push((getEquipment(r.id)||getConsumable(r.id)).name);
    }
  }
  return success(`已获得：${names.join('、')}`);
}
function useConsumable(state,action) {
  const index=state.consumables.findIndex(c=>c.uid===action.uid),tool=state.consumables[index];
  if(!tool)return fail('道具不存在。');
  const definition=getConsumable(tool.id),unit=state.units.find(u=>u.uid===action.targetUid);
  if(definition.passive)return fail('财富宝钻持有即生效，无需使用。');
  if(definition.requiresTarget&&!unit)return fail('请先选择一名角色。');
  if(['projector','perfect-projector'].includes(tool.id)) {
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
    if(unit.items.includes('wealth-gem'))return fail('财富宝钻暂无同类重铸候选，请先卸下宝钻。');
    for(const id of unit.items) {
      const original=getEquipment(id),pool=original.trait?TRAITS.filter(t=>t.type===TRAITS.find(t=>t.id===original.trait).type).map(t=>getEquipment(`trait-${t.id}`)).filter(Boolean):EQUIPMENT.filter(e=>e.tier===(original.privileged?2:original.tier)&&e.id!==(original.baseId||id));
      state.inventory.push((original.privileged?'privileged:':'')+pick(state,pool).id);
    }
    unit.items=[];
  } else {
    const privileged=tool.id==='privilege-dice';
    const slot=unit.items.findIndex(id=>getEquipment(id)?.tier===(privileged?3:2));
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
  const indexKeys={buy:['index'],choose:['index'],'choose-chest':['index'],equip:['itemIndex'],unequip:['itemIndex'],combine:['indexA','indexB']}[action.type]||[];
  if(indexKeys.some(key=>!Number.isInteger(action[key])||action[key]<0))return fail('请选择有效的位置。');
  if(action.type==='next') {
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
    } else {state.inventory.push(choice.id);name=getEquipment(choice.id).name;}
    state.choices=[];state.choiceKind=null;state.phase='prep';
    return success(`已获得「${name}」`);
  }
  if(state.phase!=='prep')return fail('请先完成当前结算或奖励选择。');
  if(state.activeChest&&!['cancel-chest','choose-chest','open-chest'].includes(action.type))return fail('请先选择装备或取消打开武装箱。');
  switch(action.type) {
    case 'collect-loot': {
      const index=state.loot.findIndex(o=>o.uid===action.uid);if(index<0)return fail('晶矿已经领取。');
      const result=grantRewards(state,state.loot[index].contents);if(!result.ok)return result;
      state.loot.splice(index,1);return result;
    }
    case 'open-chest': {
      if(!state.chests.some(c=>c.uid===action.uid))return fail('武装箱不存在。');
      state.activeChest=action.uid;return success('请选择武装；也可以取消并保留箱子。');
    }
    case 'cancel-chest':state.activeChest=null;return success('武装箱已保留，可稍后继续选择。');
    case 'choose-chest': {
      const index=state.chests.findIndex(c=>c.uid===state.activeChest),chest=state.chests[index];
      if(!chest||!chest.options[action.index])return fail('请选择有效武装。');
      const id=chest.options[action.index];state.inventory.push(id);state.chests.splice(index,1);state.activeChest=null;
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
      if(state.units.filter(u=>u.zone==='bench').length>=BENCH_CAPACITY&&copies<2)return fail('备战席已满，请先部署或出售角色。');
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
      rollShop(state);return success(cost?'商店已刷新':`免费刷新成功，剩余 ${state.freeRefreshes} 次`);
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
      if(!unit||!['front','back','bench'].includes(action.zone))return fail('请选择有效角色和位置。');
      if(action.position!==undefined&&(!Number.isInteger(action.position)||action.position<0))return fail('请选择有效的位置。');
      if(unit.zone===action.zone&&action.position===undefined)return success('角色已在该位置。');
      if(unit.zone!==action.zone&&action.zone==='front'&&state.units.filter(u=>u.zone==='front').length>=FRONT_CAPACITY)return fail('前台最多部署 4 人，请先调整阵容。');
      if(unit.zone==='bench'&&action.zone!=='bench'&&deployed(state).length>=getPopulationLimit(state))return fail('部署人数已达上限，购买经验可提升人口。');
      if(unit.zone!==action.zone&&action.zone==='bench'&&state.units.filter(u=>u.zone==='bench').length>=BENCH_CAPACITY)return fail('备战席已满。');
      unit.zone=action.zone;const c=getCharacter(unit.characterId);
      state.units=state.units.filter(u=>u!==unit);
      const row=state.units.filter(u=>u.zone===action.zone),before=row[action.position??row.length];
      const index=before?state.units.indexOf(before):row.length?state.units.indexOf(row.at(-1))+1:state.units.length;
      state.units.splice(index,0,unit);
      return success(`已将${c.name}移至${{front:'前台',back:'后台',bench:'备战席'}[action.zone]}${action.zone!=='bench'&&!c.allowedZones.includes(action.zone)?'；此位置无法激活角色赋能':''}`);
    }
    case 'sell': {
      const index=state.units.findIndex(u=>u.uid===action.uid);if(index<0)return fail('角色不存在。');
      const unit=state.units[index],value=unitCost(state,unit)*3**(unit.star-1);
      for(const [id,uid] of Object.entries(state.progression.day.assignments))if(uid===unit.uid)delete state.progression.day.assignments[id];
      for(const [id,uid] of Object.entries(state.progression.gamer.accessoryOwners||{}))if(uid===unit.uid)delete state.progression.gamer.accessoryOwners[id];
      state.gold+=value;state.inventory.push(...unit.items);state.units.splice(index,1);
      return success(`已出售，获得 ${value} 金币；装备已返还。`);
    }
    case 'equip': {
      const unit=state.units.find(u=>u.uid===action.uid),item=state.inventory[action.itemIndex];
      if(!unit||!getEquipment(item))return fail('请选择角色和有效装备。');
      if(getEquipment(item).unique&&unit.items.some(key=>baseItemId(key)===baseItemId(item)))return fail('同一角色不能重复穿戴这件唯一装备。');
      if((getEquipment(item).exclusiveSlots&&(unit.items.length||daySlots(state,unit.uid)))||unit.items.some(id=>getEquipment(id).exclusiveSlots))return fail('随便骰子需要三个空装备栏，并占用另外两栏。');
      if(unit.items.length+daySlots(state,unit.uid)>=3)return fail('每位角色最多携带 3 件装备（包含白昼装备）。');
      unit.items.push(item);state.inventory.splice(action.itemIndex,1);
      return success(`${getCharacter(unit.characterId).name}已装备${getEquipment(item).name}`);
    }
    case 'unequip': {
      const unit=state.units.find(u=>u.uid===action.uid);
      if(!unit||!getEquipment(unit.items[action.itemIndex]))return fail('请选择有效装备。');
      state.inventory.push(unit.items.splice(action.itemIndex,1)[0]);return success('装备已放回仓库');
    }
    case 'combine': {
      const {indexA,indexB}=action;
      const a=state.inventory[indexA],b=state.inventory[indexB];
      if(indexA===indexB||!getEquipment(a)||!getEquipment(b))return fail('请选择两件不同的简易装备。');
      if(getEquipment(a).tier!==1||getEquipment(b).tier!==1)return fail('进阶装备不能继续合成。');
      const result=RECIPES[[a,b].sort().join('+')];
      if(!result)return fail('这两件装备没有合成配方。');
      for(const index of [indexA,indexB].sort((x,y)=>y-x))state.inventory.splice(index,1);
      state.inventory.push(result);state.freeRefreshes+=sumEffect(state,'combineFreeRefreshes');return success(`合成成功：${getEquipment(result).name}`);
    }
    case 'battle': {
      if(!state.units.some(u=>u.zone==='front'))return fail('至少部署一名前台角色才能开始战斗。');
      const enemy=getEnemy(state),playerPower=getTeamPower(state);
      const company=getSynergies(state).find(s=>s.id==='ipc');
      const companyGold=!enemy.boss&&company?.active?(company.count>=3?3:1):0;
      state.gold+=companyGold;
      const combat=simulateCombat(state);
      const won=combat.winner==='ally';
      const damage=won?0:Math.max(3,Math.round(9+state.round*1.4+(enemy.boss?5:0)-(has(state,'fortress')?4:0)));
      const interest=getInterest(state);
      state.streak=won?Math.max(1,state.streak+1):Math.min(-1,state.streak-1);
      const streakBonus=Math.min(3,Math.floor(Math.abs(state.streak)/2));
      const income=8+interest+streakBonus+(won?2:0)+(has(state,'dividend')?3:0)+(won&&has(state,'momentum')?3:0);
      let healing=(has(state,'recovery')?5:0)+sumEffect(state,'battleHeal');
      // A lethal defeat cannot be undone by post-battle healing.
      state.hp=state.hp-damage<=0?0:Math.min(getMaxHp(state),state.hp-damage+healing);
      state.gold+=income;state[won?'wins':'losses']++;
      const growthRewards=onBattleResolved(state,combat);
      queueRewards(state,growthRewards,'战后羁绊奖励');
      if(won&&enemy.boss)queueRewards(state,[{kind:'chest',quality:state.round>=8?'privileged':'advanced'},{kind:'gold',amount:5}],'首领晶矿');
      const logs=combat.events.map(event=>event.text);
      if(healing&&state.hp>0)logs.push(`战后恢复生效，回复 ${healing} 点小队生命（最高 ${getMaxHp(state)}）。`);
      const rewards=[`基础收入 +8`,`利息 +${interest}`,`连续战绩 +${streakBonus}`];
      if(companyGold)rewards.push(`公司羁绊 +${companyGold}`);
      if(won)rewards.push('胜利奖励 +2');
      if(has(state,'dividend'))rewards.push('稳定分红 +3');
      if(won&&has(state,'momentum'))rewards.push('乘胜追投 +3');
      if(growthRewards.length)rewards.push(`羁绊产出 ${growthRewards.length} 枚晶矿，返回备战后领取`);
      if(won&&enemy.boss)rewards.push('首领晶矿已掉落，返回备战后领取');
      state.lastBattle={won,playerPower,enemyPower:enemy.power,damage,income,logs,rewards,enemy:enemy.name,healing,combat};
      state.history.push({round:state.round,won,damage,income,playerPower,enemyPower:enemy.power,turns:combat.turns,reason:combat.reason});
      state.phase='result';return success(won?'战斗胜利':'战斗结束');
    }
    default:return fail('未知操作。');
  }
}

export function act(state,action) {
  if(!state||typeof state!=='object')return fail('存档无效。');
  const draft=clone(state);
  const response=runAction(draft,action);
  if(response.ok) {
    if(['buy','exp','refresh'].includes(action.type))queueRewards(draft,onManagementAction(draft,action,{goldSpent:Math.max(0,draft.goldSpentThisNode-state.goldSpentThisNode),xp:action.type==='exp'?(has(state,'growth')?6:4):0}),'圣杯试炼');
    else queueRewards(draft,onRosterChanged(draft),'羁绊奖励');
    refreshProgression(draft);
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
  return validateState(state)?state:null;
}

export function validateState(state) {
  if(!state||state.version!==3||state.ruleset!=='zero-sum'||!validateLoot(state)||!validateProgression(state))return false;
  if(!['prep','result','choice','ended'].includes(state.phase))return false;
  for(const key of ['round','hp','gold','level','xp','rng','seed','nextUid','streak','wins','losses','freeRefreshes','goldSpentThisNode'])if(!Number.isFinite(state[key])||!Number.isInteger(state[key]))return false;
  if(state.round<1||state.round>ROUND_COUNT||state.hp<0||state.gold<0||state.level<4||state.level>MAX_LEVEL||state.xp<0||state.freeRefreshes<0||state.goldSpentThisNode<0)return false;
  if(state.nextUid<1||state.wins<0||state.losses<0||(state.level<MAX_LEVEL&&state.xp>=LEVEL_XP[state.level])||(state.level===MAX_LEVEL&&state.xp!==0))return false;
  if(!Array.isArray(state.units)||state.units.length>getPopulationLimit(state)+BENCH_CAPACITY||!Array.isArray(state.inventory)||!Array.isArray(state.shop)||state.shop.length!==5)return false;
  if(!Array.isArray(state.strategies)||!state.strategies.every(id=>strategyIds.has(id))||new Set(state.strategies).size!==state.strategies.length)return false;
  if(state.hp>getMaxHp(state)||!state.strategyState||typeof state.strategyState!=='object'||Array.isArray(state.strategyState))return false;
  for(const record of Object.values(state.strategyState))if(!record||!Number.isInteger(record.acquiredRound)||record.acquiredRound<1||record.acquiredRound>state.round||!Number.isInteger(record.nodes)||record.nodes<0||!Array.isArray(record.purchasedCosts)||!record.purchasedCosts.every(n=>Number.isInteger(n)&&n>=1&&n<=5))return false;
  if(!Array.isArray(state.choices)||!Array.isArray(state.history)||typeof state.locked!=='boolean')return false;
  const ids=new Set();
  for(const unit of state.units) {
    if(!unit||typeof unit.uid!=='string'||ids.has(unit.uid)||!getCharacter(unit.characterId)||![1,2,3].includes(unit.star)||!['front','back','bench'].includes(unit.zone))return false;
    if(unit.recruitCost!==undefined&&(!Number.isInteger(unit.recruitCost)||unit.recruitCost<1||unit.recruitCost>5))return false;
    if(!Array.isArray(unit.items)||unit.items.length>3||!unit.items.every(id=>getEquipment(id)))return false;
    if(unit.extraTraits!==undefined&&(!Array.isArray(unit.extraTraits)||!unit.extraTraits.every(id=>TRAITS.some(t=>t.id===id))||new Set(unit.extraTraits).size!==unit.extraTraits.length))return false;
    if(unit.items.some(id=>getEquipment(id).exclusiveSlots)&&unit.items.length>1)return false;
    if(unit.items.some(id=>getEquipment(id).unique&&unit.items.filter(key=>baseItemId(key)===baseItemId(id)).length>1))return false;
    ids.add(unit.uid);
  }
  if(state.units.filter(u=>u.zone==='front').length>FRONT_CAPACITY||state.units.filter(u=>u.zone==='bench').length>BENCH_CAPACITY||deployed(state).length>getPopulationLimit(state))return false;
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
