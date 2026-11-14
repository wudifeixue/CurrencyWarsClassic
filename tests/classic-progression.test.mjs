import test from 'node:test';
import assert from 'node:assert/strict';
import {CLASSIC_CHARACTERS} from '../dist/classic-roster.js';
import {initProgression,migrateProgression,validateProgression,onNodeEntry,onBattleResolved,onRosterChanged,onManagementAction,refreshProgression,applyProgressionAction,getProgressionBattleModifiers,getProgressionPanels,getProgressionTraitCounts,getProgressionUnitTraits,getProgressionNavigatorPartner,getEffectiveCharacterCost,getProgressionShopModifiers,REVELATION_CARDS,GRAIL_TRIALS} from '../dist/classic-progression.js';
const unit=(id,uid='u'+id,star=1,zone='front',items=[])=>({uid,characterId:String(id),star,zone,items});
const state=units=>({seed:1977,rng:1977,round:1,phase:'prep',gold:50,goldSpentThisNode:0,level:5,units,strategies:[],progression:initProgression()});
const withTrait=(id,n,star=1)=>CLASSIC_CHARACTERS.filter(c=>c.traits.includes(id)).slice(0,n).map((c,i)=>unit(c.id,'u'+i,star,i<4?'front':'back'));
const resolved=(perfect=true)=>({won:true,metrics:{perfectVictory:perfect}});
const battle=(s,perfect=true)=>onBattleResolved(s,resolved(perfect));
const next=s=>{s.round++;return onNodeEntry(s);};

test('new and migrated progression is valid; old completed round is never paid twice',()=>{
 const s=state(withTrait('night',2));assert.equal(validateProgression(s),true);
 delete s.progression;s.phase='result';migrateProgression(s);
 assert.equal(validateProgression(s),true);assert.deepEqual(battle(s),[]);assert.equal(s.progression.night.essence,0);
});
test('scholar DNA reflects distinct characters and stars, rewards only crossed milestones',()=>{
 const s=state(withTrait('scholar',4));const first=battle(s);
 assert.equal(s.progression.scholar.dna,12);assert.equal(s.progression.scholar.level,2);assert.equal(first.filter(r=>r.kind==='gold').reduce((n,r)=>n+r.amount,0),3);
 assert.deepEqual(battle(s),[]);next(s);const second=battle(s);
 assert.equal(s.progression.scholar.dna,24);assert.equal(second.filter(r=>r.kind==='character').length,4);
 assert.equal(validateProgression(s),true);
 const buffs=getProgressionBattleModifiers(s);assert.ok(Math.abs(buffs.ruleFlags.scholar.frontHealRatio-.3)<1e-10);assert.ok(Math.abs(buffs.units.u0.damageReduction-.21)<1e-10);
});
test('scholar counts duplicate unit at its highest star once',()=>{
 const s=state(withTrait('scholar',2));s.units.push({...s.units[0],uid:'copy',star:3});battle(s);assert.equal(s.progression.scholar.dna,10);
});
test('wolf experience uses equipped basics and advanced weights and persists if benched',()=>{
 const s=state(withTrait('wolfpack',3));s.units[0].items=['knife','blade'];s.units[1].items=['battery'];battle(s);
 assert.equal(s.progression.wolfpack.xp,8);next(s);battle(s);assert.equal(s.progression.wolfpack.level,2);
 const modifiers=getProgressionBattleModifiers(s);assert.equal(modifiers.ruleFlags.wolfpack.speed,400);assert.equal(modifiers.team.crit,.2);assert.equal(modifiers.units.u0.frontPower,.075);
 s.units.forEach(u=>u.zone='bench');next(s);battle(s);assert.equal(s.progression.wolfpack.xp,16);assert.equal(getProgressionBattleModifiers(s).summons.length,0);
});
test('night perfect victories double essence; no retroactive rewards on activation cycling',()=>{
 const s=state(withTrait('night',2));battle(s);assert.equal(s.progression.night.essence,4);next(s);battle(s,false);assert.equal(s.progression.night.essence,6);next(s);const rewards=battle(s);assert.equal(s.progression.night.essence,10);assert.equal(rewards[0].amount,3);
 onRosterChanged(s);onRosterChanged(s);assert.equal(s.progression.night.essence,10);assert.deepEqual(battle(s),[]);
});
test('day gear unlocks, assignment respects member and three-slot capacity',()=>{
 const s=state(withTrait('day',4));onRosterChanged(s);assert.deepEqual(s.progression.day.unlocked,['day-propeller','day-hybrid']);
 assert.equal(applyProgressionAction(s,{kind:'day-equip',id:'day-propeller',uid:'u0'}).ok,true);
 s.units[0].items=['knife','star'];const before=JSON.stringify(s);assert.equal(applyProgressionAction(s,{kind:'day-equip',id:'day-hybrid',uid:'u0'}).ok,false);assert.equal(JSON.stringify(s),before);
 assert.equal(getProgressionBattleModifiers(s).ruleFlags.day.assignments['day-propeller'],'u0');
});
test('assigned day gear exposes a real unequip action and can be reassigned',()=>{
 const s=state(withTrait('day',4));onRosterChanged(s);applyProgressionAction(s,{kind:'day-equip',id:'day-propeller',uid:'u0'});
 const action=getProgressionPanels(s).find(p=>p.id==='day').choices.find(c=>c.action.kind==='day-unequip').action;
 assert.equal(applyProgressionAction(s,action).ok,true);assert.equal(s.progression.day.assignments['day-propeller'],undefined);
 assert.deepEqual(s.progression.day.unlocked,['day-propeller','day-hybrid']);
 const snapshot=JSON.stringify(s);assert.equal(applyProgressionAction(s,action).ok,false);assert.equal(JSON.stringify(s),snapshot);
 assert.equal(applyProgressionAction(s,{kind:'day-equip',id:'day-propeller',uid:'u1'}).ok,true);assert.equal(s.progression.day.assignments['day-propeller'],'u1');assert.equal(validateProgression(s),true);
});
test('ordinary and privileged dice reserve all three slots against day assignments',()=>{
 for(const item of ['comet','privileged:comet']){const s=state(withTrait('day',3));onRosterChanged(s);s.units[0].items=[item];const snapshot=JSON.stringify(s);
 assert.equal(applyProgressionAction(s,{kind:'day-equip',id:'day-propeller',uid:'u0'}).ok,false);assert.equal(JSON.stringify(s),snapshot);}
});
test('seer earns one choice every two actual battles; paid choice cannot replay',()=>{
 const s=state([unit('1307')]);battle(s);assert.equal(s.progression.seer.charges,0);next(s);battle(s);assert.equal(s.progression.seer.charges,1);
 assert.equal(applyProgressionAction(s,{kind:'seer-select',id:'agility'}).ok,true);assert.equal(s.gold,45);assert.equal(getProgressionBattleModifiers(s).team.speedPct,.16);
 const snapshot=JSON.stringify(s);assert.equal(applyProgressionAction(s,{kind:'seer-select',id:'agility'}).ok,false);assert.equal(JSON.stringify(s),snapshot);
 s.progression.seer.cards.push('fortune');assert.equal(getProgressionShopModifiers(s).fiveCostOddsBonus,.03);
});
test('three-star Black Swan grants all cards and privilege boxes once',()=>{
 const s=state([unit('1307','swan',3)]);assert.equal(onRosterChanged(s)[0].quality,'privileged');assert.equal(s.progression.seer.cards.length,REVELATION_CARDS.length);assert.deepEqual(onRosterChanged(s),[]);
});
test('Cyrene unlocks a real priced poem counter after battle; one purchase per node',()=>{
 const s=state([unit('1415')]);battle(s);assert.equal(s.progression.beloved.offers.length,3);
 s.progression.beloved.offers=['strength','wealth','life'];const reply=applyProgressionAction(s,{kind:'poem-buy',id:'strength'});assert.equal(reply.ok,true);assert.equal(getProgressionBattleModifiers(s).team.damageAmp,.03);
 const snapshot=JSON.stringify(s);assert.equal(applyProgressionAction(s,{kind:'poem-buy',id:'wealth'}).ok,false);assert.equal(JSON.stringify(s),snapshot);
 next(s);s.progression.beloved.offers=['life'];const purchased=applyProgressionAction(s,{kind:'poem-buy',id:'life'});assert.equal(purchased.ok,true);assert.deepEqual(purchased.rewards,[{kind:'hp',amount:10,maxHp:10}]);assert.equal(s.gold,45);
});
test('LV999 hacks only first two-star of each cost and preserves identity/equipment',()=>{
 const s=state([unit('1506','wolf',2,'front',['knife'])]);const result=applyProgressionAction(s,{kind:'gamer-hack',uid:'wolf',choice:'promote'});assert.equal(result.ok,true);assert.equal(s.units[0].star,1);assert.equal(s.units[0].recruitCost,4);assert.equal(getEffectiveCharacterCost(s,'1506'),4);assert.deepEqual(s.units[0].items,['knife']);
 s.units[0].star=2;const component=applyProgressionAction(s,{kind:'gamer-hack',uid:'wolf',choice:'component',id:'firewall'});assert.equal(component.ok,true);assert.equal(getProgressionBattleModifiers(s).ruleFlags.enemyVulnerability,.35);assert.deepEqual(s.units[0].items,['knife']);
 const snapshot=JSON.stringify(s);assert.equal(applyProgressionAction(s,{kind:'gamer-hack',uid:'wolf',choice:'promote'}).ok,false);assert.equal(JSON.stringify(s),snapshot);
});
test('LV999 components bind to the selected copy and pause when that copy is benched',()=>{
 const s=state([unit('1506','first',1),unit('1506','chosen',2)]);applyProgressionAction(s,{kind:'gamer-hack',uid:'chosen',choice:'component',id:'hunters-cassette'});
 assert.equal(s.progression.gamer.accessoryOwners['hunters-cassette'],'chosen');let mods=getProgressionBattleModifiers(s);
 assert.equal(mods.units.chosen.frontPower,.4);assert.equal(mods.units.first,undefined);assert.equal(getProgressionTraitCounts(s).hunters,2);
 s.units[1].zone='bench';mods=getProgressionBattleModifiers(s);assert.equal(mods.units.first,undefined);assert.equal(mods.units.chosen,undefined);assert.equal(getProgressionTraitCounts(s).hunters,1);
 s.units.splice(1,1);refreshProgression(s);assert.equal(s.progression.gamer.accessoryOwners['hunters-cassette'],'first');assert.equal(getProgressionTraitCounts(s).hunters,2);
});
test('data copier counts its own deployed owner and retains the owner cost',()=>{
 const s=state([unit('1506','first'),{...unit('1506','owner',2,'bench'),recruitCost:4}]);applyProgressionAction(s,{kind:'gamer-hack',uid:'owner',choice:'component',id:'data-copier'});
 battle(s);assert.equal(s.progression.gamer.copyBattles,0);s.units[1].zone='front';let rewards=[];for(let i=0;i<3;i++){next(s);rewards=battle(s);}
 assert.equal(s.progression.gamer.copyBattles,3);assert.ok(rewards.some(r=>r.source==='data-copier'&&r.cost===4));assert.equal(getProgressionBattleModifiers(s).units.owner.damageAmp,.2);
});
test('legacy component ownership migrates explicitly while malformed owners are rejected',()=>{
 const s=state([unit('1506','wolf')]);s.progression.gamer.accessories=['firewall'];delete s.progression.gamer.accessoryOwners;
 assert.equal(validateProgression(s),true);const snapshot=JSON.stringify(s);getProgressionBattleModifiers(s);assert.equal(JSON.stringify(s),snapshot);
 migrateProgression(s);assert.equal(s.progression.gamer.accessoryOwners.firewall,'wolf');assert.equal(validateProgression(s),true);
 s.progression.gamer.accessoryOwners.fake='wolf';assert.equal(validateProgression(s),false);
});
test('administrator stats bind to the triggering five-cost three-star copy',()=>{
 const s=state([unit('1506','first',1),{...unit('1506','admin',3),recruitCost:5}]);onRosterChanged(s);let mods=getProgressionBattleModifiers(s);
 assert.equal(s.progression.gamer.accessoryOwners.admin,'admin');assert.equal(mods.ruleFlags.gamer.uid,'admin');assert.equal(mods.units.admin.damageReduction,.99);assert.equal(mods.units.first,undefined);
 s.units[1].zone='bench';mods=getProgressionBattleModifiers(s);assert.equal(mods.ruleFlags.gamer.admin,false);assert.equal(mods.units.first,undefined);
});
test('navigator copies real archetype and only existing partner first equipment',()=>{
 const s=state([unit('1510','nav'),unit('1001','march',1,'back',['armor'])]);assert.equal(applyProgressionAction(s,{kind:'navigator-select',uid:'march'}).ok,true);
 assert.ok(getProgressionUnitTraits(s,s.units[0]).includes('shield'));assert.equal(getProgressionTraitCounts(s).shield,2);assert.equal(getProgressionBattleModifiers(s).ruleFlags.navigator.copiedItem,'armor');s.units[1].zone='bench';assert.equal(getProgressionBattleModifiers(s).ruleFlags.navigator,undefined);
});
test('navigator accepts express emblems, inherits all partner archetypes and drops invalid partners',()=>{
 const s=state([unit('1510','nav'),unit('1104','partner',1,'front',['trait-express','trait-dot'])]);assert.equal(applyProgressionAction(s,{kind:'navigator-select',uid:'partner'}).ok,true);
 assert.equal(getProgressionNavigatorPartner(s,s.units[0]).uid,'partner');assert.ok(getProgressionUnitTraits(s,s.units[0]).includes('dot'));assert.ok(getProgressionBattleModifiers(s).ruleFlags.navigator.bonusTraits.includes('dot'));
 s.units[1].items=['trait-dot'];assert.equal(getProgressionNavigatorPartner(s,s.units[0]),null);assert.equal(getProgressionUnitTraits(s,s.units[0]).includes('dot'),false);assert.equal(getProgressionBattleModifiers(s).ruleFlags.navigator,undefined);
 s.units[1]={...unit('1101','partner'),items:['trait-express']};assert.equal(getProgressionNavigatorPartner(s,s.units[0]).uid,'partner');assert.doesNotThrow(()=>getProgressionTraitCounts(s));
});
test('trait count unions extra traits across duplicates without double counting original bond',()=>{
 const s=state([unit('1001','one'),{...unit('1001','two'),extraTraits:['night']}]);const counts=getProgressionTraitCounts(s);assert.equal(counts.shield,1);assert.equal(counts.night,1);
});
test('Grail has two-choice tiers, a real refresh goal, pause when undeployed and one-shot reward',()=>{
 const s=state(withTrait('grail',2));onRosterChanged(s);assert.equal(s.progression.grail.offers[0].options.length,2);
 s.progression.grail.offers[0].options=['return-1','fifth-battle'];assert.equal(applyProgressionAction(s,{kind:'grail-select',tier:1,id:'return-1'}).ok,true);
 for(let i=0;i<3;i++)assert.deepEqual(onManagementAction(s,{type:'refresh'},{goldSpent:2}),[]);
 s.units.forEach(u=>u.zone='bench');onManagementAction(s,{type:'refresh'},{goldSpent:2});assert.equal(s.progression.grail.active[0].progress,3);
 s.units.forEach(u=>u.zone='front');const rewards=onManagementAction(s,{type:'refresh'},{goldSpent:2});assert.equal(rewards[0].amount,4);assert.equal(s.progression.grail.active[0].done,true);assert.deepEqual(onManagementAction(s,{type:'refresh'},{goldSpent:2}),[]);assert.equal(validateProgression(s),true);
});
test('festival selection has different actual benefits; choices and modifier reads are pure',()=>{
 const s=state([unit('1309','robin'),unit('1306','sparkle')]);onRosterChanged(s);assert.equal(applyProgressionAction(s,{kind:'festival-select',uid:'robin'}).ok,true);assert.equal(getProgressionBattleModifiers(s).team.crit,.08);
 assert.equal(applyProgressionAction(s,{kind:'festival-select',uid:'sparkle'}).ok,true);assert.equal(getProgressionBattleModifiers(s).ruleFlags.festival.initialSP,1);
 const snapshot=JSON.stringify(s);getProgressionPanels(s);getProgressionBattleModifiers(s);assert.equal(JSON.stringify(s),snapshot);
});
test('traveler blessing changes only on a new node and does not mutate during previews',()=>{
 const s=state([unit('1501')]);onNodeEntry(s);const snapshot=JSON.stringify(s);onNodeEntry(s);assert.equal(JSON.stringify(s),snapshot);const p=getProgressionBattleModifiers(s);assert.ok(Object.keys(p.team).length);next(s);assert.equal(s.progression.wanderer.node,2);
});
test('Feiguang investments grant mentor members once and moon grows Jing Yuan cost',()=>{
 const s=state([unit('1212','jingliu',1),unit('1204','jingyuan')]);s.strategies=['feiguang-moon'];assert.equal(onRosterChanged(s).length,2);assert.deepEqual(onRosterChanged(s),[]);assert.equal(getEffectiveCharacterCost(s,'1204'),1);s.units[0].star=2;assert.equal(getEffectiveCharacterCost(s,'1204'),3);assert.equal(getProgressionBattleModifiers(s).ruleFlags.mentor.uids.length,2);
 s.strategies.push('feiguang-sword');s.units.push(unit('1209','yanqing'));onRosterChanged(s);assert.equal(getProgressionBattleModifiers(s).ruleFlags.mentor.tier,3);
});
test('current progression corruption is rejected without silent repair',()=>{
 const mutations=[s=>s.progression.scholar.dna=-1,s=>s.progression.wolfpack.level=7,s=>s.progression.gamer.cost=6,s=>s.progression.seer.cards=['invented'],s=>s.progression.grail.active=[{id:'invented',tier:1,progress:0,done:false}],s=>s.progression.day.assignments={'invented':'u1'},s=>s.progression.resolvedBattles=[1,1],s=>s.progression.beloved.buffs={damageAmp:Infinity}];
 for(const mutate of mutations){const s=state([]);mutate(s);const before=JSON.stringify(s);assert.equal(validateProgression(s),false);assert.equal(JSON.stringify(s),before);}
});
