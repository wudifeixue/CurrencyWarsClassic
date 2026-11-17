import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame,act,validateState,migrateState,getCurrentNode,getRunNodes,getRunMode,getRunLength,getLevelXp,getEnemy,getInterest,getSellPrice,getNodeBaseIncome,getNodeXp,getBackCapacity} from '../dist/engine.js';
import {getDefeatPenaltyParts} from '../dist/classic-flow.js';
import {CLASSIC_ENVIRONMENTS} from '../dist/classic-environments.js';
import {CLASSIC_ROSTER} from '../dist/data.js';

const run=(s,a)=>{const r=act(s,a);assert.equal(r.ok,true,r.message);assert.equal(validateState(s),true,`${a.type} @ ${s.round}`);return r;};
function fresh(mode='standard',environment='secondhand',rank=0){
 const s=createGame(123,{mode,rank});s.environment.choices=[environment,...CLASSIC_ENVIRONMENTS.filter(e=>e.id!==environment).slice(0,2).map(e=>e.id)];
 run(s,{type:'choose-environment',id:environment});return deploy(s);
}
// Keeps a long scripted run alive the way a player would: open crystals, spend spare gold on experience, field everyone.
function reinforce(s){
 if(s.phase!=='prep'||s.flow.nodeComplete)return s;
 for(const orb of [...s.loot])act(s,{type:'collect-loot',uid:orb.uid});
 while(s.gold>=4&&s.level<10)run(s,{type:'exp'});
 return strong(deploy(s));
}
// A run opens with everything on the bench; fill the four front slots first, then the back row.
function deploy(s){
 if(s.phase!=='prep')return s;
 for(const u of s.units.filter(u=>u.zone==='bench')){
  if(s.units.filter(x=>x.zone!=='bench').length>=s.level)break;
  run(s,{type:'move',uid:u.uid,zone:s.units.filter(x=>x.zone==='front').length<4?'front':'back'});
 }
 return s;
}
function strong(s){for(const u of s.units){u.star=3;u.items=['blade','blossom','boots'];}return s;}
function advance(s){if(s.phase==='choice')run(s,{type:'choose',index:0});else if(s.phase==='supply')run(s,{type:'choose-supply',index:0});else if(s.phase==='encounter')run(s,{type:'choose-encounter',index:0});else if(s.phase==='result')run(s,{type:'next'});else if(s.flow.nodeComplete)run(s,{type:'next-node'});else{deploy(s);run(s,{type:'battle'});}}
function reach(s,label){for(let i=0;getCurrentNode(s).label!==label&&i<100;i++)advance(s);assert.equal(getCurrentNode(s).label,label);}

test('mode routes keep distinct original node roles and stage labels',()=>{
 const standard=createGame(7,{mode:'standard',rank:2}),fast=createGame(7,{mode:'overclock',rank:2});
 assert.equal(validateState(standard),true);assert.equal(standard.phase,'environment');
 assert.equal(getRunLength(standard),23);assert.equal(getRunLength(fast),16);
 assert.deepEqual(getRunNodes(fast).map(n=>`${n.label}:${n.type}`),['1-1:reward','1-2:strategy','1-3:supply','1-4:encounter','1-5:reward','1-6:boss','2-1:strategy','2-2:supply','2-3:encounter','2-4:reward','2-5:boss','3-1:strategy','3-2:supply','3-3:encounter','3-4:reward','3-5:boss']);
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
 assert.equal(s.loot.filter(o=>o.source==='开局补给').length,1,'and one more inside a crystal');
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
 const a=strong(fresh('standard','secondhand',2));reach(a,'1-7');const b=structuredClone(a);
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

test('complete overclock route has thirteen battles, three supplies, no interest, and higher node income',()=>{
 const s=strong(fresh('overclock'));const start=s.gold;
 for(let i=0;i<100&&s.phase!=='ended';i++)advance(s);
 assert.equal(s.phase,'ended');assert.equal(s.result,'victory');assert.equal(s.history.length,13);assert.equal(s.round,16);
 assert.equal(s.runSummary.rankGain,0);assert.ok(s.gold>start+12*10);
 assert.equal(s.lastBattle.rewards.includes('超频模式无利息'),true);
});

test('overclock pays the recorded base gold and experience per node and no entry gold',()=>{
 const s=fresh('overclock'),nodes=getRunNodes(s),at=label=>nodes.find(n=>n.label===label);
 assert.deepEqual(['1-1','1-2','1-4','1-5','1-6','2-1','2-5','3-4','3-5'].map(l=>getNodeBaseIncome(at(l),s)),[5,10,10,10,15,10,15,10,0]);
 assert.deepEqual(['1-1','1-3','1-6','2-1','2-2','2-5','3-3','3-5'].map(l=>getNodeXp(s,at(l))),[6,0,10,8,0,12,12,16]);
 strong(s);const gold=s.gold;run(s,{type:'battle'});
 assert.equal(s.lastBattle.baseIncome,5);assert.equal(s.lastBattle.interestIncome,0);assert.equal(s.lastBattle.xpGain,6);
 assert.equal(s.gold,gold+5+s.lastBattle.streakIncome,'only the settlement pays gold');
 run(s,{type:'next'});assert.equal(getCurrentNode(s).label,'1-2');assert.equal(s.gold,gold+5+s.lastBattle.streakIncome,'no gold on entering a node');
 assert.equal(s.level,4);assert.equal(s.xp,2,'6 experience: 4 to reach level 4, 2 left over');
});

test('runs started before rules revision 3 keep the compressed overclock route and the old HP formula',()=>{
 const s=fresh('overclock');s.flow.rules=2;
 assert.equal(getRunLength(s),12);assert.equal(validateState(s),true);
 assert.equal(getNodeXp(s,getRunNodes(s)[0]),6);assert.equal(getNodeBaseIncome(getRunNodes(s)[0],s),3);
 const standard=fresh();standard.flow.rules=2;standard.round=3;standard.hp=100;
 standard.units=standard.units.filter(u=>u.zone==='front').slice(0,1);standard.units[0].items=[];
 run(standard,{type:'battle'});assert.equal(standard.lastBattle.won,false);assert.equal(standard.lastBattle.penalty,undefined);
});

test('squad HP loss follows the old penalty table: fixed part, unfinished progress, boss minimum',()=>{
 const s=fresh(),nodes=getRunNodes(s),at=label=>nodes.find(n=>n.label===label);
 assert.deepEqual(getDefeatPenaltyParts(at('1-3'),0),{base:5,progress:10,threshold:0,total:15});
 assert.deepEqual(getDefeatPenaltyParts(at('1-3'),50),{base:5,progress:5,threshold:0,total:10});
 assert.deepEqual(getDefeatPenaltyParts(at('2-1'),97),{base:10,progress:0,threshold:0,total:10});
 assert.deepEqual(getDefeatPenaltyParts(at('3-5'),0),{base:15,progress:20,threshold:0,total:35});
 assert.deepEqual(getDefeatPenaltyParts(at('1-9'),32),{base:10,progress:7,threshold:4,total:21});
 assert.deepEqual(getDefeatPenaltyParts(at('1-9'),33),{base:10,progress:7,threshold:0,total:17});
 assert.deepEqual(getDefeatPenaltyParts(at('2-7'),0),{base:15,progress:15,threshold:6,total:36});
 assert.deepEqual(getDefeatPenaltyParts(at('3-7'),10),{base:20,progress:18,threshold:8,total:46});
 assert.equal(getDefeatPenaltyParts(at('1-1'),0).total,0,'reward nodes never cost squad HP');
 s.round=3;s.hp=100;s.units=s.units.filter(u=>u.zone==='front').slice(0,1);s.units[0].items=[];
 run(s,{type:'battle'});assert.equal(s.lastBattle.won,false);
 const parts=getDefeatPenaltyParts(at('1-3'),s.lastBattle.progress);
 assert.deepEqual(s.lastBattle.penalty,parts);assert.equal(s.lastBattle.damage,parts.total);assert.equal(s.hp,100-parts.total);assert.equal(s.lastBattle.hpBefore,100);
 const reward=fresh();reward.units=reward.units.filter(u=>u.zone==='front').slice(0,1);reward.hp=100;
 for(const u of reward.units)u.items=[];
 const enemy=getEnemy(reward);assert.equal(enemy.node.type,'reward');
});

test('units stand in fixed slots: gaps stay, a taken slot trades places, rows have 4, 6 and 9 places',()=>{
 const s=createGame(7,{mode:'standard'});run(s,{type:'choose-environment',id:s.environment.choices[0]});
 assert.deepEqual(s.units.map(u=>u.slot),[0,1,2,3],'supplies fill the bench from the left');
 const [a,b,c,d]=s.units.map(u=>u.uid),slot=uid=>{const u=s.units.find(x=>x.uid===uid);return `${u.zone}${u.slot}`;};
 run(s,{type:'move',uid:a,zone:'front',position:2});assert.equal(slot(a),'front2');
 assert.deepEqual(s.units.filter(u=>u.zone==='bench').map(u=>u.slot),[1,2,3],'the bench keeps its gap');
 run(s,{type:'move',uid:b,zone:'front'});assert.equal(slot(b),'front0','no slot named: first free one');
 run(s,{type:'move',uid:c,zone:'back',position:5});assert.equal(slot(c),'back5');
 assert.deepEqual(s.units.filter(u=>u.zone==='front').map(u=>u.uid),[b,a],'row order is slot order');
 run(s,{type:'move',uid:d,zone:'front',position:2});assert.equal(slot(d),'front2');assert.equal(slot(a),'bench3','dropping on a taken slot swaps even at the team limit');
 run(s,{type:'move',uid:d,zone:'front',position:3});assert.equal(slot(d),'front3');
 run(s,{type:'swap',uid:d,targetUid:c});assert.equal(slot(d),'back5');assert.equal(slot(c),'front3');
 assert.equal(act(s,{type:'move',uid:a,zone:'front',position:4}).ok,false,'the front row has four slots');
 assert.equal(act(s,{type:'move',uid:a,zone:'back',position:6}).ok,false,'the back row has six');
 assert.equal(act(s,{type:'move',uid:a,zone:'bench',position:9}).ok,false,'the bench has nine');
 assert.equal(getBackCapacity(s),6);
 const clash=structuredClone(s);clash.units.find(u=>u.uid===a).slot=clash.units.find(u=>u.zone==='bench'&&u.uid!==a)?.slot??0;
 if(clash.units.filter(u=>u.zone==='bench').length>1)assert.equal(validateState(clash),false,'two units cannot share a slot');
 const old=structuredClone(s);for(const u of old.units)delete u.slot;
 const migrated=migrateState(old);assert.ok(migrated);
 assert.deepEqual(migrated.units.filter(u=>u.zone==='front').map(u=>u.slot),[0,1],'saves without slots line up from the left');
 s.level=10;s.units.push(...Array.from({length:8},(_,i)=>({uid:`extra-${i}`,characterId:'1013',star:3,zone:'bench',items:[]})));
 run(s,{type:'move',uid:a,zone:'front'});
 for(let i=0;i<5;i++)run(s,{type:'move',uid:`extra-${i}`,zone:'back'});
 assert.equal(s.units.filter(u=>u.zone==='back').length,6);
 assert.equal(act(s,{type:'move',uid:'extra-5',zone:'back'}).ok,false,'a seventh back-row unit has no slot');
 run(s,{type:'move',uid:'extra-5',zone:'front'});assert.equal(s.units.filter(u=>u.zone!=='bench').length,10);
});

test('worn equipment only comes off with the Disassembly Wrench',()=>{
 const s=fresh();const wrench=s.consumables.find(c=>c.id==='precision-wrench');
 assert.ok(wrench,'a run starts with the Precision Disassembly Wrench');
 const unit=s.units.find(u=>u.zone==='front');s.inventory=['knife','flower','battery'];
 run(s,{type:'equip',uid:unit.uid,itemIndex:0});assert.equal(unit.uid,s.units.find(u=>u.zone==='front').uid);
 const worn=()=>s.units.find(u=>u.uid===unit.uid).items;
 assert.equal(worn().length,1);
 assert.equal(act(s,{type:'unequip',uid:unit.uid,itemIndex:0}).ok,false,'no free unequip');
 const bare=s.units.find(u=>u.uid!==unit.uid);
 assert.equal(act(s,{type:'use-consumable',uid:wrench.uid,targetUid:bare.uid}).ok,false,'nothing to take off');
 run(s,{type:'use-consumable',uid:wrench.uid,targetUid:unit.uid});
 assert.equal(worn().length,0);assert.equal(s.inventory.length,3);assert.ok(s.consumables.some(c=>c.uid===wrench.uid),'the precision wrench is reusable');
 run(s,{type:'equip',uid:unit.uid,itemIndex:0});run(s,{type:'use-consumable',uid:wrench.uid,targetUid:unit.uid});assert.equal(s.inventory.length,3);
 const gold=s.gold;s.loot.push({uid:'loot-wrench',quality:'blue',source:'测试',contents:[{kind:'item',id:'wrench'}]});
 run(s,{type:'collect-loot',uid:'loot-wrench'});assert.equal(s.gold,gold+1,'an extra wrench turns into 1 gold');assert.equal(s.consumables.filter(c=>c.id==='wrench').length,0);
 s.consumables=s.consumables.filter(c=>c.id!=='precision-wrench');s.consumables.push({uid:'tool-plain',id:'wrench',nodes:0});
 run(s,{type:'equip',uid:unit.uid,itemIndex:0});run(s,{type:'use-consumable',uid:'tool-plain',targetUid:unit.uid});
 assert.equal(worn().length,0);assert.equal(s.consumables.some(c=>c.uid==='tool-plain'),false,'the plain wrench is used up');
 const older=fresh();older.flow.rules=2;older.inventory=['knife'];const u=older.units.find(x=>x.zone==='front');
 run(older,{type:'equip',uid:u.uid,itemIndex:0});run(older,{type:'unequip',uid:u.uid,itemIndex:0});assert.equal(older.inventory.length,1,'v6.2 runs keep free unequip');
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
 const s=strong(fresh('standard','secondhand',2));reach(s,'1-7');const before=JSON.stringify(s);assert.equal(act(s,{type:'reroll-encounter'}).ok,false);assert.equal(JSON.stringify(s),before);
 const bad=structuredClone(s);bad.flow.encounterOffers[0].hpMultiplier=1e99;assert.equal(validateState(bad),false);
 const badReward=structuredClone(s);badReward.flow.encounterOffers[0].rewards=[{kind:'item',id:'not-real'}];assert.equal(validateState(badReward),false);
 const wrongPhase=structuredClone(s);wrongPhase.phase='environment';assert.equal(validateState(wrongPhase),false);
});
