import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame,act,validateState,migrateState,getCurrentNode,getRunNodes,getRunMode,getRunLength,getLevelXp,getEnemy,getInterest,getSellPrice} from '../dist/engine.js';
import {CLASSIC_ENVIRONMENTS} from '../dist/classic-environments.js';
import {CLASSIC_ROSTER} from '../dist/data.js';

const run=(s,a)=>{const r=act(s,a);assert.equal(r.ok,true,r.message);assert.equal(validateState(s),true,`${a.type} @ ${s.round}`);return r;};
function fresh(mode='standard',environment='secondhand'){
 const s=createGame(123,{mode});s.environment.choices=[environment,...CLASSIC_ENVIRONMENTS.filter(e=>e.id!==environment).slice(0,2).map(e=>e.id)];
 run(s,{type:'choose-environment',id:environment});return deploy(s);
}
// Keeps a long scripted run alive the way a player would: open crystals, spend spare gold on experience, field everyone.
function reinforce(s){
 if(s.phase!=='prep'||s.flow.nodeComplete)return s;
 for(const orb of [...s.loot])act(s,{type:'collect-loot',uid:orb.uid});
 while(s.gold>=4&&s.level<10)run(s,{type:'exp'});
 return strong(deploy(s));
}
// A run opens with everything on the bench; put the first unit in front and fill the remaining population behind it.
function deploy(s){
 if(s.phase!=='prep')return s;
 for(const u of s.units.filter(u=>u.zone==='bench')){
  if(s.units.filter(x=>x.zone!=='bench').length>=s.level)break;
  run(s,{type:'move',uid:u.uid,zone:s.units.some(x=>x.zone==='front')?'back':'front'});
 }
 return s;
}
function strong(s){for(const u of s.units){u.star=3;u.items=['blade','blossom','boots'];}return s;}
function advance(s){if(s.phase==='choice')run(s,{type:'choose',index:0});else if(s.phase==='supply')run(s,{type:'choose-supply',index:0});else if(s.phase==='encounter')run(s,{type:'choose-encounter',index:0});else if(s.phase==='result')run(s,{type:'next'});else if(s.flow.nodeComplete)run(s,{type:'next-node'});else{deploy(s);run(s,{type:'battle'});}}
function reach(s,label){for(let i=0;getCurrentNode(s).label!==label&&i<100;i++)advance(s);assert.equal(getCurrentNode(s).label,label);}

test('mode routes keep distinct original node roles and stage labels',()=>{
 const standard=createGame(7,{mode:'standard'}),fast=createGame(7,{mode:'overclock'});
 assert.equal(validateState(standard),true);assert.equal(standard.phase,'environment');
 assert.equal(getRunLength(standard),23);assert.equal(getRunLength(fast),12);
 assert.deepEqual(getRunNodes(standard).filter(n=>n.boss).map(n=>n.label),['1-9','2-7','3-7']);
 assert.deepEqual(getRunNodes(standard).filter(n=>n.type==='supply').map(n=>n.label),['1-5','2-3','3-3']);
 assert.equal(getRunMode(fast).interest,false);fast.gold=100;assert.equal(getInterest(fast),0);
 standard.gold=100;assert.equal(getInterest(standard),5);
});

test('a run opens at level 3 with an empty board and Starting Supplies on the bench',()=>{
 const s=createGame(7,{mode:'standard'});
 assert.equal(s.level,3);assert.equal(s.xp,0);assert.equal(s.gold,0);assert.deepEqual(s.units,[]);assert.deepEqual(s.loot,[]);assert.deepEqual(s.shop,[null,null,null,null,null]);
 assert.equal(getLevelXp(s),4);assert.equal(validateState(s),true);
 const r=run(s,{type:'choose-environment',id:s.environment.choices[0]});
 assert.equal(s.phase,'prep');assert.equal(getCurrentNode(s).label,'1-1');assert.equal(s.level,3);
 assert.equal(s.units.length,4);assert.ok(s.units.every(u=>u.zone==='bench'&&u.star===1),'four supplies wait on the bench, nothing is deployed');
 assert.equal(r.supplies.filter(x=>x.kind==='character').length,4);
 assert.ok(s.gold>=3&&s.gold<=4,'three or four starting coins');assert.equal(s.inventory.length,1,'one basic equipment in the list');
 assert.equal(s.loot.filter(o=>o.source==='初始补给').length,1,'and one more inside a crystal');
 assert.equal(s.shop.filter(Boolean).length,5);assert.ok(s.shop.every(id=>CLASSIC_ROSTER.find(c=>c.id===id).cost===1),'level 3 shop only offers 1-cost characters');
 assert.equal(act(s,{type:'battle'}).ok,false,'cannot fight with nobody deployed');
 const [a,b,c,d]=s.units.map(u=>u.uid);
 run(s,{type:'move',uid:a,zone:'front'});run(s,{type:'move',uid:b,zone:'back'});
 run(s,{type:'move',uid:c,zone:'back'});
 assert.equal(act(s,{type:'move',uid:d,zone:'back'}).ok,false,'team size equals the level');
 const one=s.units[0];assert.equal(getSellPrice(s,one),1);
 for(const [cost,two,three] of [[1,3,9],[2,5,17],[3,8,26],[4,11,35],[5,14,44]]){const id=CLASSIC_ROSTER.find(c=>c.cost===cost).id;assert.equal(getSellPrice(s,{characterId:id,star:1,items:[]}),cost);assert.equal(getSellPrice(s,{characterId:id,star:2,items:[]}),two);assert.equal(getSellPrice(s,{characterId:id,star:3,items:[]}),three);}
});

test('level thresholds, node experience and settlement gold follow the recorded values',()=>{
 const s=fresh();const need={3:4,4:6,5:16,6:36,7:48,8:60,9:72};
 for(const [level,xp] of Object.entries(need)){s.level=Number(level);s.xp=0;assert.equal(getLevelXp(s),xp);}
 s.level=3;s.xp=0;strong(s);
 run(s,{type:'battle'});assert.equal(s.lastBattle.won,true);
 assert.equal(s.lastBattle.baseIncome,3);assert.equal(s.lastBattle.streakIncome,1);assert.equal(s.lastBattle.xpGain,2);assert.equal(s.streak,0,'reward nodes do not count towards the streak');
 reach(s,'1-2');assert.equal(s.xp,2);assert.equal(s.level,3);
 run(s,{type:'battle'});assert.equal(s.lastBattle.baseIncome,4);reach(s,'1-3');
 assert.equal(s.level,4);assert.equal(s.xp,0);
 reach(s,'1-4');strong(s);run(s,{type:'battle'});assert.equal(s.lastBattle.baseIncome,5);assert.equal(s.lastBattle.won,true);assert.equal(s.streak,2);assert.equal(s.lastBattle.streakIncome,2);
});

test('supply is a real noncombat node, rewards persist as crystals and cannot repeat',()=>{
 const s=strong(fresh());reach(s,'1-5');assert.equal(s.phase,'supply');
 const before=s.history.length,offers=structuredClone(s.flow.supplyOffers);
 run(s,{type:'reroll-supply'});assert.notDeepEqual(s.flow.supplyOffers,offers);
 assert.equal(act(s,{type:'reroll-supply'}).ok,false);
 const lootBefore=s.loot.length;run(s,{type:'choose-supply',index:0});
 assert.equal(s.history.length,before);assert.equal(s.flow.nodeComplete,true);assert.ok(s.loot.length>lootBefore);
 assert.equal(act(s,{type:'battle'}).ok,false);assert.equal(act(s,{type:'choose-supply',index:0}).ok,false);
 run(s,{type:'next-node'});assert.equal(getCurrentNode(s).label,'1-6');assert.equal(s.history.length,before);
});

test('encounter branches change enemies and grant selected reward only after victory',()=>{
 const a=strong(fresh());reach(a,'1-7');const b=structuredClone(a);
 assert.equal(a.phase,'encounter');const low=a.flow.encounterOffers[0],high=a.flow.encounterOffers[2];
 run(a,{type:'choose-encounter',index:0});run(b,{type:'choose-encounter',index:2});
 assert.ok(getEnemy(b).units[0].maxHp>getEnemy(a).units[0].maxHp);
 assert.ok(getEnemy(b).units[0].attack>getEnemy(a).units[0].attack);
 assert.equal(a.loot.some(l=>l.source==='遭遇奖励'),false);
 run(a,{type:'battle'});run(b,{type:'battle'});
 assert.equal(a.loot.filter(l=>l.source==='遭遇奖励').length,low.rewards.length);
 assert.equal(b.loot.filter(l=>l.source==='遭遇奖励').length,high.rewards.length);
 assert.equal(act(b,{type:'battle'}).ok,false);
});

test('complete standard route survives reload past node twelve and ends at final boss',()=>{
 let s=strong(fresh());const visited=new Set();
 for(let i=0;i<150&&s.phase!=='ended';i++){
  visited.add(getCurrentNode(s).label);reinforce(s);advance(s);
  const saved=migrateState(JSON.parse(JSON.stringify(s)));assert.ok(saved,`reload at ${s.round}`);s=saved;
 }
 assert.equal(s.phase,'ended');assert.equal(s.result,'victory');assert.equal(s.round,23);
 assert.equal(s.history.length,20);assert.equal(visited.size,23);assert.equal(s.runSummary.totalNodes,23);assert.ok(s.runSummary.rankGain>=1);
 assert.equal(s.progression.nodeEntries.length,23);assert.equal(s.progression.resolvedBattles.length,20);
});

test('complete overclock route has nine battles, three supplies, no interest, and higher node income',()=>{
 const s=strong(fresh('overclock'));const start=s.gold;
 for(let i=0;i<100&&s.phase!=='ended';i++)advance(s);
 assert.equal(s.phase,'ended');assert.equal(s.result,'victory');assert.equal(s.history.length,9);assert.equal(s.round,12);
 assert.equal(s.runSummary.rankGain,0);assert.ok(s.gold>start+12*10);
 assert.equal(s.lastBattle.rewards.includes('超频模式无利息'),true);
});

test('accident insurance adds a supply choice before each boss without skipping its combat',()=>{
 const s=strong(fresh('standard','accident-insurance'));reach(s,'1-9');assert.equal(s.phase,'supply');
 run(s,{type:'choose-supply',index:0});assert.equal(s.phase,'prep');assert.equal(s.flow.nodeComplete,false);
 assert.equal(act(s,{type:'next-node'}).ok,false);run(s,{type:'battle'});assert.equal(s.lastBattle.nodeType,'boss');
 run(s,{type:'next'});assert.equal(getCurrentNode(s).label,'2-1');
 assert.deepEqual(s.flow.extraSupplyDone,[9]);
});

test('joint decision and frontier environments change the real route decisions',()=>{
 const s=strong(fresh('standard','joint-decision'));reach(s,'2-6');assert.equal(s.phase,'choice');
 const before=s.strategies.length;run(s,{type:'choose',index:0});assert.equal(s.strategies.length,before+1);assert.equal(s.phase,'prep');
 run(s,{type:'battle'});assert.equal(s.lastBattle.nodeType,'reward');
 const f=fresh('standard','war-frontier');assert.equal(getRunNodes(f).find(n=>n.label==='3-1').type,'encounter');assert.equal(getRunNodes(f).find(n=>n.label==='3-4').type,'encounter');
});

test('classic losses do not pay loss-streak income and surviving a final loss still completes the run',()=>{
 const s=fresh();s.round=23;s.units=s.units.filter(u=>u.zone==='front').slice(0,1);s.units[0].items=[];s.hp=100;s.streak=0;
 run(s,{type:'battle'});assert.equal(s.lastBattle.won,false);assert.equal(s.streak,0);assert.ok(s.hp>0);
 assert.equal(s.lastBattle.rewards.includes('连胜金币 +0'),true);
 run(s,{type:'next'});assert.equal(s.phase,'ended');assert.equal(s.result,'victory');
});

test('legacy saves retain twelve-round route and economy instead of migrating mid-run to23nodes',()=>{
 const s=createGame(9);const migrated=migrateState(JSON.parse(JSON.stringify(s)));
 assert.equal(getRunMode(migrated).id,'legacy');assert.equal(getRunLength(migrated),12);
 assert.equal(migrated.phase,'prep');assert.equal(getLevelXp(migrated),8);
 const unit=migrated.units[0],refund=getSellPrice(migrated,unit),gold=migrated.gold;
 run(migrated,{type:'sell',uid:unit.uid});assert.equal(migrated.gold,gold+refund);
});

test('a concept environment adds its characters to the bench and they can actually deploy and fight',()=>{
 const s=createGame(123,{mode:'standard'});s.environment.choices=['concept-energy',...CLASSIC_ENVIRONMENTS.filter(e=>e.id!=='concept-energy').slice(0,2).map(e=>e.id)];
 run(s,{type:'choose-environment',id:'concept-energy'});
 assert.equal(s.units.length,4,'the concept pair replaces two of the four supplies');assert.ok(s.units.every(u=>u.zone==='bench'));assert.ok(['1402','1217'].every(id=>s.units.some(u=>u.characterId===id)));
 assert.ok(!s.loot.some(o=>o.contents.some(r=>r.kind==='character')),'opening characters are not left as crystals');
 const empty=JSON.stringify(s);assert.equal(act(s,{type:'battle'}).ok,false);assert.equal(JSON.stringify(s),empty);
 const [front,back]=s.units.map(u=>u.uid);run(s,{type:'move',uid:front,zone:'front'});run(s,{type:'move',uid:back,zone:'back'});
 run(s,{type:'battle'});assert.equal(s.phase,'result');
});

test('encounter refresh does not consume a charge without changing fixed offers, and corrupted offers are rejected',()=>{
 const s=strong(fresh());reach(s,'1-7');const before=JSON.stringify(s);assert.equal(act(s,{type:'reroll-encounter'}).ok,false);assert.equal(JSON.stringify(s),before);
 const bad=structuredClone(s);bad.flow.encounterOffers[0].hpMultiplier=1e99;assert.equal(validateState(bad),false);
 const badReward=structuredClone(s);badReward.flow.encounterOffers[0].rewards=[{kind:'item',id:'not-real'}];assert.equal(validateState(badReward),false);
 const wrongPhase=structuredClone(s);wrongPhase.phase='environment';assert.equal(validateState(wrongPhase),false);
});
