import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createGame,act,validateState,getEquipment} from '../dist/engine.js';
import {recommendedRoles,recommendedEquipment,EQUIP_RECOMMEND_ROLES,ROLE_RECOMMEND_EQUIP} from '../dist/classic-recommend.js';
import {itemDetailCard} from '../dist/loot-ui.js';
import {CLASSIC_ROSTER} from '../dist/data.js';

const run=(s,a)=>{const r=act(s,a);assert.equal(r.ok,true,r.message);assert.equal(validateState(s),true);return r;};
function fresh(){const s=createGame(11,{mode:'standard'});run(s,{type:'choose-environment',id:s.environment.choices[0]});s.level=8;return s;}
const unit=(s,uid,characterId,zone,slot)=>{s.units.push({uid,characterId,star:1,zone,slot,items:[],recruitCost:1});};

test('无法上阵同名角色: a second copy of a character cannot come up from the bench',()=>{
  const s=fresh();s.units=[];unit(s,'a','1001','front',0);unit(s,'b','1001','bench',0);unit(s,'c','1009','bench',1);unit(s,'d','1009','back',0);
  const r=act(s,{type:'move',uid:'b',zone:'back'});assert.equal(r.ok,false);assert.equal(r.message,'无法上阵同名角色');
  assert.equal(act(s,{type:'move',uid:'b',zone:'front',position:1}).ok,false);
  assert.equal(act(s,{type:'swap',uid:'b',targetUid:'d'}).ok,false,'swapping the copy onto the field is refused too');
  run(s,{type:'swap',uid:'b',targetUid:'a'});assert.equal(s.units.find(u=>u.uid==='b').zone,'front','trading places with the copy on the field is fine');
  run(s,{type:'move',uid:'b',zone:'back',position:3});
  // A field that already holds two copies (older saves) can still be rearranged.
  unit(s,'e','1001','back',5);assert.equal(validateState(s),true);run(s,{type:'move',uid:'e',zone:'front',position:2});
});

test('recommendations come from the old client tables and point at real items and characters',()=>{
  const ids=new Set(CLASSIC_ROSTER.map(c=>c.id));
  assert.ok(Object.keys(EQUIP_RECOMMEND_ROLES).length>=80);assert.ok(Object.keys(ROLE_RECOMMEND_EQUIP).length>=70);
  for(const [item,roles] of Object.entries(EQUIP_RECOMMEND_ROLES)){assert.ok(getEquipment(item),item);for(const r of roles)assert.ok(ids.has(r),r);}
  for(const [role,zones] of Object.entries(ROLE_RECOMMEND_EQUIP)){assert.ok(ids.has(role));for(const list of Object.values(zones))for(const id of list)assert.ok(getEquipment(id),id);}
  assert.deepEqual(recommendedRoles('garden'),['1409','1105','1217','1218','1222','1408']);
  assert.equal(recommendedRoles('privileged:garden').length,6,'a privileged item uses its base item’s list');
  assert.equal(recommendedEquipment('1217','front').length,6);
});

test('the item card shows 适配角色 and 合成公式, lighting characters the player has',()=>{
  const s=fresh();s.inventory=['garden'];s.units=[{uid:'h',characterId:'1217',star:1,zone:'bench',slot:0,items:[],recruitCost:1}];
  const html=itemDetailCard(s,0);
  assert.match(html,/适配角色/);assert.match(html,/合成公式/);
  assert.match(html,/item-card-role is-owned" title="藿藿/);assert.equal((html.match(/class="item-card-role[ "]/g)||[]).length,6);
});

test('the character card follows the original: no move buttons, 推荐装备, 详情 and 出售; marks without text',()=>{
  const app=readFileSync(new URL('../dist/app.js',import.meta.url),'utf8');
  for(const gone of ['移至前台','移至后台','移至备战','popover-wrench'])assert.ok(!app.includes(gone),gone);
  for(const label of ['推荐装备','⌕ 详情','<span>出售</span>'])assert.ok(app.includes(label),label);
  assert.ok(!/is-filled':''\}">前<\/i>/.test(app),'the 前/后 mark has no text');
  assert.ok(!app.includes('class="shop-role"'),'shop cards drop the position · element row');
});

test('portraits and character art are WebP',()=>{
  const roster=readFileSync(new URL('../dist/classic-roster.js',import.meta.url),'utf8');
  assert.ok(!/assets\/(portraits|characters)\/[^"]+\.png/.test(roster));
});
