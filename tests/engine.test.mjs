import test from 'node:test';
import assert from 'node:assert/strict';
import {createGame,act,getCharacter,getEquipment,getSynergies,getTeamPower,getEnemy,getUnitStats,validateState} from '../dist/engine.js';
import {EQUIPMENT,STRATEGIES,CHARACTERS,CLASSIC_ROSTER} from '../dist/data.js';

const run=(state,action)=>{const result=act(state,action);assert.equal(result.ok,true,result.message);assert.equal(validateState(state),true);return result;};
const invalid=(state,action)=>{const before=JSON.stringify(state);assert.equal(act(state,action).ok,false);assert.equal(JSON.stringify(state),before);};

test('new games have valid populated boards and repeatable seeded shops',()=>{
  const a=createGame(123),b=createGame(123);
  assert.equal(validateState(a),true);assert.equal(a.units.length,4);
  run(a,{type:'refresh'});run(b,{type:'refresh'});assert.deepEqual(a,b);
  assert.ok(getTeamPower(a)>0);
  assert.equal(CLASSIC_ROSTER.length,72);
  assert.ok(CHARACTERS.length>=CLASSIC_ROSTER.length);
  assert.ok(a.units.every(u=>CLASSIC_ROSTER.some(c=>c.id===u.characterId)));
});

test('invalid actions are atomic, and phase restrictions cannot be bypassed',()=>{
  const s=createGame(1);
  invalid(s,{type:'move',uid:s.units[0].uid,zone:'unknown'});
  invalid(s,{type:'equip',uid:s.units[0].uid,itemIndex:99});
  invalid(s,{type:'combine',indexA:0,indexB:0});
  invalid(s,{type:'buy',index:1.5});invalid(s,{type:'equip',uid:s.units[0].uid,itemIndex:'0'});
  invalid(s,{type:'next'});invalid(s,{type:'choose',index:0});
  s.gold=0;invalid(s,{type:'refresh'});invalid(s,{type:'buy',index:0});invalid(s,{type:'exp'});
  run(s,{type:'battle'});invalid(s,{type:'battle'});invalid(s,{type:'sell',uid:s.units[0].uid});
  run(s,{type:'next'});assert.equal(s.phase,'choice');invalid(s,{type:'refresh'});
  invalid(s,{type:'choose',index:'map'});
  run(s,{type:'choose',index:0});assert.equal(s.phase,'prep');
});

test('three copies merge automatically, preserve deployment and return excess items',()=>{
  const s=createGame(2),dan=s.units.find(u=>u.characterId==='1013');
  for(const orb of [...s.loot])run(s,{type:'collect-loot',uid:orb.uid});
  run(s,{type:'equip',uid:dan.uid,itemIndex:0});
  run(s,{type:'buy',index:0});
  const copy=s.units.find(u=>u.characterId==='1013'&&u.uid!==dan.uid);
  s.inventory.push('star','armor','skates');
  run(s,{type:'equip',uid:copy.uid,itemIndex:0});
  run(s,{type:'equip',uid:copy.uid,itemIndex:0});
  run(s,{type:'equip',uid:copy.uid,itemIndex:0});
  const inventoryBefore=s.inventory.length;
  run(s,{type:'buy',index:2});
  const upgraded=s.units.find(u=>u.characterId==='1013');
  assert.equal(upgraded.uid,dan.uid);assert.equal(upgraded.star,2);assert.equal(upgraded.zone,'front');
  assert.equal(upgraded.items.length,3);assert.equal(s.inventory.length,inventoryBefore+1);
  assert.equal(s.units.filter(u=>u.characterId==='1013').length,1);
});

test('merge cascades from one star into three stars',()=>{
  const s=createGame(3);
  s.units=s.units.filter(u=>u.characterId!=='1013');
  for(let i=0;i<8;i++)s.units.push({uid:`fixture-${i}`,characterId:'1013',star:1,zone:i===0?'front':'bench',items:[]});
  s.shop[0]='1013';run(s,{type:'buy',index:0});
  const dans=s.units.filter(u=>u.characterId==='1013');
  assert.equal(dans.length,1);assert.equal(dans[0].star,3);
});

test('equipment raises power, can be removed, sold or combined without duplication',()=>{
  const s=createGame(7),unit=s.units[0],base=getTeamPower(s);
  for(const orb of [...s.loot])run(s,{type:'collect-loot',uid:orb.uid});
  run(s,{type:'equip',uid:unit.uid,itemIndex:0});assert.ok(getTeamPower(s)>base);
  run(s,{type:'unequip',uid:unit.uid,itemIndex:0});assert.equal(getTeamPower(s),base);
  s.inventory=['skates','battery'];run(s,{type:'combine',indexA:0,indexB:1});assert.deepEqual(s.inventory,['electric']);
  invalid(s,{type:'combine',indexA:0,indexB:1});
  run(s,{type:'equip',uid:unit.uid,itemIndex:0});run(s,{type:'sell',uid:unit.uid});assert.deepEqual(s.inventory,['electric']);
  assert.equal(s.gold,17);
  // Some classic items only affect energy, break or the other zone: they need not raise the power estimate.
  for(const item of EQUIPMENT){
    const state=createGame(7),wearer=state.units[0];state.inventory=[item.id];
    run(state,{type:'equip',uid:wearer.uid,itemIndex:0});
    const stats=getUnitStats(state,state.units[0]);
    assert.ok(Number.isFinite(stats.hp)&&stats.hp>0,item.id);
    assert.ok(Number.isFinite(stats.attack)&&stats.attack>0,item.id);
    run(state,{type:'unequip',uid:wearer.uid,itemIndex:0});assert.deepEqual(state.inventory,[item.id]);
  }
});

test('unique character identities determine synergies, bench copies do not count',()=>{
  const s=createGame(9);
  assert.equal(getSynergies(s).find(x=>x.id==='express').count,1);
  s.units.push({uid:'fixture',characterId:'1001',star:2,zone:'bench',items:[]});
  assert.equal(getSynergies(s).find(x=>x.id==='express').count,1);
  s.level=5;run(s,{type:'move',uid:'fixture',zone:'front'});
  assert.equal(getSynergies(s).find(x=>x.id==='express').count,1);
});

test('population and front/back capacity limits are enforced',()=>{
  const s=createGame(10);run(s,{type:'buy',index:0});
  const unit=s.units.find(u=>u.zone==='bench');invalid(s,{type:'move',uid:unit.uid,zone:'front'});
  run(s,{type:'exp'});run(s,{type:'exp'});assert.equal(s.level,5);
  run(s,{type:'move',uid:unit.uid,zone:'front'});
  const back=s.units.find(u=>u.zone==='back');invalid(s,{type:'move',uid:back.uid,zone:'front'});
});

test('locked shops persist through round advance and interest is based on saved gold',()=>{
  const s=createGame(42);s.gold=59;run(s,{type:'lock'});
  const shop=[...s.shop];run(s,{type:'battle'});
  assert.equal(s.lastBattle.income,15);assert.equal(s.gold,74);
  run(s,{type:'next'});assert.deepEqual(s.shop,shop);assert.equal(s.locked,true);
  run(s,{type:'choose',index:0});run(s,{type:'lock'});run(s,{type:'battle'});run(s,{type:'next'});
  assert.notDeepEqual(s.shop,shop);
});

test('classic and legacy strategies can be acquired without corrupting a save',()=>{
  for(const strategy of STRATEGIES){
    const s=createGame(11),before=getTeamPower(s);s.phase='choice';s.choices=[{kind:'strategy',id:strategy.id}, {kind:'strategy',id:'compound'},{kind:'strategy',id:'dividend'}];
    run(s,{type:'choose',index:0});assert.ok(s.strategies.includes(strategy.id));
    if(['vanguard','backline','fortress'].includes(strategy.id))assert.ok(getTeamPower(s)>before,strategy.id);
    if(strategy.id==='compound')assert.equal(s.gold,24);
    if(strategy.id==='growth'){assert.equal(s.level,5);run(s,{type:'exp'});assert.equal(s.xp,6);}
    if(strategy.id==='discount'){run(s,{type:'refresh'});assert.equal(s.gold,15);}
    if(strategy.id==='dividend'){run(s,{type:'battle'});assert.equal(s.lastBattle.income,8+1+3+(s.lastBattle.won?2:0));}
    if(strategy.id==='momentum'){run(s,{type:'battle'});assert.equal(s.lastBattle.income,9+(s.lastBattle.won?5:0));}
    if(strategy.id==='recovery'){s.hp=50;run(s,{type:'battle'});assert.equal(s.hp,50-s.lastBattle.damage+5);}
  }
});

test('a complete twelve-round expedition resolves choices, rewards and a terminal result',()=>{
  const s=createGame(2026);
  // A powerful fixture isolates round progression from shopping policy.
  s.units.forEach(u=>u.star=3);
  for(let round=1;round<=12;round++){
    assert.equal(s.round,round);assert.equal(s.phase,'prep');run(s,{type:'battle'});
    assert.equal(s.phase,'result');assert.equal(s.lastBattle.won,true);
    run(s,{type:'next'});
    if(s.phase==='choice')run(s,{type:'choose',index:0});
  }
  assert.equal(s.phase,'ended');assert.equal(s.result,'victory');assert.equal(s.history.length,12);
  invalid(s,{type:'battle'});invalid(s,{type:'next'});
});

test('a lethal defeat ends the expedition and cannot be healed out of defeat',()=>{
  const s=createGame(55);s.units=s.units.slice(0,1);s.round=12;s.hp=1;s.strategies=['recovery'];
  run(s,{type:'battle'});assert.equal(s.hp,0);run(s,{type:'next'});
  assert.equal(s.phase,'ended');assert.equal(s.result,'defeat');
});

test('save validation rejects broken identities and equipment',()=>{
  const s=createGame();assert.equal(validateState(s),true);
  s.units[0].items=['not-an-item'];assert.equal(validateState(s),false);
  const s2=createGame();s2.units[0].characterId='9999';assert.equal(validateState(s2),false);
  const s3=createGame();s3.gold=-1;assert.equal(validateState(s3),false);
});
