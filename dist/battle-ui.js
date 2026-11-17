import { CHARACTERS } from './data.js?v=6.1.0';

const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const number = value => Math.round(Number(value) || 0).toLocaleString('zh-CN');
const percent = (value, max) => Math.max(0, Math.min(100, value / Math.max(1, max) * 100));
const kindLabels = {
  attack:'普通攻击', basic:'普通攻击', skill:'战技', ultimate:'终结技', followup:'追加攻击', follow:'追加攻击',
  dot:'持续伤害', heal:'治疗', shield:'护盾', break:'弱点击破', buff:'增益', debuff:'减益',
  support:'后台协同', backline:'后台协同', equipment:'装备触发', item:'装备触发', synergy:'羁绊触发',
  control:'控制', recover:'状态恢复', start:'战斗开始', end:'战斗结束', defeat:'退场', death:'退场', energy:'能量恢复', action:'行动',
};
const character = id => CHARACTERS.find(c => c.id === String(id));
const emblem = '<svg viewBox="0 0 80 80" fill="none" aria-hidden="true"><path d="M40 6 64 20 70 50 40 74 10 50 16 20Z" stroke="currentColor" stroke-width="2"/><path d="m40 18 15 14-4 23-11 9-11-9-4-23Z" fill="currentColor" opacity=".18"/><path d="m24 30 16 11 16-11M40 41v23M23 48l9 2m16 0 9-2" stroke="currentColor" stroke-width="3"/></svg>';

function battleUnit(unit, event, compact = false) {
  const c = character(unit.characterId);
  const target = event?.targets?.find(t => t.id === unit.id);
  const acting = event?.actorId === unit.id;
  const fallen = unit.hp <= 0;
  const statuses = unit.statuses || [];
  const maxEnergy = unit.maxEnergy || 100;
  const damage = target?.damage || 0;
  const healing = target?.heal || 0;
  return `<article class="combat-unit ${unit.side} ${compact?'compact':''} ${acting?'acting':''} ${fallen?'fallen':''} ${damage?'hit':''}" style="--unit-color:${c?.color || '#bc8fce'}" aria-label="${escape(unit.name)}，生命${number(unit.hp)}/${number(unit.maxHp)}${unit.shield?`，护盾${number(unit.shield)}`:''}">
    <div class="combat-unit-art">${c ? `<img src="${c.image}" alt="" draggable="false">` : `<div class="enemy-emblem">${emblem}</div>`}</div>
    <div class="combat-unit-heading"><span>${unit.zone === 'back'?'后台':unit.side === 'enemy'?escape((unit.weaknesses||[]).join(' · ')):'前台'}</span>${acting?'<b>行动中</b>':''}</div>
    ${target && (damage || healing || target.shield || target.absorbed) ? `<div class="floating-value ${healing?'healing':(target.shield||target.absorbed)&&!damage?'shielding':''}">${damage?`−${number(damage)}`:healing?`+${number(healing)}`:target.shield?`盾 +${number(target.shield)}`:`吸收 ${number(target.absorbed)}`}</div>`:''}
    ${fallen?'<span class="fallen-label">已退场</span>':''}
    <div class="combat-unit-info"><h3>${escape(unit.name)}</h3><div class="health-label"><span>${number(unit.hp)} <small>/ ${number(unit.maxHp)}</small></span>${unit.shield?`<b>◇ ${number(unit.shield)}</b>`:''}</div>
      <div class="health-bar"><i style="width:${percent(unit.hp,unit.maxHp)}%"></i></div>
      <div class="secondary-bars"><div class="energy-bar" title="能量 ${number(unit.energy)} / ${maxEnergy}"><i style="width:${percent(unit.energy,maxEnergy)}%"></i></div>${unit.maxToughness?`<div class="toughness-bar" title="韧性 ${number(unit.toughness)} / ${number(unit.maxToughness)}"><i style="width:${percent(unit.toughness,unit.maxToughness)}%"></i></div>`:''}</div>
      <div class="combat-statuses">${statuses.slice(0,4).map(s=>`<span title="${escape(s.label || s.type)}${s.turns?` · 剩余${s.turns}次行动`:''}" class="status-${escape(s.type)}">${escape(s.label || s.type)}${s.stacks>1?` ×${s.stacks}`:''}</span>`).join('') || `<span class="status-neutral">${unit.zone==='back'?'协同待命':`速度 ${number(unit.speed)}`}</span>`}</div>
    </div>
  </article>`;
}

export function combatMarkup(playback, enemyName, round) {
  const combat = playback.combat;
  const current = playback.cursor ? combat.events[playback.cursor-1] : null;
  const snapshot = current?.snapshot || combat.units;
  const units = snapshot.map(u => ({...combat.units.find(base=>base.id===u.id),...u}));
  const enemies = units.filter(u=>u.side==='enemy');
  const front = units.filter(u=>u.side==='ally'&&u.zone!=='back');
  const back = units.filter(u=>u.side==='ally'&&u.zone==='back');
  const done = playback.cursor >= combat.events.length;
  const totalDamage = combat.stats?.filter(s=>s.side==='ally').reduce((n,s)=>n+(s.damage||0),0) || 0;
  const seenEvents = combat.events.slice(Math.max(0,playback.cursor-6),playback.cursor).reverse();
  const upcoming = combat.events.slice(playback.cursor).filter(e=>e.actorId&&['attack','basic','skill','ultimate','support','backline','action'].includes(e.kind)).slice(0,7);
  const skillPoints = current?.skillPoints ?? combat.initialSkillPoints ?? 3;
  return `<div class="combat-overlay"><div class="combat-fit"><section class="combat-shell" role="dialog" aria-modal="true" aria-labelledby="modal-heading" tabindex="-1">
    <header class="combat-top"><div><span class="combat-eyebrow">CURRENCY WARS · AUTO BATTLE</span><h1 id="modal-heading">${escape(enemyName)} <small>第 ${round} 关</small></h1></div><div class="combat-turn"><small>行动轮次</small><b>${current?.turn || 0}</b><span>事件 ${playback.cursor} / ${combat.events.length}</span></div><div class="combat-mode"><i></i>${done?'战斗已结束':playback.playing?'自动战斗中':'回放已暂停'}</div></header>
    <div class="combat-layout"><aside class="action-order"><h2>行动序列</h2><p>按速度推进</p>${upcoming.length?upcoming.map((event,i)=>{const unit=units.find(u=>u.id===event.actorId),c=character(unit?.characterId);return `<div class="order-entry ${i===0?'next':''} ${unit?.side==='enemy'?'enemy':''}"><span class="order-index">${i===0?'NEXT':String(i+1).padStart(2,'0')}</span>${c?`<img src="${c.image}" alt="">`:`<span class="order-enemy">◇</span>`}<div><strong>${escape(event.actorName || unit?.name || '战场')}</strong><small>${escape(event.skill || kindLabels[event.kind] || '行动')}</small></div></div>`;}).join(''):'<div class="order-empty">等待战斗结算</div>'}<div class="order-legend"><span><i class="legend-hp"></i>生命</span><span><i class="legend-energy"></i>能量</span><span><i class="legend-toughness"></i>韧性</span></div></aside>
    <div class="combat-arena"><div class="arena-grid"></div><div class="arena-label enemy-label"><span>敌方阵列</span><small>${enemies.filter(u=>u.hp>0).length} / ${enemies.length} 存活</small></div><div class="combat-enemies">${enemies.map(u=>battleUnit(u,current)).join('')}</div>
      <div class="action-announcement ${current?.kind || ''}"><span>${escape(kindLabels[current?.kind] || (current?'战斗事件':'准备就绪'))}</span><strong>${escape(current?.skill || (done?(combat.winner==='ally'?'战斗胜利':'战斗失利'):'等待首次行动'))}</strong><p>${escape(current?.text || '双方已进入战场，按行动速度依次行动。')}</p></div>
      <div class="arena-label ally-label"><span>我方前台</span><small>${skillPoints!==undefined?`战技点 ${'◆'.repeat(Math.max(0,Math.min(5,skillPoints)))}${'◇'.repeat(Math.max(0,5-skillPoints))}`:'前台承担攻击 · 后台提供协同'}</small></div><div class="combat-allies">${front.map(u=>battleUnit(u,current)).join('')}</div>
      ${back.length?`<div class="combat-backline"><span class="backline-label">后台<br>协同</span>${back.map(u=>battleUnit(u,current,true)).join('')}</div>`:''}
    </div>
    <aside class="combat-feed"><h2>战斗记录 <small>实时结算</small></h2><div class="feed-events">${seenEvents.map((event,i)=>`<article class="feed-event ${i===0?'latest':''} ${event.kind}"><span class="feed-kind">${escape(kindLabels[event.kind]||'行动')} <small>#${event.index??playback.cursor-i}</small></span><h3>${escape(event.actorName || '战场')}</h3><p>${escape(event.text)}</p></article>`).join('')||'<p class="feed-placeholder">技能、装备和羁绊的触发会记录在这里。</p>'}</div><div class="combat-rule">胜负由前台生存与实际伤害决定。后台不受攻击；前台全灭即失败。</div></aside></div>
    <footer class="combat-controls"><div class="playback-progress"><span>${done?combat.winner==='ally'?'胜利 · 敌方已清除':combat.reason==='timeout'?'战败 · 超过行动上限':'战败 · 前台已倒下':`当前行动 ${playback.cursor}`}</span><div><i style="width:${percent(playback.cursor,combat.events.length)}%"></i></div>${done?`<small>全队累计伤害 ${number(totalDamage)}</small>`:'<small>可暂停查看生命、护盾与状态变化</small>'}</div><div class="playback-buttons"><button class="secondary-button" data-action="playback-toggle" ${done?'disabled':''}>${playback.playing?'Ⅱ 暂停':'▶ 播放'}</button><button class="secondary-button" data-action="playback-step" ${done?'disabled':''}>单步 ›</button><button class="secondary-button playback-speed" data-action="playback-speed">${playback.speed}× 速度</button>${done?'<span class="playback-finishing">正在结算…</span>':'<button class="primary-button" data-action="playback-skip">跳过回放 »</button>'}</div></footer>
  </section></div></div>`;
}

export function combatStatsMarkup(combat) {
  if (!combat?.stats) return '';
  const rows = combat.stats.filter(s=>s.side==='ally').sort((a,b)=>b.damage-a.damage);
  const max = Math.max(1,...rows.map(s=>s.damage));
  return `<div class="result-contributions"><div class="contribution-heading"><span>角色贡献</span><span>伤害</span><span>治疗 / 护盾</span></div>${rows.map(s=>`<div class="contribution-row"><strong>${escape(s.name)}<small>${combat.events.filter(e=>e.actorId===s.id&&['basic','skill','ultimate','support'].includes(e.kind)).length} 次行动</small></strong><div class="contribution-damage"><i style="width:${percent(s.damage,max)}%"></i><span>${number(s.damage)}</span></div><span>${number(s.healing)} / ${number(s.shielding)}</span></div>`).join('')}</div>`;
}
