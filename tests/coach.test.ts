import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { coachAtlasSize, coachFrames, coachHint } from '../src/coach.ts';
import { lessons } from '../src/content.ts';

test('every coach mood has a distinct in-bounds image frame in the bundled PNG', () => {
  const image = readFileSync(new URL('../assets/relay-coach-atlas.png', import.meta.url));
  assert.equal(image.readUInt32BE(16), coachAtlasSize.width);
  assert.equal(image.readUInt32BE(20), coachAtlasSize.height);
  assert.equal(new Set(Object.values(coachFrames).map(frame => JSON.stringify(frame))).size, 4);
  for (const frame of Object.values(coachFrames)) {
    assert.ok(frame.x >= 0 && frame.y >= 0 && frame.width > 0 && frame.height > 0);
    assert.ok(frame.x + frame.width <= coachAtlasSize.width && frame.y + frame.height <= coachAtlasSize.height);
  }
});

test('all 141 questions have distinct case-specific nudges and deeper reasoning', () => {
  const hints = lessons.flatMap(lesson => lesson.questions.flatMap((_, index) => [coachHint(lesson.id, index), coachHint(lesson.id, index, 1)]));
  assert.equal(hints.length, 282);
  assert.equal(new Set(hints).size, 282);
  for (const hint of hints) {
    assert.ok(hint.length > 50);
    assert.doesNotMatch(hint, /correct answer is|you are certified|you are qualified|work live/i);
    assert.doesNotMatch(hint, /choose [ABC](?:[.)]|$)/);
  }
  assert.match(coachHint('fundamentals', 0), /I = V\/R/);
  assert.match(coachHint('energy-sources', 1), /raised/);
  assert.match(coachHint('analog-scaling', 1, 1), /16 mA/);
  assert.throws(() => coachHint('missing', 0), RangeError);
  assert.throws(() => coachHint('safety', 3), RangeError);
});
