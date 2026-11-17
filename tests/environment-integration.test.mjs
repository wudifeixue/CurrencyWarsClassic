import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createGame,act,migrateState,validateState} from '../dist/engine.js';
import {getCurrentNode} from '../dist/classic-flow.js';
import {STRATEGIES} from '../dist/data.js';
import {CLASSIC_ENVIRONMENTS,getAvailableEnvironments} from '../dist/classic-environments.js';
const run=(s,a)=>{const r=act(s,a);assert.equal(r.ok,true,JSON.stringify(a)+': '+r.message);return r;};
const fresh=id=>{const s=createGame(73,{mode:'standard'});s.environment.choices=[id,...CLASSIC_ENVIRONMENTS.filter(e=>e.id!==id).slice(0,2).map(e=>e.id)];run(s,{type:'choose-environment',id});return s;};
// An isolated node-completion fixture exercises the real engine transition hooks.
const nextNode=s=>{s.phase='prep';s.choices=[];s.choiceKind=null;s.flow.pendingNodeKind=null;s.flow.nodeComplete=true;run(s,{type:'next-node'});};
const chooseStrategy=(s,id)=>{s.phase='choice';s.choiceKind='strategy';s.choices=[{kind:'strategy',id},...STRATEGIES.filter(x=>x.id!==id&&!x.legacy&&!s.strategies.includes(x.id)).slice(0,2).map(x=>({kind:'strategy',id:x.id}))];run(s,{type:'choose',index:0});};
test('engine environment confirmation keeps real reward orbs, cancel-free reroll and compatible saves',()=>{
 const s=fresh('concept-energy');assert.equal(s.units.length,4);assert.ok(s.units.every(u=>u.zone==='bench'));assert.ok(['1402','1217'].every(id=>s.units.some(u=>u.characterId===id)));
 assert.deepEqual(s.inventory,['battery'],'the concept environment supplies the opening equipment');assert.equal(s.loot.length,1,'one more basic piece waits in a crystal');assert.ok(s.environment.seenNodes.includes('1'));
 assert.equal(validateState(s),true);assert.deepEqual(migrateState(s),s);
 const r=act(s,{type:'choose-environment',id:'concept-energy'});assert.equal(r.ok,false);
});
test('node event cannot be shadowed by node.type; plane2 currency and privilege rewards actually enqueue',()=>{
 for(const id of ['currency-issue','privileged-class']){
  const s=fresh(id);while(getCurrentNode(s).plane<2)nextNode(s);
  assert.equal(s.environment.seenNodes.length,s.round);
  if(id==='currency-issue')assert.equal(s.loot.filter(o=>o.source==='投资环境').flatMap(o=>o.contents).filter(r=>r.kind==='gold'&&r.amount===8).length,1);
  else assert.equal(s.loot.filter(o=>o.source==='投资环境').flatMap(o=>o.contents).filter(r=>r.kind==='chest'&&r.quality==='privileged').length,1);
  const count=s.loot.length;nextNode(s);assert.equal(s.loot.length,count);assert.deepEqual(migrateState(s),s);
 }
});
test('actual refresh and crystal pickup update environment counters and issue only earned rewards',()=>{
 const s=fresh('secondhand');s.freeRefreshes=20;for(let i=0;i<20;i++)run(s,{type:'refresh'});assert.equal(s.environment.counters.refreshes,20);assert.equal(s.environment.counters.paidRefreshes,0);
 const rewards=s.loot.filter(o=>o.source==='投资环境').flatMap(o=>o.contents);assert.ok(rewards.some(r=>r.kind==='gold'&&r.amount===30));assert.ok(rewards.some(r=>r.kind==='item'&&r.id==='projector'));assert.deepEqual(migrateState(s),s);
});
test('every rarity-locked standard node offers three correct candidates through the entire route',()=>{
 for(const id of ['rainbow','silver-age','gold-age','silver-gold-prismatic']){
  const s=fresh(id);let selected=0;
  while(s.round<23){
   if(s.phase==='choice'){
    const rarities=s.choices.map(c=>STRATEGIES.find(x=>x.id===c.id).rarity);
    assert.equal(rarities.length,3);assert.deepEqual(rarities,id==='silver-gold-prismatic'?['白银','黄金','棱彩']:Array(3).fill(id==='rainbow'?'棱彩':id==='gold-age'?'黄金':'白银'));
    run(s,{type:'choose',index:0});selected++;
   }
   nextNode(s);
  }
  assert.equal(selected,3,id);
 }
});
test('new prismatic kits pay their exact character, wearable emblem and gear through loot',()=>{
 const kits=STRATEGIES.filter(s=>s.id.startsWith('emblem-kit-'));assert.equal(kits.length,20);
 for(const strategy of kits){
  const s=fresh('gunpowder');const before=s.loot.length;chooseStrategy(s,strategy.id);
  assert.equal(s.loot.length-before,3,strategy.id);assert.deepEqual(s.loot.filter(o=>o.source==='投资策略').flatMap(o=>o.contents),strategy.effect.rewards,strategy.id);assert.equal(validateState(s),true,strategy.id);
 }
});
test('armaments chain gives one initial chest and exactly five subsequent node chests',()=>{
 const s=fresh('gunpowder');chooseStrategy(s,'armaments-chain');const count=()=>s.loot.filter(o=>o.source==='投资策略').flatMap(o=>o.contents).filter(r=>r.kind==='chest').length;
 assert.equal(count(),1);for(let i=0;i<7;i++)nextNode(s);assert.equal(count(),6);assert.equal(s.strategyState['armaments-chain'].nodes,7);
});
test('overclock does not advertise standard-only unreachable environment conditions',()=>{
 const s=createGame(12,{mode:'overclock'}),blocked=['company-contract','joint-decision','strategy-master','war-frontier'];assert.equal(getAvailableEnvironments(s).length,61);assert.ok(s.environment.choices.every(id=>!blocked.includes(id)));
});
test('all environment and strategy artwork resolves locally',()=>{
 for(const e of CLASSIC_ENVIRONMENTS)assert.equal(fs.readFileSync(new URL('../dist/'+e.image,import.meta.url)).subarray(0,8).toString('hex'),'89504e470d0a1a0a',e.id);
 for(const s of STRATEGIES.filter(x=>!x.legacy))assert.ok(fs.existsSync(new URL('../dist/assets/strategies/classic-'+s.id+'.png',import.meta.url)),s.id);
});
