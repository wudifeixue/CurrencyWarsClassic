import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame} from '../dist/engine.js';
import {getBattleStats} from '../dist/combat.js';
import {CLASSIC_ROSTER} from '../dist/data.js';
import {CLASSIC_ENVIRONMENTS,initEnvironment,chooseEnvironment,rerollEnvironments,onEnvironmentEvent,getEnvironmentShopWeight,getEnvironmentShopOdds,getEnvironmentRefreshCost,getEnvironmentStrategyRarity,getEnvironmentRules,validateEnvironment} from '../dist/classic-environments.js';
import {environmentScreen,environmentSummary,environmentDetails} from '../dist/environment-ui.js';
const setup=(id,seed=510)=>{const s=createGame(seed);initEnvironment(s,{enabled:true});s.environment.choices=[id,...CLASSIC_ENVIRONMENTS.filter(e=>e.id!==id).slice(0,2).map(e=>e.id)];return s;};
const choose=id=>{const s=setup(id);assert.equal(chooseEnvironment(s,id).ok,true);return s;};
const has=(out,kind,id)=>out.some(r=>r.kind===kind&&(r.id===id||r.amount===id));
test('environment choices reroll once, never give resources until confirmed, and reject duplicate confirmation',()=>{
 const s=createGame(861),t=createGame(861);initEnvironment(s,{enabled:true});initEnvironment(t,{enabled:true});assert.deepEqual(s.environment,t.environment);
 const first=[...s.environment.choices],beforeGold=s.gold,beforeUnits=s.units.length;
 assert.equal(rerollEnvironments(s).ok,true);assert.equal(s.environment.choices.length,3);assert.ok(s.environment.choices.every(id=>!first.includes(id)));assert.equal(s.gold,beforeGold);assert.equal(s.units.length,beforeUnits);
 assert.equal(rerollEnvironments(s).ok,false);const id=s.environment.choices[0];assert.equal(chooseEnvironment(s,id).ok,true);assert.equal(chooseEnvironment(s,id).ok,false);assert.equal(validateEnvironment(s),true);
});
test('screenshot energy concept provides original kit and only weights matching same-cost characters',()=>{
 const s=setup('concept-energy'),r=chooseEnvironment(s,'concept-energy');assert.equal(r.replaceStarter,true);assert.deepEqual(r.rewards,[{kind:'character',id:'1402'},{kind:'character',id:'1217'},{kind:'item',id:'battery'}]);
 assert.equal(getEnvironmentShopWeight(s,CLASSIC_ROSTER.find(c=>c.id==='1402')),2);assert.equal(getEnvironmentShopWeight(s,CLASSIC_ROSTER.find(c=>c.id==='1013')),1);
});
test('company counts actual earned interest, pays Topaz once, and survives reload',()=>{
 let s=setup('company-contract');const r=chooseEnvironment(s,'company-contract');assert.deepEqual(r.rewards.map(r=>r.id),['1314','1304']);
 assert.deepEqual(onEnvironmentEvent(s,{type:'interest',amount:39}),[]);s=JSON.parse(JSON.stringify(s));assert.equal(validateEnvironment(s),true);
 assert.deepEqual(onEnvironmentEvent(s,{type:'interest',amount:1}),[{kind:'character',id:'1112'}]);assert.deepEqual(onEnvironmentEvent(s,{type:'interest',amount:100}),[]);
});
test('secondhand counts free and paid refreshes while long-positive counts only paid refreshes',()=>{
 const s=choose('secondhand');for(let i=0;i<19;i++)assert.deepEqual(onEnvironmentEvent(s,{type:'refresh',paid:false}),[]);
 const out=onEnvironmentEvent(s,{type:'refresh',paid:true});assert.ok(has(out,'gold',30));assert.ok(has(out,'item','projector'));assert.deepEqual(onEnvironmentEvent(s,{type:'refresh',paid:true}),[]);
 const t=choose('long-positive');for(let i=0;i<60;i++)onEnvironmentEvent(t,{type:'refresh',paid:false});assert.equal(getEnvironmentRefreshCost(t,2),2);
 for(let i=0;i<29;i++)onEnvironmentEvent(t,{type:'refresh',paid:true});assert.deepEqual(onEnvironmentEvent(t,{type:'refresh',paid:true}),[{kind:'gold',amount:20}]);assert.equal(getEnvironmentRefreshCost(t,2),1);assert.equal(getEnvironmentRefreshCost(t,0),0);
});
test('plane grants do not repeat across duplicate node entry or persisted reload',()=>{
 let s=setup('currency-issue');assert.deepEqual(chooseEnvironment(s,'currency-issue').rewards,[{kind:'gold',amount:6}]);assert.deepEqual(onEnvironmentEvent(s,{type:'node',key:'1-1',plane:1}),[]);
 assert.deepEqual(onEnvironmentEvent(s,{type:'node',key:'2-1',plane:2}),[{kind:'gold',amount:8}]);s=JSON.parse(JSON.stringify(s));assert.deepEqual(onEnvironmentEvent(s,{type:'node',key:'2-1',plane:2}),[]);assert.deepEqual(onEnvironmentEvent(s,{type:'node',key:'2-2',plane:2}),[]);assert.deepEqual(onEnvironmentEvent(s,{type:'node',key:'3-1',plane:3}),[{kind:'gold',amount:12}]);
 const t=choose('privileged-class');assert.equal(onEnvironmentEvent(t,{type:'node',key:'2-1',plane:2})[0].quality,'privileged');assert.deepEqual(onEnvironmentEvent(t,{type:'node',key:'2-2',plane:2}),[]);
});
test('deepwell rewards first five-win streak once; failures and reload do not reset earned flags',()=>{
 const s=choose('deepwell');s.streak=4;assert.deepEqual(onEnvironmentEvent(s,{type:'battle',key:'1-5'}),[]);s.streak=5;assert.deepEqual(onEnvironmentEvent(s,{type:'battle',key:'1-6'}),[{kind:'item',id:'wealth-gem'}]);assert.deepEqual(onEnvironmentEvent(s,{type:'battle',key:'1-6'}),[]);s.streak=6;assert.deepEqual(onEnvironmentEvent(s,{type:'battle',key:'1-7'}),[]);
});
test('experience triggers next three nodes after level8, not three times on same node',()=>{
 const s=choose('success-experience');assert.deepEqual(onEnvironmentEvent(s,{type:'node',key:'1'}),[]);s.level=8;s.xp=0;
 for(let i=2;i<5;i++){assert.deepEqual(onEnvironmentEvent(s,{type:'node',key:String(i)}),[{kind:'xp',amount:12}]);assert.deepEqual(onEnvironmentEvent(s,{type:'node',key:String(i)}),[]);}
 assert.deepEqual(onEnvironmentEvent(s,{type:'node',key:'5'}),[]);
});
test('rarity environments and extra-node rules remain explicit and deterministic',()=>{
 assert.equal(getEnvironmentStrategyRarity(choose('first-prismatic'),1),'棱彩');assert.equal(getEnvironmentStrategyRarity(choose('first-prismatic'),2),null);assert.equal(getEnvironmentStrategyRarity(choose('last-prismatic'),3),'棱彩');
 assert.deepEqual([0,1,2].map(i=>getEnvironmentStrategyRarity(choose('silver-gold-prismatic'),2,i)),['白银','黄金','棱彩']);assert.equal(getEnvironmentRules(choose('silver-gold-prismatic')).strategyRerollsBonus,2);
 assert.deepEqual(getEnvironmentRules(choose('joint-decision')).extraStrategyLabels,['2-6']);assert.deepEqual(getEnvironmentRules(choose('strategy-master')).extraStrategyLabels,['3-5']);assert.equal(getEnvironmentRules(choose('accident-insurance')).extraBossSupply,true);assert.equal(getEnvironmentRules(choose('excess-budget')).supplyEquipmentCount,2);
});
test('rotation doubles one fee weight and normalizes visible and actual probabilities',()=>{
 const s=choose('rotation');s.environment.rotationCost=2;assert.deepEqual(getEnvironmentShopOdds(s,[50,30,20,0,0]),[50/130*100,60/130*100,20/130*100,0,0]);
});
test('evolution grows deployed units per node and changes actual battle stats; bench does not grow',()=>{
 const s=choose('evolution-algorithm'),front=s.units[0];s.units[1].zone='bench';const before=getBattleStats(s,front);onEnvironmentEvent(s,{type:'node',key:'2'});onEnvironmentEvent(s,{type:'node',key:'2'});
 assert.equal(front.environmentStacks,1);assert.equal(s.units[1].environmentStacks,undefined);const after=getBattleStats(s,front);assert.ok(after.attack>before.attack);assert.ok(after.damageReduction>before.damageReduction);
});
test('talent reserve provides three distinct3cost characters and original2/3star combat bonuses',()=>{
 const s=setup('talent-reserve'),r=chooseEnvironment(s,'talent-reserve');assert.equal(r.replaceStarter,true);assert.equal(r.rewards.length,3);assert.equal(new Set(r.rewards.map(r=>r.id)).size,3);assert.ok(r.rewards.every(r=>CLASSIC_ROSTER.find(c=>c.id===r.id).cost===3));
 const u={uid:'test',characterId:'1405',star:2,zone:'front',items:[],recruitCost:3};s.units=[u];const normal=structuredClone(s);normal.environment.id=null;const a=getBattleStats(s,u),b=getBattleStats(normal,u);assert.ok(a.speed>b.speed);assert.equal(a.damageAmp-b.damageAmp,.22);u.star=3;assert.equal(getBattleStats(s,u).damageAmp-getBattleStats(normal,u).damageAmp,.66);
});
test('contract rewards follow real grail, crystal and gamer records without repeat grants',()=>{
 const g=choose('grail-contract');g.progression.grail.completed=['a','b'];assert.deepEqual(onEnvironmentEvent(g,{type:'roster'}),[{kind:'character',id:'1015'}]);assert.deepEqual(onEnvironmentEvent(g,{type:'roster'}),[]);
 const s=choose('sp-contract');for(let i=0;i<19;i++)assert.deepEqual(onEnvironmentEvent(s,{type:'collect-loot'}),[]);assert.equal(onEnvironmentEvent(s,{type:'collect-loot'}).length,2);assert.deepEqual(onEnvironmentEvent(s,{type:'roster'}),[]);
 const e=choose('elation-contract');e.progression.gamer.claimedCosts=[3];assert.equal(onEnvironmentEvent(e,{type:'roster'}).length,1);assert.deepEqual(onEnvironmentEvent(e,{type:'roster'}),[]);
});
test('quantum upgrades pay once per actual star gain, never merely because another action happened',()=>{
 const s=choose('quantum-contract'),u={uid:'sparkle',characterId:'1306',star:1,items:[],zone:'bench'};s.units.push(u);assert.deepEqual(onEnvironmentEvent(s,{type:'roster'}),[]);u.star=2;assert.equal(onEnvironmentEvent(s,{type:'roster'}).length,1);assert.deepEqual(onEnvironmentEvent(s,{type:'roster'}),[]);
});
test('environment validation rejects malformed persisted progress and UI exposes choice/refresh/confirmation',()=>{
 const s=setup('concept-energy');assert.match(environmentScreen(s,0),/data-action="environment-confirm"/);assert.match(environmentScreen(s,0),/能量概念股/);chooseEnvironment(s,'concept-energy');assert.match(environmentSummary(s),/environment-info/);assert.match(environmentDetails(s),/阿格莱雅/);
 s.environment.counters.refreshes=-1;assert.equal(validateEnvironment(s),false);
});
