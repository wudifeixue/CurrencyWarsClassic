// 补给阶段 — laid out after the old season's supply screen (REC1 5:31, 18:12, 32:37; REC2 5:50): a gold
// backdrop under the route bar, five packs of a character card above the equipment it carries, the
// re-deal counter (剩余次数) and 已选择 0/1 beside 确认, 角色详情 bottom-left and 返回备战界面 top-right.
// Labels are the Chinese client strings (TextMapCHS).
import { CHARACTERS, TRAITS, LEGACY_TRAITS, resolveEquipment, getEquipmentArtPath, getTraitArtPath } from './data.js?v=6.5.0';
import { getEffectiveCharacterCost } from './engine.js?v=6.5.0';

const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const RARITY = ['', '#8d929c', '#3f9e8a', '#5d6fe0', '#9a68dc', '#d6a83e'];
const traitName = id => TRAITS.find(t => t.id === id)?.name || LEGACY_TRAITS.find(t => t.id === id)?.name || id;
const zoneLabel = z => ({ front: '前台', back: '后台' }[z]);

function packCard(game, offer, index, selected, details) {
  const charReward = offer.rewards.find(r => r.kind === 'character');
  const itemReward = offer.rewards.find(r => r.kind === 'item');
  const c = CHARACTERS.find(x => x.id === charReward?.id);
  const item = itemReward && resolveEquipment(itemReward.id);
  if (!c) return '';
  const cost = getEffectiveCharacterCost(game, c.id);
  const owned = game.units.filter(u => u.characterId === c.id).length;
  const picked = selected === index;
  const longName = item && item.name.length > 5;
  const detail = (c.empowerments || []).map(e => `<span><b>${zoneLabel(e.zone) || ''} · ${esc(e.name)}</b>${esc(e.description)}</span>`).join('') || `<span>${esc(c.description || '')}</span>`;
  return `<button class="supply-pack ${picked ? 'is-selected' : ''}" style="--rarity:${RARITY[cost] || RARITY[1]};--deal:${index}" data-action="node-select" data-index="${index}" aria-pressed="${picked}" aria-label="${esc(c.name)}（${cost}费）与${esc(item?.name || '')}">
    <span class="supply-card">
      <img class="supply-face" src="assets/portraits/${esc(c.id)}.png" alt="" draggable="false">
      <span class="supply-zones" title="赋能位置 · ${(c.allowedZones || []).map(zoneLabel).join(' / ')}"><i class="${c.allowedZones?.includes('front') ? 'on' : ''}"></i><i class="${c.allowedZones?.includes('back') ? 'on' : ''}"></i></span>
      ${owned ? `<span class="supply-owned" title="已拥有 ${owned} 名"></span>` : ''}
      <span class="supply-traits">${c.traits.map(t => `<span><img src="${getTraitArtPath(t)}" alt="" draggable="false">${esc(traitName(t))}</span>`).join('')}</span>
      <span class="supply-name"><b>${esc(c.name)}</b><small>${cost}</small></span>
      ${details ? `<span class="supply-detail">${detail}</span>` : ''}
    </span>
    <i class="supply-divider" aria-hidden="true"></i>
    <span class="supply-item ${longName ? 'is-long' : ''}">${item ? `<span class="supply-item-art"><img src="${getEquipmentArtPath(item.id)}" alt="" draggable="false"></span><b>${esc(item.name)}${itemReward.amount > 1 ? ` ×${itemReward.amount}` : ''}</b>` : ''}</span>
    <span class="supply-check" aria-hidden="true"></span>
  </button>`;
}

export function supplyScreen(game, selected = null, { route = '', canReturn = false, details = false, dealing = false } = {}) {
  const offers = game.flow?.supplyOffers || [];
  const rerolls = game.flow?.supplyRerolls || 0;
  const valid = Number.isInteger(selected) && offers[selected];
  return `<div class="reference-overlay supply-overlay"><section class="reference-fullscreen supply-screen" role="dialog" aria-modal="true" aria-labelledby="modal-heading">
    <div class="supply-backdrop" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
    ${route}
    ${canReturn ? '<button class="supply-return" data-action="choice-hide"><span aria-hidden="true">⇄</span>返回备战界面</button>' : ''}
    <h1 id="modal-heading" class="supply-title">补给阶段</h1>
    <div class="supply-packs ${dealing ? 'is-dealing' : ''}">${offers.map((offer, i) => packCard(game, offer, i, selected, details)).join('')}</div>
    <button class="supply-details-toggle" data-action="supply-details" aria-pressed="${details}"><span aria-hidden="true">⌕</span>${details ? '隐藏角色详情' : '角色详情'}</button>
    <button class="supply-flip" data-action="reroll-supply" ${rerolls ? '' : 'disabled'} title="重置所有可选角色和装备"><span aria-hidden="true">↻</span>剩余次数：${rerolls}</button>
    <span class="supply-selected">已选择${valid ? 1 : 0}/1</span>
    <button class="supply-confirm" data-action="node-confirm" ${valid ? '' : 'disabled'}><span aria-hidden="true">✓</span>确认</button>
  </section></div>`;
}
