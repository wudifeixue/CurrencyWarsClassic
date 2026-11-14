import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame,act,validateState,migrateState,getCurrentNode,getRunNodes,getRunMode,getRunLength,getLevelXp,getEnemy,getInterest,getSellPrice} from '../dist/engine.js';
import {CLASSIC_ENVIRONMENTS} from '../dist/classic-environments.js';

const run=(s,a)=>{const r=act(s,a);assert.equal(r.ok,true,r.message);assert.equal(validateState(s),true,`${a.type} @ ${s.round}`);return r;};
function fresh(mode='standard',environment='secondhand'){
 const s=createGame(123,{mode});s.environment.choices=[environment,...CLASSIC_ENVIRONMENTS.filter(e=>e.id!==environment).slice(0,2).map(e=>e.id)];
 run(s,{type:'choose-environment',id:environment});return s;
}
function strong(s){for(const u of s.units){u.star=3;u.items=['blade','blossom','boots'];}return s;}
function advance(s){if(s.phase==='choice')run(s,{type:'choose',index:0});else if(s.phase==='supply')run(s,{type:'choose-supply',index:0});else if(s.phase==='encounter')run(s,{type:'choose-encounter',index:0});else if(s.phase==='result')run(s,{type:'next'});else if(s.flow.nodeComplete)run(s,{type:'next-node'});else run(s,{type:'battle'});}
function reach(s,label){for(let i=0;getCurrentNode(s).label!==label&&i<100;i++)advance(s);assert.equal(getCurrentNode(s).label,label);}

test('mode routes keep distinct original node roles and stage labels',()=>{
 const standard=createGame(7,{mode:'standard'}),fast=createGame(7,{mode:'overclock'});
 assert.equal(validateState(standard),true);assert.equal(standard.phase,'environment');
 assert.equal(getRunLength(standard),23);assert.equal(getRunLength(fast),12);
 assert.deepEqual(getRunNodes(standard).filter(n=>n.boss).map(n=>n.label),['1-9','2-7','3-7']);
 assert.deepEqual(getRunNodes(standard).filter(n=>n.type==='supply').map(n=>n.label),['1-5','2-3','3-3']);
 assert.ok(fast.gold>standard.gold);
 assert.equal(getRunMode(fast).interest,false);fast.gold=100;assert.equal(getInterest(fast),0);
 standard.gold=100;assert.equal(getInterest(standard),5);
 assert.ok(getLevelXp(standard)>getLevelXp(createGame(7)));
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
  visited.add(getCurrentNode(s).label);advance(s);
  const saved=migrateState(JSON.parse(JSON.stringify(s)));assert.ok(saved,`reload at ${s.round}`);s=saved;
 }
 assert.equal(s.phase,'ended');assert.equal(s.result,'victory');assert.equal(s.round,23);
 assert.equal(s.history.length,20);assert.equal(visited.size,23);assert.equal(s.runSummary.totalNodes,23);assert.equal(s.runSummary.rankGain,3);
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
 const s=fresh();s.round=23;s.units=s.units.slice(0,1);s.units[0].items=[];s.hp=100;s.streak=0;
 run(s,{type:'battle'});assert.equal(s.lastBattle.won,false);assert.equal(s.streak,0);assert.ok(s.hp>0);
 assert.equal(s.lastBattle.rewards.includes('连胜奖励 +0'),true);
 run(s,{type:'next'});assert.equal(s.phase,'ended');assert.equal(s.result,'victory');
});

test('legacy saves retain twelve-round route and economy instead of migrating mid-run to23nodes',()=>{
 const s=createGame(9);const migrated=migrateState(JSON.parse(JSON.stringify(s)));
 assert.equal(getRunMode(migrated).id,'legacy');assert.equal(getRunLength(migrated),12);
 assert.equal(migrated.phase,'prep');assert.equal(getLevelXp(migrated),8);
 const unit=migrated.units[0],refund=getSellPrice(migrated,unit),gold=migrated.gold;
 run(migrated,{type:'sell',uid:unit.uid});assert.equal(migrated.gold,gold+refund);
});

test('an environment replacement starts with collectible characters and can actually deploy and fight',()=>{
 const s=fresh('standard','concept-energy');assert.equal(s.units.length,0);assert.ok(s.loot.some(o=>o.contents.some(r=>r.kind==='character')));
 const empty=JSON.stringify(s);assert.equal(act(s,{type:'battle'}).ok,false);assert.equal(JSON.stringify(s),empty);
 for(const orb of [...s.loot])run(s,{type:'collect-loot',uid:orb.uid});assert.ok(s.units.length>=2);
 const [front,back]=s.units.map(u=>u.uid);run(s,{type:'move',uid:front,zone:'front'});run(s,{type:'move',uid:back,zone:'back'});
 run(s,{type:'battle'});assert.equal(s.phase,'result');
});

test('encounter refresh does not consume a charge without changing fixed offers, and corrupted offers are rejected',()=>{
 const s=strong(fresh());reach(s,'1-7');const before=JSON.stringify(s);assert.equal(act(s,{type:'reroll-encounter'}).ok,false);assert.equal(JSON.stringify(s),before);
 const bad=structuredClone(s);bad.flow.encounterOffers[0].hpMultiplier=1e99;assert.equal(validateState(bad),false);
 const badReward=structuredClone(s);badReward.flow.encounterOffers[0].rewards=[{kind:'item',id:'not-real'}];assert.equal(validateState(badReward),false);
 const wrongPhase=structuredClone(s);wrongPhase.phase='environment';assert.equal(validateState(wrongPhase),false);
});
