import {CHARACTERS,TRAITS,EQUIPMENT,STRATEGIES,RECIPES,LEVEL_XP} from './data.js';

const characters = new Map(CHARACTERS.map(c=>[c.id,c]));
const equipment = new Map(EQUIPMENT.map(e=>[e.id,e]));
const strategyIds = new Set(STRATEGIES.map(s=>s.id));
const clone = value => JSON.parse(JSON.stringify(value));
const fail = message => ({ok:false,message});
const success = message => ({ok:true,message});
const has = (state,id) => state.strategies.includes(id);
const deployed = state => state.units.filter(u=>u.zone!=='bench');
export const getCharacter = id => characters.get(String(id));
export const getEquipment = id => equipment.get(id);

function random(state) {
  let value = state.rng >>> 0;
  value ^= value << 13; value ^= value >>> 17; value ^= value << 5;
  state.rng = value >>> 0;
  return state.rng / 4294967296;
}

function pick(state,list) { return list[Math.floor(random(state)*list.length)]; }
function addUnit(state,characterId,zone='bench') {
  const unit={uid:`u${state.nextUid++}`,characterId:String(characterId),star:1,zone,items:[]};
  state.units.push(unit);
  return unit;
}

function rollShop(state) {
  const chances = {4:[55,32,13,0,0],5:[40,35,20,5,0],6:[27,33,28,10,2],7:[18,28,32,18,4],8:[12,20,30,28,10]};
  state.shop = Array.from({length:5},()=>{
    let roll=random(state)*100;
    let cost=1;
    for(const chance of chances[state.level]) {if(roll<chance) break;roll-=chance;cost++;}
    return pick(state,CHARACTERS.filter(c=>c.cost===cost)).id;
  });
}

function addXp(state,amount) {
  state.xp+=amount;
  while(state.level<8 && state.xp>=LEVEL_XP[state.level]) {
    state.xp-=LEVEL_XP[state.level];state.level++;
  }
  if(state.level===8) state.xp=0;
}

function mergeUnits(state) {
  const merges=[];
  for(let star=1;star<=2;star++) {
    for(const character of CHARACTERS) {
      let copies=state.units.filter(u=>u.characterId===character.id&&u.star===star);
      while(copies.length>=3) {
        copies.sort((a,b)=>({front:0,back:1,bench:2}[a.zone]-{front:0,back:1,bench:2}[b.zone]));
        const group=copies.slice(0,3), survivor=group[0];
        const allItems=group.flatMap(u=>u.items);
        survivor.star++;
        survivor.items=allItems.slice(0,3);
        state.inventory.push(...allItems.slice(3));
        const removed=new Set(group.slice(1).map(u=>u.uid));
        state.units=state.units.filter(u=>!removed.has(u.uid));
        merges.push(`${character.name}升至${survivor.star}星`);
        copies=state.units.filter(u=>u.characterId===character.id&&u.star===star);
      }
    }
  }
  return merges;
}

export function createGame(seed=Date.now()) {
  const normalized=(Number(seed)>>>0)||197706;
  const state={version:1,seed:normalized,rng:normalized,round:1,hp:100,gold:16,level:4,xp:0,nextUid:1,
    units:[],shop:[],locked:false,inventory:['knife','flower','battery'],strategies:[],phase:'prep',
    choices:[],choiceKind:null,streak:0,wins:0,losses:0,lastBattle:null,history:[],result:null};
  addUnit(state,'1001','front');addUnit(state,'1002','front');addUnit(state,'1013','front');addUnit(state,'1009','back');
  state.shop=['1002','1001','1002','1105','1202'];
  return state;
}

export function getSynergies(state) {
  const unique=new Set(deployed(state).map(u=>u.characterId));
  const counts={};
  for(const id of unique) for(const trait of getCharacter(id)?.traits||[]) counts[trait]=(counts[trait]||0)+1;
  return TRAITS.filter(t=>counts[t.id]).map(t=>{
    const count=counts[t.id],level=t.thresholds.filter(n=>count>=n).length;
    return {...t,count,active:level>0,level,next:t.thresholds.find(n=>n>count)??null};
  }).sort((a,b)=>Number(b.active)-Number(a.active)||b.count-a.count);
}

function traitBonuses(state) {
  let attack=0,hp=0,speed=0;
  for(const s of getSynergies(state)) {
    if(!s.active)continue;
    const index=s.level-1;
    if(s.id==='express')attack+=[.08,.18][index];
    if(s.id==='station')speed+=[8,16][index];
    if(s.id==='belobog')hp+=[.10,.20,.32][index];
    if(s.id==='hunters')attack+=[.12,.24][index];
    if(s.id==='luofu')speed+=[6,14,24][index];
    if(s.id==='wildfire')hp+=[.12,.24][index];
    if(s.id==='shield')hp+=[.14,.28][index];
    if(s.id==='strike')attack+=[.10,.22][index];
    if(s.id==='follow')speed+=[10,22][index];
    if(s.id==='support') {attack+=[.06,.14][index];hp+=[.06,.14][index];}
    if(s.id==='dot')attack+=[.12,.26][index];
    if(s.id==='heal')hp+=.18;
  }
  return {attack,hp,speed};
}

export function getUnitStats(state,unit) {
  const character=getCharacter(unit.characterId);
  if(!character) return {attack:0,hp:0,speed:100,power:0,contribution:0};
  const factor=[0,1,1.85,3.5][unit.star],bonus=traitBonuses(state);
  let attack=character.attack*factor,hp=character.hp*factor,speed=100;
  for(const id of unit.items) {const item=getEquipment(id);attack+=item?.attack||0;hp+=item?.hp||0;speed+=item?.speed||0;}
  attack*=1+bonus.attack+(has(state,'vanguard')&&unit.zone==='front'?.22:0)+(has(state,'recovery')?.08:0)+(has(state,'momentum')?.10:0);
  hp*=1+bonus.hp+(has(state,'fortress')?.25:0);
  speed+=bonus.speed;
  attack=Math.round(attack);hp=Math.round(hp);speed=Math.round(speed);
  const power=Math.round((attack*2.2+hp*.18)*(speed/100));
  const efficiency=unit.zone==='front'?1:unit.zone==='back'?(has(state,'backline')?1:.72):0;
  return {attack,hp,speed,power,contribution:Math.round(power*efficiency)};
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
  return {name,power,boss:state.round%4===0,description};
}

function choicesFor(state,kind) {
  const candidates=kind==='strategy'?STRATEGIES.filter(s=>!has(state,s.id)):EQUIPMENT.filter(e=>e.tier===1);
  const pool=[...candidates];state.choices=[];
  while(state.choices.length<3&&pool.length) {
    const index=Math.floor(random(state)*pool.length);
    state.choices.push({kind,id:pool.splice(index,1)[0].id});
  }
  state.choiceKind=kind;state.phase='choice';
}

function runAction(state,action) {
  if(!action||typeof action.type!=='string')return fail('操作无效。');
  const indexKeys={buy:['index'],choose:['index'],equip:['itemIndex'],unequip:['itemIndex'],combine:['indexA','indexB']}[action.type]||[];
  if(indexKeys.some(key=>!Number.isInteger(action[key])||action[key]<0))return fail('请选择有效的位置。');
  if(action.type==='next') {
    if(state.phase!=='result')return fail('请先完成本回合战斗。');
    if(state.hp<=0||state.round===12) {
      state.phase='ended';state.result=state.hp>0&&state.lastBattle.won?'victory':'defeat';
      return success(state.result==='victory'?'远征完成，经典仍在继续。':'本次远征结束，下一次投资会更好。');
    }
    state.round++;addXp(state,2);
    if(!state.locked)rollShop(state);
    if([2,6,10].includes(state.round))choicesFor(state,'strategy');
    else if([3,5,7,9,11].includes(state.round))choicesFor(state,'equipment');
    else {state.phase='prep';state.choices=[];state.choiceKind=null;}
    return success(`进入第 ${state.round} 回合`);
  }
  if(action.type==='choose') {
    if(state.phase!=='choice')return fail('当前没有待选择的奖励。');
    const choice=state.choices[action.index];if(!choice)return fail('请选择有效奖励。');
    let name;
    if(choice.kind==='strategy') {
      state.strategies.push(choice.id);name=STRATEGIES.find(s=>s.id===choice.id).name;
      if(choice.id==='compound')state.gold+=8;
      if(choice.id==='growth')addXp(state,8);
    } else {state.inventory.push(choice.id);name=getEquipment(choice.id).name;}
    state.choices=[];state.choiceKind=null;state.phase='prep';
    return success(`已获得「${name}」`);
  }
  if(state.phase!=='prep')return fail('请先完成当前结算或奖励选择。');
  switch(action.type) {
    case 'buy': {
      const character=getCharacter(state.shop[action.index]);
      if(!character)return fail('这个位置没有可招募的角色。');
      if(state.gold<character.cost)return fail('金币不足。');
      const copies=state.units.filter(u=>u.characterId===character.id&&u.star===1).length;
      if(state.units.filter(u=>u.zone==='bench').length>=8&&copies<2)return fail('备战席已满，请先部署或出售角色。');
      state.gold-=character.cost;state.shop[action.index]=null;addUnit(state,character.id);
      const merges=mergeUnits(state);
      return success(merges.length?merges.join(' · '):`已招募${character.name}`);
    }
    case 'refresh': {
      const cost=has(state,'discount')?1:2;
      if(state.gold<cost)return fail('刷新商店的金币不足。');
      state.gold-=cost;rollShop(state);return success('商店已刷新');
    }
    case 'lock':state.locked=!state.locked;return success(state.locked?'商店已锁定，下回合保留。':'已解除商店锁定');
    case 'exp': {
      if(state.level>=8)return fail('已达到最高等级。');
      if(state.gold<4)return fail('购买经验需要 4 金币。');
      state.gold-=4;const previous=state.level;addXp(state,has(state,'growth')?6:4);
      return success(state.level>previous?`提升至 ${state.level} 级，可以部署更多角色。`:'已获得经验');
    }
    case 'move': {
      const unit=state.units.find(u=>u.uid===action.uid);
      if(!unit||!['front','back','bench'].includes(action.zone))return fail('请选择有效角色和位置。');
      if(unit.zone===action.zone)return success('角色已在该位置。');
      if(action.zone==='front'&&state.units.filter(u=>u.zone==='front').length>=4)return fail('前台最多部署 4 人，请先调整阵容。');
      if(unit.zone==='bench'&&action.zone!=='bench'&&deployed(state).length>=state.level)return fail('部署人数已达上限，购买经验可提升人口。');
      if(action.zone==='bench'&&state.units.filter(u=>u.zone==='bench').length>=8)return fail('备战席已满。');
      unit.zone=action.zone;return success(`已将${getCharacter(unit.characterId).name}移至${{front:'前台',back:'后台',bench:'备战席'}[action.zone]}`);
    }
    case 'sell': {
      const index=state.units.findIndex(u=>u.uid===action.uid);if(index<0)return fail('角色不存在。');
      const unit=state.units[index],value=getCharacter(unit.characterId).cost*3**(unit.star-1);
      state.gold+=value;state.inventory.push(...unit.items);state.units.splice(index,1);
      return success(`已出售，获得 ${value} 金币；装备已返还。`);
    }
    case 'equip': {
      const unit=state.units.find(u=>u.uid===action.uid),item=state.inventory[action.itemIndex];
      if(!unit||!getEquipment(item))return fail('请选择角色和有效装备。');
      if(unit.items.length>=3)return fail('每位角色最多携带 3 件装备。');
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
      const result=RECIPES[[a,b].sort().join('+')]||'hybrid';
      for(const index of [indexA,indexB].sort((x,y)=>y-x))state.inventory.splice(index,1);
      state.inventory.push(result);return success(`合成成功：${getEquipment(result).name}`);
    }
    case 'battle': {
      if(!state.units.some(u=>u.zone==='front'))return fail('至少部署一名前台角色才能开始战斗。');
      const enemy=getEnemy(state),playerPower=getTeamPower(state);
      const won=playerPower>=enemy.power;
      const damage=won?0:Math.max(3,Math.round(9+state.round*1.4+(enemy.boss?5:0)-(has(state,'fortress')?4:0)));
      const interest=Math.min(has(state,'compound')?8:5,Math.floor(state.gold/10));
      state.streak=won?Math.max(1,state.streak+1):Math.min(-1,state.streak-1);
      const streakBonus=Math.min(3,Math.floor(Math.abs(state.streak)/2));
      const income=8+interest+streakBonus+(won?2:0)+(has(state,'dividend')?3:0)+(won&&has(state,'momentum')?3:0);
      let healing=has(state,'recovery')?5:0;
      if(getSynergies(state).some(s=>s.id==='heal'&&s.active))healing+=4;
      // A lethal defeat cannot be undone by post-battle healing.
      state.hp=state.hp-damage<=0?0:Math.min(100,state.hp-damage+healing);
      state.gold+=income;state[won?'wins':'losses']++;
      const logs=[`敌方「${enemy.name}」进入战场，战力 ${enemy.power}。`];
      for(const unit of deployed(state)) {
        const c=getCharacter(unit.characterId);
        logs.push(`${c.name}${unit.zone==='back'?'从后台协同，':'发动'}「${c.skill}」，贡献 ${getUnitStats(state,unit).contribution} 战力。`);
      }
      const synergies=getSynergies(state).filter(s=>s.active);
      if(synergies.length)logs.push(`${synergies.map(s=>`${s.name}(${s.count})`).join('、')}羁绊生效。`);
      logs.push(won?'击破敌方防线，本回合胜利！':`阵容未能突破防线，受到 ${damage} 点伤害。`);
      if(healing&&state.hp>0)logs.push(`恢复效果生效，回复 ${healing} 点生命（最高 100）。`);
      const rewards=[`基础收入 +8`,`利息 +${interest}`,`连续战绩 +${streakBonus}`];
      if(won)rewards.push('胜利奖励 +2');
      if(has(state,'dividend'))rewards.push('稳定分红 +3');
      if(won&&has(state,'momentum'))rewards.push('乘胜追投 +3');
      state.lastBattle={won,playerPower,enemyPower:enemy.power,damage,income,logs,rewards,enemy:enemy.name,healing};
      state.history.push({round:state.round,won,damage,income,playerPower,enemyPower:enemy.power});
      state.phase='result';return success(won?'战斗胜利':'战斗结束');
    }
    default:return fail('未知操作。');
  }
}

export function act(state,action) {
  if(!state||typeof state!=='object')return fail('存档无效。');
  const draft=clone(state);
  const response=runAction(draft,action);
  if(response.ok)Object.assign(state,draft);
  return response;
}

export function validateState(state) {
  if(!state||state.version!==1)return false;
  if(!['prep','result','choice','ended'].includes(state.phase))return false;
  for(const key of ['round','hp','gold','level','xp','rng','seed','nextUid','streak','wins','losses'])if(!Number.isFinite(state[key])||!Number.isInteger(state[key]))return false;
  if(state.round<1||state.round>12||state.hp<0||state.hp>100||state.gold<0||state.level<4||state.level>8||state.xp<0)return false;
  if(state.nextUid<1||state.wins<0||state.losses<0||(state.level<8&&state.xp>=LEVEL_XP[state.level])||(state.level===8&&state.xp!==0))return false;
  if(!Array.isArray(state.units)||state.units.length>16||!Array.isArray(state.inventory)||!Array.isArray(state.shop)||state.shop.length!==5)return false;
  if(!Array.isArray(state.strategies)||!state.strategies.every(id=>strategyIds.has(id))||new Set(state.strategies).size!==state.strategies.length)return false;
  if(!Array.isArray(state.choices)||!Array.isArray(state.history)||typeof state.locked!=='boolean')return false;
  const ids=new Set();
  for(const unit of state.units) {
    if(!unit||typeof unit.uid!=='string'||ids.has(unit.uid)||!getCharacter(unit.characterId)||![1,2,3].includes(unit.star)||!['front','back','bench'].includes(unit.zone))return false;
    if(!Array.isArray(unit.items)||unit.items.length>3||!unit.items.every(id=>getEquipment(id)))return false;
    ids.add(unit.uid);
  }
  if(state.units.filter(u=>u.zone==='front').length>4||state.units.filter(u=>u.zone==='bench').length>8||deployed(state).length>state.level)return false;
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
