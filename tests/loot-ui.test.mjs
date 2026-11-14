import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {createGame,act} from '../dist/engine.js';
import {queueRewards} from '../dist/loot.js';
import {groupedInventory,inventoryContents,lootField,chestScreen,chestName} from '../dist/loot-ui.js';

const run=(state,action)=>{const result=act(state,action);assert.equal(result.ok,true,result.message);};

test('starting supplies appear as collectible ore and rendering does not grant them',()=>{
  const s=createGame(15),before=structuredClone(s);
  assert.deepEqual(s.inventory,[]);assert.ok(s.loot.length>0);
  assert.equal((lootField(s).match(/data-action="collect-loot"/g)||[]).length,s.loot.length);
  assert.match(inventoryContents(s),/暂无装备/);assert.deepEqual(s,before);
  run(s,{type:'collect-loot',uid:s.loot[0].uid});
  assert.match(inventoryContents(s),/data-action="item"/);
});

test('all four ore qualities have separate visual classes and accessible collect controls',()=>{
  const s={loot:['white','blue','gold','prismatic'].map((quality,i)=>({uid:`ore-${i}`,quality,contents:[{kind:'gold',amount:10}]}))};
  const html=lootField(s);
  for(const q of ['white','blue','gold','prismatic'])assert.match(html,new RegExp(`quality-${q}`));
  assert.match(html,/开启棱彩晶矿/);assert.match(html,/开启白色晶矿/);
  assert.equal((html.match(/data-action="collect-loot"/g)||[]).length,4);
  assert.equal(lootField({loot:[]}), '');
});

test('duplicate inventory icons preserve the exact first item index and special equipment art',()=>{
  const inventory=['knife','armor','knife','privileged:boots','trait-day','wealth-gem'];
  const grouped=groupedInventory(inventory),knife=grouped.find(x=>x.id==='knife');
  assert.deepEqual(knife,{id:'knife',index:0,amount:2});assert.equal(grouped.length,5);
  const html=inventoryContents({inventory,chests:[],consumables:[]});
  assert.equal((html.match(/data-action="item"/g)||[]).length,5);
  assert.match(html,/is-privileged/);assert.match(html,/inventory-count">2/);
  assert.doesNotMatch(html,/classic-privileged:|classic-trait-day/);
  assert.match(html,/assets\/equipment\/classic-wealth-gem\.png/);
  for(const match of html.matchAll(/src="([^"]+)"/g))assert.ok(existsSync(new URL(`../dist/${match[1]}`,import.meta.url)),match[1]);
});

test('opening, selecting and cancelling a chest preview retains its options and contents',()=>{
  const s=createGame(31);queueRewards(s,[{kind:'chest',quality:'basic',options:['knife','star','skates']}]);
  run(s,{type:'collect-loot',uid:s.loot.at(-1).uid});
  const chest=structuredClone(s.chests[0]);run(s,{type:'open-chest',uid:chest.uid});
  const initial=chestScreen(s),preview=chestScreen(s,0);
  assert.match(initial,/data-action="choose-chest" disabled/);
  assert.match(initial,/返回备战界面/);assert.match(initial,/暂不选择/);
  assert.doesNotMatch(preview,/data-action="choose-chest" disabled/);
  assert.deepEqual(s.chests[0],chest);assert.deepEqual(s.inventory,[]);
  run(s,{type:'cancel-chest'});assert.equal(chestScreen(s),'');assert.deepEqual(s.chests[0],chest);
  run(s,{type:'open-chest',uid:chest.uid});assert.equal(chestScreen(s),initial);
  run(s,{type:'choose-chest',index:0});assert.deepEqual(s.inventory,['knife']);assert.equal(s.chests.length,0);
});

test('privileged chests and consumables remain distinct from equipable inventory',()=>{
  const chest={uid:'special',quality:'prismatic',kind:'equipment',options:['privileged:boots','privileged:blade','privileged:orbital']};
  const s={activeChest:chest.uid,chests:[chest],inventory:['knife'],consumables:[{uid:'projector-1',id:'projector'}]};
  const html=inventoryContents(s),screen=chestScreen(s,0);
  assert.equal(chestName(chest),'特权武装箱');assert.match(html,/assets\/loot\/chest-privileged.png/);
  assert.match(html,/data-action="open-chest" data-uid="special"/);
  assert.match(html,/data-action="consumable" data-uid="projector-1"/);
  assert.match(screen,/is-privileged/);assert.doesNotMatch(screen,/classic-privileged:/);
});
