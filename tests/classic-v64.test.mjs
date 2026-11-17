import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {createGame,act,validateState,migrateState,getCurrentNode,getRunNodes,getLevelXp,getBenchCount,getEquipment,getRewardNodeLayout} from '../dist/engine.js';
import {getDefeatPenaltyParts,getNodeCountdown,getMinProgress,RANKS,validateFlow} from '../dist/classic-flow.js';
import {simulateCombat} from '../dist/combat.js';
import {queueRewards,FORGE_CHOICES} from '../dist/loot.js';
import {itemDetailCard,craftOptions,consumableArt} from '../dist/loot-ui.js';
import {getEquipmentArtPath,CLASSIC_ROSTER,BENCH_CAPACITY} from '../dist/data.js';
import {CLASSIC_ENVIRONMENTS} from '../dist/classic-environments.js';

const run=(s,a)=>{const r=act(s,a);assert.equal(r.ok,true,r.message);assert.equal(validateState(s),true,`${a.type} @ ${s.round}`);return r;};
const reject=(s,a)=>{const before=JSON.stringify(s),r=act(s,a);assert.equal(r.ok,false,a.type);assert.equal(JSON.stringify(s),before);return r;};
function fresh(rank=0,environment='secondhand',mode='standard',seed=123){
  const s=createGame(seed,{mode,rank});s.environment.choices=[environment,...CLASSIC_ENVIRONMENTS.filter(e=>e.id!==environment).slice(0,2).map(e=>e.id)];
  run(s,{type:'choose-environment',id:environment});return s;
}
const cost=id=>CLASSIC_ROSTER.find(c=>c.id===id).cost;

test('ranks follow the old client notes: encounters from A2, 80 HP and the higher EXP table from A5, plain wrench from A6',()=>{
  assert.deepEqual(RANKS.map(r=>`${r.abbr}${r.name}`),['A0黑铁','A1青铜','A2翠钢','A3钴银','A4冰钛','A5紫金','A6投资大师','A7资本帝王','A8财富造物主']);
  const a0=createGame(5,{mode:'standard',rank:0}),a2=createGame(5,{mode:'standard',rank:2});
  assert.equal(getRunNodes(a0).filter(n=>n.type==='encounter').length,0);
  assert.deepEqual(getRunNodes(a0).filter((n,i)=>getRunNodes(a2)[i].type==='encounter').map(n=>`${n.label}:${n.type}`),['1-7:battle','2-5:battle','3-5:battle']);
  assert.deepEqual(getRunNodes(createGame(5,{mode:'overclock',rank:1})).filter(n=>['1-4','2-3','3-3'].includes(n.label)).map(n=>n.type),['battle','battle','battle']);
  assert.equal(createGame(5,{mode:'standard',rank:4}).hp,100);assert.equal(createGame(5,{mode:'standard',rank:5}).hp,80);
  const high=fresh(5),base=fresh(4);high.level=base.level=5;high.xp=base.xp=0;
  assert.equal(getLevelXp(high),20);assert.equal(getLevelXp(base),16);
  high.level=9;assert.equal(getLevelXp(high),84);
  assert.equal(fresh(5).consumables.find(c=>c.id.includes('wrench')).id,'precision-wrench');
  assert.equal(fresh(6).consumables.find(c=>c.id.includes('wrench')).id,'wrench');
  const bad=structuredClone(a0);bad.flow.rank=9;assert.equal(validateFlow(bad),false);
});

test('encounters have a 25% minimum progress; A3 raises both surcharges; revision 3 saves keep the old boss-only rule',()=>{
  const enc=plane=>({type:'encounter',plane}),boss=plane=>({type:'boss',boss:true,plane});
  assert.equal(getMinProgress(enc(1)),25);assert.equal(getMinProgress(boss(1)),33);assert.equal(getMinProgress({type:'battle',plane:1}),null);
  assert.deepEqual([1,2,3].map(p=>getDefeatPenaltyParts(enc(p),20,{revision4:true}).threshold),[3,5,7]);
  assert.deepEqual([1,2,3].map(p=>getDefeatPenaltyParts(enc(p),20,{rank:3,revision4:true}).threshold),[15,25,35]);
  assert.deepEqual([1,2,3].map(p=>getDefeatPenaltyParts(boss(p),20,{rank:3,revision4:true}).threshold),[20,30,40]);
  assert.equal(getDefeatPenaltyParts(enc(1),25,{revision4:true}).threshold,0);
  assert.equal(getDefeatPenaltyParts(enc(1),10).threshold,0,'revision 3 had no encounter threshold');
  assert.deepEqual([getNodeCountdown({type:'battle',plane:1}),getNodeCountdown({type:'encounter',plane:3}),getNodeCountdown(boss(1)),getNodeCountdown(boss(2)),getNodeCountdown({type:'reward',plane:1})],[18,12,20,16,99]);
});

test('Starting Supplies: four characters costing 1/1/2/2 or 1/1/1/3; a concept environment keeps the two 1-costs',()=>{
  const seen=new Set();
  for(let seed=1;seed<=24;seed++){
    const s=fresh(0,'secondhand','standard',seed),costs=s.units.map(u=>cost(u.characterId)).sort();
    assert.equal(s.units.length,4);assert.equal(costs.reduce((a,b)=>a+b,0),6,`seed ${seed}: ${costs}`);seen.add(costs.join(''));
  }
  assert.deepEqual([...seen].sort(),['1113','1122']);
  const concept=CLASSIC_ENVIRONMENTS.find(e=>e.id.startsWith('concept-'));
  const s=fresh(0,concept.id),environmentIds=concept.characters.map(String);
  assert.equal(s.units.length,4);assert.equal(s.units.filter(u=>environmentIds.includes(u.characterId)).length,2);
  for(const u of s.units.filter(u=>!environmentIds.includes(u.characterId)))assert.equal(cost(u.characterId),1);
});

test('countdown battles never knock anyone down; fatal blows shorten the countdown instead',()=>{
  const state={units:[{uid:'a',characterId:'1001',zone:'front',items:[],star:1}],strategies:[],round:4,seed:3,strategyState:{}};
  const brute={id:'brute',name:'重装',hp:5e6,maxHp:5e6,attack:4000,speed:140,weaknesses:[],toughness:0,maxToughness:0};
  const combat=simulateCombat(state,{enemyLineup:[brute],countdown:{turns:12,reviveLoss:.25}});
  assert.equal(combat.reason,'timeout');assert.equal(combat.countdown,12);assert.ok(combat.revives>0);
  assert.ok(combat.final.filter(u=>u.side==='ally').every(u=>u.hp>0),'allies are restored, not knocked out');
  assert.ok(combat.events.some(e=>/战斗倒计时减少/.test(e.text)));assert.match(combat.events.at(-1).text,/倒计时结束/);
  const steeper=simulateCombat(state,{enemyLineup:[brute],countdown:{turns:12,reviveLoss:.5}});
  assert.ok(steeper.turns<combat.turns,'a larger revive loss ends the fight sooner');
  const old=simulateCombat(state,{enemyLineup:[brute],maxActions:100});assert.equal(old.countdown,undefined);assert.equal(old.reason==='elimination'||old.reason==='timeout',true);
});

test('encounter rewards: paid at A2–A3 whatever the result, from A4 only past the 25% minimum',()=>{
  const s=fresh(4);
  for(const u of s.units){u.star=3;u.items=['blade','blossom','boots'];}
  for(let i=0;i<40&&getCurrentNode(s).label!=='1-7';i++){
    if(s.phase==='choice')run(s,{type:'choose',index:0});else if(s.phase==='supply')run(s,{type:'choose-supply',index:0});
    else if(s.phase==='result')run(s,{type:'next'});
    else if(s.phase==='prep'){if(!s.units.some(u=>u.zone==='front'))run(s,{type:'move',uid:s.units[0].uid,zone:'front'});if(getCurrentNode(s).combat)run(s,{type:'battle'});else run(s,{type:'next-node'});}
  }
  assert.equal(s.phase,'encounter');run(s,{type:'choose-encounter',index:2});
  // A lone 1★ unit cannot reach a quarter of the elite's health.
  const keep=s.units.find(u=>u.zone==='front');s.units=[{...keep,star:1,items:[],zone:'front',slot:0}];
  const low=structuredClone(s);low.flow.rank=2;
  run(s,{type:'battle'});run(low,{type:'battle'});
  assert.ok(s.lastBattle.progress<25,`progress ${s.lastBattle.progress}`);
  assert.equal(s.loot.some(o=>o.source==='遭遇奖励'),false);
  assert.ok(low.loot.some(o=>o.source==='遭遇奖励'));
  assert.equal(s.lastBattle.minProgress,25);assert.ok(s.lastBattle.penalty.threshold>0);
});

test('武装箱 and 聘用书 occupy bench slots, block a full bench and offer four choices',()=>{
  const s=fresh(0);
  queueRewards(s,[{kind:'chest',quality:'advanced'},{kind:'item',id:'hire-3'}]);
  for(const orb of s.loot.filter(o=>o.contents.some(r=>r.kind==='chest'||r.id==='hire-3')))run(s,{type:'collect-loot',uid:orb.uid});
  const [box,letter]=s.chests;
  assert.equal(box.options.length,FORGE_CHOICES);assert.equal(letter.kind,'role');assert.equal(letter.options.length,4);
  assert.ok(letter.options.every(id=>cost(id)===3));
  assert.deepEqual([box.slot,letter.slot],[4,5],'after the four starters');assert.equal(getBenchCount(s),6);
  run(s,{type:'move-chest',uid:box.uid,position:0});assert.equal(s.chests.find(c=>c.uid===box.uid).slot,0);assert.equal(s.units.find(u=>u.zone==='bench'&&u.slot===4)?.zone,'bench');
  run(s,{type:'open-chest',uid:letter.uid});run(s,{type:'choose-chest',index:1});
  assert.equal(s.chests.length,1);assert.ok(s.units.some(u=>u.characterId===letter.options[1]));
  // Fill the bench to nine places: further chests and purchases are refused, and the crystal stays.
  for(let n=0;n<BENCH_CAPACITY;n++)if(!s.units.some(u=>u.zone==='bench'&&u.slot===n)&&!s.chests.some(c=>c.slot===n))s.units.push({uid:`x${s.nextUid++}`,characterId:'1001',star:1,zone:'bench',items:[],slot:n});
  assert.equal(getBenchCount(s),BENCH_CAPACITY);assert.equal(validateState(s),true);
  s.gold=50;assert.match(reject(s,{type:'buy',index:s.shop.findIndex(id=>id&&id!=='1001')}).message,/备战席已满/);
  queueRewards(s,[{kind:'chest',quality:'basic'}]);const orb=s.loot.at(-1);
  const refused=reject(s,{type:'collect-loot',uid:orb.uid});assert.match(refused.message,/备战席已满/);
});

test('chests from older saves take free bench slots, or go back on the board when the bench is full',()=>{
  const s=fresh(0);queueRewards(s,[{kind:'chest',quality:'basic'}]);run(s,{type:'collect-loot',uid:s.loot.at(-1).uid});
  const old=structuredClone(s);delete old.chests[0].slot;old.chests[0].options=old.chests[0].options.slice(0,3);
  const migrated=migrateState(old);assert.ok(migrated);assert.equal(migrated.chests[0].slot,4);
  const full=structuredClone(old);for(let n=4;n<9;n++)full.units.push({uid:`f${n}`,characterId:'1001',star:1,zone:'bench',items:[],slot:n});
  const moved=migrateState(full);assert.ok(moved);assert.equal(moved.chests.length,0);
  assert.ok(moved.loot.some(o=>o.contents.some(r=>r.kind==='chest'&&r.chest.uid===old.chests[0].uid)));
  const clash=structuredClone(s);clash.chests[0].slot=clash.units.find(u=>u.zone==='bench').slot;assert.equal(validateState(clash),false);
});

test('the item card lists what an item combines into, and owned partners combine from it or by dragging',()=>{
  const s=fresh(0);s.inventory=['knife','star','knife','red-gem'];
  const options=craftOptions(s.inventory,0);
  assert.ok(options.length>=8);assert.equal(options.find(o=>o.partner==='star').partnerIndex,1);
  assert.equal(options.find(o=>o.partner==='knife').partnerIndex,2,'a second copy counts as a partner');
  assert.equal(options.find(o=>o.partner==='skates').partnerIndex,-1);
  const html=itemDetailCard(s,0);
  assert.match(html,/可合成列表/);assert.match(html,/data-action="combine-with" data-index="0" data-partner="1"/);
  assert.equal((html.match(/class="craft-row is-owned"/g)||[]).length,3,'star, the second knife and the red gem');
  run(s,{type:'combine',indexA:0,indexB:1});const crafted=s.inventory.at(-1);assert.equal(getEquipment(crafted).tier,2);
  assert.match(itemDetailCard(s,s.inventory.length-1),/合成路线/);
});

test('返回备战: the team can be managed while a strategy pick waits; only the battle needs the pick',()=>{
  const s=fresh(0);
  for(let i=0;i<20&&s.phase!=='choice';i++){if(s.phase==='result')run(s,{type:'next'});else if(s.phase==='prep'){if(!s.units.some(u=>u.zone==='front'))run(s,{type:'move',uid:s.units[0].uid,zone:'front'});run(s,{type:'battle'});}}
  assert.equal(s.phase,'choice');assert.equal(s.choiceKind,'strategy');
  s.gold+=10;run(s,{type:'refresh'});run(s,{type:'move',uid:s.units.find(u=>u.zone==='bench').uid,zone:'back'});
  assert.match(reject(s,{type:'battle'}).message,/投资策略/);
  run(s,{type:'choose',index:0});assert.equal(s.phase,'prep');
});

test('星徽 and wrenches use the original item icons',()=>{
  const emblems=['luofu','debuff','break','express','grail','night','sp','shield','dot','wanderer','day','elation','heal','blood','wolfpack','festival','aoe','energy','belobog','follow','quantum','scholar'];
  for(const id of emblems){const path=getEquipmentArtPath(`trait-${id}`);assert.equal(path,`assets/equipment/classic-emblem-${id}.png`);assert.ok(existsSync(new URL('../dist/'+path,import.meta.url)),path);}
  for(const id of ['wrench','precision-wrench','smelter']){assert.match(consumableArt(id),new RegExp(`assets/loot/${id}.png`));assert.ok(existsSync(new URL(`../dist/assets/loot/${id}.png`,import.meta.url)));}
});

test('reward nodes drop small crystals as in REC1: 2 white + 2 blue at 1-1, 3 white + 2 blue at 1-2',()=>{
  const nodes=s=>getRunNodes(s).filter(n=>n.type==='reward');
  const std=createGame(1,{mode:'standard',rank:0}),oc=createGame(1,{mode:'overclock',rank:0});
  assert.deepEqual(nodes(std).map(n=>[n.label,getRewardNodeLayout(std,n)]),[['1-1',{white:2,blue:2,gold:0}],['1-2',{white:3,blue:2,gold:0}],['1-8',{white:3,blue:2,gold:1}],['2-6',{white:2,blue:3,gold:1}],['3-6',{white:2,blue:2,gold:2}]]);
  assert.deepEqual(getRewardNodeLayout(oc,nodes(oc)[0]),{white:2,blue:2,gold:0});
  for(let seed=1;seed<=12;seed++){
    const s=fresh(0,'secondhand','standard',seed);s.loot=[];
    for(const u of s.units.slice(0,3))run(s,{type:'move',uid:u.uid,zone:'front'});
    for(const label of ['1-1','1-2']){
      const before=s.loot.length;run(s,{type:'battle'});const orbs=s.loot.slice(before).filter(o=>o.source==='奖励节点晶矿');
      assert.equal(orbs.length,label==='1-1'?4:5);assert.ok(orbs.every(o=>['white','blue'].includes(o.quality)));
      for(const o of orbs)for(const c of o.contents){assert.notEqual(c.kind,'chest');if(c.kind==='gold')assert.ok(c.amount<=2);}
      run(s,{type:'next'});
    }
  }
});
