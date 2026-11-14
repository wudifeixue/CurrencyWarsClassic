import {getRunLength} from './classic-flow.js?v=6.0.0';
// Old Zero-Sum Game persistent bonds. References and simulator boundaries:
// docs/classic-progression-research.md. No dependency on engine or combat.
import {CLASSIC_CHARACTERS,CLASSIC_TRAITS} from './classic-roster.js?v=6.0.0';
import {CLASSIC_EQUIPMENT} from './classic-items.js?v=6.0.0';
const chars=new Map(CLASSIC_CHARACTERS.map(c=>[c.id,c]));
const traits=new Map(CLASSIC_TRAITS.map(t=>[t.id,t]));
const gear=new Map(CLASSIC_EQUIPMENT.map(e=>[e.id,e]));
const copy=x=>JSON.parse(JSON.stringify(x));
const finite=(n,f=0)=>Number.isFinite(Number(n))?Number(n):f;
const deployed=s=>(s.units||[]).filter(u=>u.zone==='front'||u.zone==='back');
const char=u=>chars.get(String(u.characterId));
const unique=xs=>[...new Set(xs)];
const gold=amount=>({kind:'gold',amount});
const item=(id,amount=1)=>({kind:'item',id,amount});
const chest=(quality='basic',amount=1)=>({kind:'chest',quality,amount});
const hero=(id,amount=1,star=1)=>({kind:'character',id:String(id),amount,star});
export const SCHOLAR_THRESHOLDS=Object.freeze([6,24,60,105,180,270,390,540,780]);
export const WOLF_THRESHOLDS=Object.freeze([12,40,100,250,600,1000]);
export const NIGHT_THRESHOLDS=Object.freeze([9,24,45,66,90,120,160,240,360]);
const levelAt=(value,thresholds)=>1+thresholds.filter(t=>value>=t).length;
export const WOLF_FORMS=Object.freeze([
 {name:'狼卒',speed:300,attackScale:10,splashScale:0,secondAttackScale:0,crit:0,element:'physical'},
 {name:'狼卒长',speed:400,attackScale:10,splashScale:0,secondAttackScale:0,crit:.2,element:'physical'},
 {name:'狼督军',speed:500,attackScale:12,splashScale:8,secondAttackScale:0,crit:.25,element:'physical'},
 {name:'狼飞将',speed:600,attackScale:15,splashScale:12,secondAttackScale:0,crit:.3,element:'physical',extraWolf:true},
 {name:'奔雷狼王',speed:800,attackScale:15,splashScale:12,secondAttackScale:18,crit:.35,element:'thunder',vulnerability:.2},
 {name:'赤月•狼之祖',speed:1000,attackScale:18,splashScale:0,secondAttackScale:25,crit:.4,element:'thunder',target:'all',vulnerability:.2},
 {name:'赤月•狼神尊',speed:3000,attackScale:60,splashScale:0,secondAttackScale:100,crit:.5,element:'thunder',target:'all',vulnerability:.5},
]);
export const REVELATION_CARDS=Object.freeze([
 {id:'assertion',name:'断言',cost:5,description:'开场对全体敌人造成其生命上限10%的真实伤害。'},
 {id:'deep-arcana',name:'深层奥迹',cost:5,description:'奥迹上限提高49层，每层倍率提高20%。'},
 {id:'original-arcana',name:'原始奥迹',cost:5,description:'敌人入场时附加7层奥迹。'},
 {id:'agility',name:'机敏',cost:5,description:'小队速度增幅提高16%。'},
 {id:'fortune',name:'妙运',cost:5,description:'五费刷新概率提高3个百分点。'},
 {id:'blank',name:'留白卡',cost:0,description:'黑天鹅后台强度提高25%。'},
]);
export const HACKER_COMPONENTS=Object.freeze([
 {id:'clone-glasses',name:'分身墨镜',description:'获得银狼；银狼与LV.999同时出战时，两人速度和伤害提高20%。LV.999前台强度提高40%。',frontPower:.4},
 {id:'data-copier',name:'数据拷贝仪',description:'每参与3战获得一星复制，招募时另有30%复制概率；二/三星伤害提高20%/50%。前台强度提高30%。',frontPower:.3},
 {id:'hunters-cassette',name:'星核猎手卡带',description:'星核猎手人数+1；LV.999前台强度提高40%。',frontPower:.4},
 {id:'elation-cassette',name:'欢愉卡带',description:'欢愉人数+1；LV.999前台强度提高40%。',frontPower:.4},
 {id:'firewall',name:'病毒防火墙',description:'敌人受到的伤害提高35%；LV.999前台强度提高30%。',frontPower:.3},
]);
const POEMS=[
 {id:'wealth',name:'财富之诗',cost:0,description:'获得3金币。',rewards:[gold(3)]},
 {id:'growth',name:'成长之诗',cost:0,description:'获得4经验。',rewards:[{kind:'xp',amount:4}]},
 {id:'opportunity',name:'机遇之诗',cost:0,description:'获得2次免费刷新。',rewards:[{kind:'refresh',amount:2}]},
 {id:'life',name:'生命之诗',cost:5,description:'获得10点小队生命及生命上限。',rewards:[{kind:'hp',amount:10,maxHp:10}]},
 {id:'love',name:'爱心之诗',cost:0,description:'恢复2点小队生命。',rewards:[{kind:'hp',amount:2}]},
 {id:'forge',name:'锻造之诗',cost:6,description:'获得简易武装箱。',rewards:[chest()]},
 {id:'projection',name:'光影之诗',cost:6,description:'获得员工投影仪。',rewards:[item('projector')]},
 {id:'perfect-projection',name:'完美光影之诗',cost:12,description:'获得完美投影仪。',rewards:[item('perfect-projector')]},
 {id:'authority',name:'权力之诗',cost:15,description:'获得特权赋予卡。',rewards:[item('privilege-card')]},
 {id:'red-poem',name:'红之诗',cost:12,description:'获得一颗红钻。',rewards:[item('red-gem')]},
 {id:'blue-poem',name:'蓝之诗',cost:12,description:'获得一颗蓝钻。',rewards:[item('blue-gem')]},
 {id:'memory',name:'记忆之诗',cost:2,description:'获得记忆开拓者。',rewards:[hero('8007')]},
 {id:'self',name:'与我有关的诗',cost:5,description:'获得昔涟。',rewards:[hero('1415')]},
 {id:'trio',name:'三重奏',cost:6,description:'获得两张3费聘用书。',rewards:[item('hire-3',2)]},
 {id:'quartet',name:'四重奏',cost:8,description:'获得两张4费聘用书。',rewards:[item('hire-4',2)]},
 {id:'quintet',name:'五重奏',cost:8,description:'获得一张5费聘用书。',rewards:[item('hire-5')]},
 {id:'dawn',name:'等待黎明',cost:15,description:'获得昼之半神星徽。',rewards:[item('trait-day')]},
 {id:'dusk',name:'等待黄昏',cost:15,description:'获得夜之半神星徽。',rewards:[item('trait-night')]},
 {id:'strength',name:'赐予力量之诗',cost:0,description:'小队永久获得3%伤害增幅。',buff:{damageAmp:.03}},
 {id:'speed',name:'赐予神速之诗',cost:0,description:'小队永久获得3%速度增幅。',buff:{speedPct:.03}},
 {id:'guard',name:'赐予守护之诗',cost:0,description:'小队永久获得3%伤害减免。',buff:{damageReduction:.03}},
 {id:'hero-return',name:'英雄凯旋之诗',cost:2,description:'下一战完美通关后获得8金币。',nextPerfect:8},
 {id:'all-golden',name:'黄金裔，集结！',cost:24,description:'获得所有黄金裔角色各一位。',golden:true},
 {id:'wealth-river',name:'财富，汇聚成河',cost:0,minStar:3,description:'获得60金币和60经验。',rewards:[gold(60),{kind:'xp',amount:60}]},
 {id:'life-bloom',name:'生命，盛放于此',cost:0,minStar:3,description:'恢复100点小队生命。',rewards:[{kind:'hp',amount:100}]},
 {id:'shield-spear',name:'盾矛，冲锋在前',cost:0,minStar:3,description:'永久获得99%减伤与99%伤害增幅。',buff:{damageReduction:.99,damageAmp:.99}},
];
export const CYRENE_POEMS=Object.freeze(POEMS);
// Conditions and guaranteed rewards below are documented in the frozen 4.6
// community observation sheet. Random reward-pool entries explicitly use a
// selected verified gold outcome; original unknown probabilities are not invented.
export const GRAIL_TRIALS=Object.freeze([
 {id:'return-1',name:'归还仪式 I',tier:1,event:'refresh',target:4,rewards:[gold(4)],adaptedPool:true,description:'累计刷新商店4次，获得4金币（已核实奖池中的固定金币分支）。'},
 {id:'archer-banner',name:'弓兵满旗',tier:1,event:'rin-refresh',target:20,rewards:[hero('1015')],description:'远坂凛在场时累计刷新20次，获得Archer。'},
 {id:'fifth-battle',name:'第五战前奏',tier:1,event:'grail-stars',target:5,rewards:[item('projector',2)],description:'上场圣杯角色总星级达到5，获得2个员工投影仪。'},
 {id:'circuit-1',name:'回路升级 I',tier:1,event:'purchase-xp',target:12,rewards:[{kind:'xp',amount:4}],adaptedPool:true,description:'累计购买12经验，获得4经验（已核实奖池分支）。'},
 {id:'infinite-broth',name:'无尽浓汤',tier:2,event:'energy-count',target:7,rewards:[item('perpetual')],description:'出战时激活7能量，获得永动机。'},
 {id:'yours',name:'任君取用',tier:2,event:'sp-count',target:6,rewards:[item('firestorm')],description:'出战时激活6战技点，获得火力风暴潮。'},
 {id:'workshop',name:'万能工坊',tier:2,event:'shop-level',target:9,rewards:[{kind:'xp',amount:72}],description:'商店升至9级，获得72经验。'},
 {id:'return-3',name:'归还仪式 III',tier:2,event:'refresh',target:6,rewards:[gold(8)],adaptedPool:true,description:'累计刷新6次，获得8金币（已核实奖池分支）。'},
 {id:'disguise-ascension',name:'因祸得福·升华',tier:3,event:'nonperfect-streak',target:3,rewards:[gold(60)],description:'连续3个战斗节点未完美通关，获得60金币。'},
 {id:'return-3b',name:'归还仪式·继续',tier:3,event:'refresh',target:12,rewards:[gold(8)],adaptedPool:true,adaptedTier:true,description:'累计刷新12次，获得8金币。短局适配：沿用已核实二阶任务。'},
 {id:'perfect',name:'完美胜利',tier:4,event:'perfect',target:3,rewards:[item('perfect-projector',2)],description:'完成3次完美通关，获得2个完美投影仪。'},
 {id:'conquest',name:'征服之路',tier:4,event:'battle',target:3,rewards:[item('wealth-gem')],description:'参与3场战斗，获得财富宝钻。'},
 {id:'gold-burner',name:'烧金富豪',tier:4,event:'gold-spent',target:80,rewards:[gold(40)],description:'累计花费80金币，获得40金币。'},
]);
const BLESSINGS=[
 {id:'guard',name:'庇护祝福',stats:{damageReduction:.1}},
 {id:'front',name:'锋刃祝福',stats:{frontPower:.2}},
 {id:'energy',name:'充能祝福',stats:{startEnergy:15}},
 {id:'speed',name:'疾行祝福',stats:{speedPct:.1}},
 {id:'damage',name:'胜势祝福',stats:{damageAmp:.1}},
 {id:'back',name:'支援祝福',stats:{backPower:.2}},
 {id:'crit',name:'幸运祝福',stats:{crit:.1}},
 {id:'critical',name:'会心祝福',stats:{critDamage:.18}},
];
const DAY_ITEMS=[{id:'day-propeller',name:'白昼•光速螺旋桨',count:3},{id:'day-hybrid',name:'白昼•武器大师',count:4},{id:'day-execution',name:'白昼•斩首行动',count:6}];
export function initProgression(){return {version:1,rng:0,nodeEntries:[],resolvedBattles:[],knownUnits:[],
 scholar:{dna:0,level:1},wolfpack:{xp:0,level:1},night:{essence:0,level:1},day:{unlocked:[],assignments:{}},
 seer:{battles:0,charges:0,cards:[],threeStarGranted:false},gamer:{cost:3,claimedCosts:[],accessories:[],accessoryOwners:{},copyBattles:0,admin:false},
 beloved:{battles:0,poems:[],offers:[],offerNode:0,boughtNode:0,buffs:{},nextPerfect:0},
 navigator:{targetUid:null},festival:{targetUid:null},wanderer:{node:0,blessing:null},mentor:{characterIds:[],swordNodes:0,granted:[]},
 grail:{unlockedTiers:[],offers:[],active:[],completed:[]},management:{refreshes:0,purchasedXp:0,goldSpent:0}};}
function fill(target,defaults){for(const [key,value] of Object.entries(defaults)){if(target[key]===undefined||target[key]===null)target[key]=copy(value);else if(value&&typeof value==='object'&&!Array.isArray(value)){if(typeof target[key]!=='object'||Array.isArray(target[key]))target[key]=copy(value);else fill(target[key],value);}else if(Array.isArray(value)&&!Array.isArray(target[key]))target[key]=[];}return target;}
function bindGamerOwners(state,p){
 const wolves=(state.units||[]).filter(u=>String(u.characterId)==='1506');
 for(const id of [...p.gamer.accessories,...(p.gamer.admin?['admin']:[])])if(!wolves.some(u=>u.uid===p.gamer.accessoryOwners[id])){
  const owner=id==='admin'?wolves.find(u=>u.star>=3&&(u.recruitCost||p.gamer.cost)===5)||wolves[0]:wolves[0];
  if(owner)p.gamer.accessoryOwners[id]=owner.uid;else delete p.gamer.accessoryOwners[id];
 }
 return p;
}
const deployedGamerOwner=(state,p,id)=>deployed(state).find(u=>String(u.characterId)==='1506'&&u.uid===p.gamer.accessoryOwners[id]);
export function migrateProgression(state){
 const fresh=!state.progression||typeof state.progression!=='object'||Array.isArray(state.progression);
 if(fresh)state.progression=initProgression();
 const p=fill(state.progression,initProgression());
 if(!p.rng)p.rng=((finite(state.seed,197706)^0x7a8f4d21)>>>0)||197706;
 for(const [key,prop,thresholds] of [['scholar','dna',SCHOLAR_THRESHOLDS],['wolfpack','xp',WOLF_THRESHOLDS],['night','essence',NIGHT_THRESHOLDS]]){
  p[key][prop]=Math.max(0,finite(p[key][prop]));p[key].level=levelAt(p[key][prop],thresholds);
 }
 if(fresh){p.knownUnits=(state.units||[]).map(u=>u.uid);if(['result','ended'].includes(state.phase))p.resolvedBattles.push(state.round);}
 p.gamer.cost=Math.max(3,Math.min(5,finite(p.gamer.cost,3)));return bindGamerOwners(state,p);
}
const read=s=>bindGamerOwners(s,fill(copy(s.progression||{}),initProgression()));
function random(p){let n=p.rng>>>0;n^=n<<13;n^=n>>>17;n^=n<<5;p.rng=n>>>0;return p.rng/4294967296;}
const pick=(p,list)=>list[Math.floor(random(p)*list.length)];
function sample(p,list,n){const pool=[...list],out=[];while(pool.length&&out.length<n)out.push(pool.splice(Math.floor(random(p)*pool.length),1)[0]);return out;}
function statAdd(target,stats,multiplier=1){for(const [key,value]of Object.entries(stats||{}))target[key]=(target[key]||0)+value*multiplier;}
export function getEffectiveCharacterCost(state,id,unit){
 if(String(id)==='1506')return unit?.recruitCost||read(state).gamer.cost;
 if(String(id)==='1204'&&(state.strategies||[]).includes('feiguang-moon')){const highest=Math.max(1,...(state.units||[]).filter(u=>String(u.characterId)==='1212').map(u=>u.star));return [1,3,5][Math.min(2,highest-1)];}
 return char(unit||{characterId:id})?.cost||1;
}
function baseUnitTraits(state,unit,p=read(state)){
 const unadjusted=other=>unique([...(char(other)?.traits||[]),...(other.extraTraits||[]),...(other.items||[]).filter(id=>id.startsWith('trait-')).map(id=>id.slice(6)),...(p.mentor.characterIds.includes(String(other.characterId))?['mentor']:[])]);
 const base=unadjusted(unit);
 if(String(unit.characterId)==='1101'){
  const counts={blood:new Set(),belobog:new Set()};
  // Evaluate the guardian's own stance before navigator inheritance; this keeps
  // an express-emblem Bronya/navigator pair from recursively counting itself.
  for(const other of deployed(state).filter(u=>String(u.characterId)!=='1101'))for(const id of unadjusted(other))if(counts[id])counts[id].add(String(other.characterId));
  return unique([...base.filter(id=>!['blood','belobog'].includes(id)),counts.blood.size>counts.belobog.size?'blood':'belobog']);
 }
 return unique(base);
}
export function getProgressionNavigatorPartner(state,unit){
 const p=read(state),nav=unit||deployed(state).find(u=>String(u.characterId)==='1510');
 if(!nav||String(nav.characterId)!=='1510'||nav.zone==='bench')return null;
 const target=deployed(state).find(u=>u.uid===p.navigator.targetUid&&u.uid!==nav.uid&&String(u.characterId)!=='1510');
 return target&&baseUnitTraits(state,target,p).includes('express')?target:null;
}
export function getProgressionUnitTraits(state,unit){
 const p=read(state),base=baseUnitTraits(state,unit,p),target=getProgressionNavigatorPartner(state,unit);
 if(target)base.push(...baseUnitTraits(state,target,p).filter(id=>traits.get(id)?.type==='流派羁绊'));
 return unique(base);
}
export function getProgressionTraitCounts(state){
 const counts={},sets={};for(const u of deployed(state))for(const id of getProgressionUnitTraits(state,u))(sets[id]||=new Set()).add(String(u.characterId));
 for(const [id,set]of Object.entries(sets))counts[id]=set.size;
 const p=read(state);for(const [component,trait]of [['hunters-cassette','hunters'],['elation-cassette','elation']])if(p.gamer.accessories.includes(component)&&deployedGamerOwner(state,p,component))counts[trait]=(counts[trait]||0)+1;
 return counts;
}
const tier=(counts,id)=>(traits.get(id)?.thresholds||[]).filter(n=>(counts[id]||0)>=n).length;
const members=(state,id)=>deployed(state).filter(u=>getProgressionUnitTraits(state,u).includes(id));
function rewardsForScholar(level,p){switch(level){case 2:return[gold(3)];case 3:return Array.from({length:4},()=>hero(pick(p,CLASSIC_CHARACTERS.filter(c=>c.cost===1)).id));case 4:return[item('projector'),{kind:'refresh',amount:4}];case 5:return[hero('1401')];case 6:return[chest()];case 7:return[{kind:'xp',amount:24}];case 8:return[item('hire-5'),item('reroll-dice')];case 9:return[item('wealth-gem'),gold(12)];case 10:return[item('privilege-card',6),item('privilege-dice',2)];default:return[];}}
function rewardsForNight(level,p){switch(level){case 2:return[gold(3)];case 3:return[item(pick(p,CLASSIC_EQUIPMENT.filter(i=>i.tier===1)).id)];case 4:return[hero(pick(p,CLASSIC_CHARACTERS.filter(c=>c.cost===3)).id),item('projector')];case 5:return[chest()];case 6:return[hero(pick(p,CLASSIC_CHARACTERS.filter(c=>c.cost===4)).id,1,2)];case 7:return[item('trait-'+pick(p,['express','luofu','day','night','energy','grail'])),item('smelter')];case 8:return[item('privilege-card')];case 9:return[item('wealth-gem')];case 10:return CLASSIC_CHARACTERS.filter(c=>c.cost===5).map(c=>hero(c.id,1,2));default:return[];}}
function gainGrowth(p,key,prop,gain,thresholds,reward){const old=p[key].level;p[key][prop]+=gain;p[key].level=levelAt(p[key][prop],thresholds);const out=[];for(let level=old+1;level<=p[key].level;level++)out.push(...reward(level,p).map(r=>({...r,source:key,sourceLevel:level})));return out;}
function availablePoems(state){const stars=Math.max(0,...deployed(state).filter(u=>String(u.characterId)==='1415').map(u=>u.star));return POEMS.filter(poem=>!poem.minStar||stars>=poem.minStar);}
function syncChoices(state,p){
 const counts=getProgressionTraitCounts(state);
 if(p.beloved.battles>0&&members(state,'beloved').length&&p.beloved.offerNode!==state.round){p.beloved.offers=sample(p,availablePoems(state),3).map(x=>x.id);p.beloved.offerNode=state.round;}
 for(const entry of DAY_ITEMS)if((counts.day||0)>=entry.count&&!p.day.unlocked.includes(entry.id))p.day.unlocked.push(entry.id);
 const grailTier=tier(counts,'grail');for(let rank=1;rank<=grailTier;rank++)if(!p.grail.unlockedTiers.includes(rank)){
  p.grail.unlockedTiers.push(rank);p.grail.offers.push({tier:rank,options:sample(p,GRAIL_TRIALS.filter(t=>t.tier===rank),2).map(t=>t.id)});
 }
 for(const [flag,ids]of [['feiguang-moon',['1212','1204']],['feiguang-sword',['1209','1204']]])if((state.strategies||[]).includes(flag))p.mentor.characterIds=unique([...p.mentor.characterIds,...ids]);
}
export function refreshProgression(state){const p=migrateProgression(state);syncChoices(state,p);return p;}
export function onRosterChanged(state){
 const p=refreshProgression(state),out=[];
 for(const [flag,ids]of [['feiguang-moon',['1212','1204']],['feiguang-sword',['1209','1204']]])if((state.strategies||[]).includes(flag)&&!p.mentor.granted.includes(flag)){p.mentor.granted.push(flag);out.push(...ids.map(id=>({...hero(id),...(id==='1204'&&flag==='feiguang-moon'?{cost:1}:{})})));}
 const bs=deployed(state).find(u=>String(u.characterId)==='1307'&&u.star>=3);
 if(bs&&!p.seer.threeStarGranted){p.seer.threeStarGranted=true;p.seer.cards=REVELATION_CARDS.map(c=>c.id);out.push(chest('privileged',3));}
 const sw=deployed(state).find(u=>String(u.characterId)==='1506'&&u.star>=3&&getEffectiveCharacterCost(state,'1506',u)===5);if(sw&&!p.gamer.admin){p.gamer.admin=true;p.gamer.accessoryOwners.admin=sw.uid;}
 const newUnits=(state.units||[]).filter(u=>!p.knownUnits.includes(u.uid));
 const copier=deployedGamerOwner(state,p,'data-copier');if(p.gamer.accessories.includes('data-copier')&&copier)for(const u of newUnits)if(String(u.characterId)==='1506'&&random(p)<.3)out.push({...hero('1506'),cost:getEffectiveCharacterCost(state,'1506',copier),source:'data-copier'});
 p.knownUnits=(state.units||[]).map(u=>u.uid);
 out.push(...evaluateTrials(state,p,'roster'));return out;
}
export function onNodeEntry(state){const p=refreshProgression(state);if(p.nodeEntries.includes(state.round))return[];p.nodeEntries.push(state.round);
 p.wanderer.node=state.round;p.wanderer.blessing=pick(p,BLESSINGS).id;
 if(p.mentor.characterIds.includes('1209')&&['1209','1204'].every(id=>deployed(state).some(u=>String(u.characterId)===id)))p.mentor.swordNodes++;
 return [...onRosterChanged(state),...evaluateTrials(state,p,'node')];}
function evaluateTrials(state,p,event,combat){
 const counts=getProgressionTraitCounts(state),out=[],hasGrail=tier(counts,'grail')>0;if(!hasGrail)return out;
 for(const task of p.grail.active){const def=GRAIL_TRIALS.find(t=>t.id===task.id);if(!def||task.done)continue;
  if(event==='roster'&&def.event==='grail-stars')task.progress=members(state,'grail').reduce((n,u)=>n+u.star,0);
  if((event==='node'||event==='roster')&&def.event==='shop-level')task.progress=state.level;
  if(event==='battle'){
   if(def.event==='battle')task.progress++;
   if(def.event==='perfect'&&combat.metrics?.perfectVictory===true)task.progress++;
   if(def.event==='nonperfect-streak')task.progress=combat.metrics?.perfectVictory===true?0:task.progress+1;
   if(def.event==='energy-count')task.progress=counts.energy||0;
   if(def.event==='sp-count')task.progress=counts.sp||0;
  }
  if(task.progress>=def.target){task.done=true;p.grail.completed.push(task.id);out.push(...copy(def.rewards).map(r=>({...r,source:'grail',trial:def.id})));}
 }
 return out;
}
export function onManagementAction(state,action,details={}){
 const p=refreshProgression(state);const out=[];if(details.ok===false)return out;
 const refresh=action.type==='refresh',xp=action.type==='exp'?finite(details.xp,4):0,spent=Math.max(0,finite(details.goldSpent));
 if(refresh)p.management.refreshes++;p.management.purchasedXp+=xp;p.management.goldSpent+=spent;
 if(tier(getProgressionTraitCounts(state),'grail'))for(const task of p.grail.active){if(task.done)continue;const def=GRAIL_TRIALS.find(t=>t.id===task.id);if(!def)continue;
  if(def.event==='refresh'&&refresh)task.progress++;
  if(def.event==='rin-refresh'&&refresh&&deployed(state).some(u=>String(u.characterId)==='1508'))task.progress++;
  if(def.event==='purchase-xp')task.progress+=xp;
  if(def.event==='gold-spent')task.progress+=spent;
 }
 out.push(...onRosterChanged(state));return out;
}
export function onBattleResolved(state,combat){
 const p=refreshProgression(state);if(p.resolvedBattles.includes(state.round))return[];p.resolvedBattles.push(state.round);const counts=getProgressionTraitCounts(state),out=[];
 const scholar=tier(counts,'scholar');if(scholar){const people=new Map();for(const u of members(state,'scholar'))people.set(String(u.characterId),Math.max(u.star,people.get(String(u.characterId))||0));const dna=[...people.values()].reduce((n,star)=>n+([2,4,8,20][Math.min(3,star-1)]||2),0)*[1,1.5,2][scholar-1];out.push(...gainGrowth(p,'scholar','dna',dna,SCHOLAR_THRESHOLDS,rewardsForScholar));}
 const wolf=tier(counts,'wolfpack');if(wolf){const equipmentWeight=deployed(state).reduce((n,u)=>n+(u.items||[]).reduce((sum,id)=>sum+((gear.get(id)?.tier||2)>=2?2:1),0),0);gainGrowth(p,'wolfpack','xp',(4+equipmentWeight)*[1,2,3,6][wolf-1],WOLF_THRESHOLDS,()=>[]);}
 const night=tier(counts,'night');if(night)out.push(...gainGrowth(p,'night','essence',[2,5,9,30][night-1]*(combat.metrics?.perfectVictory===true?2:1),NIGHT_THRESHOLDS,rewardsForNight));
 if(members(state,'seer').length){p.seer.battles++;if(p.seer.battles%2===0)p.seer.charges++;}
 if(members(state,'beloved').length)p.beloved.battles++;
 if(p.beloved.nextPerfect){if(combat.metrics?.perfectVictory===true)out.push(gold(p.beloved.nextPerfect));p.beloved.nextPerfect=0;}
 const copier=deployedGamerOwner(state,p,'data-copier');if(copier&&p.gamer.accessories.includes('data-copier')){p.gamer.copyBattles++;if(p.gamer.copyBattles%3===0)out.push({...hero('1506'),cost:getEffectiveCharacterCost(state,'1506',copier),source:'data-copier'});}
 out.push(...evaluateTrials(state,p,'battle',combat));syncChoices(state,p);return out;
}
export function getProgressionBattleModifiers(state){
 const p=read(state),team={},units={},summons=[],ruleFlags={},counts=getProgressionTraitCounts(state),people=deployed(state);
 const statsFor=u=>units[u.uid]||=( {} );
 statAdd(team,p.beloved.buffs);
 if(tier(counts,'scholar')){ruleFlags.scholar={level:p.scholar.level,frontHealRatio:.2+.05*(p.scholar.level-1),frontDamageReduction:.15+.03*(p.scholar.level-1)};for(const u of people.filter(u=>u.zone==='front'))statAdd(statsFor(u),{damageReduction:ruleFlags.scholar.frontDamageReduction});}
 const wolf=tier(counts,'wolfpack');if(wolf){const form=WOLF_FORMS[Math.min(6,p.wolfpack.level-1)];statAdd(team,{crit:form.crit});const extra=[.15,.3,.5,.9][wolf-1]*.5*(p.wolfpack.level-1);for(const u of members(state,'wolfpack'))statAdd(statsFor(u),{frontPower:extra,backPower:extra});ruleFlags.wolfpack={level:p.wolfpack.level,...form};summons.push({id:'wolfpack',kind:'wolfpack',...form,level:p.wolfpack.level,hpScale:0,params:{...form}});}
 const day=tier(counts,'day');if(day||p.day.unlocked.length){ruleFlags.day={tier:day,enhanced:day>=4,assignments:{}};for(const entry of DAY_ITEMS){const uid=p.day.assignments[entry.id];const owner=people.find(u=>u.uid===uid&&getProgressionUnitTraits(state,u).includes('day'));if(owner)ruleFlags.day.assignments[entry.id]=uid;}}
 if(p.seer.cards.includes('agility'))statAdd(team,{speedPct:.16});
 for(const u of people.filter(u=>String(u.characterId)==='1307'))if(p.seer.cards.includes('blank'))statAdd(statsFor(u),{backPower:.25});
 if(p.seer.cards.length)ruleFlags.seer={assertionHpRatio:p.seer.cards.includes('assertion')?.1:0,arcanaInitialStacks:p.seer.cards.includes('original-arcana')?7:0,arcanaExtraCap:p.seer.cards.includes('deep-arcana')?49:0,arcanaMultiplier:p.seer.cards.includes('deep-arcana')?1.2:1};
 const traveler=tier(counts,'wanderer');if(traveler&&people.some(u=>String(u.characterId)==='1501')){const blessing=BLESSINGS.find(b=>b.id===p.wanderer.blessing)||BLESSINGS[0];const multiplier=[1,1.2,1.45,1.75,2.1,2.5,3][traveler-1];statAdd(team,blessing.stats,multiplier);for(const u of members(state,'wanderer'))statAdd(statsFor(u),blessing.stats,multiplier);ruleFlags.wanderer={blessing:blessing.id};}
 const admin=p.gamer.admin?deployedGamerOwner(state,p,'admin'):null,sw=admin||people.find(u=>String(u.characterId)==='1506');
 if(sw)ruleFlags.gamer={uid:sw.uid,cost:getEffectiveCharacterCost(state,'1506',sw),accessories:p.gamer.accessories.filter(id=>deployedGamerOwner(state,p,id)),accessoryOwners:{...p.gamer.accessoryOwners},admin:!!admin};
 for(const id of p.gamer.accessories){const owner=deployedGamerOwner(state,p,id),component=HACKER_COMPONENTS.find(c=>c.id===id);if(!owner||!component)continue;
  statAdd(statsFor(owner),{frontPower:component.frontPower});
  if(id==='data-copier')statAdd(statsFor(owner),{damageAmp:owner.star>=3?.5:owner.star>=2?.2:0});
  if(id==='clone-glasses'){const other=people.find(u=>String(u.characterId)==='1006');if(other){statAdd(statsFor(owner),{speedPct:.2,damageAmp:.2});statAdd(statsFor(other),{speedPct:.2,damageAmp:.2});}}
  if(id==='firewall')ruleFlags.enemyVulnerability=.35;
 }
 if(admin)statAdd(statsFor(admin),{damageReduction:.99,damageAmp:.99,frontPower:.99,critDamage:.99,crit:.99,speedPct:.99});
 const nav=people.find(u=>String(u.characterId)==='1510'),target=getProgressionNavigatorPartner(state,nav);if(nav&&target)ruleFlags.navigator={uid:nav.uid,targetUid:target.uid,bonusTraits:baseUnitTraits(state,target,p).filter(id=>traits.get(id)?.type==='流派羁绊'),copiedItem:target.items?.[0]||null};
 const festivalTier=tier(counts,'festival'),star=people.find(u=>u.uid===p.festival.targetUid&&getProgressionUnitTraits(state,u).includes('festival'));
 if(festivalTier&&star){const rank=festivalTier;ruleFlags.festival={uid:star.uid,characterId:String(star.characterId),tier:rank,simulation:'原版效果类别；每档数值暂采用公开标注的短局适配'};
  // The source describes effect types but omits tier coefficients. Keep this
  // explicit simulator table separate from claimed reference numbers.
  if(String(star.characterId)==='1321')statAdd(team,{breakEffect:.15*rank,speedPct:.04*rank});
  else if(String(star.characterId)==='1306'){statAdd(team,{basicSkillDamage:.12*rank});ruleFlags.festival.initialSP=rank;}
  else if(String(star.characterId)==='1313'){const front=people.find(u=>u.zone==='front'),back=people.find(u=>u.zone==='back');if(front)statAdd(statsFor(front),{frontPower:.2*rank});if(back)statAdd(statsFor(back),{backPower:.2*rank});}
  else if(String(star.characterId)==='1309')statAdd(team,{crit:.08*rank});
  else if(String(star.characterId)==='1307')statAdd(team,{damageAmp:.04*rank*people.filter(u=>getEffectiveCharacterCost(state,u.characterId,u)===5).length});
  else if(String(star.characterId)==='1301')statAdd(team,{breakEffect:.15*rank,healAmp:.08*rank});
 }
 const bronya=people.find(u=>String(u.characterId)==='1101');if(bronya)ruleFlags.guardian={uid:bronya.uid,stance:getProgressionUnitTraits(state,bronya).includes('blood')?'blood':'belobog',chargeThreshold:bronya.star>=3?1:8,initialCharge:bronya.star>=3?0:4,damageMultiplier:bronya.star>=3?10:bronya.star===2?1.5:1};
 const saviors=members(state,'savior');if(saviors.length)ruleFlags.savior={uids:saviors.map(u=>u.uid)};
 const mages=members(state,'magician');if(mages.length)ruleFlags.magician={uids:mages.map(u=>u.uid),chargeThreshold:6,projectionTargets:3};
 const mentors=members(state,'mentor');if(mentors.length>=2)ruleFlags.mentor={uids:mentors.map(u=>u.uid),tier:Math.min(3,mentors.length),shareRatio:1,advance:.3,skillStacks:2,ultimateStacks:3,damagePerStack:.1,stackCap:99,swordEchoRatio:.15+.04*p.mentor.swordNodes};
 return {team,units,summons,ruleFlags};
}
export const buildProgressionCombatModifiers=getProgressionBattleModifiers;
export function getProgressionShopModifiers(state){const p=read(state);return {fiveCostOddsBonus:p.seer.cards.includes('fortune')?.03:0,gamerCost:p.gamer.cost};}
const fail=message=>({ok:false,message,rewards:[]});
const ok=(message,rewards=[])=>({ok:true,message,rewards});
export function applyProgressionAction(state,action){
 if(!action||typeof action.kind!=='string')return fail('请选择有效的羁绊操作。');
 if(state.phase&&state.phase!=='prep')return fail('请先回到备战阶段。');
 // All validation precedes mutation. Caller may still run this on an atomic draft.
 const p=read(state),counts=getProgressionTraitCounts(state);let update,rewards=[],cost=0,message='';
 if(action.kind==='seer-select'){
  const card=REVELATION_CARDS.find(c=>c.id===action.id);if(!card||!members(state,'seer').length||p.seer.charges<1||p.seer.cards.includes(card.id))return fail('当前无法选择这张启示卡。');
  cost=card.cost;update=real=>{real.seer.charges--;real.seer.cards.push(card.id);};message=`获得启示卡：${card.name}`;
 }else if(action.kind==='poem-buy'){
  const poem=POEMS.find(c=>c.id===action.id);if(!poem||!members(state,'beloved').length||p.beloved.battles<1||p.beloved.boughtNode===state.round||!p.beloved.offers.includes(poem.id)||!availablePoems(state).includes(poem))return fail('当前无法购买这首诗篇。');
  cost=poem.cost;rewards=copy(poem.rewards||[]);if(poem.golden)rewards=CLASSIC_CHARACTERS.filter(c=>c.traits.some(t=>['day','night'].includes(t))).map(c=>hero(c.id));
  update=real=>{real.beloved.boughtNode=state.round;real.beloved.poems.push(poem.id);statAdd(real.beloved.buffs,poem.buff);if(poem.nextPerfect)real.beloved.nextPerfect=poem.nextPerfect;};message=`购入${poem.name}`;
 }else if(action.kind==='navigator-select'){
  const target=deployed(state).find(u=>u.uid===action.uid);if(!members(state,'navigator').length||!target||String(target.characterId)==='1510'||!getProgressionUnitTraits(state,target).includes('express'))return fail('请选择上场的列车同行伙伴。');
  update=real=>{real.navigator.targetUid=target.uid;};message=`领航伙伴：${char(target).name}`;
 }else if(action.kind==='festival-select'){
  const target=members(state,'festival').find(u=>u.uid===action.uid);if(!tier(counts,'festival')||!target)return fail('请选择上场的盛会之星角色。');
  update=real=>{real.festival.targetUid=target.uid;};message=`巨星：${char(target).name}`;
 }else if(action.kind==='day-equip'){
  const target=members(state,'day').find(u=>u.uid===action.uid),entry=DAY_ITEMS.find(x=>x.id===action.id);if(!target||!entry||!p.day.unlocked.includes(entry.id))return fail('仅能交给上场的昼之半神角色。');
  const assigned=Object.entries(p.day.assignments).filter(([id,uid])=>id!==entry.id&&uid===target.uid).length;
  if((target.items||[]).some(id=>gear.get(id.replace(/^privileged:/,''))?.exclusiveSlots))return fail('随便骰子独占装备栏，无法同时穿戴白昼装备。');
  if((target.items||[]).length+assigned>=3)return fail('角色的三个装备栏已满，请先移走装备。');
  update=real=>{real.day.assignments[entry.id]=target.uid;};message=`${char(target).name}装备${entry.name}`;
 }else if(action.kind==='day-unequip'){
  const entry=DAY_ITEMS.find(x=>x.id===action.id);if(!entry||!p.day.assignments[entry.id])return fail('这件白昼装备尚未分配。');
  update=real=>{delete real.day.assignments[entry.id];};message=`已卸下${entry.name}，可重新分配`;
 }else if(action.kind==='gamer-hack'){
  const unit=(state.units||[]).find(u=>u.uid===action.uid&&String(u.characterId)==='1506');const currentCost=unit?getEffectiveCharacterCost(state,'1506',unit):0;
  if(!unit||unit.star<2||p.gamer.claimedCosts.includes(currentCost))return fail('该费用的首次二星骇入尚不可用。');
  if(action.choice==='promote'){
   if(currentCost>=5)return fail('已经达到五费。');
   update=real=>{real.gamer.claimedCosts.push(currentCost);real.gamer.cost=currentCost+1;unit.star=1;unit.recruitCost=currentCost+1;};message=`银狼LV.999已改为${currentCost+1}费一星`;
  }else{
   const component=HACKER_COMPONENTS.find(c=>c.id===action.id);if(!component||p.gamer.accessories.includes(component.id))return fail('请选择尚未持有的骇客改件。');
   update=real=>{real.gamer.claimedCosts.push(currentCost);real.gamer.accessories.push(component.id);real.gamer.accessoryOwners[component.id]=unit.uid;};if(component.id==='clone-glasses')rewards=[hero('1006')];message=`安装${component.name}，不占装备栏`;
  }
 }else if(action.kind==='grail-select'){
  const offer=p.grail.offers.find(o=>o.tier===action.tier&&o.options.includes(action.id));if(!offer||!tier(counts,'grail'))return fail('当前没有这项圣杯祈愿。');
  update=real=>{real.grail.offers=real.grail.offers.filter(o=>o.tier!==offer.tier);real.grail.active.push({id:action.id,tier:offer.tier,progress:0,done:false});};message='圣杯祈愿已接受';
 }else return fail('未知羁绊操作。');
 if(finite(state.gold)<cost)return fail(`需要${cost}金币。`);
 const actual=migrateProgression(state);state.gold=finite(state.gold)-cost;state.goldSpentThisNode=finite(state.goldSpentThisNode)+cost;actual.management.goldSpent+=cost;update(actual);
 rewards.push(...evaluateTrials(state,actual,'roster'));return ok(message,rewards);
}
export function getProgressionPanels(state){
 const p=read(state),counts=getProgressionTraitCounts(state),panels=[];
 const growth=(id,title,value,level,thresholds,text)=>{if(tier(counts,id)||value>0)panels.push({id,title,description:text,progress:{value,max:thresholds[level-1]||thresholds.at(-1),label:`Lv.${level}`},choices:[]});};
 growth('scholar','银河学者 · 猫猫糕',p.scholar.dna,p.scholar.level,SCHOLAR_THRESHOLDS,'上场学者星级提供2/4/8/20 DNA；升阶获得奖励，猫糕为前台回血并减伤。');
 growth('wolfpack','狼狩 · '+WOLF_FORMS[Math.min(6,p.wolfpack.level-1)].name,p.wolfpack.xp,p.wolfpack.level,WOLF_THRESHOLDS,'每战4经验，携带装备额外提供经验；升阶强化召唤物和狼狩成员。');
 growth('night','夜之半神 · 月光精华',p.night.essence,p.night.level,NIGHT_THRESHOLDS,'每战按羁绊档位获得精华，完美通关翻倍；跨阶段逐级领取晶矿奖励。');
 if(tier(counts,'day')||p.day.unlocked.length)panels.push({id:'day',title:'昼之半神 · 白昼装备',description:'专属装备随人数解锁，占用三个装备栏之一，可分配、改派或卸下；九人档强化全部白昼装备并补齐空栏。',choices:p.day.unlocked.flatMap(id=>[...members(state,'day').map(u=>({id:id+u.uid,label:`${DAY_ITEMS.find(x=>x.id===id).name} → ${char(u).name}`,selected:p.day.assignments[id]===u.uid,action:{kind:'day-equip',id,uid:u.uid}})),...(p.day.assignments[id]?[{id:id+'-unequip',label:`卸下${DAY_ITEMS.find(x=>x.id===id).name}`,action:{kind:'day-unequip',id}}]:[])])});
 if(members(state,'seer').length||p.seer.cards.length)panels.push({id:'seer',title:'命运卜者 · 占卜屋',description:`已参与${p.seer.battles}战，可选择${p.seer.charges}次。`,choices:REVELATION_CARDS.filter(c=>!p.seer.cards.includes(c.id)).map(c=>({id:c.id,label:c.name,description:c.description,cost:c.cost,disabled:p.seer.charges<1||finite(state.gold)<c.cost,action:{kind:'seer-select',id:c.id}}))});
 if(p.beloved.battles&&members(state,'beloved').length)panels.push({id:'beloved',title:'挚爱之人 · 昔涟诗篇',description:'每节点最多购买一首。短局适配：诗篇独立三选专柜，价格与单首效果按原表。',choices:p.beloved.offers.map(id=>{const poem=POEMS.find(x=>x.id===id);return{id,label:poem.name,description:poem.description,cost:poem.cost,disabled:p.beloved.boughtNode===state.round||finite(state.gold)<poem.cost,action:{kind:'poem-buy',id}};})});
 if(members(state,'navigator').length)panels.push({id:'navigator',title:'领航员 · 选择伙伴',description:'获得伙伴流派羁绊，并复制首件装备为本场改件。',choices:members(state,'express').filter(u=>String(u.characterId)!=='1510').map(u=>({id:u.uid,label:char(u).name,selected:p.navigator.targetUid===u.uid,action:{kind:'navigator-select',uid:u.uid}}))});
 if(tier(counts,'festival'))panels.push({id:'festival',title:'盛会之星 · 选择巨星',description:'按原版角色提供不同加成；逐档数值暂为短局适配，详见规则说明。',choices:members(state,'festival').map(u=>({id:u.uid,label:char(u).name,selected:p.festival.targetUid===u.uid,action:{kind:'festival-select',uid:u.uid}}))});
 for(const unit of (state.units||[]).filter(u=>String(u.characterId)==='1506'&&u.star>=2&&!p.gamer.claimedCosts.includes(getEffectiveCharacterCost(state,'1506',u)))){const cost=getEffectiveCharacterCost(state,'1506',unit);panels.push({id:'gamer',title:`头号玩家 · ${cost}费骇入`,description:'每个费用首次二星时选择一次：提升费用并重置一星，或获得不占装备栏的改件。',choices:[...(cost<5?[{id:'promote',label:`升为${cost+1}费一星`,action:{kind:'gamer-hack',uid:unit.uid,choice:'promote'}}]:[]),...HACKER_COMPONENTS.filter(c=>!p.gamer.accessories.includes(c.id)).map(c=>({id:c.id,label:c.name,description:c.description,action:{kind:'gamer-hack',uid:unit.uid,choice:'component',id:c.id}}))]});}
 if(p.grail.offers.length||p.grail.active.length)panels.push({id:'grail',title:'命运圣杯 · 祈愿试炼',description:'每个羁绊档位提供两项祈愿，任选其一；圣杯未激活时暂停进度。',choices:p.grail.offers.flatMap(o=>o.options.map(id=>{const def=GRAIL_TRIALS.find(t=>t.id===id);return{id,label:`第${o.tier}阶 · ${def.name}`,description:def.description,action:{kind:'grail-select',tier:o.tier,id}};})),tasks:p.grail.active.map(t=>{const def=GRAIL_TRIALS.find(x=>x.id===t.id);return{id:t.id,label:def?.name||t.id,value:t.progress,target:def?.target||0,done:t.done,description:def?.description||''};})});
 if(peopleHas(state,'1501'))panels.push({id:'wanderer',title:'星间旅人 · 节点祝福',description:`火花本节点：${(BLESSINGS.find(b=>b.id===p.wanderer.blessing)||BLESSINGS[0]).name}。每个新节点重选，旅人成员收益加倍。`,choices:[]});
 return panels;
}
const peopleHas=(state,id)=>deployed(state).some(u=>String(u.characterId)===id);

// Strict current-save validation; migration is explicitly a separate operation.
export function validateProgression(state){
 const nodeLimit=getRunLength(state);
 const p=state?.progression;if(!p||typeof p!=='object'||Array.isArray(p)||p.version!==1)return false;
 const object=x=>x&&typeof x==='object'&&!Array.isArray(x);
 const integer=(x,min=0,max=1000000000)=>Number.isInteger(x)&&x>=min&&x<=max;
 const list=(x,valid,distinct=true)=>Array.isArray(x)&&x.length<=1000&&x.every(valid)&&(!distinct||new Set(x).size===x.length);
 const id=x=>typeof x==='string'&&x.length>0&&x.length<100;
 const nullableId=x=>x===null||id(x);
 if(!integer(p.rng,0,4294967295)||!list(p.nodeEntries,n=>integer(n,1,nodeLimit))||!list(p.resolvedBattles,n=>integer(n,1,nodeLimit))||!list(p.knownUnits,id))return false;
 for(const [key,prop,thresholds]of [['scholar','dna',SCHOLAR_THRESHOLDS],['wolfpack','xp',WOLF_THRESHOLDS],['night','essence',NIGHT_THRESHOLDS]])if(!object(p[key])||!Number.isFinite(p[key][prop])||p[key][prop]<0||p[key][prop]>1e9||p[key].level!==levelAt(p[key][prop],thresholds))return false;
 if(!object(p.day)||!list(p.day.unlocked,x=>DAY_ITEMS.some(e=>e.id===x))||!object(p.day.assignments)||Object.entries(p.day.assignments).some(([key,value])=>!p.day.unlocked.includes(key)||!id(value)))return false;
 if(!object(p.seer)||!integer(p.seer.battles,0,nodeLimit)||!integer(p.seer.charges,0,nodeLimit)||!list(p.seer.cards,id=>REVELATION_CARDS.some(c=>c.id===id))||typeof p.seer.threeStarGranted!=='boolean')return false;
 if(!object(p.gamer)||!integer(p.gamer.cost,3,5)||!list(p.gamer.claimedCosts,c=>integer(c,3,5))||!list(p.gamer.accessories,id=>HACKER_COMPONENTS.some(c=>c.id===id))||!integer(p.gamer.copyBattles,0,nodeLimit)||typeof p.gamer.admin!=='boolean')return false;
 // Missing ownership belongs to the previous v3 save shape and is explicitly
 // assigned during migration; malformed ownership is never silently accepted.
 if(p.gamer.accessoryOwners!==undefined&&(!object(p.gamer.accessoryOwners)||Object.entries(p.gamer.accessoryOwners).some(([key,value])=>!(p.gamer.accessories.includes(key)||(key==='admin'&&p.gamer.admin))||!id(value))))return false;
 if(!object(p.beloved)||!integer(p.beloved.battles,0,nodeLimit)||!list(p.beloved.poems,id=>POEMS.some(c=>c.id===id),false)||!list(p.beloved.offers,id=>POEMS.some(c=>c.id===id))||p.beloved.offers.length>3||!integer(p.beloved.offerNode,0,nodeLimit)||!integer(p.beloved.boughtNode,0,nodeLimit)||!object(p.beloved.buffs)||!integer(p.beloved.nextPerfect,0,8))return false;
 if(Object.entries(p.beloved.buffs).some(([key,value])=>!['damageAmp','speedPct','damageReduction'].includes(key)||!Number.isFinite(value)||value<0||value>12))return false;
 if(!object(p.navigator)||!nullableId(p.navigator.targetUid)||!object(p.festival)||!nullableId(p.festival.targetUid))return false;
 if(!object(p.wanderer)||!integer(p.wanderer.node,0,nodeLimit)||(p.wanderer.blessing!==null&&!BLESSINGS.some(b=>b.id===p.wanderer.blessing)))return false;
 if(!object(p.mentor)||!list(p.mentor.characterIds,id=>['1212','1204','1209'].includes(id))||!integer(p.mentor.swordNodes,0,nodeLimit)||!list(p.mentor.granted,id=>['feiguang-moon','feiguang-sword'].includes(id)))return false;
 if(!object(p.grail)||!list(p.grail.unlockedTiers,n=>integer(n,1,4))||!list(p.grail.completed,id=>GRAIL_TRIALS.some(t=>t.id===id)))return false;
 if(!Array.isArray(p.grail.offers)||p.grail.offers.length>4||new Set(p.grail.offers.map(o=>o?.tier)).size!==p.grail.offers.length)return false;
 if(p.grail.offers.some(o=>!object(o)||!p.grail.unlockedTiers.includes(o.tier)||!list(o.options,id=>GRAIL_TRIALS.some(t=>t.id===id&&t.tier===o.tier))||o.options.length!==2))return false;
 if(!Array.isArray(p.grail.active)||p.grail.active.length>4||new Set(p.grail.active.map(t=>t?.tier)).size!==p.grail.active.length)return false;
 if(p.grail.active.some(t=>!object(t)||!GRAIL_TRIALS.some(d=>d.id===t.id&&d.tier===t.tier)||!p.grail.unlockedTiers.includes(t.tier)||!integer(t.progress)||typeof t.done!=='boolean'||t.done!==p.grail.completed.includes(t.id)||p.grail.offers.some(o=>o.tier===t.tier)))return false;
 if(!object(p.management)||!['refreshes','purchasedXp','goldSpent'].every(k=>integer(p.management[k])))return false;
 return true;
}
