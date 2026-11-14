import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame,act,getTeamPower,getCharacter,getUnitStats,validateState} from '../dist/engine.js';
import {simulateCombat,getEnemyLineup} from '../dist/combat.js';
import {CHARACTERS,EQUIPMENT} from '../dist/data.js';

const team=(ids,seed=42)=>{const s=createGame(seed);s.level=8;s.units=ids.map((entry,i)=>({uid:`ally-${i}`,characterId:typeof entry==='string'?entry:entry.id,star:typeof entry==='string'?1:entry.star||1,zone:typeof entry==='string'?'front':entry.zone||'front',items:typeof entry==='string'?[]:entry.items||[]}));return s;};
const dummy=(extra={})=>({id:'target',name:'训练守卫',side:'enemy',zone:'front',hp:20000,maxHp:20000,attack:0,speed:90,archetype:'raider',weaknesses:[],toughness:90,maxToughness:90,statuses:[],...extra});
const simulate=(state,extra={})=>simulateCombat(state,{enemyLineup:[dummy()],maxActions:24,...extra});
const actions=r=>r.events.filter(e=>['basic','skill','ultimate','support'].includes(e.kind));

test('seeded tactical combat is deterministic and does not mutate the management save',()=>{
  const s=createGame(21),before=structuredClone(s);
  const a=simulateCombat(s),b=simulateCombat(s);
  assert.deepEqual(a,b);assert.deepEqual(s,before);
  assert.ok(a.events.length>3);assert.ok(a.events.some(e=>e.targets.some(t=>t.damage>0)));
  assert.ok(a.events.some(e=>['skill','basic','support'].includes(e.kind)));
  assert.equal(a.winner,'ally');assert.equal(a.events.at(-1).winner,a.winner);
});

test('similar management estimates retain distinct tactical defense and attack mechanics',()=>{
  const guard=team(['1104']),attacker=team(['1201']);
  assert.ok(Math.abs(getTeamPower(guard)-getTeamPower(attacker))<5);
  const opponents=[dummy({hp:4000,maxHp:4000,attack:130,speed:100,weaknesses:['风','雷']})];
  const defense=simulateCombat(guard,{enemyLineup:opponents}),offense=simulateCombat(attacker,{enemyLineup:opponents});
  assert.ok(defense.stats[0].shielding>0);assert.equal(offense.stats[0].shielding,0);
  assert.ok(defense.events.some(e=>e.skill==='凛冬反攻'));
  assert.ok(offense.events.some(e=>e.text.includes('暗杠')));
});

test('backline characters provide speed-based support without skill points or incoming hits',()=>{
  const s=team([{id:'1002',star:2},{id:'1202',zone:'back',items:['perpetual']}]);
  const r=simulate(s,{maxActions:15});
  const support=r.events.filter(e=>e.actorId==='ally-1'&&e.kind==='ultimate');
  assert.ok(support.length>=1);assert.ok(support.some(e=>e.targets.some(t=>t.id==='ally-0'&&t.energy>0)));
  assert.equal(r.events.some(e=>e.actorId==='ally-1'&&e.kind==='basic'),false);
  assert.equal(r.events.some(e=>e.actorId==='target'&&e.targets.some(t=>t.id==='ally-1'&&t.damage>0)),false);
  const lethal=simulate(s,{enemyLineup:[dummy({attack:10000,speed:1000})]});
  assert.equal(lethal.winner,'enemy');assert.equal(lethal.reason,'elimination');
  assert.equal(lethal.final.find(u=>u.id==='ally-1').hp,lethal.units.find(u=>u.id==='ally-1').maxHp);
});

test('classic March shields from the backline and does not invent a frontline counter',()=>{
  const s=team([{id:'1001',zone:'back'},'1002']);
  const r=simulate(s,{enemyLineup:[dummy({attack:90,speed:100})]});
  assert.ok(r.events.some(e=>e.targets.some(t=>t.shield>0)));
  assert.ok(r.events.some(e=>e.targets.some(t=>t.absorbed>0)));
  assert.equal(r.events.some(e=>e.kind==='followup'&&e.skill==='少女的特权'),false);
  const march=r.stats.find(u=>u.id==='ally-0');assert.ok(march.shielding>0);
});

test('healing restores living frontline HP, stays capped, and never resurrects',()=>{
  const s=team(['1002','1105',{id:'1203',zone:'back'}]);
  const r=simulate(s,{enemyLineup:[dummy({attack:180,speed:130,archetype:'caster'})],maxActions:55});
  assert.ok(r.events.some(e=>e.targets.some(t=>t.heal>0)));
  const dead=new Set();
  for(const e of r.events){for(const target of e.targets)if(target.heal>0)assert.ok(!dead.has(target.id));for(const u of e.snapshot){assert.ok(u.hp>=0&&u.hp<=u.maxHp);if(u.hp===0)dead.add(u.id);}}
});

test('damage over time ticks before the target action, consumes shields, and Kafka detonates it',()=>{
  const s=team(['1108','1005']);
  const r=simulate(s,{enemyLineup:[dummy({shield:12000,speed:100})],maxActions:24});
  const ticks=r.events.filter(e=>e.kind==='dot');
  assert.ok(ticks.length>0);assert.ok(ticks.some(e=>e.targets.some(t=>t.absorbed>0)));
  assert.ok(r.events.some(e=>e.actorId==='ally-1'&&e.text.includes('引爆')));
  assert.ok(r.stats.find(u=>u.id==='ally-0').damage>0);
});

test('elemental weakness enables toughness breaks and delays the target',()=>{
  const s=team(['1002']);
  const weak=simulate(s,{enemyLineup:[dummy({weaknesses:['风'],toughness:40,maxToughness:40})]});
  const resist=simulate(s,{enemyLineup:[dummy({weaknesses:['火'],toughness:40,maxToughness:40})]});
  assert.ok(weak.events.some(e=>e.kind==='break'));
  assert.equal(resist.events.some(e=>e.kind==='break'),false);
  assert.ok(weak.events.some(e=>e.snapshot.find(u=>u.id==='target').statuses.some(s=>s.type==='broken')));
});

test('speed equipment changes action frequency and energy equipment enables earlier ultimates',()=>{
  const slow=team(['1002']),fast=team([{id:'1002',items:['boots']}]);
  const count=r=>actions(r).filter(e=>e.actorId==='ally-0').length;
  assert.ok(count(simulate(fast,{maxActions:30}))>count(simulate(slow,{maxActions:30})));
  const charged=simulate(team([{id:'1002',items:['perpetual']}]),{maxActions:15});
  const plain=simulate(slow,{maxActions:15});
  assert.ok(charged.events.find(e=>e.kind==='ultimate').turn<plain.events.find(e=>e.kind==='ultimate').turn);
  assert.ok(charged.events.some(e=>e.text.includes('永动机')));
});

test('classic healing, shielding and offensive equipment have observable event effects',()=>{
  const heat=simulate(team([{id:'1107',items:['absolute-heat']}]),{enemyLineup:[dummy({attack:120})]});
  assert.ok(heat.stats[0].healing>0);
  const cover=simulate(team([{id:'1002',items:['cover-gun']}]),{maxActions:15});
  assert.ok(cover.events.some(e=>e.targets.some(t=>t.shield>0)));
  const drill=simulate(team([{id:'1002',items:['planetary-drill']}]),{maxActions:8});
  assert.ok(drill.events.some(e=>e.snapshot.find(u=>u.id==='target').statuses.some(s=>s.type==='exposed')));
  const blade=simulate(team([{id:'1002',items:['blade']}]),{enemyLineup:[dummy({attack:120})]});
  assert.equal(blade.stats[0].healing,0,'碎星斩舰刀 is strength and damage, not the previous invented lifesteal');
});

test('skill points, energy, reaction count and all replay values remain bounded',()=>{
  const s=team([{id:'1001',star:3},{id:'1107',star:3},{id:'1013',star:3},{id:'1204',star:3},{id:'1202',zone:'back'},{id:'1203',zone:'back'}]);
  const r=simulate(s,{enemyLineup:[dummy({id:'one',attack:500,archetype:'caster',hp:50000,maxHp:50000}),dummy({id:'two',attack:450,hp:50000,maxHp:50000})],maxActions:180});
  assert.ok(r.events.length<=250);assert.ok(r.turns<=180);assert.equal(r.events.at(-1).kind,'end');assert.equal(r.events.at(-1).winner,r.winner);
  for(const e of r.events){assert.ok(e.skillPoints>=0&&e.skillPoints<=r.maxSkillPoints);for(const u of e.snapshot){assert.ok(Number.isFinite(u.hp)&&u.hp>=0&&u.hp<=u.maxHp);assert.ok(u.energy>=0&&u.energy<=100);assert.ok(u.shield>=0&&u.shield<=u.maxHp);}}
});

test('classic characters and legacy saves produce finite replays in their supported positions',()=>{
  for(const c of CHARACTERS)for(const zone of c.allowedZones||['front','back']){const s=team([{id:c.id,zone,star:2},...(zone==='back'?[{id:'1104',star:3}]:[])]);const r=simulate(s);assert.ok(r.stats.find(u=>u.id==='ally-0'),`${c.name} ${zone}`);for(const u of r.final){assert.ok(Number.isFinite(u.hp),`${c.name}: HP`);assert.ok(Number.isFinite(u.attack),`${c.name}: attack`);}}
  for(const e of EQUIPMENT){const r=simulate(team([{id:'1002',items:[e.id]}]),{maxActions:6});assert.ok(r.events.length>1,e.id);}
});

test('legacy saves without combat replays still validate; new battles include replay and summary',()=>{
  const s=createGame(42);assert.equal(validateState(s),true);assert.equal(act(s,{type:'battle'}).ok,true);
  assert.equal(s.lastBattle.won,s.lastBattle.combat.winner==='ally');
  assert.equal(s.lastBattle.logs.length>=s.lastBattle.combat.events.length,true);
  delete s.lastBattle.combat;assert.equal(validateState(s),true);
  assert.equal(getEnemyLineup(12).filter(u=>u.boss).length,1);
});


test('backline investment increases both direct support damage and ongoing damage',()=>{
  const normal=team([{id:'1104',star:3},{id:'1108',zone:'back'}],1),boosted=structuredClone(normal);
  boosted.strategies=['pistol-blessing'];
  const enemy=[dummy({hp:99999,maxHp:99999,attack:1,speed:100})];
  const a=simulateCombat(normal,{enemyLineup:enemy,maxActions:8}),b=simulateCombat(boosted,{enemyLineup:enemy,maxActions:8});
  const firstDot=r=>r.events.find(e=>e.kind==='dot').targets.reduce((sum,t)=>sum+(t.damage||0)+(t.absorbed||0),0);
  assert.ok(firstDot(b)>firstDot(a)*1.2);
});

test('an expedition can be won using only legal economy, recruitment, placement and reward actions',()=>{
  const s=createGame(1);
  const play=action=>{const result=act(s,action);assert.equal(validateState(s),true);return result;};
  const score=u=>getUnitStats(s,u).power;
  function arrange(){
    const available=[...s.units].sort((a,b)=>score(b)-score(a)),frontline=[];
    for(const role of ['守护','治疗']){const u=available.find(u=>getCharacter(u.characterId).role===role);if(u)frontline.push(u.uid);}
    for(const u of available)if(frontline.length<4&&!frontline.includes(u.uid)&&getCharacter(u.characterId).role!=='辅助')frontline.push(u.uid);
    for(const u of available)if(frontline.length<4&&!frontline.includes(u.uid))frontline.push(u.uid);
    const back=available.filter(u=>!frontline.includes(u.uid)).sort((a,b)=>(getCharacter(b.characterId).role==='辅助'?300:0)+score(b)-(getCharacter(a.characterId).role==='辅助'?300:0)-score(a)).slice(0,s.level-frontline.length).map(u=>u.uid);
    for(const u of s.units)if(u.zone!=='bench'&&!frontline.includes(u.uid)&&!back.includes(u.uid))play({type:'move',uid:u.uid,zone:'bench'});
    for(const u of s.units)if(u.zone==='front'&&!frontline.includes(u.uid))play({type:'move',uid:u.uid,zone:'back'});
    for(const uid of frontline)play({type:'move',uid,zone:'front'});
    for(const uid of back)play({type:'move',uid,zone:'back'});
  }
  for(let round=1;round<=12&&s.phase!=='ended';round++){
    if(s.phase==='choice'){
      const priorities=s.choiceKind==='strategy'?['vanguard','momentum','backline','recovery','dividend','growth','fortress','discount','compound']:['battery','knife','flower','star'];
      const index=s.choices.map((c,i)=>({i,rank:priorities.indexOf(c.id)<0?99:priorities.indexOf(c.id)})).sort((a,b)=>a.rank-b.rank)[0].i;
      play({type:'choose',index});
    }
    let shopping=0;
    while(shopping++<7){
      for(let i=0;i<5;i++){
        const id=s.shop[i],c=getCharacter(id);if(!c)continue;
        const owned=s.units.some(u=>u.characterId===id&&u.star<3);
        const healer=c.role==='治疗'&&!s.units.some(u=>getCharacter(u.characterId).role==='治疗');
        if(owned||healer||s.units.length<s.level+2||c.cost>=3&&s.gold>15)play({type:'buy',index:i});
      }
      arrange();
      if(s.level<8&&s.gold>=8&&s.units.length>s.level)play({type:'exp'});
      else if(s.gold>12&&shopping<5)play({type:'refresh'});else break;
    }
    arrange();
    while(s.inventory.length){
      const target=[...s.units].filter(u=>u.zone==='front'&&u.items.length<3).sort((a,b)=>score(b)-score(a))[0]||s.units.find(u=>u.items.length<3);
      if(!target)break;play({type:'equip',uid:target.uid,itemIndex:0});
    }
    assert.equal(play({type:'battle'}).ok,true);assert.equal(play({type:'next'}).ok,true);
  }
  assert.equal(s.phase,'ended');assert.equal(s.result,'victory');assert.equal(s.history.length,12);
});
