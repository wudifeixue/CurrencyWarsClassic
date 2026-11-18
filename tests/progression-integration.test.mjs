import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame,act,validateState,migrateState,getEffectiveCharacterCost,getSynergies} from '../dist/engine.js';
import {queueRewards} from '../dist/loot.js';
import {CLASSIC_CHARACTERS} from '../dist/classic-roster.js';
import {onRosterChanged,getProgressionTraitCounts,getProgressionBattleModifiers} from '../dist/classic-progression.js';
const defs=new Map(CLASSIC_CHARACTERS.map(c=>[c.id,c]));
const unit=(id,uid,zone='front',star=1,items=[])=>({uid,characterId:String(id),zone,star,items,recruitCost:defs.get(String(id)).cost});
const setup=units=>{const s=createGame(421);s.level=10;s.xp=0;s.gold=300;s.units=units;s.loot=[];s.inventory=[];s.shop=[null,null,null,null,null];s.progression.knownUnits=units.map(u=>u.uid);return s;};
const run=(s,a)=>{const r=act(s,a);assert.equal(r.ok,true,r.message);assert.equal(validateState(s),true,`invalid after ${a.type}`);return r;};
const reject=(s,a)=>{const before=structuredClone(s);assert.equal(act(s,a).ok,false);assert.deepEqual(s,before);};
const collect=s=>{for(const o of [...s.loot])run(s,{type:'collect-loot',uid:o.uid});};
const buy=(s,id)=>{s.shop[0]=id;return run(s,{type:'buy',index:0});};
const progression=(s,a)=>run(s,{type:'progression',...a});

test('actual purchases merge LV999 at the paid cost, then four-cost copies merge separately',()=>{
 const s=setup([]);for(let i=0;i<3;i++)buy(s,'1506');const uid=s.units[0].uid;assert.equal(s.gold,291);assert.equal(s.units[0].star,2);
 progression(s,{kind:'gamer-hack',uid,choice:'promote'});assert.equal(s.units[0].star,1);assert.equal(s.units[0].recruitCost,4);assert.equal(getEffectiveCharacterCost(s,'1506'),4);
 for(let i=0;i<2;i++)buy(s,'1506');assert.equal(s.gold,283);assert.equal(s.units.length,1);assert.equal(s.units[0].star,2);assert.equal(s.units[0].recruitCost,4);
 progression(s,{kind:'gamer-hack',uid,choice:'component',id:'firewall'});assert.deepEqual(s.progression.gamer.claimedCosts,[3,4]);assert.equal(getProgressionBattleModifiers({...s,units:s.units.map(u=>({...u,zone:'front'}))}).ruleFlags.enemyVulnerability,.35);
 assert.deepEqual(migrateState(s),s);
});
test('a full bench cannot claim a merge using copies of a different LV999 cost',()=>{
 const others=CLASSIC_CHARACTERS.filter(c=>c.cost===1).slice(0,7).map((c,i)=>unit(c.id,'other'+i,'bench'));
 const s=setup([unit('1506','old-a','bench'),unit('1506','old-b','bench'),...others]);s.progression.gamer.cost=4;s.shop[0]='1506';
 reject(s,{type:'buy',index:0});
 queueRewards(s,[{kind:'character',id:'1506',cost:4}]);reject(s,{type:'collect-loot',uid:s.loot[0].uid});
});
test('projector and character drops preserve an old LV999 recruit form after shop promotion',()=>{
 const s=setup([unit('1506','old','front')]);s.progression.gamer.cost=4;
 queueRewards(s,[{kind:'item',id:'projector'}]);collect(s);run(s,{type:'use-consumable',uid:s.consumables[0].uid,targetUid:'old'});
 assert.equal(s.units.length,2);assert.ok(s.units.every(u=>u.recruitCost===3));
 queueRewards(s,[{kind:'character',id:'1506',cost:3}]);collect(s);assert.equal(s.units.length,1);assert.equal(s.units[0].star,2);assert.equal(s.units[0].recruitCost,3);
});
test('bound hacker parts follow actual merge survivors and are recovered after sale',()=>{
 const s=setup([unit('1506','survivor','front',2),unit('1506','owner','back',2)]);
 progression(s,{kind:'gamer-hack',uid:'owner',choice:'component',id:'firewall'});assert.equal(s.progression.gamer.accessoryOwners.firewall,'owner');assert.equal(getProgressionBattleModifiers(s).units.owner.frontPower,.3);
 queueRewards(s,[{kind:'character',id:'1506',star:2,cost:3}]);collect(s);assert.equal(s.units.length,1);assert.equal(s.units[0].star,3);assert.equal(s.progression.gamer.accessoryOwners.firewall,'survivor');
 assert.equal(getProgressionBattleModifiers(s).units.survivor.frontPower,.3);run(s,{type:'sell',uid:'survivor'});assert.equal(s.progression.gamer.accessoryOwners.firewall,undefined);assert.equal(getProgressionBattleModifiers(s).ruleFlags.enemyVulnerability,undefined);
 buy(s,'1506');const newUid=s.units[0].uid;assert.equal(s.progression.gamer.accessoryOwners.firewall,newUid);run(s,{type:'move',uid:newUid,zone:'front'});assert.equal(getProgressionBattleModifiers(s).ruleFlags.enemyVulnerability,.35);assert.deepEqual(migrateState(s),s);
});
test('Feiguang choice queues its characters once, collection/deployment enables mentors and cost growth',()=>{
 const s=setup([]);s.phase='choice';s.choiceKind='strategy';s.choices=['feiguang-moon','interest-raise','gas-station'].map(id=>({kind:'strategy',id}));
 run(s,{type:'choose',index:0});assert.equal(s.loot.length,2);assert.equal(s.units.length,0);run(s,{type:'lock'});assert.equal(s.loot.length,2);
 collect(s);const jingliu=s.units.find(u=>u.characterId==='1212'),jingyuan=s.units.find(u=>u.characterId==='1204');assert.equal(jingyuan.recruitCost,1);
 run(s,{type:'move',uid:jingliu.uid,zone:'front'});run(s,{type:'move',uid:jingyuan.uid,zone:'back'});assert.equal(getProgressionTraitCounts(s).mentor,2);assert.equal(getEffectiveCharacterCost(s,'1204'),1);
 buy(s,'1212');buy(s,'1212');assert.equal(s.units.find(u=>u.uid===jingliu.uid).star,2);assert.equal(getEffectiveCharacterCost(s,'1204'),3);assert.equal(s.loot.length,0);
 assert.deepEqual(migrateState(s),s);
});
test('accepted Grail refresh goal counts actual paid/free actions and drops only once',()=>{
 const ids=CLASSIC_CHARACTERS.filter(c=>c.traits.includes('grail')).slice(0,2).map(c=>c.id),s=setup(ids.map((id,i)=>unit(id,'grail'+i)));
 run(s,{type:'lock'});const offer=s.progression.grail.offers.find(o=>o.tier===1);assert.ok(offer);offer.options=['return-1','fifth-battle'];
 progression(s,{kind:'grail-select',tier:1,id:'return-1'});s.freeRefreshes=2;
 for(let i=0;i<4;i++)run(s,{type:'refresh'});assert.equal(s.progression.grail.active[0].progress,4);assert.equal(s.gold,296);assert.equal(s.loot.length,1);
 const rewardUid=s.loot[0].uid;assert.equal(s.loot[0].contents[0].amount,4);run(s,{type:'lock'});run(s,{type:'refresh'});assert.equal(s.loot.length,1);collect(s);assert.equal(s.gold,298);reject(s,{type:'collect-loot',uid:rewardUid});assert.deepEqual(migrateState(s),s);
});
test('white-day gear shares three slots, follows its merged owner and is released on sale',()=>{
 const ids=CLASSIC_CHARACTERS.filter(c=>c.traits.includes('day')).slice(0,3).map(c=>c.id);
 const s=setup([unit(ids[0],'survivor','front',1,['blade','garden']),unit(ids[0],'copy','back',1,['chainsaw','joke-engine']),unit(ids[1],'other-one','front'),unit(ids[2],'other-two','front')]);
 run(s,{type:'lock'});progression(s,{kind:'day-equip',id:'day-propeller',uid:'copy'});s.inventory=['hard-armor'];reject(s,{type:'equip',uid:'copy',itemIndex:0});
 progression(s,{kind:'day-unequip',id:'day-propeller'});run(s,{type:'equip',uid:'copy',itemIndex:0});run(s,{type:'unequip',uid:'copy',itemIndex:2});progression(s,{kind:'day-equip',id:'day-propeller',uid:'copy'});
 buy(s,ids[0]);assert.equal(s.progression.day.assignments['day-propeller'],'survivor');assert.equal(s.units.find(u=>u.uid==='survivor').items.length,2);assert.equal(s.inventory.length,3);
 run(s,{type:'sell',uid:'survivor'});assert.equal(s.progression.day.assignments['day-propeller'],undefined);assert.ok(s.progression.day.unlocked.includes('day-propeller'));
 // Two different 昼之半神 left: the 白昼 item is gone until a third is back on the field.
 const gone=act(s,{type:'progression',kind:'day-equip',id:'day-propeller',uid:'other-one'});assert.equal(gone.ok,false);assert.match(gone.message,/人数不足/);
});
test('equipped emblems occupy a slot, unite duplicate character contributions and can be removed',()=>{
 const s=setup([unit('1001','march-a'),unit('1001','march-b','back'),unit('1202','tingyun')]);queueRewards(s,[{kind:'item',id:'trait-night',amount:2}]);collect(s);
 run(s,{type:'equip',uid:'march-a',itemIndex:0});run(s,{type:'equip',uid:'march-b',itemIndex:0});assert.equal(getProgressionTraitCounts(s).night,1);
 run(s,{type:'unequip',uid:'march-a',itemIndex:0});assert.equal(getProgressionTraitCounts(s).night,1);run(s,{type:'equip',uid:'tingyun',itemIndex:0});assert.equal(getProgressionTraitCounts(s).night,2);
 const night=getSynergies(s).find(t=>t.id==='night');assert.equal(night.count,2);assert.equal(night.active,true);assert.ok(night.level>=1);
 run(s,{type:'unequip',uid:'march-b',itemIndex:0});assert.equal(getProgressionTraitCounts(s).night,1);assert.deepEqual(migrateState(s),s);
});
