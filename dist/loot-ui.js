import {EQUIPMENT,CHARACTERS,TRAITS,RECIPES,resolveEquipment,getEquipmentArtPath} from './data.js?v=6.4.2';
import {getConsumable} from './loot.js?v=6.4.2';
import {getCraftResult,isCraftingMaterial} from './classic-crafting.js?v=6.4.2';

const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const item=id=>resolveEquipment(id);
const person=id=>CHARACTERS.find(c=>c.id===String(id));
const qualityNames={white:'白色晶矿',blue:'蓝色晶矿',gold:'金色晶矿',prismatic:'棱彩晶矿'};
const colors={white:'#effaff',blue:'#7ee1ff',gold:'#ffdb67',prismatic:'#d0a8ff'};
const quality=value=>Object.hasOwn(qualityNames,value)?value:'white';
const itemImage=id=>{const e=item(id);return `<img class="${e?.privileged?'is-privileged':''}" src="${esc(getEquipmentArtPath(id))}" alt="" draggable="false">`;};
const arrow='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m10 5-7 7 7 7M3 12h18"/></svg>';

export function chestType(chest){
  if(chest.kind==='role')return 'role';
  if(['privileged','prismatic'].includes(chest.quality)||chest.options?.some(id=>item(id)?.privileged))return 'privileged';
  return chest.quality==='advanced'||chest.options?.some(id=>item(id)?.tier===2)?'advanced':'basic';
}
export const chestName=chest=>chest.kind==='role'?`${chest.cost}费聘用书`:({basic:'简易武装箱',advanced:'进阶武装箱',privileged:'特权武装箱'})[chestType(chest)];
const roleColors=['','#b4b4b4','#6cce9f','#7196ff','#927fe7','#ffd471'];
// No original 聘用书 icon was found; this letter is drawn for the site, tinted with the cost colour.
export const chestArt=chest=>chest.kind==='role'?`<svg class="role-letter" viewBox="0 0 64 64" aria-hidden="true" style="--cost:${roleColors[chest.cost]||'#fff'}"><rect x="10" y="6" width="44" height="52" rx="5"/><path d="M19 20h26M19 28h26M19 36h16"/><circle cx="43" cy="45" r="8"/><text x="43" y="49" text-anchor="middle">${chest.cost}</text></svg>`:`<img src="assets/loot/chest-${chestType(chest)}.png" alt="" draggable="false">`;
// Old client GridFightForge descriptions.
export const chestDescription=chest=>chest.kind==='role'?`点击开启进行角色招募，从四名${chest.cost}费角色中选择一名获得。该道具使用后消失。`:`点击开启${chestName(chest)}，从四件${({basic:'简易',advanced:'进阶',privileged:'特权'})[chestType(chest)]}装备中选择一件获得。该道具使用后消失。`;

export function consumableArt(id){
  // Original item icons where the old client art is available (BWIKI / Fandom item tables).
  const file=['projector','perfect-projector','privilege-card','wrench','precision-wrench','smelter'].includes(id)?`assets/loot/${id}.png`:id==='wealth-gem'?'assets/equipment/classic-wealth-gem.png':id?.startsWith('trait-')&&item(id)?getEquipmentArtPath(id):null;
  if(file)return `<img src="${esc(file)}" alt="" draggable="false">`;
  const glyph=id==='wealth-gem'?'<path d="m12 2 9 6-9 14L3 8Zm-9 6h18M7 3l5 19 5-19"/>':id.startsWith('hire-')?'<path d="M5 2h12l3 3v17H5ZM8 8h9M8 12h9M8 16h5"/><circle cx="16" cy="18" r="3"/>':id.startsWith('trait-')?'<path d="m12 2 10 10-10 10L2 12Z"/><path d="m12 7 5 5-5 5-5-5Z"/>':'<rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8" cy="8" r="1"/><circle cx="16" cy="8" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/>';
  return `<svg class="consumable-glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">${glyph}</svg>${id.startsWith('hire-')?`<b class="consumable-cost">${esc(id.slice(5))}</b>`:''}`;
}

// Duplicates share one visible slot, while the action keeps the exact inventory index.
export function groupedInventory(inventory=[]){
  const grouped=new Map();
  inventory.forEach((id,index)=>{if(!item(id))return;const entry=grouped.get(id);if(entry)entry.amount++;else grouped.set(id,{id,index,amount:1});});
  return [...grouped.values()].sort((a,b)=>item(b.id).tier-item(a.id).tier||EQUIPMENT.findIndex(e=>e.id===a.id)-EQUIPMENT.findIndex(e=>e.id===b.id));
}

export function lootField(game){
  const orbs=game.loot||[];if(!orbs.length)return '';
  return `<section class="loot-field" aria-label="待领取战利品"><div class="loot-field-heading"><span>战利品</span><b>${orbs.length}</b></div><div class="loot-orbs">${orbs.map((orb,i)=>{
    const q=quality(orb.quality);
    return `<button class="loot-orb quality-${q}" data-key="orb-${esc(orb.uid)}" data-action="collect-loot" data-uid="${esc(orb.uid)}" style="--orb-delay:${-(i%5)*.53}s" data-tip-title="${qualityNames[q]}" data-tip="点击开启${orb.source?` · 来源：${esc(orb.source)}`:''}" aria-label="开启${qualityNames[q]}"><span class="orb-halo"></span><span class="orb-sphere"><span class="orb-cloud"></span><span class="orb-shine"></span><span class="orb-particles"></span></span><span class="orb-floor"></span><span class="orb-label">${qualityNames[q]}</span></button>`;
  }).join('')}</div><p class="loot-field-hint">点击晶矿，领取战利品</p></section>`;
}

export function inventoryContents(game){
  // Chests are not inventory items: they wait on the bench (see app.js benchChest).
  const consumables=(game.consumables||[]).map(c=>{const info=getConsumable(c.id);return `<button class="inventory-item loot-consumable" data-key="consumable-${esc(c.uid)}" data-action="consumable" data-uid="${esc(c.uid)}" data-tip-title="${esc(info?.name||c.id)}" data-tip="${esc(info?.description||'')}" ${info?.requiresTarget?'data-tip-extra="拖到角色身上使用，或点击选择角色"':''} aria-label="${info?.passive?'查看':'使用'}${esc(info?.name||c.id)}">${consumableArt(c.id)}<span class="inventory-kind">道具</span></button>`;});
  // One tile per item in the order obtained, as in the old client's 物品栏 (no grouping, no re-sorting),
  // so nothing jumps around after a combine.
  const items=(game.inventory||[]).map((id,index)=>{const e=item(id);if(!e)return '';return `<button class="inventory-item tier-${e.tier} ${e.privileged?'is-privileged':''}" data-key="item-${index}-${esc(id)}" data-action="item" data-index="${index}" data-tip-kind="item" data-tip-id="${esc(id)}" data-tip-extra="拖到角色身上穿戴，拖到另一件装备上合成；点击查看可合成列表" aria-label="装备${esc(e.name)}">${itemImage(id)}</button>`;});
  return [...consumables,...items].join('')||'<p class="inventory-empty">物品栏<br>暂无装备</p>';
}

const recipeOf=id=>{const base=item(id)?.baseId||id;const entry=Object.entries(RECIPES).find(([,result])=>result===base);return entry?entry[0].split('+'):null;};
// Every id that appears in a recipe, in the order the recipe table lists them.
const MATERIALS=[...new Set(Object.keys(RECIPES).flatMap(key=>key.split('+')))];
export const itemKind=e=>!e?'':e.privileged?'特权装备':e.trait?'稀有装备 · 星徽':e.craftingMaterial?'稀有装备 · 合成材料':e.tier===1?'简易装备':'进阶装备';
// 可合成列表 for one 物品栏 entry: every partner it combines with, the result, and where an owned
// partner sits in the inventory (another copy of the same item counts).
export function craftOptions(inventory,index){
  const id=inventory[index];if(!isCraftingMaterial(id))return [];
  return MATERIALS.map(partner=>{const result=getCraftResult(id,partner);if(!result)return null;return {partner,result,partnerIndex:inventory.findIndex((x,i)=>x===partner&&i!==index)};}).filter(Boolean);
}
// The item card the old client opens when an item is clicked: name, type, description, then the
// 可合成列表 (owned partners outlined and clickable) or, for crafted items, the 合成路线.
export function itemDetailCard(game,index){
  const id=game.inventory[index],e=item(id);if(!e)return '';
  const options=craftOptions(game.inventory,index),recipe=recipeOf(id);
  const rows=options.map(o=>{const r=item(o.result),owned=o.partnerIndex>=0,inner=`<span class="craft-plus">＋</span><span class="craft-icon">${itemImage(o.partner)}</span><span class="craft-plus">＝</span><span class="craft-icon is-result">${itemImage(o.result)}</span><span class="craft-name">${esc(r?.name||o.result)}</span>`;
    return owned?`<button class="craft-row is-owned" data-action="combine-with" data-index="${index}" data-partner="${o.partnerIndex}" aria-label="与${esc(item(o.partner)?.name)}合成${esc(r?.name)}">${inner}</button>`:`<div class="craft-row" title="还没有${esc(item(o.partner)?.name)}">${inner}</div>`;}).join('');
  return `<aside class="item-card" data-key="item-card" role="dialog" aria-label="${esc(e.name)}"><button class="popover-close item-card-close" data-action="item-close" aria-label="关闭">×</button><header class="item-card-head"><span class="item-card-art tier-${e.tier}">${itemImage(id)}</span><div><h2>${esc(e.name)}</h2><small>${itemKind(e)}</small></div></header><p class="item-card-desc">${esc(e.description)}</p>${rows?`<div class="item-card-section"><h3>可合成列表</h3>${rows}</div>`:''}${recipe?`<div class="item-card-section"><h3>合成路线</h3><div class="craft-route">${recipe.map(x=>`<span class="craft-icon">${itemImage(x)}</span>`).join('<span class="craft-plus">＋</span>')}</div></div>`:''}<p class="item-card-hint">拖到角色身上穿戴${rows?'；拖到另一件装备上合成':''}</p></aside>`;
}
const traitNames=ids=>ids.map(id=>TRAITS.find(t=>t.id===id)?.name).filter(Boolean).join(' · ');
// The forge choice as in the old client: a panel over the board with four cards; clicking a card
// takes it at once. 返回 keeps the chest on the bench with the same four options.
export function chestScreen(game){
  const chest=(game.chests||[]).find(c=>c.uid===game.activeChest);if(!chest)return '';
  const role=chest.kind==='role',costColor=['','#b8bec8','#6cc2ad','#758afa','#ae84ed','#e4c871'];
  const cards=chest.options.map((id,index)=>{
    if(role){const c=person(id);if(!c)return '';return `<button class="forge-card is-role" data-action="choose-chest" data-index="${index}" style="--rarity:${costColor[c.cost]}" aria-label="招募${esc(c.name)}"><span class="forge-card-art"><img src="assets/portraits/${esc(c.id)}.png" alt="" draggable="false"></span><span class="forge-card-name">${esc(c.name)}</span><span class="forge-card-meta">${c.cost}费 · ${esc(traitNames(c.traits||[]))}</span></button>`;}
    const e=item(id);if(!e)return '';const recipe=recipeOf(id);
    return `<button class="forge-card tier-${e.tier} ${e.privileged?'is-privileged':''}" data-action="choose-chest" data-index="${index}" aria-label="选择${esc(e.name)}"><span class="forge-card-art">${itemImage(id)}</span><span class="forge-card-name">${esc(e.name)}</span><span class="forge-card-meta">${esc(e.description)}</span>${recipe?`<span class="forge-card-recipe" aria-label="合成路线">${recipe.map(itemImage).join('<b>＋</b>')}</span>`:''}</button>`;
  }).join('');
  return `<div class="forge-overlay"><section class="forge-panel chest-${chestType(chest)}" role="dialog" aria-modal="true" aria-labelledby="modal-heading" tabindex="-1"><header class="forge-heading"><h1 id="modal-heading">${esc(chestName(chest))}</h1><p>${role?'选择一名角色加入备战席':'选择一件装备放入物品栏'}</p><button class="forge-return" data-action="cancel-chest">${arrow}返回</button></header><div class="forge-cards" style="--option-count:${chest.options.length}">${cards}</div><p class="forge-note">点击卡片即可获得；返回后${role?'聘用书':'武装箱'}仍留在备战席，选项不变。</p></section></div>`;
}

function rewardVisual(content){
  if(content.kind==='gold')return {image:'assets/ui/coin.svg',label:`金币 +${content.amount||0}`,target:'.shop-toggle'};
  if(content.kind==='item'){const e=item(content.id);return e?{image:getEquipmentArtPath(e.id),label:e.name,target:'.equipment-heading'}:{markup:consumableArt(content.id),label:getConsumable(content.id)?.name||'道具',target:'.equipment-heading'};}
  if(content.kind==='character')return {image:`assets/portraits/${content.id}.png`,label:person(content.id)?.name||'角色',target:'.bench'};
  if(content.kind==='consumable')return {markup:consumableArt(content.id),label:getConsumable(content.id)?.name||'道具',target:'.equipment-heading'};
  if(content.kind==='chest'){const chest=content.chest||content;return {image:`assets/loot/chest-${chestType(chest)}.png`,label:chestName(chest),target:'.equipment-heading'};}
  if(['xp','hp','refresh'].includes(content.kind))return {markup:`<b class="loot-resource-symbol">${{xp:'EXP',hp:'♥',refresh:'↻'}[content.kind]}</b>`,label:`${{xp:'经验',hp:'小队生命',refresh:'免费刷新'}[content.kind]} +${content.amount||0}`,target:content.kind==='hp'?'.resource.life':content.kind==='xp'?'.experience-button':'.refresh-button'};
  return {image:'assets/ui/coin.svg',label:'获得战利品',target:'.equipment-heading'};
}

// Cosmetic only: inventory changes are committed by collect-loot before this runs.
export function animateLootCollection(orb,rect){
  if(!rect)return;
  const reduced=globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const host=document.createElement('div');host.className='loot-collection-effect';host.setAttribute('aria-hidden','true');host.style.setProperty('--loot-color',colors[quality(orb.quality)]);
  const x=rect.left+rect.width/2,y=rect.top+rect.height/2;
  host.style.left=`${x}px`;host.style.top=`${y}px`;
  host.innerHTML='<span class="loot-burst-ring"></span>'+Array.from({length:10},(_,i)=>`<i class="loot-burst-spark" style="--spark-angle:${i*36}deg;--spark-distance:${32+(i%3)*18}px"></i>`).join('');
  document.body.append(host);
  const content=orb.contents||[];
  content.slice(0,5).forEach((reward,i)=>{
    const visual=rewardVisual(reward),el=document.createElement('div');el.className='loot-drop-token';
    el.innerHTML=`${visual.markup||`<img src="${esc(visual.image)}" alt="">`}<span>${esc(visual.label)}${(reward.amount||1)>1&&['item','character','chest','consumable'].includes(reward.kind)?` ×${reward.amount}`:''}</span>`;host.append(el);
    const target=document.querySelector(visual.target)?.getBoundingClientRect();
    const tx=target?target.left+target.width/2-x:40,ty=target?target.top+target.height/2-y:-90;
    if(el.animate&&!reduced)el.animate([{transform:'translate(-50%,-50%) scale(.3)',opacity:0},{transform:`translate(calc(-50% + ${(i-(content.length-1)/2)*38}px),-80px) scale(1)`,opacity:1,offset:.3},{transform:`translate(calc(-50% + ${(i-(content.length-1)/2)*38}px),-80px) scale(1)`,opacity:1,offset:.62},{transform:`translate(calc(-50% + ${tx}px),calc(-50% + ${ty}px)) scale(.25)`,opacity:0}],{duration:1000,delay:i*65,easing:'cubic-bezier(.2,.7,.3,1)',fill:'both'});
  });
  setTimeout(()=>host.remove(),reduced?250:1500);
}
