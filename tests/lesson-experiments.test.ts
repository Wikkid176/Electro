import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dcValues, networkValues, analogTemperature, timerStep, samplingPoints } from '../src/lesson-experiments.ts';
import { lessons } from '../src/content.ts';
import { teachingLessons } from '../src/teaching/index.ts';
import { checkpointMigrations } from '../src/checkpoint-migrations.ts';
import { lessonFingerprint, restoreSession } from '../src/session.ts';

test('interactive DC and network models respect topology, current paths and power', () => {
  assert.equal(dcValues(12, 120).current, 0.1);
  assert.ok(Math.abs(dcValues(12, 120).power - 1.2) < 1e-12);
  assert.equal(dcValues(24, 120).current, 0.2);
  assert.equal(dcValues(12, 240).current, 0.05);
  assert.deepEqual(networkValues(false, false), { current: 0.1, branchOne: 0.1, branchTwo: 0.1 });
  assert.deepEqual(networkValues(false, true), { current: 0, branchOne: 0, branchTwo: 0 });
  assert.deepEqual(networkValues(true, true), { current: 0.2, branchOne: 0, branchTwo: 0.2 });
  assert.equal(networkValues(true, false).current, 0.4);
  for (const [v, r] of [[12, 0], [NaN, 120], [12, Infinity], [-1, 120]]) assert.throws(() => dcValues(v, r), RangeError);
});

test('analog experiment includes its offset and never turns invalid current into a valid temperature', () => {
  assert.equal(analogTemperature(4), -10);
  assert.equal(analogTemperature(8), 5);
  assert.equal(analogTemperature(12), 20);
  assert.equal(analogTemperature(20), 50);
  for (const value of [0, 3.9, 20.1, NaN, Infinity]) assert.equal(analogTemperature(value), null);
});

test('on-delay requires an uninterrupted interval and resets on enable removal', () => {
  let state = { enabled: false, elapsed: 0 };
  assert.equal(timerStep(state, 'tick').elapsed, 0);
  state = timerStep(state, 'toggle');
  state = timerStep(timerStep(state, 'tick'), 'tick');
  assert.equal(state.elapsed, 2);
  state = timerStep(state, 'toggle');
  assert.deepEqual(state, { enabled: false, elapsed: 0 });
  state = timerStep(state, 'toggle');
  state = timerStep(timerStep(timerStep(state, 'tick'), 'tick'), 'tick');
  assert.deepEqual(state, { enabled: true, elapsed: 3 });
});

test('the same brief event is missed or captured according to sample spacing', () => {
  assert.deepEqual(samplingPoints(false), [{ time: 0, event: false }, { time: 20, event: false }]);
  assert.deepEqual(samplingPoints(true).filter(point => point.event).map(point => point.time), [6, 8]);
});

test('all lessons have five authored sections without repeated fiction labels', () => {
  assert.doesNotMatch(JSON.stringify([lessons, teachingLessons]), /\bfictional\b|\binvented\b/i);
  for (const lesson of lessons) assert.equal(teachingLessons[lesson.id].sections.length, 5);
});

test('wording-only migrations preserve checked answers but reject changed answer structures', () => {
  const lesson = lessons.find(item => item.id === 'energy-sources')!;
  const old = Object.entries(checkpointMigrations).find(([, current]) => current === lessonFingerprint(lesson))![0];
  const checkpoint = { version: 1, lessonId: lesson.id, fingerprint: old, phase: 'quiz', questionIndex: 0, selection: lesson.questions[0].correct, score: 1, checked: true, hintVisible: true, hintExpanded: true };
  const restored = restoreSession(JSON.stringify(checkpoint), lessons);
  assert.equal(restored?.score, 1);
  assert.equal(restored?.fingerprint, lessonFingerprint(lesson));
  assert.equal(restored?.hintExpanded, true);
  const changed = { ...lesson, questions: lesson.questions.map((question, index) => index ? question : { ...question, correct: (question.correct + 1) % 3 }) };
  assert.equal(restoreSession(JSON.stringify(checkpoint), [changed]), null);
  assert.equal(restoreSession(JSON.stringify({ ...checkpoint, hintVisible: false }), lessons), null);
});
