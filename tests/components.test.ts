import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { componentArt, componentArtFrame, componentAtlasSize } from '../src/component-art.ts';
import { componentChallenges, componentQuizReducer, initialComponentQuiz, workshopComponents } from '../src/components.ts';

test('workshop devices and inspection targets resolve to distinct illustrated parts', () => {
  assert.equal(workshopComponents.length, 8);
  assert.equal(new Set(workshopComponents.map(item => item.id)).size, 8);
  assert.equal(new Set(componentChallenges.map(item => item.id)).size, componentChallenges.length);
  for (const component of workshopComponents) {
    assert.equal(component.states.length, 2);
    assert.equal(new Set(component.parts.map(part => part.id)).size, component.parts.length);
    for (const part of component.parts) if (part.target) assert.ok(part.target.x >= 0 && part.target.x <= 300 && part.target.y >= 0 && part.target.y <= 270);
    assert.ok(component.parts.every(part => part.x >= 0 && part.x <= 300 && part.y >= 0 && part.y <= 270 && part.description));
  }
  for (const challenge of componentChallenges) {
    const component = workshopComponents.find(item => item.id === challenge.component);
    assert.ok(component);
    assert.ok(challenge.choices.some(choice => choice.id === challenge.answer));
    assert.equal(new Set(challenge.choices.map(choice => choice.id)).size, challenge.choices.length);
    if (challenge.kind === 'defect') assert.ok(component.parts.some(part => part.id === challenge.answer));
  }
  assert.deepEqual(new Set(componentChallenges.filter(item => item.kind === 'identify').map(item => item.component)), new Set(workshopComponents.map(item => item.id)));
});

test('workshop cannot check an empty/invalid selection or advance before feedback', () => {
  assert.equal(componentQuizReducer(initialComponentQuiz, { type: 'next' }), initialComponentQuiz);
  assert.equal(componentQuizReducer(initialComponentQuiz, { type: 'check' }), initialComponentQuiz);
  assert.equal(componentQuizReducer(initialComponentQuiz, { type: 'select', id: 'unknown' }), initialComponentQuiz);
  const selected = componentQuizReducer(initialComponentQuiz, { type: 'select', id: componentChallenges[0].answer });
  assert.equal(componentQuizReducer(selected, { type: 'next' }), selected);
  assert.equal(initialComponentQuiz.selection, null);
});

test('checking and changing a locked workshop answer cannot award duplicate points', () => {
  const first = componentChallenges[0];
  const wrong = first.choices.find(choice => choice.id !== first.answer)!;
  const selected = componentQuizReducer(initialComponentQuiz, { type: 'select', id: wrong.id });
  const checked = componentQuizReducer(selected, { type: 'check' });
  assert.equal(checked.correct, 0);
  assert.equal(checked.checked, true);
  assert.equal(componentQuizReducer(checked, { type: 'select', id: first.answer }), checked);
  assert.equal(componentQuizReducer(checked, { type: 'check' }), checked);
  const next = componentQuizReducer(checked, { type: 'next' });
  assert.equal(next.index, 1);
  assert.equal(next.selection, null);
  assert.equal(next.checked, false);
});

test('a completed workshop stays complete until restart and starts a clean practice session', () => {
  let state = initialComponentQuiz;
  for (const challenge of componentChallenges) {
    state = componentQuizReducer(state, { type: 'select', id: challenge.answer });
    state = componentQuizReducer(state, { type: 'check' });
    state = componentQuizReducer(state, { type: 'check' });
    state = componentQuizReducer(state, { type: 'next' });
  }
  assert.equal(state.correct, componentChallenges.length);
  assert.equal(state.index, componentChallenges.length);
  assert.equal(componentQuizReducer(state, { type: 'next' }), state);
  assert.equal(componentQuizReducer(state, { type: 'select', id: 'anything' }), state);
  assert.deepEqual(componentQuizReducer(state, { type: 'restart' }), initialComponentQuiz);
});


test('generated artwork has distinct in-bounds states and a dedicated image for each inspection finding', () => {
  const image = readFileSync(new URL('../assets/component-art-atlas.png', import.meta.url));
  assert.equal(image.subarray(1, 4).toString(), 'PNG');
  assert.equal(image.readUInt32BE(16), componentAtlasSize.width);
  assert.equal(image.readUInt32BE(20), componentAtlasSize.height);
  const frames = workshopComponents.flatMap(component => {
    const off = componentArtFrame(component.id, false, false);
    const on = componentArtFrame(component.id, true, false);
    assert.notDeepEqual(off, on);
    const defect = componentArt[component.id].defect;
    return defect ? [off, on, defect] : [off, on];
  });
  assert.equal(frames.length, 20);
  assert.equal(new Set(frames.map(frame => JSON.stringify(frame))).size, 20);
  for (const frame of frames) {
    assert.ok(frame.x >= 0 && frame.y >= 0 && frame.width > 0 && frame.height > 0);
    assert.ok(frame.x + frame.width <= componentAtlasSize.width);
    assert.ok(frame.y + frame.height <= componentAtlasSize.height);
  }
  for (const challenge of componentChallenges.filter(item => item.kind === 'defect')) {
    assert.ok(componentArt[challenge.component].defect);
    assert.notDeepEqual(componentArtFrame(challenge.component, false, true), componentArtFrame(challenge.component, false, false));
  }
});
