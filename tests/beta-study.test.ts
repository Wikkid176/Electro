import { test } from 'node:test';
import assert from 'node:assert/strict';
import { newStudy, restoreStudy, studySummary, heartbeatSeconds } from '../src/beta.ts';
import { lessons } from '../src/content.ts';

test('human beta records preserve first attempts separately from improved game scores', () => {
  const data = newStudy('A01', 'Adults 30–45 / beginner', {});
  const lesson = lessons[0];
  data.attempts = [2, 3].map((score, number) => ({ id: String(number), lessonId: lesson.id, startedAt: data.startedAt, finishedAt: data.startedAt, score, seconds: 20, hintIndexes: [0], answers: lesson.questions.map((question, index) => ({ index, choice: score === 2 && index === 0 ? (question.correct + 1) % question.choices.length : question.correct, correct: score === 3 || index > 0, hintUsed: index === 0 })) }));
  assert.deepEqual(restoreStudy(JSON.stringify(data)), data);
  const summary = studySummary(data);
  assert.equal(summary.completedFirstAttempts, 1);
  assert.equal(summary.firstPassCorrect, 2);
  assert.equal(summary.firstPassQuestions, 3);
  assert.equal(summary.hintQuestions, 1);
});

test('partial attempts are identified and never presented as complete first-pass results', () => {
  const data = newStudy('T01', 'Teens / beginner', { safety: 3 });
  data.attempts.push({ id: 'partial', lessonId: 'safety', startedAt: data.startedAt, finishedAt: null, score: null, seconds: 10, hintIndexes: [], answers: [] });
  const summary = studySummary(data);
  assert.equal(summary.attemptedMissions, 1);
  assert.equal(summary.completedFirstAttempts, 0);
  assert.equal(summary.firstPassAccuracy, null);
  assert.equal(summary.baselineHasProgress, true);
});

test('malformed human beta logs cannot create misleading scores or cohorts', () => {
  const data = newStudy('P01', 'Electrical professionals', {});
  for (const raw of ['null', '{', '{}', JSON.stringify({ ...data, trainingSeconds: -1 }), JSON.stringify({ ...data, attempts: [{ lessonId: 'missing' }] }), JSON.stringify({ ...data, participant: { code: 'a full name is not a tester code', cohort: 'fake' } }), JSON.stringify({ ...data, workshops: [{ id: 'x', answers: [{ index: 0, choice: 'unknown', correct: true }] }] })]) assert.equal(restoreStudy(raw), null);
  assert.throws(() => newStudy('!', 'Other / prefer not to say', {}));
});

test('timing excludes the background, caps delayed heartbeats, and tolerates clock rollback', () => {
  assert.equal(heartbeatSeconds(1000, 6000, true), 5);
  assert.equal(heartbeatSeconds(1000, 6000, false), 0);
  assert.equal(heartbeatSeconds(1000, 86_400_000, true), 15);
  assert.equal(heartbeatSeconds(6000, 1000, true), 0);
});

test('the fifth lab is recorded and previous beta3 records remain exportable but paused', () => {
  const data = newStudy('A01', 'Adults 30–45 / beginner', {});
  data.labsVisited = ['motor', 'meter', 'trace', 'components', 'wiring'];
  const current = restoreStudy(JSON.stringify(data));
  assert.ok(current); assert.equal(studySummary(current).visitedLabs, 5);
  const earlier = restoreStudy(JSON.stringify({ ...data, build: '0.4.0-beta.3', labsVisited: ['motor', 'meter', 'trace', 'components'] }));
  assert.ok(earlier); assert.equal(earlier.build, '0.4.0-beta.3'); assert.equal(earlier.recording, false);
  assert.equal(restoreStudy(JSON.stringify({ ...data, labsVisited: ['unrecognized'] })), null);
});

test('the Click logo update retains active beta4 records because training and metrics are unchanged', () => {
  const original = { ...newStudy('A01', 'Adults 30–45 / beginner', {}), build: '0.5.0-beta.4' };
  const restored = restoreStudy(JSON.stringify(original));
  assert.ok(restored); assert.equal(restored.recording, true); assert.equal(restored.build, original.build);
  original.recording = false;
  assert.equal(restoreStudy(JSON.stringify(original))?.recording, false);
});
