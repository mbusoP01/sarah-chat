import test from 'node:test';
import assert from 'node:assert/strict';
import { chooseModel, formatMessages, rankModels } from '../lib/horde.js';

test('formatMessages preserves roles and adds assistant cue', () => {
  const out = formatMessages([{role:'user',content:'Hello'}, {role:'assistant',content:'Hi'}], 'Be direct');
  assert.match(out, /### System:\nBe direct/);
  assert.match(out, /### User:\nHello/);
  assert.ok(out.endsWith('### Assistant:\n'));
});

test('ranking rewards capable preferred live models', () => {
  const ranked = rankModels([
    { name:'tiny', count:5, eta:1, performance:20, queued:0, jobs:0 },
    { name:'aphrodite/TheDrummer/Skyfall-31B-v4.2', count:5, eta:1, performance:20, queued:0, jobs:0 }
  ]);
  assert.match(ranked[0].name, /Skyfall/);
});

test('fast mode prefers lower eta', () => {
  const chosen = chooseModel([
    { name:'aphrodite/TheDrummer/Skyfall-31B-v4.2', count:3, eta:20, performance:20 },
    { name:'fast-model', count:2, eta:1, performance:30 }
  ], 'auto', 'fast');
  assert.equal(chosen.name, 'fast-model');
});
