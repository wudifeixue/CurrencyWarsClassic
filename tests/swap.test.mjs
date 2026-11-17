import test from 'node:test';
import assert from 'node:assert/strict';
import { createGame, act } from '../dist/engine.js';

const zones = state => Object.fromEntries(['front', 'back', 'bench'].map(z => [z, state.units.filter(u => u.zone === z).map(u => u.uid)]));

test('swap exchanges zones and order between a bench unit and a full front row', () => {
  const state = createGame(7);
  assert.equal(act(state, { type: 'buy', index: 3 }).ok, true);
  const before = zones(state);
  const benchUid = before.bench[0], frontUid = before.front[1];
  const result = act(state, { type: 'swap', uid: benchUid, targetUid: frontUid });
  assert.equal(result.ok, true);
  const after = zones(state);
  assert.deepEqual(after.front, [before.front[0], benchUid, ...before.front.slice(2)]);
  assert.deepEqual(after.bench, [frontUid]);
  assert.equal(after.front.length, before.front.length);
});

test('swap reorders two units inside the same row', () => {
  const state = createGame(7);
  const [a, b, c] = zones(state).front;
  assert.equal(act(state, { type: 'swap', uid: a, targetUid: c }).ok, true);
  assert.deepEqual(zones(state).front, [c, b, a]);
});

test('swap rejects unknown units and leaves the roster unchanged', () => {
  const state = createGame(7);
  const before = JSON.stringify(state.units);
  assert.equal(act(state, { type: 'swap', uid: 'missing', targetUid: state.units[0].uid }).ok, false);
  assert.equal(JSON.stringify(state.units), before);
});
