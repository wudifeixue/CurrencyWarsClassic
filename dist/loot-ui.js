import {EQUIPMENT,CHARACTERS,resolveEquipment,getEquipmentArtPath} from './data.js?v=6.3.0';
import {getConsumable} from './loot.js?v=6.3.0';

const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const item=id=>resolveEquipment(id);
const person=id=>CHARACTERS.find(c=>c.id===String(id));
const qualityNames={white:'白色晶矿',blue:'蓝色晶矿',gold:'金色晶矿',prismatic:'棱彩晶矿'};
const colors={white:'#effaff',blue:'#7ee1ff',gold:'#ffdb67',prismatic:'#d0a8ff'};
const quality=value=>Object.hasOwn(qualityNames,value)?value:'white';
const itemImage=id=>{const e=item(id);return `<img class="${e?.privileged?'is-privileged':''}" src="${esc(getEquipmentArtPath(id))}" alt="" draggable="false">`;};
const arrow='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m10 5-7 7 7 7M3 12h18"/></svg>';

export function chestType(chest){
  if(['privileged','prismatic'].includes(chest.quality)||chest.options?.some(id=>item(id)?.privileged))return 'privileged';
  return chest.quality==='advanced'||chest.options?.some(id=>item(id)?.tier===2)?'advanced':'basic';
}
export const chestName=chest=>({basic:'简易武装箱',advanced:'进阶武装箱',privileged:'特权武装箱'})[chestType(chest)];
export const chestArt=chest=>`<img src="assets/loot/chest-${chestType(chest)}.png" alt="" draggable="false">`;

export function consumableArt(id){
  if(['projector','perfect-projector','privilege-card'].includes(id))return `<img src="assets/loot/${id}.png" alt="" draggable="false">`;
  if(['wrench','precision-wrench'].includes(id))return `<svg class="consumable-glyph ${id==='precision-wrench'?'is-precision':''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.5 3.5a5 5 0 0 0-4.300 7.200L3.500 17.400a2.200 2.200 0 0 0 3.100 3.100l6.700-6.700a5 5 0 0 0 6.900-5.800l-3 3-2.800-.700-.700-2.800 3-3a5 5 0 0 0-2.200-1Z"/>${id==='precision-wrench'?'<path d="M5.200 18.800h.01"/>':''}</svg>${id==='precision-wrench'?'<b class="consumable-cost">∞</b>':''}`;
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
  const chests=(game.chests||[]).map(chest=>`<button class="inventory-item loot-chest chest-${chestType(chest)}" data-key="chest-${esc(chest.uid)}" data-action="open-chest" data-uid="${esc(chest.uid)}" data-tip-title="${chestName(chest)}" data-tip="点击打开并三选一；返回不会消耗箱子。" aria-label="打开${chestName(chest)}">${chestArt(chest)}<span class="inventory-kind">自选</span></button>`);
  const consumables=(game.consumables||[]).map(c=>{const info=getConsumable(c.id);return `<button class="inventory-item loot-consumable" data-key="consumable-${esc(c.uid)}" data-action="consumable" data-uid="${esc(c.uid)}" data-tip-title="${esc(info?.name||c.id)}" data-tip="${esc(info?.description||'')}" ${info?.requiresTarget?'data-tip-extra="拖到角色身上使用，或点击选择角色"':''} aria-label="${info?.passive?'查看':'使用'}${esc(info?.name||c.id)}">${consumableArt(c.id)}<span class="inventory-kind">道具</span></button>`;});
  const items=groupedInventory(game.inventory).map(({id,index,amount})=>{const e=item(id);return `<button class="inventory-item tier-${e.tier} ${e.privileged?'is-privileged':''}" data-key="item-${esc(id)}" data-action="item" data-index="${index}" data-tip-kind="item" data-tip-id="${esc(id)}" data-tip-extra="${amount>1?`共 ${amount} 件 · `:''}拖到角色身上穿戴，或点击选择角色" aria-label="装备${esc(e.name)}${amount>1?`，共${amount}件`:''}">${itemImage(id)}${amount>1?`<span class="inventory-count">${amount}</span>`:''}</button>`;});
  return [...chests,...consumables,...items].join('')||'<p class="inventory-empty">仓库<br>暂无装备</p>';
}

export function chestScreen(game,selected=null){
  const chest=(game.chests||[]).find(c=>c.uid===game.activeChest);if(!chest)return '';
  const selectedId=Number.isInteger(selected)?chest.options[selected]:null;
  return `<div class="reference-overlay"><section class="reference-fullscreen chest-screen chest-${chestType(chest)}" role="dialog" aria-modal="true" aria-labelledby="modal-heading" tabindex="-1"><div class="chest-screen-pattern" aria-hidden="true"></div><button class="chest-return" data-action="cancel-chest">${arrow}返回备战界面</button><header class="chest-heading"><span></span><h1 id="modal-heading">${chestName(chest)}</h1><span></span></header><p class="chest-intro">选择一件装备</p><div class="chest-options" style="--option-count:${chest.options.length}">${chest.options.map((id,index)=>{
    const e=item(id);if(!e)return '';
    return `<button class="chest-option ${selected===index?'selected':''} tier-${e.tier}" data-action="chest-select" data-index="${index}" aria-pressed="${selected===index}" aria-label="选择${esc(e.name)}"><span class="chest-option-image">${itemImage(id)}</span><span class="chest-option-name">${esc(e.name)}</span><span class="chest-option-rule"></span><span class="chest-option-description">${esc(e.description)}</span><span class="chest-selected-mark" aria-hidden="true">✓</span></button>`;
  }).join('')}</div><p class="chest-retain-note">返回后武装箱仍保留，可以稍后再选。</p><div class="chest-actions"><button class="chest-cancel" data-action="cancel-chest">暂不选择</button><button class="reference-confirm-button" data-action="choose-chest" ${!selectedId?'disabled':''}><span>确认选择${selectedId?` · ${esc(item(selectedId)?.name)}`:''}</span></button></div></section></div>`;
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
