import test from 'node:test';
import assert from 'node:assert/strict';
import {RECIPES,EQUIPMENT,resolveEquipment,getEquipmentArtPath} from '../dist/data.js';
import {combineInventoryItems,equipCraftingItem,getEquipCraftPreview,getCraftResult,getSmeltingPool,isCraftingMaterial} from '../dist/classic-crafting.js';
import {createGame,act,getPopulationLimit,validateState,migrateState,getUnitStats,getSynergies} from '../dist/engine.js';
import {existsSync} from 'node:fs';

const fixture=(inventory,items=[])=>({inventory:[...inventory],units:[{uid:'u1',characterId:'1013',items:[...items]}],progression:{day:{assignments:{}}}});
const reject=(fn,state)=>{const before=structuredClone(state);assert.equal(fn().ok,false);assert.deepEqual(state,before);};

test('classic diamond matrix makes all sixteen named emblems in either ingredient order',()=>{
  const parts=['skates','knife','pistol','star','flower','armor','drill','battery'];
  const red=['day','luofu','night','festival','wolfpack','belobog','wanderer','scholar'];
  const blue=['follow','sp','debuff','aoe','blood','dot','break','energy'];
  for(const [gem,traits] of [['red-gem',red],['blue-gem',blue]])parts.forEach((part,i)=>{
    const id=`trait-${traits[i]}`;
    assert.equal(getCraftResult(gem,part),id);assert.equal(getCraftResult(part,gem),id);
    const s=fixture([gem,'blade',part]);
    assert.equal(combineInventoryItems(s,2,0).ok,true);assert.deepEqual(s.inventory,['blade',id]);
    assert.equal(resolveEquipment(id).trait,traits[i]);
  });
  assert.equal(Object.keys(RECIPES).length,57);
  assert.equal(EQUIPMENT.filter(e=>e.tier===1).length,8,'diamonds must not leak into ordinary basic chests');
});

test('all three diamond pairs produce population gems and garbage diamonds produce elation',()=>{
  for(const [a,b] of [['red-gem','red-gem'],['red-gem','blue-gem'],['blue-gem','blue-gem']]){
    const s=fixture([a,b]);assert.equal(combineInventoryItems(s,0,1).result,'wealth-gem');assert.deepEqual(s.inventory,['wealth-gem']);
  }
  for(const gem of ['red-gem','blue-gem']){
    assert.equal(getCraftResult(gem,'trash-bag'),'trait-elation');
    assert.equal(getCraftResult('trash-bag',gem),'trait-elation');
  }
  assert.equal(getCraftResult('trash-bag','knife'),null);
  assert.equal(isCraftingMaterial('privileged:blade'),false);
  assert.equal(isCraftingMaterial('wealth-gem'),false);
});

test('on-wearer crafting replaces the component even at full physical capacity',()=>{
  const s=fixture(['star'],['knife','garden','hard-armor']),before=structuredClone(s);
  const preview=getEquipCraftPreview(s,'u1',0);assert.equal(preview.result,'chainsaw');assert.equal(preview.crafted,true);assert.deepEqual(s,before);
  const result=equipCraftingItem(s,'u1',0);assert.equal(result.ok,true);assert.deepEqual(s.inventory,[]);assert.deepEqual(s.units[0].items,['chainsaw','garden','hard-armor']);
});

test('on-wearer crafting and ordinary equip share unique, dice, and day-slot checks atomically',()=>{
  const unique=fixture(['battery'],['skates','electric']);reject(()=>equipCraftingItem(unique,'u1',0),unique);
  const dice=fixture(['star'],['star','blade']);reject(()=>equipCraftingItem(dice,'u1',0),dice);
  const dayDice=fixture(['star'],['star']);dayDice.progression.day.assignments={sword:'u1'};reject(()=>equipCraftingItem(dayDice,'u1',0),dayDice);
  const dayFull=fixture(['knife'],['blade','garden']);dayFull.progression.day.assignments={sword:'u1'};reject(()=>equipCraftingItem(dayFull,'u1',0),dayFull);
  const uniqueEmblem=fixture(['blue-gem'],['trait-sp','knife']);reject(()=>equipCraftingItem(uniqueEmblem,'u1',0),uniqueEmblem);
  const validDice=fixture(['star'],['star']);assert.equal(equipCraftingItem(validDice,'u1',0).ok,true);assert.deepEqual(validDice.units[0].items,['comet']);
  const blocked=fixture(['flower'],['comet']);reject(()=>equipCraftingItem(blocked,'u1',0),blocked);
});

test('invalid ingredients and stale indexes never consume inventory',()=>{
  for(const [items,a,b] of [[['knife'],0,0],[['knife'],0,1],[['blade','knife'],0,1],[['red-gem','wealth-gem'],0,1],[['knife','flower'],-1,0]]){
    const s=fixture(items);reject(()=>combineInventoryItems(s,a,b),s);
  }
});

test('smelting keeps equipment types and swaps red/blue without rolling an unrelated item',()=>{
  assert.deepEqual(getSmeltingPool('red-gem'),['blue-gem']);assert.deepEqual(getSmeltingPool('blue-gem'),['red-gem']);
  assert.ok(getSmeltingPool('knife').every(id=>resolveEquipment(id).tier===1));
  assert.ok(getSmeltingPool('privileged:electric').every(id=>resolveEquipment(id).privileged));
  assert.ok(getSmeltingPool('trait-night').includes('trait-day'));
  assert.ok(!getSmeltingPool('trait-night').includes('trait-energy'));
  assert.deepEqual(getSmeltingPool('wealth-gem'),[]);
});

test('crafted emblems affect actual traits, gem population survives saving, and original art resolves',()=>{
  const s=createGame(73);s.inventory=['red-gem','blue-gem'];
  const before=getPopulationLimit(s);combineInventoryItems(s,0,1);assert.equal(getPopulationLimit(s),before+1);
  assert.equal(validateState(s),true);const restored=migrateState(structuredClone(s));assert.equal(getPopulationLimit(restored),before+1);
  for(const id of ['red-gem','blue-gem','trash-bag','wealth-gem'])assert.ok(existsSync(new URL(`../dist/${getEquipmentArtPath(id)}`,import.meta.url)));
  const stats=getUnitStats(s,s.units[0]);s.units[0].items=['trash-bag'];const improved=getUnitStats(s,s.units[0]);assert.ok(improved.speed>stats.speed);assert.ok(improved.attack>stats.attack);
});

test('real equip and combine actions craft, award strategy refreshes, and activate an emblem',()=>{
  const s=createGame(73);s.strategies=['armed-refresh'];s.inventory=['red-gem','knife','blue-gem','battery'];
  const uid=s.units[0].uid;
  assert.equal(act(s,{type:'equip',uid,itemIndex:0}).ok,true);assert.deepEqual(s.units[0].items,['red-gem']);
  assert.equal(act(s,{type:'equip',uid,itemIndex:0}).ok,true);assert.deepEqual(s.units[0].items,['trait-luofu']);assert.equal(s.freeRefreshes,2);
  assert.ok(getSynergies(s).some(t=>t.id==='luofu'&&t.count>0));
  assert.equal(act(s,{type:'combine',indexA:0,indexB:1}).ok,true);assert.deepEqual(s.inventory,['trait-energy']);assert.equal(s.freeRefreshes,4);
  assert.equal(validateState(s),true);assert.deepEqual(migrateState(s),s);
});

test('real smelter swaps diamonds and privilege reroll cannot consume a gem or an emblem',()=>{
  const s=createGame(79),uid=s.units[0].uid;s.inventory=['red-gem'];s.consumables=[{uid:'smelter-test',id:'smelter'}];
  assert.equal(act(s,{type:'equip',uid,itemIndex:0}).ok,true);
  assert.equal(act(s,{type:'use-consumable',uid:'smelter-test',targetUid:uid}).ok,true);assert.deepEqual(s.inventory,['blue-gem']);assert.deepEqual(s.units[0].items,[]);
  s.units[0].items=['trait-day','red-gem'];s.consumables=[{uid:'priv-test',id:'privilege-dice'}];
  reject(()=>act(s,{type:'use-consumable',uid:'priv-test',targetUid:uid}),s);
  assert.equal(validateState(s),true);
});

test('Cyrene diamond poems cost twelve, yield collectible material once, and survive reload',()=>{
  for(const [poem,gem] of [['red-poem','red-gem'],['blue-poem','blue-gem']]){
    const s=createGame(81);s.loot=[];s.gold=20;s.units[0].characterId='1415';s.units[0].recruitCost=5;
    Object.assign(s.progression.beloved,{battles:1,offers:[poem],offerNode:s.round});
    const response=act(s,{type:'progression',kind:'poem-buy',id:poem});assert.equal(response.ok,true,response.message);
    assert.equal(s.gold,8);assert.deepEqual(s.inventory,[]);assert.equal(s.loot.length,1);
    reject(()=>act(s,{type:'progression',kind:'poem-buy',id:poem}),s);
    assert.deepEqual(migrateState(s),s);
    assert.equal(act(s,{type:'collect-loot',uid:s.loot[0].uid}).ok,true);assert.deepEqual(s.inventory,[gem]);
    assert.equal(validateState(s),true);
  }
});
