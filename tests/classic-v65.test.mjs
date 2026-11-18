import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame,act,validateState,getCurrentNode,getEquipment,getShopOdds,getSupplyCostOdds,getBenchCount} from '../dist/engine.js';
import {FLOW_RULES} from '../dist/classic-flow.js';
import {supplyScreen} from '../dist/supply-ui.js';
import {resultScreen} from '../dist/reference-screens.js';
import {CLASSIC_ROSTER,BENCH_CAPACITY} from '../dist/data.js';
import {CLASSIC_ENVIRONMENTS} from '../dist/classic-environments.js';

const run=(s,a)=>{const r=act(s,a);assert.equal(r.ok,true,r.message);assert.equal(validateState(s),true,`${a.type} @ ${s.round}`);return r;};
const reject=(s,a)=>{const before=JSON.stringify(s),r=act(s,a);assert.equal(r.ok,false,a.type);assert.equal(JSON.stringify(s),before);return r;};
function fresh(rank=0,environment='secondhand',seed=123){
  const s=createGame(seed,{mode:'standard',rank});s.environment.choices=[environment,...CLASSIC_ENVIRONMENTS.filter(e=>e.id!==environment).slice(0,2).map(e=>e.id)];
  run(s,{type:'choose-environment',id:environment});
  for(const u of s.units.slice(0,3))run(s,{type:'move',uid:u.uid,zone:'front'});
  return s;
}
const strong=s=>{for(const u of s.units){u.star=3;u.items=['blade','blossom','boots'];}return s;};
// Plays on to a node; supply picks are taken as they come (revision 5 moves on by itself).
function reach(s,label,{stopAtSupply=false}={}){
  for(let i=0;i<120&&getCurrentNode(s).label!==label;i++){
    if(s.phase==='choice')run(s,{type:'choose',index:0});
    else if(s.phase==='supply'){if(stopAtSupply)break;run(s,{type:'choose-supply',index:0});}
    else if(s.phase==='encounter')run(s,{type:'choose-encounter',index:0});
    else if(s.phase==='result')run(s,{type:'next'});
    else if(s.flow.nodeComplete)run(s,{type:'next-node'});
    else {strong(s);run(s,{type:'battle'});}
  }
  assert.equal(getCurrentNode(s).label,label);return s;
}
const cost=id=>CLASSIC_ROSTER.find(c=>c.id===id).cost;

test('new runs use rules revision 5 or later',()=>{
  assert.ok(FLOW_RULES>=5);assert.equal(fresh().flow.rules,FLOW_RULES);
});

test('confirming a supply hands over the character and the item and moves straight on to the next node',()=>{
  const s=reach(fresh(),'1-5');assert.equal(s.phase,'supply');assert.equal(s.flow.supplyOffers.length,5);
  const offer=s.flow.supplyOffers[2],[char,item]=offer.rewards,inventory=s.inventory.length,loot=s.loot.length;
  const copies=s.units.filter(u=>u.characterId===char.id).length;
  const r=run(s,{type:'choose-supply',index:2});
  assert.equal(getCurrentNode(s).label,'1-6');assert.equal(s.phase,'prep');assert.equal(s.flow.nodeComplete,false);
  assert.equal(s.loot.length,loot,'no crystal to collect');
  assert.ok(s.units.filter(u=>u.characterId===char.id).length>copies||s.units.some(u=>u.characterId===char.id&&u.star>1),'character delivered');
  assert.equal(s.inventory.length,inventory+1);assert.equal(s.inventory.at(-1),item.id);
  assert.match(r.message,/已获得/);assert.match(r.message,/1-6/);
});

test('with a full bench the pack is kept whole as a crystal and the run still moves on',()=>{
  const s=reach(fresh(),'1-5');
  const others=CLASSIC_ROSTER.filter(c=>!s.flow.supplyOffers.some(o=>o.rewards[0].id===c.id)&&!s.units.some(u=>u.characterId===c.id));
  const taken=new Set([...s.units.filter(u=>u.zone==='bench').map(u=>u.slot),...(s.chests||[]).map(c=>c.slot)]);
  for(let i=0,slot=0;getBenchCount(s)<BENCH_CAPACITY;i++){while(taken.has(slot))slot++;taken.add(slot);s.units.push({uid:`fill-${i}`,characterId:others[i].id,star:1,zone:'bench',slot,items:[],recruitCost:others[i].cost});}
  assert.equal(validateState(s),true);
  const offer=structuredClone(s.flow.supplyOffers[0]);run(s,{type:'choose-supply',index:0});
  assert.equal(getCurrentNode(s).label,'1-6');
  const pack=s.loot.filter(o=>o.source==='补给包');
  assert.deepEqual(pack.flatMap(o=>o.contents.map(c=>c.id)),offer.rewards.map(r=>r.id),'both rewards kept as crystals');
});

test('返回备战界面: the team can be managed while the supply pick waits; the re-deal resets all five',()=>{
  const s=reach(fresh(),'1-5');const bench=s.units.find(u=>u.zone==='bench');
  if(bench)run(s,{type:'sell',uid:bench.uid});
  s.gold+=4;run(s,{type:'exp'});assert.equal(s.phase,'supply');
  reject(s,{type:'battle'});assert.equal(act(s,{type:'battle'}).message,'请先选择补给。');
  const offers=JSON.stringify(s.flow.supplyOffers);run(s,{type:'reroll-supply'});
  assert.notEqual(JSON.stringify(s.flow.supplyOffers),offers);assert.equal(s.flow.supplyOffers.length,5);
  reject(s,{type:'reroll-supply'});
});

test('supply odds by plane: shop odds on the first plane, 3–4 costs on the second, 4–5 costs and advanced equipment on the third',()=>{
  const s=fresh();
  assert.deepEqual(getSupplyCostOdds(s,1),getShopOdds(s));
  assert.deepEqual(getSupplyCostOdds(s,2),[0,0,50,50,0]);assert.deepEqual(getSupplyCostOdds(s,3),[0,0,0,60,40]);
  const second=reach(fresh(),'2-3');assert.equal(second.phase,'supply');
  for(const o of second.flow.supplyOffers){assert.ok([3,4].includes(cost(o.rewards[0].id)));const e=getEquipment(o.rewards[1].id);assert.ok(e.tier===1||e.category==='diamond');}
  const third=reach(fresh(),'3-3');assert.equal(third.phase,'supply');
  for(const o of third.flow.supplyOffers){assert.ok([4,5].includes(cost(o.rewards[0].id)));const e=getEquipment(o.rewards[1].id);assert.ok(e.tier===2&&!e.privileged||e.category==='diamond');}
  assert.equal(new Set(third.flow.supplyOffers.map(o=>o.rewards[0].id)).size,5,'five different characters');
});

test('bosses drop no crystal; clearing the first two gives one basic item (简易武装); revision 4 runs keep the boss crystal',()=>{
  const s=reach(fresh(),'1-9');strong(s);const control=structuredClone(s);control.flow.rules=4;
  const inventory=s.inventory.length;run(s,{type:'battle'});run(control,{type:'battle'});assert.equal(s.lastBattle.won,true);
  assert.equal(s.loot.filter(o=>o.source==='首领晶矿').length,0);assert.ok(control.loot.some(o=>o.source==='首领晶矿'));
  assert.equal(s.inventory.length-inventory,control.inventory.length-inventory+1,'one extra basic item');
  const extra=s.inventory.find((id,i)=>id!==control.inventory[i])??s.inventory.at(-1);assert.equal(getEquipment(extra).tier,1);
  assert.equal(s.lastBattle.baseIncome,5);assert.equal(s.lastBattle.xpGain,10);
  assert.ok(s.lastBattle.rewards.some(r=>r.startsWith('简易武装')));assert.deepEqual(s.lastBattle.drops,[]);
  const html=resultScreen(s);assert.doesNotMatch(html,/掉落晶矿/);assert.match(html,/简易武装/);
  const last=reach(fresh(),'3-7');strong(last);const before=last.inventory.length;run(last,{type:'battle'});assert.equal(last.inventory.length,before,'no item after the final boss');
});

test('the supply screen follows the original layout and client wording',()=>{
  const s=reach(fresh(),'1-5');
  const html=supplyScreen(s,null,{route:'<div class="supply-route"></div>',canReturn:true});
  assert.equal((html.match(/class="supply-pack[ "]/g)||[]).length,5);
  for(const text of ['补给阶段','返回备战界面','角色详情','剩余次数：1','已选择0/1','确认'])assert.ok(html.includes(text),text);
  assert.match(html,/data-action="node-confirm" disabled/);
  for(const o of s.flow.supplyOffers){assert.ok(html.includes(`assets/portraits/${o.rewards[0].id}.webp`));assert.ok(html.includes(getEquipment(o.rewards[1].id).name));}
  const picked=supplyScreen(s,3,{details:true});
  assert.match(picked,/supply-pack is-selected[^>]*data-index="3"/);assert.ok(picked.includes('已选择1/1'));assert.ok(picked.includes('隐藏角色详情'));
  assert.doesNotMatch(picked,/返回备战界面/,'older runs cannot leave the supply screen');
  assert.doesNotMatch(picked,/data-action="node-confirm" disabled/);
  run(s,{type:'reroll-supply'});assert.ok(supplyScreen(s).includes('剩余次数：0'));
});

test('the arena clamps, divider and back floor are one layer that moves with the board, not two background images',async()=>{
  const {readFileSync}=await import('node:fs');
  const css=readFileSync(new URL('../dist/reference.css',import.meta.url),'utf8'),app=readFileSync(new URL('../dist/app.js',import.meta.url),'utf8');
  assert.match(css,/classic-arena-base\.svg/);assert.doesNotMatch(css,/classic-arena-closed\.svg/);
  for(const part of ['arena-back','arena-divider','arena-clamp-left','arena-clamp-right'])assert.ok(app.includes(`class="${part}`)||app.includes(`arena-clamp ${part}`),part);
  assert.match(css,/:not\(\.shop-is-open\) \.arena-clamp-left \{ transform:translate\(14px,-70px\)/);
  assert.match(css,/\.arena-divider, \.classic-scene \.arena-clamp \{[^}]*transition:transform \.32s/);
});
