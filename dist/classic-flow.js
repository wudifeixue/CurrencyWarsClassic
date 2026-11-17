// Zero-Sum Game route structure. Sources and explicitly adapted values are in
// docs/classic-flow-research.md. No weekly/account rewards are simulated here.
import {CHARACTERS,resolveEquipment} from './data.js?v=6.1.0';
export const RUN_MODES=Object.freeze([
  {id:'standard',name:'标准博弈',description:'三个位面，23个节点。奖励、投资、补给、遭遇与首领依次推进；保留利息，经营完整阵容。',nodeCount:23,interest:true,startGold:16,nodeGold:0,nodeXp:2},
  {id:'overclock',name:'超频博弈',description:'更短的三个位面，无利息，每节点自动获得更多金币和经验。网页流程压缩为12节点。',nodeCount:12,interest:false,startGold:36,nodeGold:12,nodeXp:6},
]);
export const DIFFICULTIES=Object.freeze([
  {id:0,name:'入门',description:'熟悉经典运营与羁绊。',hpMultiplier:1,attackMultiplier:1},
  {id:1,name:'进阶',description:'敌人生命提高35%，攻击提高15%。',hpMultiplier:1.35,attackMultiplier:1.15},
  {id:2,name:'挑战',description:'敌人生命提高80%，攻击提高30%。',hpMultiplier:1.8,attackMultiplier:1.3},
]);
export const NODE_NAMES=Object.freeze({reward:'奖励',strategy:'投资策略',battle:'战斗',supply:'补给',encounter:'遭遇',boss:'首领'});
const standard=[['reward','reward','strategy','battle','supply','battle','encounter','reward','boss'],['battle','strategy','supply','battle','encounter','reward','boss'],['battle','strategy','supply','battle','encounter','reward','boss']];
const overclock=Array.from({length:3},()=>['strategy','supply','encounter','boss']);
const modes=new Map(RUN_MODES.map(mode=>[mode.id,mode]));
export const isClassicRun=state=>!!state.flow&&modes.has(state.flow.mode);
export const getRunMode=state=>modes.get(state.flow?.mode)||{id:'legacy',name:'旧版远征',description:'保留已有12关存档。新开局可选择标准或超频博弈。',nodeCount:12,interest:true,nodeGold:0,nodeXp:2};
export function getRunNodes(state){
  if(!isClassicRun(state))return Array.from({length:12},(_,i)=>({round:i+1,plane:Math.ceil((i+1)/4),index:i%4+1,label:`${Math.ceil((i+1)/4)}-${i%4+1}`,type:i%4===3?'boss':[1,5,9].includes(i)?'strategy':'battle',boss:i%4===3,combat:true,combatRound:i+1,name:i%4===3?'首领':'战斗'}));
  let round=0;
  return (state.flow.mode==='overclock'?overclock:standard).flatMap((plane,p)=>plane.map((type,index)=>{
    if(getRunMode(state).id==='standard'&&state.environment?.id==='war-frontier'&&p===2&&type==='battle')type='encounter';
    const combatRound=type==='boss'?(p+1)*4:p*4+Math.min(3,Math.max(1,Math.ceil((index+1)/3)));
    return {round:++round,plane:p+1,index:index+1,label:`${p+1}-${index+1}`,type,name:NODE_NAMES[type],boss:type==='boss',combat:type!=='supply',combatRound};
  }));
}
export const getCurrentNode=state=>getRunNodes(state)[state.round-1];
export const getRunLength=state=>getRunNodes(state).length;
// Longer-run curve: 9→10 is the observed 84 XP. Earlier thresholds remain
// simulator tuning until a complete historical client table is verified.
export const CLASSIC_LEVEL_XP=Object.freeze({4:10,5:20,6:32,7:48,8:64,9:84});
export function initFlow(mode='standard',difficulty=0){
  return {mode:modes.has(mode)?mode:'standard',difficulty:DIFFICULTIES.some(d=>d.id===difficulty)?difficulty:0,
    nodeComplete:false,supplyOffers:[],encounterOffers:[],selectedEncounter:null,supplyRerolls:1,encounterRerolls:1,
    strategyRerolls:[1,1,1],strategySelections:0,extraSupplyDone:[],extraStrategyDone:[],pendingNodeKind:null};
}
export function validateFlow(state){
  const f=state.flow;if(f===undefined||f===null)return !['environment','supply','encounter'].includes(state.phase);
  if(!modes.has(f.mode)||!DIFFICULTIES.some(d=>d.id===f.difficulty)||typeof f.nodeComplete!=='boolean')return false;
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
