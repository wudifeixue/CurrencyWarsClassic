import { CHARACTERS, EQUIPMENT, resolveEquipment, getEquipmentArtPath, STRATEGIES, getTraitArtPath } from './data.js?v=6.4.1';
import { getSynergies, getRunLength, getRunMode, getCurrentNode, getRunNodes, getSellPrice, getLevelXp } from './engine.js?v=6.4.1';

const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const number = value => Math.round(Number(value) || 0).toLocaleString('zh-CN');
const character = id => CHARACTERS.find(c => c.id === String(id));
const equipment = id => resolveEquipment(id);
const gem = '<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M12 3h16l10 17-10 17H12L2 20Z" fill="#e9b948" stroke="#fff0a7" stroke-width="2"/><path d="m14 9-7 11 7 11h12l7-11-7-11Z" fill="none" stroke="#8f5a25" stroke-width="2"/><path d="m13 18 6-5 8 4-5 3 5 3-8 4-6-5 4-2Z" fill="#fff0a7" stroke="#a37525"/></svg>';
const check = '<svg viewBox="0 0 30 30" aria-hidden="true"><circle cx="15" cy="15" r="13" fill="#25211b" stroke="#bdaa7c" stroke-width="2"/><path d="m8 15 5 5 9-10" fill="none" stroke="#f4eee0" stroke-width="2"/></svg>';
const symbols = {
  compound:'M24 50a26 26 0 0 1 44-18l9-9v27H50l10-10a14 14 0 1 0 1 20l10 9a27 27 0 0 1-47-19Zm20-11h12v22H44Z',
  dividend:'M24 27h52v47H24Zm7 8v9h8v-9Zm15 0v9h8v-9Zm15 0v9h8v-9ZM31 52v15h8V52Zm15 0v15h8V52Zm15 0v15h8V52ZM18 77h64v7H18Z',
  growth:'m19 73 8 8 31-31 16 16V23H31l16 16-28 34ZM20 19h8v9h-8ZM71 76h9v9h-9Z',
  discount:'M43 20h14v21h21v14H57v23H43V55H22V41h21ZM18 18h18v18H18Zm46 0h18v18H64ZM18 64h18v18H18Zm46 0h18v18H64Z',
  vanguard:'m24 14 29 28-11 11L14 24V14Zm52 0L47 42l11 11 28-29V14ZM27 56l17 17-9 9-17-17ZM56 73l17-17 9 9-17 17ZM18 71l11 11-9 9-11-11Zm53 11 11-11 9 9-11 11Z',
  backline:'m50 12 34 20v40L50 92 16 72V32Zm0 12L28 37v27l22 13 22-13V37Zm0 14 14 8v16l-14 8-14-8V46Z',
  fortress:'m50 12 34 14v25c0 22-23 34-34 40-11-6-34-18-34-40V26Zm0 13L28 34v17c0 14 12 23 22 29V25Z',
  recovery:'M39 16h22v23h23v22H61v23H39V61H16V39h23Z',
  momentum:'m50 10 11 28 29 12-29 12-11 28-12-28-28-12 28-12Zm-29 6 4 9 9 4-9 4-4 9-4-9-9-4 9-4Zm59 53 3 8 8 3-8 3-3 8-3-8-8-3 8-3Z',
};

function strategySymbol(id) {
  if(STRATEGIES.some(s=>s.id===id&&!s.legacy))return `<img class="reference-strategy-symbol" src="assets/strategies/classic-${id}.png" alt="">`;
  const e=STRATEGIES.find(s=>s.id===id)?.effect||{},b=e.battle||{};
  const symbol=symbols[id]||symbols[e.gold||e.interestCap||e.nodeGold?'compound':e.xp||e.nodeXp||e.paidRefreshXp||e.expShopPromotion?'growth':e.freeRefreshes||e.nodeFreeRefreshes||e.combineFreeRefreshes?'discount':e.maxHp||e.battleHeal||b.healAmp?'recovery':b.damageReduction||b.shieldAmp?'fortress':b.backPower?'backline':b.frontPower||b.damageAmp?'vanguard':'momentum'];
  return `<svg class="reference-strategy-symbol" viewBox="0 0 100 100" aria-hidden="true"><path d="${symbol}" fill="currentColor" fill-rule="evenodd"/></svg>`;
}

export function choiceScreen(game, selectedIndex = null) {
  const isStrategy = game.choiceKind === 'strategy';
  const selectedChoice = Number.isInteger(selectedIndex) ? game.choices[selectedIndex] : null;
  const hasSelection = Boolean(selectedChoice && (selectedChoice.kind === 'strategy' ? STRATEGIES.some(s => s.id === selectedChoice.id) : selectedChoice.kind === 'equipment' && equipment(selectedChoice.id)));
  return `<div class="reference-overlay"><section class="reference-fullscreen reference-choice-screen" role="dialog" aria-modal="true" aria-labelledby="modal-heading">
    <div class="reference-mesh" aria-hidden="true"></div>
    <div class="reference-choice-stage">${getCurrentNode(game).label} · ${isStrategy ? '投资机遇' : '装备补给'}</div>
    ${isStrategy && (game.flow?.rules || 1) >= 4 ? '<button class="reference-choice-return" data-action="choice-hide">← 返回备战</button>' : ''}
    <header class="reference-choice-heading"><i></i><h1 id="modal-heading">${isStrategy ? '请选择投资策略' : '请选择补给装备'}</h1><i></i></header>
    <div class="reference-choice-cards">${game.choices.map((choice, index) => {
      const item = choice.kind === 'strategy' ? STRATEGIES.find(s => s.id === choice.id) : equipment(choice.id);
      if (!item) return '';
      const chosen = index === selectedIndex;
      return `<div class="reference-choice-column"><button class="reference-choice-card ${chosen ? 'is-selected' : ''}" data-action="choice-select" data-index="${index}" aria-pressed="${chosen}" aria-label="${escape(item.name)}：${escape(item.description)}">
        <span class="reference-card-face"><span class="reference-card-foil" aria-hidden="true"></span><span class="reference-choice-emblem">${choice.kind === 'strategy' ? strategySymbol(item.id) : `<img src="${getEquipmentArtPath(item.id)}" alt="">`}</span><span class="reference-choice-copy"><strong>${escape(item.name)}</strong><span class="reference-choice-rule"></span><span class="reference-choice-description">${escape(item.description)}</span></span><span class="reference-card-detail" aria-hidden="true"></span></span>
      </button><div class="reference-choice-caption"><span class="reference-rarity-mark">${isStrategy ? '✧' : '◇'}</span>${isStrategy ? `${escape(item.rarity)}投资策略` : '简易装备'}${chosen ? '<span class="reference-selected-caption">已选择</span>' : ''}</div>${isStrategy&&game.flow?`<button class="strategy-reroll-button" data-action="reroll-strategy" data-index="${index}" ${!game.flow.strategyRerolls[index]?'disabled':''}>↻ 刷新次数 ${game.flow.strategyRerolls[index]}</button>`:''}</div>`;
    }).join('')}</div>
    <p class="reference-choice-hint">${hasSelection ? '确认后获得所选奖励' : '选择一项奖励，然后确认'}</p>
    <button class="reference-confirm-button" data-action="choice-confirm" ${hasSelection ? '' : 'disabled'}>${check}<span>确认</span></button>
    <span class="reference-screen-signature">经典回响 · 非官方同人</span>
  </section></div>`;
}

function overviewPanel(game, battle, won, ended) {
  const active = getSynergies(game).filter(s => s.active);
  const total=getRunLength(game);
  const completed = ended?Math.min(game.round,total):Math.min(game.round,total);
  const cumulativeIncome = game.history.reduce((sum, b) => sum + (b.income || 0), 0);
  return `<div class="reference-overview-grade"><h2>${ended ? won ? '远征完成' : '远征结束' : won ? '对局胜利' : '对局失利'}</h2><div class="reference-earned-wins"><span>${game.wins}</span><small>胜场</small></div><p><span>${getRunMode(game).name}</span><i></i>${getCurrentNode(game).label}</p><div class="reference-expedition-progress"><strong>当前进度 ${completed} / ${total} 节点</strong><span><i style="width:${completed / total * 100}%"></i></span></div></div>
  <div class="reference-overview-content"><div class="reference-overview-banner"><span>经典回响 <i>◇</i> 远征战报</span><strong>小队生命值 <b>♥</b> ${number(game.hp)}</strong></div>
  <section class="reference-overview-traits"><h3>羁绊信息</h3><div>${active.map(s => `<span class="reference-overview-trait" title="${escape(s.name)}：${escape(s.description)}"><img src="${getTraitArtPath(s.id)}" alt="${escape(s.name)}"><b>${s.count}</b></span>`).join('') || '<p class="reference-empty-overview">尚未激活羁绊</p>'}</div></section>
  <section class="reference-overview-team"><h3>我的阵容</h3><div class="reference-overview-roster">${game.units.filter(u => u.zone !== 'bench').map(u => {
    const c = character(u.characterId);
    if (!c) return '';
    return `<div class="reference-overview-unit" title="${escape(c.name)} · ${u.star} 星 · ${u.zone === 'back' ? '后台' : '前台'}"><div class="reference-stat-portrait" style="--portrait-rarity:${['', '#b8bccb', '#79b9aa', '#778ce4', '#a47be4', '#c3a451'][c.cost]}"><img src="assets/portraits/${c.id}.png" alt="${escape(c.name)}"><span class="reference-stat-stars">${'★'.repeat(u.star)}</span><span class="reference-stat-position">${u.zone === 'back' ? '▯' : '▪'}</span></div><div class="reference-stat-equipment">${u.items.map(id => `<img src="${getEquipmentArtPath(id)}" alt="${escape(equipment(id)?.name || id)}">`).join('')}</div></div>`;
  }).join('')}</div></section>
  <div class="reference-overview-lower"><section class="reference-overview-record"><h3>本局记录</h3><p><span>累计收入</span><strong>${gem}${number(cumulativeIncome)}</strong></p><p><span>胜 / 负</span><strong>${game.wins} / ${game.losses}</strong></p></section><section class="reference-overview-strategies"><h3>投资策略</h3><div>${game.strategies.map(id => {const s = STRATEGIES.find(item => item.id === id);return s ? `<span title="${escape(s.name)}：${escape(s.description)}">${strategySymbol(id)}<small>${escape(s.name)}</small></span>` : '';}).join('') || '<p class="reference-empty-overview">尚未获得投资策略</p>'}</div></section></div></div>`;
}

// Per-node settlement, laid out like the old season's "挑战完成" page: challenge progress, squad HP,
// experience gained, the gold overview with its three sources, crystal ore dropped and battle statistics.
const compact = value => { const n = Math.round(Number(value) || 0); return n >= 10000 ? `${(n / 1000).toFixed(1)}K` : number(n); };
const heart = '<svg viewBox="0 0 100 92" aria-hidden="true"><path d="M50 90 6 46V22L24 4h14l12 12L62 4h14l18 18v24Z" fill="currentColor"/><path d="M50 74 20 44V28l8-8h6l16 16 16-16h6l8 8v16Z" fill="none" stroke="#fff8d8" stroke-width="3" opacity=".65"/></svg>';
const oreNames = { white: '白色晶矿', blue: '蓝色晶矿', gold: '金色晶矿', prismatic: '棱彩晶矿' };
function settlementPanel(game, battle, won) {
  const combat = battle.combat, overclock = !getRunMode(game).interest;
  const progress = Math.max(0, Math.min(100, Number.isFinite(battle.progress) ? battle.progress : won ? 100 : 0));
  const penalty = battle.penalty, parts = penalty ? [`固定 ${penalty.base}`, `未完成进度 ${penalty.progress}`, penalty.threshold ? `未达最低进度要求 ${penalty.threshold}` : ''].filter(Boolean).join(' · ') : '';
  const other = Math.max(0, (battle.income || 0) - (battle.baseIncome || 0) - (battle.streakIncome || 0) - (battle.interestIncome || 0));
  const ores = Object.entries((battle.drops || []).reduce((count, quality) => ({ ...count, [quality]: (count[quality] || 0) + 1 }), {}));
  const notes = (battle.rewards || []).filter(line => !/^(基础金币|连胜金币|利息|获得经验|超频模式无利息)/.test(line));
  const rows = (combat?.stats || []).filter(s => s.side === 'ally').sort((a, b) => b.damage - a.damage).slice(0, 6);
  const max = Math.max(1, ...rows.map(s => s.damage || 0));
  const maxLevel = !getLevelXp(game);
  return `<div class="settle">
    <div class="settle-progress" role="img" aria-label="挑战进度 ${progress}%"><span>挑战进度</span><div class="settle-progress-bar"><i style="width:${progress}%"></i>${battle.minProgress ? `<b style="left:${battle.minProgress}%" title="最低进度要求 ${battle.minProgress}%"></b>` : ''}</div><strong>${progress}%</strong></div>
    ${Number.isFinite(battle.countdown) ? `<p class="settle-countdown">倒计时 ${battle.countdown} · 受到致命攻击 ${battle.revives || 0} 次${battle.minProgress ? ` · 最低进度要求 ${battle.minProgress}%` : ''}</p>` : ''}
    <div class="settle-emblems">
      <div class="settle-emblem settle-hp ${battle.damage ? 'is-loss' : ''}"><span class="settle-heart">${heart}</span><div><small>小队生命值</small><strong>${number(game.hp)}</strong>${battle.damage ? `<em>失去小队生命值 −${number(battle.damage)}</em>${parts ? `<p>${parts}</p>` : ''}` : battle.healing ? `<em class="is-gain">回复 +${number(battle.healing)}</em>` : '<p>未损失小队生命值</p>'}</div></div>
      <div class="settle-emblem settle-level"><span class="settle-level-badge"><small>Lv.</small>${game.level}</span><div><small>获取经验</small><strong>+${number(battle.xpGain)}</strong><p>${maxLevel ? '已达到最高等级' : `当前 ${game.xp} / ${getLevelXp(game)} · 进入下个节点时计入`}</p></div></div>
    </div>
    <div class="settle-columns">
      <section class="settle-gold"><h3>获得金币总览<b>${gem}${number(battle.income)}</b></h3>
        <p><span>基础奖励</span><b>${number(battle.baseIncome)}</b></p>
        <p><span>连胜<i>×${Math.max(0, battle.streak || 0)}</i></span><b>${number(battle.streakIncome)}</b></p>
        <p class="${overclock ? 'is-muted' : ''}"><span>利息${overclock ? '<i>超频博弈不计利息</i>' : ''}</span><b>${number(battle.interestIncome)}</b></p>
        ${other ? `<p><span>策略与其他收益</span><b>${number(other)}</b></p>` : ''}
        <p class="settle-ores"><span>掉落晶矿</span><b>${ores.length ? ores.map(([quality, count]) => `<i class="settle-ore quality-${escape(quality)}" title="${oreNames[quality] || '晶矿'}"></i>${count}`).join('') : '<small>无</small>'}</b></p>
        ${notes.length ? `<small class="settle-notes">${notes.map(escape).join(' · ')}</small>` : ''}
      </section>
      <section class="settle-stats"><h3>数据统计<button data-action="result-view" data-view="damage" aria-label="查看完整伤害统计">⌕</button></h3>
        ${rows.length ? rows.map(s => {
          const c = character(combat.units?.find(u => u.id === s.id)?.characterId || game.units.find(u => u.uid === s.id)?.characterId);
          return `<div class="settle-stat" title="${escape(s.name)} · 伤害 ${number(s.damage)} · 治疗 ${number(s.healing)} · 护盾 ${number(s.shielding)}">${c ? `<img src="assets/portraits/${c.id}.png" alt="${escape(s.name)}">` : `<span>${escape(s.name)}</span>`}<div><i style="width:${Math.max(0, Math.min(100, (s.damage || 0) / max * 100))}%"></i></div><b>${compact(s.damage)}</b></div>`;
        }).join('') : '<p class="settle-empty">本节点没有战斗数据</p>'}
      </section>
    </div>
  </div>`;
}

export function resultScreen(game, { ended = false, view = 'overview' } = {}) {
  const battle = game.lastBattle || {};
  const combat = battle.combat;
  const won = ended ? game.result === 'victory' : battle.won;
  const rows = (combat?.stats || []).filter(s => s.side === 'ally').sort((a, b) => b.damage - a.damage);
  const max = Math.max(1, ...rows.map(s => s.damage || 0));
  const deployed = game.units.filter(u => u.zone !== 'bench');
  const teamValue = deployed.reduce((sum, u) => sum + getSellPrice(game,u), 0);
  const roundLabel = ended ? `抵达 ${getCurrentNode(game).label} · ${game.wins} 胜 / ${game.losses} 负` : `${getCurrentNode(game).label} · ${escape(battle.enemy)}${combat ? Number.isFinite(combat.countdown) ? ` · 倒计时 ${combat.countdown}，致命攻击 ${combat.revives||0} 次` : ` · ${combat.turns} 次行动` : ''}`;
  // Runs on the verified rules settle each node on the "挑战完成" page; older saves keep the previous report.
  const settle = !ended && Number.isFinite(battle.baseIncome);
  const title = ended ? won ? '远征完成' : '远征结束' : settle ? won ? '挑战完成' : '挑战失败' : won ? '作战胜利' : '作战失利';
  const reason = combat?.reason === 'timeout' ? (Number.isFinite(combat.countdown) ? '倒计时结束' : '达到行动上限') : battle.won ? '敌方全部退场' : '前台全部退场';
  return `<div class="reference-overlay"><section class="reference-fullscreen reference-result-screen ${won ? 'is-victory' : 'is-defeat'}" role="dialog" aria-modal="true" aria-labelledby="modal-heading">
    <div class="reference-victory-prism" aria-hidden="true"><span></span></div>
    <header class="reference-result-heading"><h1 id="modal-heading">${title}</h1><p>${roundLabel}</p></header>
    <div class="reference-result-panel ${view === 'overview' ? settle ? 'settle-panel' : 'reference-overview-panel' : ''}">
      ${view === 'overview' ? settle ? settlementPanel(game, battle, won) : overviewPanel(game, battle, won, ended) : `
      <div class="reference-result-metrics"><div><span>小队生命值</span><strong><span class="reference-heart">♥</span>${number(game.hp)}</strong></div><div><span>持有金币</span><strong>${gem}${number(game.gold)}</strong></div><div><span>阵容价值</span><strong>${gem}${number(teamValue)}</strong></div></div>
      <div class="reference-damage-heading"><span>${ended ? `远征战绩 ${game.wins} 胜 / ${game.losses} 负` : `${reason}　·　收入 +${number(battle.income)}${battle.damage ? `　·　生命 −${number(battle.damage)}` : ''}`}</span><strong>伤害统计</strong></div>
      <div class="reference-damage-chart" role="img" aria-label="本场角色伤害统计：${escape(rows.map(s => `${s.name} ${number(s.damage)}，治疗 ${number(s.healing)}，护盾 ${number(s.shielding)}`).join('；'))}">
        <div class="reference-chart-grid" aria-hidden="true"></div>
        ${rows.length ? `<div class="reference-damage-columns">${rows.map(s => {
          const initial = combat.units?.find(u => u.id === s.id);
          const current = game.units.find(u => u.uid === s.id);
          const c = character(initial?.characterId || current?.characterId);
          const unit = current || initial;
          const barHeight = Math.max(0, Math.min(100, (s.damage || 0) / max * 100));
          return `<div class="reference-damage-column" title="${escape(s.name)} · 伤害 ${number(s.damage)} · 治疗 ${number(s.healing)} · 护盾 ${number(s.shielding)}"><div class="reference-damage-bar-space"><div class="reference-damage-bar" style="height:${barHeight}%"><span>${number(s.damage)}</span></div></div><div class="reference-stat-portrait" style="--portrait-rarity:${['', '#b8bccb', '#79b9aa', '#778ce4', '#a47be4', '#c3a451'][c?.cost || 1]}">${c ? `<img src="assets/portraits/${c.id}.png" alt="${escape(s.name)}">` : `<span>${escape(s.name)}</span>`}<span class="reference-stat-stars">${'★'.repeat(unit?.star || 1)}</span><span class="reference-stat-position">${initial?.zone === 'back' ? '▯' : '▪'}</span></div><div class="reference-stat-equipment">${(unit?.items || []).map(id => `<img src="${getEquipmentArtPath(id)}" alt="${escape(equipment(id)?.name || id)}">`).join('')}</div><span class="reference-stat-name">${escape(s.name)}</span></div>`;
        }).join('')}</div>` : '<div class="reference-no-statistics">这份旧版战报未保存逐角色伤害统计<br><small>下一场战斗将记录完整数据</small></div>'}
      </div>`}
    </div>
    <nav class="reference-result-pagination" aria-label="战报视图"><button data-action="result-view" data-view="overview" aria-label="${settle ? '查看节点结算' : '查看战报总览'}" aria-pressed="${view === 'overview'}" class="${view === 'overview' ? 'active' : ''}"></button><button data-action="result-view" data-view="damage" aria-label="查看伤害统计" aria-pressed="${view === 'damage'}" class="${view === 'damage' ? 'active' : ''}"></button></nav>
    <div class="reference-result-bottom"><div class="reference-result-secondary">${combat ? '<button data-action="replay"><span>↻</span>回看战斗</button>' : ''}${ended ? '<button data-action="history"><span>▥</span>战斗记录</button>' : ''}</div><button class="reference-confirm-button reference-return-button" data-action="${ended ? 'restart' : 'next'}"><span>${ended ? '开启新的远征' : game.hp <= 0 || game.round === getRunLength(game) ? '查看远征结算' : '继续挑战'}</span></button><div class="reference-result-income">${ended ? '经典，仍在继续' : settle ? `持有金币 ${number(game.gold)}` : `本回合收入 +${number(battle.income)}`}</div></div>
    <p class="reference-reward-breakdown">${settle && view === 'overview' ? '' : !ended && battle.rewards ? battle.rewards.map(escape).join('　·　') : ended ? won ? `你已完成${getRunMode(game).name}全部 ${getRunLength(game)} 个节点。` : '调整阵容与投资路线，再次启程。' : ''}</p>
    <span class="reference-screen-signature">经典回响 · 非官方同人</span>
  </section></div>`;
}
