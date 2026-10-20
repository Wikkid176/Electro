import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { coachAtlasSize, coachFrames, coachHint } from '../src/coach.ts';

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

test('coach hints support reasoning across course topics without selecting an answer or issuing a qualification', () => {
  const categories = ['FOUNDATIONS', 'METER USE', 'REFERENCE SKILLS', 'SCHEMATICS', 'PANEL BUILD', 'MOTION', 'SENSORS / I/O', 'TROUBLESHOOTING', 'CIRCUIT BASICS'];
  const hints = categories.map(coachHint);
  assert.equal(new Set(hints).size, categories.length);
  for (const hint of hints) {
    assert.ok(hint.length > 50);
    assert.doesNotMatch(hint, /correct answer is|choose [abc]\b|certified|you are qualified|remove a guard|bypass|work live/i);
  }
});
