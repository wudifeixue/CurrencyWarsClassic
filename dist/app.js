import { environmentScreen, environmentSummary, environmentDetails } from './environment-ui.js?v=6.0.0';
import { modeScreen, nodeScreen } from './run-ui.js?v=6.0.0';
import { isCraftingMaterial, getEquipCraftPreview } from './classic-crafting.js?v=6.0.0';
import { progressionSummary, progressionScreen } from './progression-ui.js?v=6.0.0';
import { getProgressionPanels } from './classic-progression.js?v=6.0.0';
import { choiceScreen, resultScreen } from './reference-screens.js?v=6.0.0';
import { lootField, inventoryContents, chestScreen, animateLootCollection, consumableArt } from './loot-ui.js?v=6.0.0';
import { getConsumable } from './loot.js?v=6.0.0';
import { combatMarkup } from './battle-ui.js?v=6.0.0';
import { getEnemyLineup, CLASSIC_SIMULATION_NOTE, getClassicSimulationDescription, getClassicTraitSimulationDescription } from './combat.js?v=6.0.0';
import { CHARACTERS, CLASSIC_ROSTER, TRAITS, LEGACY_TRAITS, getTraitArtPath, getEquipmentArtPath, EQUIPMENT, STRATEGIES, RECIPES, LEVEL_XP, SHOP_ODDS, MAX_LEVEL, BENCH_CAPACITY } from './data.js?v=6.0.0';
import { createGame, act, getSynergies, getEnemy, getUnitStats, migrateState, getInterest, getRefreshCost, getPopulationLimit, getEffectiveCharacterCost, getShopOdds, getCharacter, getEquipment, getSellPrice, getCurrentNode, getRunMode, getRunNodes, getRunLength, getLevelXp } from './engine.js?v=6.0.0';

const paths = {
 star:'M12 2 15 9 22 12 15 15 12 22 9 15 2 12 9 9Z',
 swords:'m4 3 8 8-3 3-8-8V3h3Zm16 0-8 8 3 3 8-8V3h-3ZM4 20l5-5m6 0 5 5M2 16l6 6m8 0 6-6',
 grid:'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
 book:'M3 4h7l2 2 2-2h7v15h-7l-2 2-2-2H3zM12 6v15',
 hammer:'m14 3 7 7-3 3-3-3-9 11-4-4L13 8l-3-3 4-2Z',
 help:'M9 8a3 3 0 1 1 5 2c-2 1-2 2-2 3m0 4h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z',
 reset:'M3 10a9 9 0 1 1 2 8M3 3v7h7',
 coin:'M20 12a8 8 0 1 1-16 0 8 8 0 0 1 16 0ZM12 7v10m3-7c0-3-6-3-6 0s6 1 6 4-6 3-6 0',
 heart:'M12 21 3 12a6 6 0 0 1 9-8 6 6 0 0 1 9 8Z',
 level:'m3 12 9-9 9 9-9 9-9-9Zm4 0 5-5 5 5-5 5-5-5Z',
 population:'M12 1a4.5 3.5 0 1 0 0 7 4.5 3.5 0 1 0 0-7ZM5 10 12 8.5 19 10 14.5 23H9.5Z',
 users:'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm10-7a4 4 0 0 1 0 8m3 9v-2a4 4 0 0 0-3-4',
 plus:'M12 5v14M5 12h14',
 lock:'M6 10V7a6 6 0 0 1 12 0v3M4 10h16v11H4zM12 14v3',
 unlock:'M7 10V7a5 5 0 0 1 9-3M4 10h16v11H4zM12 14v3',
 refresh:'M20 7a9 9 0 0 0-15-2L2 8m0-6v6h6m-4 9a9 9 0 0 0 15 2l3-3m0 6v-6h-6',
 arrow:'M4 12h16m-6-6 6 6-6 6',
 shop:'M3 9h18l-2-6H5L3 9Zm1 0v12h16V9M9 21v-8h6v8M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0',
 bag:'M4 7h16v15H4zM8 7V5a4 4 0 0 1 8 0v2',
 check:'m4 12 5 5L20 6',
 shield:'M12 2 3 6v7c0 5 9 9 9 9s9-4 9-9V6l-9-4Z',
 close:'m6 6 12 12M6 18 18 6',
 crown:'m2 6 5 5 5-8 5 8 5-5-3 13H5L2 6ZM5 22h14',
 route:'M5 5h12a4 4 0 0 1 0 8H7a4 4 0 0 0 0 8h12M5 2v6m14 10v6',
 info:'M12 11v6m0-10h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z',
 expand:'M9 3H3v6m12-6h6v6M3 15v6h6m12-6v6h-6',
 clock:'M12 6v6l4 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z',
};
const icon = (name,cls='') => name==='coin'?`<img class="icon coin-icon ${cls}" src="assets/ui/coin.svg" alt="金币" draggable="false">`:`<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[name]||paths.star}"/></svg>`;
const esc = value => String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt = value => Number(value).toLocaleString('zh-CN');
const traitName = id => TRAITS.find(t=>t.id===id)?.name||LEGACY_TRAITS.find(t=>t.id===id)?.name||id;
const rarity = ['','#b8bec8','#6cc2ad','#758afa','#ae84ed','#e4c871'];
const portrait = c => `assets/portraits/${c.id}.png`;
const itemArt = (id,cls='') => {const e=getEquipment(id);return `<img class="equipment-art ${e?.privileged?'is-privileged':''} ${cls}" src="${getEquipmentArtPath(id)}" alt="" draggable="false">`;};
const dayItems = unit => Object.entries(game.progression?.day?.assignments||{}).filter(([,uid])=>uid===unit.uid).map(([id])=>id);
const occupiedSlots=unit=>unit.items.some(id=>getEquipment(id)?.exclusiveSlots)?3:unit.items.length+dayItems(unit).length;
const traitArt = id => `<img src="${getTraitArtPath(id)}" alt="" draggable="false">`;
const saveKey = 'currency-wars-classic-v1';
let saveAvailable=true, recovered=false, newRunRequired=false;
function loadGame(){try{const raw=localStorage.getItem(saveKey);if(raw){const saved=JSON.parse(raw);const migrated=migrateState(saved);if(migrated){if(migrated.phase==='result'&&(migrated.hp<=0||migrated.round===getRunLength(migrated)))act(migrated,{type:'next'});return migrated;}recovered=true;}}catch{recovered=true;}newRunRequired=true;return createGame();}
const zoneName=z=>({front:'前台',back:'后台',bench:'备战席'}[z]);
const positions=c=>c.allowedZones.map(zoneName).join(' / ');
const positionBadge=(c,zone)=>`<span class="unit-position classic-position ${zone&&zone!=='bench'&&!c.allowedZones.includes(zone)?'wrong-position':''}" title="赋能位置：${positions(c)}"><i class="${c.allowedZones.includes('front')?'is-filled':''}"></i><i class="${c.allowedZones.includes('back')?'is-filled':''}"></i></span>`;
let game=loadGame(), selected=game.units[1]?.uid, tab='battle', modal=newRunRequired?{type:'modes'}:null, craft=[], codexCost=0, codexQuery='', battleAnimating=false, toastTimer, battleTimer, previousFocus=null, playback=null, shopOpen=true, enlarged=false, choiceSelected=null, chestSelected=null, resultView='overview', modeSelected='standard', difficultySelected=0, nodeSelected=null, environmentSelected=null;
const app=document.getElementById('app'),modalRoot=document.getElementById('modal-root');
function save(){if(newRunRequired)return;try{localStorage.setItem(saveKey,JSON.stringify(game));saveAvailable=true;}catch{saveAvailable=false;}}
function toast(message){if(!message)return;const el=document.getElementById('toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2800);}
function perform(action,{quiet=false}={}){const result=act(game,action);if(result.ok){save();if(!game.units.some(u=>u.uid===selected))selected=game.units.find(u=>u.zone==='front')?.uid;render();}if(!quiet||!result.ok)toast(result.message);return result;}
function unitCard(unit,kind='front') {
 const c=getCharacter(unit.characterId);
 return `<button class="unit-card roster-card ${selected===unit.uid?'selected':''}" style="--char:${c.color};--rarity:${rarity[c.cost]}" data-action="select" data-uid="${unit.uid}" draggable="false" aria-label="选择${c.name}，${unit.star}星" aria-pressed="${selected===unit.uid}">
 <img class="face" src="${portrait(c)}" alt="" draggable="false">${positionBadge(c,kind)}<span class="unit-stars">${'★'.repeat(unit.star)}</span><span class="unit-name">${c.name}</span>
 <span class="equipped-icons">${unit.items.map(id=>`<span class="equipped-icon tier-${getEquipment(id).tier}" title="${getEquipment(id).name}">${itemArt(id)}</span>`).join('')}</span></button>`;
}

function emptySlot(zone,index){return `<div class="empty-slot" data-zone="${zone}" aria-label="${zone==='front'?'前台':zone==='back'?'后台':'备战席'}空位 ${index+1}"><span class="slot-ornament"></span></div>`;}

function row(zone,max){const units=game.units.filter(u=>u.zone===zone);return units.map(u=>unitCard(u,zone)).join('')+Array.from({length:Math.max(0,max-units.length)},(_,i)=>emptySlot(zone,units.length+i)).join('');}
function header(){const leader=getCharacter(game.units.find(u=>u.zone==='front')?.characterId||'1001');return `<header class="topbar"><button class="scene-back" data-action="${tab==='battle'?'help':'tab'}" data-tab="battle" aria-label="${tab==='battle'?'玩法指南':'返回备战'}">${icon('arrow')}</button><button class="profile-badge" data-action="modes" aria-label="博弈模式" title="切换博弈模式"><span class="profile-rank">${icon('crown')}<b>${game.wins}</b></span><img src="${portrait(leader)}" alt=""><div><strong>${getRunMode(game).name}</strong><span>${getCurrentNode(game).label} · ${game.wins} 胜 ${game.losses} 负</span></div></button><nav class="navigation" aria-label="主要导航">${[['codex','grid','角色图鉴'],['history','route','战斗记录'],['fullscreen','expand','全屏游玩']].map(([id,i,name])=>`<button class="nav-item" data-action="${['workshop','codex'].includes(id)?'tab':id}" data-tab="${id}" title="${name}" aria-label="${name}">${icon(i)}</button>`).join('')}</nav></header>`;}

function overview(){const node=getCurrentNode(game),nodes=getRunNodes(game).filter(n=>n.plane===node.plane);return `<section class="overview" aria-label="博弈进度"><div class="stage-label"><h1>${game.phase==='ended'?'博弈结束':node.type==='supply'?'补给阶段':'备战阶段'}</h1><strong>${node.label}</strong></div><div class="overview-route">${nodes.map((n,i)=>`<span class="route-dot ${n.round<game.round?'done':n.round===game.round?'current':''} ${n.boss?'boss':''}" title="${n.label} · ${n.name}">${icon({boss:'crown',strategy:'book',supply:'bag',encounter:'shield',reward:'star',battle:'swords'}[n.type])}${n.boss?'<small>首领</small>':''}</span>${i<nodes.length-1?'<i class="route-link"></i>':''}`).join('')}</div><div class="resource life">${icon('heart')}<strong>${game.hp}</strong></div></section>`;}

function synergies(){return `<aside class="trait-rail" aria-label="阵容羁绊"><div class="synergy-list">${getSynergies(game).map(s=>`<button class="synergy ${s.active?'activated':''}" data-action="trait" data-id="${s.id}" title="${s.description}"><span class="trait-symbol"><span>${traitArt(s.id)}</span><b>${s.count}</b></span><div><div class="synergy-name">${s.name}</div><div class="synergy-count">${s.thresholds.map(n=>`<span class="${s.count>=n?'achieved':''}">${n}</span>`).join('<i>/</i>')}</div></div></button>`).join('')||'<p class="no-items">部署角色<br>激活羁绊</p>'}</div></aside>`;}

function strategies(){return `<div class="strategy-pins" aria-label="投资策略">${game.strategies.length?game.strategies.map(id=>{const st=STRATEGIES.find(s=>s.id===id);return `<button data-action="strategies" title="${st.name}：${st.description}" aria-label="${st.name}"><span>${st.legacy?st.icon:`<img class="strategy-art" src="assets/strategies/classic-${st.id}.png" alt="">`}</span></button>`;}).join(''):`<button data-action="strategies" aria-label="查看投资策略" title="投资策略 · 在投资节点选择">${icon('book')}</button>`}</div>`;}

function board(){const deployed=game.units.filter(u=>u.zone!=='bench').length,capacity=getPopulationLimit(game);return `<section class="board" aria-label="部署区域"><div class="population" aria-label="已部署 ${deployed} 人，人口上限 ${capacity} 人">${icon('population')}<strong>${deployed}<span>/${capacity}</span></strong></div><div class="front-label"><i></i>前台区域</div><div class="front-row" data-zone="front">${row('front',4)}</div><div class="back-label"><i></i>后台区域</div><div class="back-row" data-zone="back" style="--slots:${Math.max(6,game.units.filter(u=>u.zone==='back').length)}">${row('back',6)}</div><div class="board-hint">拖动部署 · 拖至左右底角出售 · 悬停角色按 E 出售</div></section>`;}

function benchDock(){const interest=getInterest(game);return `<div class="bench-dock"><button class="experience-button" data-action="exp" ${game.gold<4||game.level===MAX_LEVEL?'disabled':''} aria-label="购买经验，4金币"><kbd>F</kbd><span>${game.level===MAX_LEVEL?'满级':'购买经验'}</span><strong><small>Lv.</small>${game.level}</strong><span class="experience-progress">${game.level===MAX_LEVEL?'最高等级':`${game.xp} / ${getLevelXp(game)}`}</span><div class="experience-track"><i style="width:${game.level===MAX_LEVEL?100:game.xp/getLevelXp(game)*100}%"></i></div>${game.level===MAX_LEVEL?'':`<b>${icon('coin')} 4</b>`}</button><section class="bench-wrap" aria-label="备战席"><div class="bench" data-zone="bench">${row('bench',BENCH_CAPACITY)}</div></section><div class="streak-badge" title="已胜利场数">${icon('crown')}<strong>${game.wins}</strong></div><button class="shop-toggle ${shopOpen?'active':''}" data-action="shop-toggle" aria-pressed="${shopOpen}">${interest?`<span class="interest-banner">利息 +${interest}</span>`:''}<strong>${icon('coin')}${game.gold}</strong><span>${shopOpen?'收起':'商店'}</span></button></div>`;}

function shop(){const probabilities=getShopOdds(game),price=getRefreshCost(game);return `${shopOpen?`<section class="shop" aria-label="角色商店"><div class="shop-cards">${game.shop.map((id,i)=>{if(!id)return `<div class="shop-sold" aria-label="该位置角色已招募"><span class="slot-ornament"></span></div>`;const c=getCharacter(id),cost=getEffectiveCharacterCost(game,id),copies=game.units.filter(u=>u.characterId===id&&u.star===1).length;return `<button class="shop-card" style="--char:${c.color};--rarity:${rarity[cost]}" data-action="buy" data-index="${i}" ${game.gold<cost?'disabled':''} aria-label="招募${c.name}，${cost}金币"><img class="face" src="${portrait(c)}" alt="" draggable="false">${positionBadge(c)}${copies?`<span class="owned-badge" title="已拥有${copies}张一星角色">${icon('users')}<b>${copies}</b></span>`:''}<div class="shop-traits">${c.traits.map(t=>`<span>${traitArt(t)}${traitName(t)}</span>`).join('')}<span class="shop-role">${icon(c.role==='治疗'?'heart':c.role==='守护'?'shield':'star')}${positions(c)} · ${c.element}</span></div><div class="shop-info"><h3>${c.name}</h3><span class="shop-price">${icon('coin')}${cost}</span></div></button>`;}).join('')}</div><div class="shop-footer"><div class="shop-probs" aria-label="商店费用概率">${probabilities.map((p,i)=>`<span style="color:${rarity[i+1]}" title="${i+1}费角色"><i></i>${Number(p.toFixed(1))}%</span>`).join('')}</div><button class="shop-search" data-action="tab" data-tab="codex" title="查看角色图鉴" aria-label="查看角色图鉴">${icon('book')}</button><button class="shop-lock ${game.locked?'active':''}" data-action="lock" title="${game.locked?'解除锁定':'锁定商店'}" aria-label="${game.locked?'解除商店锁定':'锁定商店'}" aria-pressed="${game.locked}">${icon(game.locked?'lock':'unlock')}</button></div></section>`:''}<button class="refresh-button" data-action="refresh" ${game.gold<price?'disabled':''} title="刷新商店 (D / R)"><kbd>D</kbd><span>${price===0?'免费刷新':'刷新'}</span><strong>${price===0?`剩余 ${game.freeRefreshes}`:`${icon('coin')}${price}`}</strong></button>`;}

function detail(){const unit=game.units.find(u=>u.uid===selected);if(!unit)return `<section class="panel selected-panel"><div class="panel-heading"><h2>角色详情</h2></div><p class="no-items">选择一位角色<br>查看技能与调整部署</p></section>`;const c=getCharacter(unit.characterId),stats=getUnitStats(game,unit);return `<section class="panel selected-panel" style="--char:${c.color}"><div class="detail-top"><img src="${c.image}" alt=""><div class="detail-title"><small>角色详情</small><h2>${c.name}</h2><span class="stars">${'★'.repeat(unit.star)}</span></div><span class="detail-role">${c.element} · ${c.role} · ${{front:'前台',back:'后台',bench:'备战'}[unit.zone]}</span></div><div class="detail-body"><div class="detail-stats"><div class="detail-stat"><small>攻击</small><span>${stats.attack}</span></div><div class="detail-stat"><small>生命</small><span>${fmt(stats.hp)}</span></div><div class="detail-stat"><small>速度</small><span>${stats.speed}</span></div></div><button class="detail-skill-button" data-action="character" data-id="${c.id}"><div class="skill-name">${icon('star')}${unit.zone==='bench'?'赋能位置：'+positions(c):c.allowedZones.includes(unit.zone)?zoneName(unit.zone)+'赋能':'当前站位未激活赋能'}</div><p class="skill-desc">${esc(c.empowerments.find(e=>e.zone===unit.zone)?.description||c.description)}</p><small>查看经典赋能与本作模拟说明 ›</small></button><div class="detail-items">${Array.from({length:3},(_,i)=>unit.items[i]?`<button class="item-slot filled" data-action="unequip" data-uid="${unit.uid}" data-index="${i}" title="${getEquipment(unit.items[i]).name}：${getEquipment(unit.items[i]).description} 点击卸下" aria-label="卸下${getEquipment(unit.items[i]).name}">${itemArt(unit.items[i])}</button>`:dayItems(unit)[i-unit.items.length]?`<button class="item-slot day-slot" data-action="progression-open" title="白昼装备占用此栏，可在羁绊成长中调整">${traitArt('day')}<small>白昼</small></button>`:unit.items.some(id=>getEquipment(id)?.exclusiveSlots)?'<span class="item-slot reserved-slot" title="随便骰子占用此栏">锁定</span>':'<span class="item-slot" title="从装备仓库选择装备">＋</span>').join('')}</div><div class="unit-controls">${['front','back','bench'].filter(z=>z!==unit.zone).map(z=>`<button class="secondary-button" data-action="move" data-uid="${unit.uid}" data-zone="${z}">${{front:'移至前台',back:'移至后台',bench:'移至备战'}[z]}</button>`).join('')}</div><button class="sell-button" aria-label="出售${esc(c.name)}，获得${getSellPrice(game,unit)}金币" data-action="sell" data-uid="${unit.uid}">出售角色 <span class="gold">+ ${getSellPrice(game,unit)} 金币</span></button></div></section>`;}

function inventory(){const count=game.inventory.length+(game.chests?.length||0)+(game.consumables?.length||0);return `<aside class="equipment-rail" aria-label="装备与道具仓库"><button class="equipment-heading" data-action="tab" data-tab="workshop" title="装备工坊" aria-label="装备工坊">${icon('hammer')}<span>${count}</span></button><div class="inventory" aria-label="竖向装备列表">${inventoryContents(game)}</div></aside>`;}

function battlePanel(){const node=getCurrentNode(game),noncombat=!node.combat,enemy=noncombat?null:getEnemy(game);return `${enemy?`<button class="enemy-peek" data-action="enemy" title="查看敌方阵容">${icon(enemy.boss?'crown':'swords')}<span>${enemy.name}</span>${icon('info')}</button>`:'<span class="node-complete-label">补给已选择 · 可整理装备和阵容</span>'}<button class="launch-button" data-action="${noncombat?'next-node':'battle'}" ${game.phase!=='prep'?'disabled':''}>${icon(noncombat?'arrow':'swords')}<span>${noncombat?'继续前进':'出战'}</span></button>`;}

function sellZones(){return ['left','right'].map(side=>`<div class="sell-zone sell-zone-${side}" data-sell-zone aria-label="拖到此处出售角色"><span>${icon('coin')}</span><strong>出售角色</strong><b class="sell-zone-value">拖到此处</b><small>装备自动返还</small></div>`).join('');}

function battlePage(){return `${sellZones()}${synergies()}${strategies()}${board()}${benchDock()}${inventory()}${environmentSummary(game)}${progressionSummary(game)}${lootField(game)}${battlePanel()}${shop()}`;}

function workshop(){const a=getEquipment(game.inventory[craft[0]]),b=getEquipment(game.inventory[craft[1]]),result=a&&b?getEquipment(RECIPES[[a.id,b.id].sort().join('+')]):null;return `<section class="panel page-panel"><div class="tab-page-head"><div><h2>装备工坊 <span class="tiny-label">EQUIPMENT WORKSHOP</span></h2><p>选择两件材料预览成品；也可把第二件材料直接交给角色合成。</p></div><button class="secondary-button" data-action="tab" data-tab="battle">${icon('arrow')}返回筹备</button></div><div class="workshop-layout"><div><h3>装备仓库 <small>${game.inventory.length} 件</small></h3><div class="workshop-inventory">${game.inventory.map((id,i)=>{const e=getEquipment(id);return `<button class="workshop-item ${craft.includes(i)?'selected':''}" data-action="craft-select" data-index="${i}" ${!isCraftingMaterial(e.id)?'disabled':''} title="${e.description}"><span>${itemArt(e.id)}</span><strong>${e.name}</strong><small>${e.craftingMaterial?'特殊材料':e.tier===1?'简易装备':'进阶装备'}</small></button>`;}).join('')||'<p class="no-items">仓库空空的，卸下装备或赢取补给吧。</p>'}</div><div class="recipe-list"><h3>合成图谱</h3>${Object.entries(RECIPES).map(([key,id])=>`<div class="recipe-row"><span>${key.split('+').map(x=>getEquipment(x).name).join(' ＋ ')}</span><span>${getEquipment(id).name}</span></div>`).join('')}</div></div><div><div class="crafting-station"><small class="eyebrow">SOMETHING GREATER, TOGETHER</small><div class="crafting-slots"><div class="crafting-slot">${a?itemArt(a.id):'＋'}</div><span class="muted">＋</span><div class="crafting-slot">${b?itemArt(b.id):'＋'}</div></div><div class="craft-result"><span>${result?itemArt(result.id):'◇'}</span><h3>${result?result.name:'等待合成'}</h3><p>${result?result.description:'从左侧选择两件材料'}</p><button class="primary-button" data-action="combine" ${!result?'disabled':''}>${icon('hammer')} 确认合成</button></div></div><p class="helper-note">合成会消耗两件材料。红钻、蓝钻可与简易装备合成星徽；两钻合成财富宝钻。穿戴第二件材料时会自动合成，详情中可预览结果。</p></div></div></section>`;}
function codex(){const list=CLASSIC_ROSTER.filter(c=>(!codexCost||c.cost===codexCost)&&(!codexQuery||`${c.name}${c.element}${c.traits.map(traitName).join('')}`.includes(codexQuery)));return `<section class="panel page-panel"><div class="tab-page-head"><div><h2>角色图鉴 <span class="tiny-label">CHARACTER ARCHIVE</span></h2><p>${CLASSIC_ROSTER.length} 位同行者 · 零和博弈经典卡池</p></div><span class="number muted">${list.length} / ${CLASSIC_ROSTER.length}</span></div><div class="codex-controls">${[0,1,2,3,4,5].map(n=>`<button class="filter-button ${codexCost===n?'active':''}" data-action="filter" data-cost="${n}">${n?`${n} 费角色`:'全部角色'}</button>`).join('')}<input id="codex-search" class="search-input" placeholder="搜索角色、属性、羁绊" aria-label="搜索角色" value="${esc(codexQuery)}"></div><div class="codex-grid">${list.map(c=>`<button class="unit-card" style="--char:${c.color};--rarity:${rarity[c.cost]}" data-action="character" data-id="${c.id}" aria-label="查看${c.name}"><img src="${c.image}" alt="" loading="lazy"><span class="cost-badge">${icon('coin')}${c.cost}</span><div class="unit-info"><h3>${c.name}</h3><div class="unit-tags">${c.traits.map(t=>`<span>${traitName(t)}</span>`).join('')}</div><small>${c.element} · ${c.role}</small></div></button>`).join('')||'<p class="no-items">没有匹配的角色。</p>'}</div></section>`;}
function footer(){return `<footer class="scene-footer"><span>经典回响 · 零和博弈 v6</span><div><span class="save-indicator">${saveAvailable?'进度已保存':'仅本次会话'}</span><button data-action="help">玩法指南</button><a href="https://github.com/wudifeixue/CurrencyWarsClassic" target="_blank" rel="noopener">GitHub ↗</a></div></footer>`;}

function render(){const inventoryScroll=app.querySelector('.equipment-rail .inventory')?.scrollTop||0;app.innerHTML=`<main class="classic-scene ${shopOpen&&tab==='battle'?'shop-is-open':''} ${tab!=='battle'?'is-secondary':''}"><div class="scene-rails" aria-hidden="true"><div class="rail-left"></div><div class="rail-right"></div></div>${header()}${overview()}${tab==='battle'?battlePage():`<div class="secondary-screen">${tab==='workshop'?workshop():codex()}</div>`}${footer()}</main>`;const inventoryList=app.querySelector('.equipment-rail .inventory');if(inventoryList)inventoryList.scrollTop=inventoryScroll;fitGame();renderModal();}

function fitGame(){const portrait=innerWidth<900&&innerHeight>innerWidth;document.body.classList.toggle('has-orientation-hint',portrait);document.body.classList.toggle('enlarged',enlarged&&portrait);const availableHeight=innerHeight-(portrait?52:0);const fitted=Math.min(innerWidth/1920,availableHeight/1080);const scale=enlarged&&portrait?Math.max(.65,fitted):fitted;const viewport=document.getElementById('game-viewport');viewport.style.width=`${1920*scale}px`;viewport.style.height=`${1080*scale}px`;app.style.transform=`scale(${scale})`;document.documentElement.style.setProperty('--battle-scale',Math.min(innerWidth/1440,innerHeight/900));document.documentElement.style.setProperty('--reference-scale',Math.min(innerWidth/1920,innerHeight/1080));document.getElementById('zoom-toggle').textContent=enlarged?'适应窗口':'放大操作';}

async function fullscreen(){try{if(document.fullscreenElement)await document.exitFullscreen();else if(document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen();else toast('当前浏览器不支持全屏，请旋转屏幕或在独立浏览器打开。');}catch{toast('当前浏览器无法进入全屏，请使用浏览器的全屏功能。');}}

function openModal(value){previousFocus=document.activeElement;modal=value;renderModal();}
function closeModal(){if(newRunRequired)return;if(game.activeChest){chestSelected=null;perform({type:'cancel-chest'},{quiet:true});}modal=null;renderModal();const focusTarget=previousFocus?.isConnected?previousFocus:app.querySelector(`[data-action="select"][data-uid="${selected}"]`);focusTarget?.focus?.();}
function modalFrame(body,{wide=false,close=true,center=false}={}){return `<div class="overlay" data-action="backdrop"><section class="modal ${center?'modal-centered':''}" role="dialog" aria-modal="true" aria-labelledby="modal-heading" tabindex="-1" ${wide?'style="width:min(900px,100%)"':''}>${close?`<button class="icon-button modal-close" data-action="close" aria-label="关闭">${icon('close')}</button>`:''}${body}</section></div>`;}
function renderModal(){let html='';
 if(modal?.type==='modes'){html=modeScreen(game,modeSelected,difficultySelected,newRunRequired);}
 else if(battleAnimating&&playback){html=combatMarkup(playback,game.lastBattle.enemy,game.round);}
 else if(game.phase==='environment'){html=environmentScreen(game,environmentSelected);}
 else if(['supply','encounter'].includes(game.phase)){html=nodeScreen(game,nodeSelected);}
 else if(game.phase==='choice'){html=choiceScreen(game,choiceSelected);}
 else if(game.phase==='result'){html=resultScreen(game,{view:resultView});}
 else if(game.phase==='ended'&&!modal){html=resultScreen(game,{ended:true,view:resultView});}
 else if(game.activeChest){html=chestScreen(game,chestSelected);}
 else if(modal?.type==='environment-info'){html=environmentDetails(game);}
 else if(modal?.type==='progression'){html=progressionScreen(game);}
 else if(modal?.type==='unit'){html=modalFrame(`<h1 id="modal-heading" class="inspector-heading">角色配置</h1><div class="unit-inspector">${detail()}</div>`);}
 else if(modal?.type==='strategies'){html=modalFrame(`<h1 id="modal-heading">投资策略</h1><p class="modal-intro">投资策略节点可三选一，每张候选卡可单独刷新。环境可能增加额外策略节点；已选效果持续到本局结束。</p><div class="strategy-overview">${game.strategies.map(id=>{const st=STRATEGIES.find(s=>s.id===id);return `<article><span>${st.legacy?st.icon:`<img class="strategy-art" src="assets/strategies/classic-${st.id}.png" alt="">`}</span><div><h2>${st.name}</h2><p>${st.description}</p></div></article>`;}).join('')||'<p class="helper-note">尚未获得投资策略。继续前进至投资节点，即可进行选择。</p>'}</div>`);}
 else if(modal?.type==='enemy'){const enemy=getEnemy(game),lineup=getEnemy(game).units||getEnemyLineup(getCurrentNode(game).combatRound),enemies=Array.isArray(lineup)?lineup:lineup.units||[];html=modalFrame(`<div class="modal-kicker">${getCurrentNode(game).label} · 敌方情报</div><h1 id="modal-heading">${enemy.name}</h1><div class="enemy-reference">${enemies.map(e=>`<article><h2>${esc(e.name)}</h2><p>弱点：${esc((e.weaknesses||[]).join(' · '))}</p></article>`).join('')}</div><p class="helper-note">匹配敌方弱点可以削韧、击破；合理搭配护盾、治疗和后台支援。</p>`);}
 else if(modal?.type==='help'){html=modalFrame(`<div class="modal-kicker">WELCOME BACK, TRAILBLAZER</div><h1 id="modal-heading">熟悉的博弈，轻装上阵。</h1><p class="modal-intro">标准博弈共有三个位面、23 个节点；超频博弈提供更高资源和压缩路线。选择环境、组建队伍，击败最终首领。进度会自动保存在当前浏览器。</p><div class="help-grid">${[['01 / 招募与升星','点击商店卡牌招募角色。三张同星角色自动合成更高星级，最高三星。刷新花费 2 金币，锁店可保留到下回合。'],['02 / 部署与羁绊','前台最多 4 人，人口随等级提升，最高 10；备战席 9 格。只有部署在角色标注的位置才激活赋能，备战角色不参战。点击角色调整位置，或拖动到区域；拖至左右底角可出售回收金币，装备自动返还。'],['03 / 装备与合成','点击仓库装备，再选择穿戴角色。每人最多 3 件，点击已装备图标可免费卸下。8 种简易装备共有 36 种常规配方，红蓝钻与垃圾袋还可合成星徽和财富宝钻。第二件材料穿戴到同一角色时会自动合成。随便骰子需独占三栏，唯一装备不能重复穿戴。'],['04 / 运营与投资','每留 10 金币获得 1 利息，通常上限 5。购买经验提升人口。在投资节点选择策略；补给节点选择资源；遭遇节点选择风险与奖励。点击开启，获得金币、角色、装备或武装箱；武装箱可返回后再选。'],['05 / 回合制战斗','角色按速度依次行动。普攻恢复战技点，战技消耗战技点，能量满时释放终结技。护盾、治疗、持续伤害、破韧与追加攻击均实际结算。后台触发专属支援且不承伤，前台全灭即失败。'],['06 / 远征与结算','每个位面以首领战结束。战败扣除小队生命，耗尽或最终首领战结束后进入总评；非战斗补给阶段可整理阵容后继续。稳住经济，升星与升人口同样重要。']].map(([title,text])=>`<div class="help-item"><h3>${title}</h3><p>${text}</p></div>`).join('')}</div><p class="helper-note">快捷键：D / R 刷新 · F 购买经验 · 悬停角色按 E 出售 · 空格出战/暂停 · → 单步回放 · ? 查看指南<br>本作为非官方同人改编，费用、羁绊归属、门槛与装备配方参考旧赛季「零和博弈」。本作采用独立试用面板和二维战斗；三档难度、超频压缩节点与未公开敌方数值为网页适配。</p><div class="modal-footer"><button class="secondary-button" data-action="restart">重新开始</button><button class="primary-button" data-action="close">准备好了</button></div>`,{wide:true});}
 else if(modal?.type==='restart'){html=modalFrame(`<div class="modal-kicker">A NEW JOURNEY</div><h1 id="modal-heading">开启一场新的远征？</h1><p class="modal-intro">本次第 ${game.round} 回合的进度将被新游戏替换。新一局会重新生成商店与奖励。</p><div class="modal-footer"><button class="secondary-button" data-action="close">继续当前远征</button><button class="primary-button" data-action="new-game">重新开始</button></div>`);}
 else if(modal?.type==='trait'){const t=TRAITS.find(t=>t.id===modal.id),s=getSynergies(game).find(s=>s.id===t.id);html=modalFrame(`<div class="modal-kicker">SYNERGY DETAILS</div><h1 id="modal-heading">${t.icon} ${t.name}</h1><div class="simulation-note"><h3>本作实际效果</h3><p>${esc(getClassicTraitSimulationDescription(t.id))}</p></div><h3>经典版规则参考</h3><p class="modal-intro">${esc(t.description)}</p><div class="skill-reference">${t.levels.map(l=>`<article><h3>${l.count} 人</h3><p>${esc(l.description)}</p></article>`).join('')}</div><div class="help-item" style="margin-top:20px"><h3>激活人数：${t.thresholds.join(' / ')}</h3><p>目前已部署 ${s?.count||0} 名不同角色。前台与后台都计入羁绊，备战席不计入。</p></div><p class="helper-note">拥有此羁绊：${CHARACTERS.filter(c=>c.traits.includes(t.id)).map(c=>c.name).join('、')}</p>`);}
 else if(modal?.type==='consumable'){const consumable=(game.consumables||[]).find(c=>c.uid===modal.uid),info=consumable&&getConsumable(consumable.id);if(info)html=modalFrame(`<div class="modal-kicker">战利品 · 消耗品</div><span class="consumable-detail-art">${consumableArt(consumable.id)}</span><h1 id="modal-heading">${esc(info.name)}</h1><p class="modal-intro">${esc(info.description)}</p>${consumable.id==='privilege-card'?'<p class="helper-note">强化所选角色的第一件未升级进阶装备。</p>':''}${info.requiresTarget?`<p class="helper-note">选择使用对象</p><div class="equip-targets">${game.units.map(u=>{const c=getCharacter(u.characterId);return `<button class="equip-target ${u.uid===selected?'is-selected':''}" data-action="use-consumable" data-uid="${esc(consumable.uid)}" data-target-uid="${u.uid}"><img src="${portrait(c)}" alt=""><strong>${esc(c.name)} <span class="gold">${'★'.repeat(u.star)}</span></strong><small>${zoneName(u.zone)} · ${u.items.length} 件装备</small></button>`;}).join('')}</div>`:`<div class="modal-footer">${info.passive?'<span class="helper-note">持有即生效</span><button class="primary-button" data-action="close">返回</button>':`<button class="secondary-button" data-action="close">稍后使用</button><button class="primary-button" data-action="use-consumable" data-uid="${esc(consumable.uid)}">使用</button>`}</div>`}`);}
 else if(modal?.type==='item'){const e=getEquipment(game.inventory[modal.index]);if(e)html=modalFrame(`<div class="modal-kicker">EQUIP YOUR TEAM</div><h1 id="modal-heading">${itemArt(e.id)} ${e.name}</h1><p class="modal-intro">${e.description}</p><p class="helper-note">选择一位角色装备 · 每位角色最多 3 件</p><div class="equip-targets">${game.units.map(u=>{const c=getCharacter(u.characterId),preview=getEquipCraftPreview(game,u.uid,modal.index);return `<button class="equip-target" data-action="equip" data-uid="${u.uid}" data-index="${modal.index}" ${!preview.ok?'disabled':''}><img src="${c.image}" alt=""><strong>${c.name} <span class="gold">${'★'.repeat(u.star)}</span></strong><small>${{front:'前台',back:'后台',bench:'备战席'}[u.zone]} · 已用 ${occupiedSlots(u)}/3 栏</small><small class="equip-preview">${esc(preview.message)}</small></button>`;}).join('')}</div>`);}

 else if(modal?.type==='character'){const c=getCharacter(modal.id);html=modalFrame(`<div class="modal-kicker">零和博弈 · 经典赋能</div><h1 id="modal-heading">${c.name} <small>${c.cost} 费 · ${c.element}</small></h1><p class="modal-intro">赋能位置：${positions(c)}　${c.traits.map(traitName).join(' / ')}</p><div class="skill-reference">${c.empowerments.map(e=>`<article><h3>${zoneName(e.zone)} · ${esc(e.name)}</h3><p>${esc(e.description)}</p>${e.skills.map(skill=>`<details><summary>${esc(skill.type)} · ${esc(skill.name)}</summary><p>${esc(skill.description)}</p></details>`).join('')}</article>`).join('')}<article class="simulation-note"><h3>本作战斗说明</h3><p>${esc(getClassicSimulationDescription(c.id))}</p><p>${esc(CLASSIC_SIMULATION_NOTE)}</p><p>只在上述适用位置启用赋能。放错前台仅普攻，放错后台不行动，仍计羁绊；备战席不参战。伤害、治疗和护盾按实际战斗日志统计。</p>${c.legacy?`<p>${esc(c.simulationDescription)}</p>`:''}</article></div>${c.sourceUrl?`<a class="reference-source-link" href="${esc(c.sourceUrl)}" target="_blank" rel="noopener">查看资料来源 · 零和博弈页签 ↗</a>`:''}`);}


 else if(modal?.type==='history'){html=modalFrame(`<div class="modal-kicker">THE JOURNEY SO FAR</div><h1 id="modal-heading">远征战报</h1><p class="modal-intro">${game.wins} 胜 / ${game.losses} 负 · 当前第 ${game.round} 关</p><div class="battle-logs" style="margin-top:20px;max-height:50vh">${game.history.map(b=>`<div class="battle-log">第 ${String(b.round).padStart(2,'0')} 关 <span class="${b.won?'mint':'gold'}">${b.won?'胜利':'失利'}</span> ${b.turns?`· ${b.turns} 次行动轮次`:''} · 收入 +${b.income}${b.damage?` · 生命 −${b.damage}`:''}</div>`).join('')||'第一场交锋还未开始。'}</div>`);}
 const changed=modalRoot.innerHTML!==html;if(changed){const wasOpen=!!modalRoot.firstChild;const focusData=modalRoot.contains(document.activeElement)?{...document.activeElement.dataset}:{};const focusAction=focusData.action;modalRoot.innerHTML=html;app.inert=!!html;if(html&&(!wasOpen||focusAction))requestAnimationFrame(()=>{const target=focusAction?modalRoot.querySelector(`[data-action="${focusAction}"]${focusData.index!==undefined?`[data-index="${focusData.index}"]`:''}${focusData.view?`[data-view="${focusData.view}"]`:''}:not(:disabled)`):null;(target||modalRoot.querySelector('button:not(:disabled),[tabindex="-1"]'))?.focus();});}
}
function startBattle(){if(battleAnimating||game.phase!=='prep')return;const result=act(game,{type:'battle'});if(!result.ok){toast(result.message);return;}save();resultView='overview';beginReplay();}
function beginReplay(){if(!game.lastBattle?.combat){render();return;}clearTimeout(battleTimer);playback={combat:game.lastBattle.combat,cursor:0,speed:2,playing:true};battleAnimating=true;modal=null;renderModal();schedulePlayback();}
function schedulePlayback(){clearTimeout(battleTimer);if(!playback||!battleAnimating)return;if(playback.cursor>=playback.combat.events.length){finishPlayback();return;}if(!playback.playing)return;battleTimer=setTimeout(()=>{playback.cursor++;if(playback.cursor>=playback.combat.events.length){finishPlayback();return;}renderModal();schedulePlayback();},1000/playback.speed);}
function finishPlayback(){clearTimeout(battleTimer);battleAnimating=false;playback=null;if(game.phase==='result'&&(game.hp<=0||game.round===getRunLength(game))){act(game,{type:'next'});save();}render();}
function togglePlayback(){if(!playback)return;playback.playing=!playback.playing;renderModal();schedulePlayback();}
function stepPlayback(){if(!playback)return;clearTimeout(battleTimer);playback.playing=false;playback.cursor=Math.min(playback.cursor+1,playback.combat.events.length);if(playback.cursor>=playback.combat.events.length){finishPlayback();return;}renderModal();}

function handleAction(button){const a=button.dataset.action,i=Number(button.dataset.index),uid=button.dataset.uid;
 switch(a){
 case 'tab':tab=button.dataset.tab;craft=[];render();break;
 case 'select':selected=uid;render();openModal({type:'unit'});break;
 case 'buy':perform({type:'buy',index:i});break;
 case 'refresh':shopOpen=true;perform({type:a});break;
 case 'exp':case 'lock':perform({type:a});break;
 case 'move':if(perform({type:'move',uid,zone:button.dataset.zone}).ok)closeModal();break;
 case 'sell':if(perform({type:'sell',uid}).ok)closeModal();break;
 case 'unequip':perform({type:'unequip',uid,itemIndex:i});break;
 case 'battle':startBattle();break;
 case 'replay':beginReplay();break;
 case 'result-view':resultView=button.dataset.view;renderModal();break;
 case 'playback-toggle':togglePlayback();break;
 case 'playback-step':stepPlayback();break;
 case 'playback-speed':playback.speed=playback.speed===4?1:playback.speed*2;renderModal();schedulePlayback();break;
 case 'playback-skip':case 'playback-finish':finishPlayback();break;
 case 'shop-toggle':shopOpen=!shopOpen;render();break;
 case 'fullscreen':fullscreen();break;
 case 'zoom':enlarged=!enlarged;fitGame();break;
 case 'next':tab='battle';choiceSelected=null;nodeSelected=null;perform({type:'next'},{quiet:true});break;
 case 'choice-select':choiceSelected=i;renderModal();break;
 case 'choice-confirm':if(Number.isInteger(choiceSelected)&&perform({type:'choose',index:choiceSelected}).ok)choiceSelected=null;break;
 case 'collect-loot':{const orb=(game.loot||[]).find(l=>l.uid===uid),rect=button.getBoundingClientRect();if(orb){const result=perform({type:'collect-loot',uid},{quiet:true});if(result.ok){animateLootCollection(orb,rect);toast(result.message);}}break;}
 case 'open-chest':previousFocus=document.activeElement;chestSelected=null;modal=null;perform({type:'open-chest',uid},{quiet:true});break;
 case 'chest-select':chestSelected=i;renderModal();break;
 case 'cancel-chest':chestSelected=null;modal=null;perform({type:'cancel-chest'},{quiet:true});break;
 case 'choose-chest':if(Number.isInteger(chestSelected)&&perform({type:'choose-chest',index:chestSelected}).ok)chestSelected=null;break;
 case 'consumable':openModal({type:'consumable',uid});break;
 case 'use-consumable':{const targetUid=button.dataset.targetUid;if(perform({type:'use-consumable',uid,targetUid}).ok){if(targetUid)selected=targetUid;modal=null;render();}break;}
 case 'strategies':openModal({type:'strategies'});break;
 case 'enemy':openModal({type:'enemy'});break;
 case 'help':openModal({type:'help'});break;
 case 'restart':openModal({type:'restart'});break;
 case 'new-game':case 'modes':modal={type:'modes'};renderModal();break;
 case 'environment-info':if(game.environment?.id)openModal({type:'environment-info'});else toast('旧版存档没有投资环境；可从左上角开启标准或超频新局。');break;
 case 'environment-select':environmentSelected=i;renderModal();break;
 case 'environment-reroll':environmentSelected=null;perform({type:'reroll-environment'});break;
 case 'environment-confirm':if(Number.isInteger(environmentSelected)){const id=game.environment?.choices[environmentSelected];if(id&&perform({type:'choose-environment',id}).ok)environmentSelected=null;}break;
 case 'mode-select':modeSelected=button.dataset.mode;renderModal();break;
 case 'difficulty-select':difficultySelected=i;renderModal();break;
 case 'start-run':clearTimeout(battleTimer);game=createGame(undefined,{mode:modeSelected,difficulty:difficultySelected});newRunRequired=false;selected=game.units[0]?.uid;tab='battle';modal=null;craft=[];battleAnimating=false;playback=null;shopOpen=true;choiceSelected=null;chestSelected=null;nodeSelected=null;environmentSelected=null;save();render();toast('请选择本局投资环境。');break;
 case 'node-select':nodeSelected=i;renderModal();break;
 case 'node-confirm':if(Number.isInteger(nodeSelected)){const result=perform({type:game.phase==='supply'?'choose-supply':'choose-encounter',index:nodeSelected});if(result.ok)nodeSelected=null;}break;
 case 'reroll-supply':case 'reroll-encounter':nodeSelected=null;perform({type:a});break;
 case 'next-node':nodeSelected=null;choiceSelected=null;perform({type:'next-node'});break;
 case 'reroll-strategy':choiceSelected=null;perform({type:'refresh-strategy',index:i});break;
 case 'close':if(!newRunRequired)closeModal();break;
 case 'backdrop':if(!['choice','result'].includes(game.phase)&&!battleAnimating)closeModal();break;
 case 'progression-open':openModal({type:'progression'});break;
 case 'progression-select':{const choice=getProgressionPanels(game)[Number(button.dataset.panel)]?.choices?.[Number(button.dataset.choice)];if(choice?.action){perform({type:'progression',...choice.action});}break;}
 case 'trait':openModal({type:'trait',id:button.dataset.id});break;
 case 'item':openModal({type:'item',index:i});break;
 case 'equip':{const result=perform({type:'equip',uid,itemIndex:i});if(result.ok){modal=null;selected=uid;render();}break;}
 case 'craft-select':if(craft.includes(i))craft=craft.filter(x=>x!==i);else craft=[...craft.slice(-1),i];render();break;
 case 'combine':if(craft.length===2){const result=perform({type:'combine',indexA:craft[0],indexB:craft[1]});if(result.ok){craft=[];render();}}break;
 case 'filter':codexCost=Number(button.dataset.cost);render();break;
 case 'character':openModal({type:'character',id:button.dataset.id});break;
 case 'history':openModal({type:'history'});break;
 }
}
document.addEventListener('click',event=>{const button=event.target.closest('[data-action]');if(!button||button.disabled)return;if(['select','item','consumable'].includes(button.dataset.action)&&Date.now()<suppressClickUntil)return;if(button.dataset.action==='backdrop'&&event.target!==button)return;handleAction(button);});
function updateSearch(event){if(event.target.id!=='codex-search'||event.isComposing)return;const position=event.target.selectionStart;codexQuery=event.target.value;render();const input=document.getElementById('codex-search');input.focus();input.setSelectionRange(position,position);}
document.addEventListener('input',updateSearch);
document.addEventListener('compositionend',updateSearch);
document.addEventListener('keydown',event=>{if(battleAnimating&&!event.repeat){if(event.code==='Space'){event.preventDefault();togglePlayback();return;}if(event.key==='ArrowRight'){event.preventDefault();stepPlayback();return;}}if(event.key==='Tab'&&modalRoot.firstChild){const focusables=[...modalRoot.querySelectorAll('button:not(:disabled),a[href],input')];const first=focusables[0],last=focusables.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}return;}if(event.key==='Escape'&&(modal||game.activeChest)&&!battleAnimating){closeModal();return;}if(event.target.matches('input,textarea')||event.ctrlKey||event.metaKey||event.altKey||event.repeat||modalRoot.firstChild)return;if(event.key==='?'){openModal({type:'help'});return;}if(tab!=='battle'||game.phase!=='prep')return;if(['r','d'].includes(event.key.toLowerCase())){event.preventDefault();shopOpen=true;perform({type:'refresh'});}else if(event.key.toLowerCase()==='e'){const card=app.querySelector('.roster-card:hover')||document.activeElement?.closest('.roster-card');if(card){event.preventDefault();perform({type:'sell',uid:card.dataset.uid});}}else if(event.key.toLowerCase()==='f'){event.preventDefault();perform({type:'exp'});}else if(event.code==='Space'&&!event.target.closest('button')){event.preventDefault();startBattle();}});
// Pointer dragging covers desktop, touch, equipment and the original corner sale zones.
let dragSession=null,suppressClickUntil=0;
const clearDrag=()=>{dragSession?.ghost?.remove();document.body.classList.remove('dragging-unit','dragging-item');document.querySelectorAll('.drag-over').forEach(el=>el.classList.remove('drag-over'));dragSession=null;};
const dragTarget=(x,y)=>document.elementFromPoint(x,y);
document.addEventListener('pointerdown',event=>{
 const card=event.target.closest('.roster-card'),item=event.target.closest('.equipment-rail [data-action="item"]');
 if((!card&&!item)||game.phase!=='prep'||event.button!==0||modalRoot.firstChild)return;
 const source=card||item;
 dragSession={kind:card?'unit':'item',uid:card?.dataset.uid,index:Number(item?.dataset.index),card:source,x:event.clientX,y:event.clientY,pointerId:event.pointerId,ghost:null};
 source.setPointerCapture(event.pointerId);
});
document.addEventListener('pointermove',event=>{
 if(!dragSession||event.pointerId!==dragSession.pointerId)return;
 const d=dragSession;if(!d.ghost&&Math.hypot(event.clientX-d.x,event.clientY-d.y)<7)return;
 event.preventDefault();
 if(!d.ghost){const r=d.card.getBoundingClientRect();d.ghost=document.createElement('img');d.ghost.src=d.card.querySelector('img').src;d.ghost.className='drag-portrait';d.ghost.style.width=r.width+'px';d.ghost.style.height=r.height+'px';document.body.append(d.ghost);document.body.classList.add(d.kind==='unit'?'dragging-unit':'dragging-item');if(d.kind==='unit'){const u=game.units.find(u=>u.uid===d.uid);document.querySelectorAll('.sell-zone-value').forEach(el=>el.textContent=`+ ${getSellPrice(game,u)} 金币`);}}
 d.ghost.style.left=event.clientX+'px';d.ghost.style.top=event.clientY+'px';
 document.querySelectorAll('.drag-over').forEach(el=>el.classList.remove('drag-over'));
 const target=dragTarget(event.clientX,event.clientY);
 (d.kind==='unit'?target?.closest('[data-sell-zone],[data-zone]:not(button)'):target?.closest('.roster-card'))?.classList.add('drag-over');
});
document.addEventListener('pointerup',event=>{
 if(!dragSession||event.pointerId!==dragSession.pointerId)return;
 const d=dragSession,target=dragTarget(event.clientX,event.clientY);
 if(d.ghost){suppressClickUntil=Date.now()+350;
  if(d.kind==='unit'&&target?.closest('[data-sell-zone]'))perform({type:'sell',uid:d.uid});
  else if(d.kind==='item'){const unit=target?.closest('.roster-card');if(unit)perform({type:'equip',uid:unit.dataset.uid,itemIndex:d.index});}
  else {const zone=target?.closest('[data-zone]:not(button)');if(zone){const slot=target?.closest('.roster-card,.empty-slot'),row=slot?.parentElement;const position=slot&&row?Array.from(row.children).indexOf(slot):undefined;perform({type:'move',uid:d.uid,zone:zone.dataset.zone,position});}}
 }
 clearDrag();
});
document.addEventListener('pointercancel',clearDrag);
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&dragSession){suppressClickUntil=Date.now()+350;clearDrag();}});
window.addEventListener('pagehide',save);
window.addEventListener('resize',fitGame);
document.addEventListener('fullscreenchange',fitGame);
save();render();if(recovered)toast('旧存档无法读取，已为你开始新的远征。');
