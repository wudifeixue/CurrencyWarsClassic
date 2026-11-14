import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, act, validateState } from '../dist/engine.js';
import { choiceScreen, resultScreen } from '../dist/reference-screens.js';

const freeze = value => {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
};
const confirmButton = html => html.match(/<button\b[^>]*data-action="choice-confirm"[^>]*>/)?.[0];
const statNames = html => [...html.matchAll(/<span class="reference-stat-name">([^<]+)<\/span>/g)].map(m => m[1]);
const foughtGame = () => {
  const state = createGame(86);
  assert.equal(act(state, { type: 'battle' }).ok, true);
  return state;
};

test('reward preview does not award anything, and index zero can be explicitly confirmed once', () => {
  const state = foughtGame();
  assert.equal(act(state, { type: 'next' }).ok, true);
  assert.equal(state.phase, 'choice');
  const before = structuredClone(state);
  const reward = state.choices[0];
  const html = choiceScreen(freeze(structuredClone(state)), 0);
  assert.ok(confirmButton(html));
  assert.doesNotMatch(confirmButton(html), /\bdisabled\b/);
  assert.equal((html.match(/aria-pressed="true"/g) || []).length, 1);
  assert.deepEqual(state, before);
  assert.equal(act(state, { type: 'choose', index: 0 }).ok, true);
  assert.equal(state.phase, 'prep');
  assert.ok(state.strategies.includes(reward.id));
  const afterAward = structuredClone(state);
  assert.equal(act(state, { type: 'choose', index: 0 }).ok, false);
  assert.deepEqual(state, afterAward);
});

test('reward confirmation stays disabled for no selection and out-of-range or non-integer indices', () => {
  const state = foughtGame();
  act(state, { type: 'next' });
  freeze(state);
  for (const index of [undefined, null, -1, 3, 99, 0.5, NaN, '0']) {
    const html = choiceScreen(state, index);
    assert.match(confirmButton(html), /\bdisabled\b/, String(index));
    assert.equal((html.match(/aria-pressed="true"/g) || []).length, 0, String(index));
  }
});

test('damage chart ranks only allies by actual combat damage without mutating the saved battle', () => {
  const state = foughtGame();
  const expected = state.lastBattle.combat.stats.filter(s => s.side === 'ally').toSorted((a, b) => b.damage - a.damage);
  const before = structuredClone(state);
  const html = resultScreen(freeze(state), { view: 'damage' });
  assert.deepEqual(statNames(html), expected.map(s => s.name));
  for (const stat of expected) {
    assert.ok(html.includes(`${stat.name} · 伤害 ${Math.round(stat.damage).toLocaleString('zh-CN')}`), stat.name);
  }
  assert.match(html, /height:100%/);
  assert.match(html, /data-action="replay"/);
  assert.match(html, /data-action="next"/);
  assert.deepEqual(state, before);
});

test('legacy results without combat remain readable and do not offer an unavailable replay', () => {
  const state = foughtGame();
  delete state.lastBattle.combat;
  assert.equal(validateState(state), true);
  const html = resultScreen(freeze(state), { view: 'damage' });
  assert.match(html, /旧版战报未保存逐角色伤害统计/);
  assert.doesNotMatch(html, /data-action="replay"/);
  assert.match(html, /data-action="next"/);
  assert.doesNotMatch(html, /\b(?:NaN|undefined)\b/);
});

test('expedition ending offers restart confirmation rather than directly resetting the save', () => {
  const state = foughtGame();
  state.phase = 'ended';
  state.result = 'defeat';
  const html = resultScreen(freeze(state), { ended: true, view: 'damage' });
  assert.match(html, /远征结束/);
  assert.match(html, /data-action="restart"/);
  assert.doesNotMatch(html, /data-action="new-game"/);
  assert.doesNotMatch(html, /data-action="next"/);
});

test('result overview and damage pages use the same saved run and expose both pagination controls', () => {
  const state = foughtGame();
  act(state, { type: 'next' });
  act(state, { type: 'choose', index: 0 });
  act(state, { type: 'battle' });
  const before = structuredClone(state);
  freeze(state);
  const overview = resultScreen(state, { view: 'overview' });
  const damage = resultScreen(state, { view: 'damage' });
  assert.match(overview, /当前进度 2 \/ 12 节点/);
  assert.ok(overview.includes(`${state.wins} / ${state.losses}`));
  for (const html of [overview, damage]) {
    assert.match(html, /data-action="result-view" data-view="overview"/);
    assert.match(html, /data-action="result-view" data-view="damage"/);
    assert.match(html, /data-action="next"/);
  }
  assert.deepEqual(state, before);
});
