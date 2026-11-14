import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame,act,migrateState,validateState,getEquipment,getPopulationLimit,getUnitStats,getShopOdds} from '../dist/engine.js';
import {queueRewards} from '../dist/loot.js';
const run=(s,a)=>{const r=act(s,a);assert.equal(r.ok,true,r.message);assert.equal(validateState(s),true);return r;};
const reject=(s,a)=>{const before=structuredClone(s);assert.equal(act(s,a).ok,false);assert.deepEqual(s,before);};
const pickup=s=>{for(const orb of [...s.loot])run(s,{type:'collect-loot',uid:orb.uid});};

test('new equipment is visible loot, paid exactly once and persisted across reloads',()=>{
 const s=createGame(501);assert.deepEqual(s.inventory,[]);assert.equal(s.loot.length,3);
 const uid=s.loot[0].uid;run(s,{type:'collect-loot',uid});assert.deepEqual(s.inventory,['knife']);reject(s,{type:'collect-loot',uid});
 const loaded=migrateState(JSON.parse(JSON.stringify(s)));assert.deepEqual(loaded,s);assert.equal(loaded.loot.length,2);
 pickup(loaded);assert.deepEqual(loaded.inventory,['knife','flower','battery']);
});
test('chest cancellation and reload preserve options; only final selection consumes a chest',()=>{
 const s=createGame(502);s.loot=[];queueRewards(s,[{kind:'chest',quality:'basic'},{kind:'chest',quality:'advanced'},{kind:'chest',quality:'privileged'},{kind:'gold',amount:3}]);
 assert.deepEqual(s.loot.map(o=>o.quality),['blue','gold','prismatic','white']);pickup(s);assert.equal(s.chests.length,3);
 const chest=structuredClone(s.chests[0]);run(s,{type:'open-chest',uid:chest.uid});reject(s,{type:'battle'});reject(s,{type:'choose-chest',index:-1});
 run(s,{type:'cancel-chest'});assert.deepEqual(s.chests[0],chest);assert.deepEqual(s.inventory,[]);
 const loaded=migrateState(s);run(loaded,{type:'open-chest',uid:chest.uid});assert.deepEqual(loaded.chests[0].options,chest.options);
 run(loaded,{type:'choose-chest',index:1});assert.deepEqual(loaded.inventory,[chest.options[1]]);assert.equal(loaded.chests.length,2);reject(loaded,{type:'choose-chest',index:1});
});
test('full bench defers the whole crystal atomically instead of losing a character or doubling gold',()=>{
 const s=createGame(503);s.loot=[];for(let i=0;i<9;i++)s.units.push({uid:`bench-${i}`,characterId:'1001',star:2,zone:'bench',items:[]});
 queueRewards(s,[{contents:[{kind:'gold',amount:10},{kind:'character',id:'1202'}]}]);
 const uid=s.loot[0].uid;reject(s,{type:'collect-loot',uid});run(s,{type:'sell',uid:'bench-0'});run(s,{type:'collect-loot',uid});
 assert.ok(s.units.some(u=>u.characterId==='1202'));assert.equal(s.loot.length,0);
});
test('old pending equipment choice migrates to a cancellable chest without new starter loot',()=>{
 const old=createGame(504);old.version=2;for(const key of ['loot','chests','consumables','activeChest','nextLootUid','bonusMaxHp','progression'])delete old[key];
 old.inventory=['armor'];old.phase='choice';old.choiceKind='equipment';old.choices=['knife','drill','battery'].map(id=>({kind:'equipment',id}));
 const s=migrateState(old);assert.ok(s);assert.equal(s.phase,'prep');assert.equal(s.loot.length,0);assert.deepEqual(s.inventory,['armor']);assert.deepEqual(s.chests[0].options,['knife','drill','battery']);
 assert.deepEqual(migrateState(s),s);
});
test('privilege card, projector and wealth gem change actual combat and management state',()=>{
 const s=createGame(505);s.loot=[];s.inventory=['boots'];run(s,{type:'equip',uid:s.units[0].uid,itemIndex:0});const base=getUnitStats(s,s.units[0]);
 queueRewards(s,[{kind:'item',id:'privilege-card'},{kind:'item',id:'projector'},{kind:'item',id:'wealth-gem'}]);pickup(s);
 run(s,{type:'use-consumable',uid:s.consumables.find(c=>c.id==='privilege-card').uid,targetUid:s.units[0].uid});
 assert.equal(s.units[0].items[0],'privileged:boots');assert.equal(getEquipment(s.units[0].items[0]).speedPct,.4);assert.ok(getUnitStats(s,s.units[0]).speed>base.speed);
 run(s,{type:'use-consumable',uid:s.consumables.find(c=>c.id==='projector').uid,targetUid:s.units[0].uid});assert.equal(s.units.filter(u=>u.characterId===s.units[0].characterId).length,2);
 assert.equal(getPopulationLimit(s),5);run(s,{type:'move',uid:s.units.at(-1).uid,zone:'back'});
 run(s,{type:'unequip',uid:s.units[0].uid,itemIndex:0});assert.ok(s.inventory.includes('privileged:boots'));assert.ok(s.inventory.includes('wealth-gem'));
});
test('supply nodes leave preparation available and all generated chest payloads survive saving',()=>{
 const s=createGame(506);s.units.forEach(u=>u.star=3);
 for(let i=1;i<=5;i++){
   pickup(s);run(s,{type:'battle'});run(s,{type:'next'});if(s.phase==='choice')run(s,{type:'choose',index:0});
   assert.deepEqual(migrateState(s),s);
   if([3,5].includes(s.round)){assert.equal(s.phase,'prep');assert.ok(s.loot.some(o=>o.contents.some(r=>r.kind==='chest')));}
 }
});
test('fortune card changes real shop odds and corrupted crystal contents are rejected',()=>{
 const s=createGame(507);const before=getShopOdds(s);s.progression.seer.cards.push('fortune');const after=getShopOdds(s);assert.equal(after[4],before[4]+3);assert.equal(after.reduce((a,b)=>a+b),100);
 for(const bad of [{kind:'item',id:'invalid'},{kind:'gold',amount:-1},{kind:'chest',chest:{options:['knife']}}]){const broken=structuredClone(s);broken.loot[0].contents=[bad];assert.equal(migrateState(broken),null);}
});
