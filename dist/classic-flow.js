// Zero-Sum Game route structure. Sources and explicitly adapted values are in
// docs/classic-flow-research.md and docs/classic-opening-research.md. No weekly/account rewards are simulated here.
import {CHARACTERS,resolveEquipment} from './data.js?v=6.3.0';
export const RUN_MODES=Object.freeze([
  {id:'standard',name:'标准博弈',description:'三个位面，23个节点。奖励、投资、补给、遭遇与首领依次推进；保留利息，经营完整阵容。',nodeCount:23,interest:true,nodeGold:0,nodeXp:2},
  {id:'overclock',name:'超频博弈',description:'更短的三个位面，共16个节点。无利息，每个节点的基础金币和经验更多。',nodeCount:16,interest:false,nodeGold:12,nodeXp:6},
]);
export const DIFFICULTIES=Object.freeze([
  {id:0,name:'入门',description:'熟悉经典运营与羁绊。',hpMultiplier:1,attackMultiplier:1},
  {id:1,name:'进阶',description:'敌人生命提高35%，攻击提高15%。',hpMultiplier:1.35,attackMultiplier:1.15},
  {id:2,name:'挑战',description:'敌人生命提高80%，攻击提高30%。',hpMultiplier:1.8,attackMultiplier:1.3},
]);
export const NODE_NAMES=Object.freeze({reward:'奖励',strategy:'投资策略',battle:'战斗',supply:'补给',encounter:'遭遇',boss:'首领'});
const standard=[['reward','reward','strategy','battle','supply','battle','encounter','reward','boss'],['battle','strategy','supply','battle','encounter','reward','boss'],['battle','strategy','supply','battle','encounter','reward','boss']];
// v6.0–v6.2 saves: a compressed four-node plane that was a web adaptation.
const overclockCompressed=Array.from({length:3},()=>['strategy','supply','encounter','boss']);
// Rules revision 3: the old client's Overclock route. Plane 1 opens with a reward node; every plane is
// strategy battle, supply, encounter, reward, boss.
const overclock=[['reward','strategy','supply','encounter','reward','boss'],['strategy','supply','encounter','reward','boss'],['strategy','supply','encounter','reward','boss']];
const modes=new Map(RUN_MODES.map(mode=>[mode.id,mode]));
export const isClassicRun=state=>!!state.flow&&modes.has(state.flow.mode);
export const getRunMode=state=>modes.get(state.flow?.mode)||{id:'legacy',name:'旧版远征',description:'保留已有12关存档。新开局可选择标准或超频博弈。',nodeCount:12,interest:true,nodeGold:0,nodeXp:2};
export function getRunNodes(state){
  if(!isClassicRun(state))return Array.from({length:12},(_,i)=>({round:i+1,plane:Math.ceil((i+1)/4),index:i%4+1,label:`${Math.ceil((i+1)/4)}-${i%4+1}`,type:i%4===3?'boss':[1,5,9].includes(i)?'strategy':'battle',boss:i%4===3,combat:true,combatRound:i+1,name:i%4===3?'首领':'战斗'}));
  let round=0;
  return (state.flow.mode==='overclock'?(state.flow.rules||1)>=3?overclock:overclockCompressed:standard).flatMap((plane,p)=>plane.map((type,index)=>{
    if(getRunMode(state).id==='standard'&&state.environment?.id==='war-frontier'&&p===2&&type==='battle')type='encounter';
    const combatRound=type==='boss'?(p+1)*4:p*4+Math.min(3,Math.max(1,Math.ceil((index+1)/3)));
    return {round:++round,plane:p+1,index:index+1,label:`${p+1}-${index+1}`,type,name:NODE_NAMES[type],boss:type==='boss',combat:type!=='supply',combatRound};
  }));
}
export const getCurrentNode=state=>getRunNodes(state)[state.round-1];
export const getRunLength=state=>getRunNodes(state).length;
// v6.0/v6.1 saves: level 4 opening and a tuned curve. Kept only so those runs can finish unchanged.
export const CLASSIC_LEVEL_XP=Object.freeze({4:10,5:20,6:32,7:48,8:64,9:84});
// Rules revision 2 (v6.2), see docs/classic-opening-research.md. A run opens at level 3 with nothing
// deployed. Thresholds are the old season's base level table (3.7–4.6 client data, and the 0/72 at
// level 9 in the in-game tutorial picture). High ranks raise them: two A7 recordings showed
// x/20, x/40, x/52 and x/72 at levels 5–8, and a player screenshot shows 84 at level 9.
// Rules revision 3 (v6.3) adds the old Overclock route and its gold and experience, the squad HP
// loss table, the Disassembly Wrench and fixed board slots. Runs started on revision 2 keep the
// v6.2 behaviour for those four things.
export const FLOW_RULES=3;
export const START_LEVEL=3;
export const ZERO_SUM_LEVEL_XP=Object.freeze({3:4,4:6,5:16,6:36,7:48,8:60,9:72});
export const BOSS_XP=10;
export const usesVerifiedRules=state=>(state.flow?.rules||1)>=2;
export const usesRevision3=state=>(state.flow?.rules||1)>=3;
const isOverclock3=state=>state.flow?.mode==='overclock'&&usesRevision3(state);
// "Basic Rewards" on the settlement screen: 3 at 1-1, 4 at 1-2, then 5 (seen at 1-4, 1-6 and 1-9).
// Overclock (old client route table): 5 at the opening reward node, 10 at every other fought node,
// 15 at the first two bosses and nothing at the last one.
export const getNodeBaseIncome=(node,state)=>isOverclock3(state)?node?.boss?(node.plane<3?15:0):node?.round===1?5:10:node?.plane===1&&node.index<=2?2+node.index:5;
// Gold handed out on entering a node. Only the pre-revision-3 Overclock adaptation used this.
export const getNodeEntryGold=state=>isOverclock3(state)?0:getRunMode(state).nodeGold;
// The streak row paid 1 at ×0 and ×1 and 2 at ×2 and ×3 in the recordings; the old client data gives
// 1 win +1, 2–4 wins +2, 5 or more +3. A defeat pays nothing and there is no losing-streak bonus.
export const getStreakGold=streak=>streak>=5?3:streak>=2?2:1;
// Old-season sale values: a one-star sells for its cost; merged units of 2-cost and above lose one coin
// (2★ 3/5/8/11/14 and 3★ 9/17/26/35/44 for costs 1–5).
export const getClassicSellPrice=(cost,star)=>cost*3**(star-1)-(cost>1&&star>1?1:0);
// Experience shown on the settlement screen: +2 per fought node, +10 for a boss, nothing for a supply stop.
// Overclock pays 6 / 8 / 12 per fought node by plane and 10 / 12 / 16 for the bosses (old client constants).
export const getNodeXp=(state,node)=>isOverclock3(state)?node?.type==='supply'?0:(node?.boss?[10,12,16]:[6,8,12])[(node?.plane||1)-1]:getRunMode(state).id==='overclock'?getRunMode(state).nodeXp:node?.type==='supply'?0:node?.boss?BOSS_XP:getRunMode(state).nodeXp;
// Squad HP lost when a node is not cleared, from the old client's penalty table for the base ranks:
// a fixed part per plane (5 / 10 / 15, bosses 10 / 15 / 20) plus a part that scales with the
// unfinished progress (coefficient 10 / 15 / 20), and a surcharge (4 / 6 / 8) when a boss ends
// below its 33% minimum progress. Reward nodes never cost HP. How the two parts combine is read
// from the field names; a player guide confirms the fixed 10 on plane 2. Rounding is an assumption.
export const BOSS_MIN_PROGRESS=33;
export function getDefeatPenaltyParts(node,progress){
  if(!node||node.type==='reward'||node.type==='supply')return {base:0,progress:0,threshold:0,total:0};
  const p=Math.max(0,Math.min(2,(node.plane||1)-1)),missing=1-Math.max(0,Math.min(100,progress))/100;
  const parts={base:(node.boss?[10,15,20]:[5,10,15])[p],progress:Math.round([10,15,20][p]*missing),threshold:node.boss&&progress<BOSS_MIN_PROGRESS?[4,6,8][p]:0};
  return {...parts,total:parts.base+parts.progress+parts.threshold};
}
export const getDefeatPenalty=(node,progress)=>getDefeatPenaltyParts(node,progress).total;
export function initFlow(mode='standard',difficulty=0){
  return {mode:modes.has(mode)?mode:'standard',rules:FLOW_RULES,difficulty:DIFFICULTIES.some(d=>d.id===difficulty)?difficulty:0,
    nodeComplete:false,supplyOffers:[],encounterOffers:[],selectedEncounter:null,supplyRerolls:1,encounterRerolls:1,
    strategyRerolls:[1,1,1],strategySelections:0,extraSupplyDone:[],extraStrategyDone:[],pendingNodeKind:null};
}
export function validateFlow(state){
  const f=state.flow;if(f===undefined||f===null)return !['environment','supply','encounter'].includes(state.phase);
  if(!modes.has(f.mode)||!DIFFICULTIES.some(d=>d.id===f.difficulty)||typeof f.nodeComplete!=='boolean')return false;
  if(f.rules!==undefined&&![2,3].includes(f.rules))return false;
  if(!Number.isInteger(f.strategySelections)||f.strategySelections<0||!Array.isArray(f.strategyRerolls)||f.strategyRerolls.length!==3||!f.strategyRerolls.every(n=>Number.isInteger(n)&&n>=0&&n<=10))return false;
  if(![f.supplyRerolls,f.encounterRerolls].every(n=>Number.isInteger(n)&&n>=0&&n<=1))return false;
  if(!Array.isArray(f.supplyOffers)||!Array.isArray(f.encounterOffers)||!Array.isArray(f.extraSupplyDone)||!Array.isArray(f.extraStrategyDone))return false;
  if(!f.extraSupplyDone.every(n=>Number.isInteger(n)&&n>0&&n<=getRunLength(state))||!f.extraStrategyDone.every(n=>Number.isInteger(n)&&n>0&&n<=getRunLength(state)))return false;
  if(![null,'supply','strategy','encounter','prep'].includes(f.pendingNodeKind))return false;
  const validReward=r=>{
    if(!r||typeof r!=='object'||r.amount!==undefined&&(!Number.isInteger(r.amount)||r.amount<1||r.amount>1000000))return false;
    if(['gold','refresh','xp'].includes(r.kind))return Number.isInteger(r.amount)&&r.amount>0;
    if(r.kind==='item')return !!resolveEquipment(r.id);
    if(r.kind==='character')return CHARACTERS.some(c=>c.id===r.id)&&[1,2,3].includes(r.star||1);
    return r.kind==='chest'&&['basic','advanced','privileged'].includes(r.quality);
  };
  const validOffer=o=>o&&typeof o.id==='string'&&typeof o.name==='string'&&typeof o.description==='string'&&Array.isArray(o.rewards)&&o.rewards.length>0&&o.rewards.length<10&&o.rewards.every(validReward);
  const validEncounter=o=>validOffer(o)&&[1,2,3].includes(o.level)&&[o.hpMultiplier,o.attackMultiplier].every(n=>Number.isFinite(n)&&n>=.1&&n<=5);
  if(!f.supplyOffers.every(validOffer)||!f.encounterOffers.every(validEncounter))return false;
  if(f.selectedEncounter!==null&&!validEncounter(f.selectedEncounter))return false;
  if(state.phase==='supply'&&f.supplyOffers.length!==3||state.phase==='encounter'&&f.encounterOffers.length!==3)return false;
  return true;
}
