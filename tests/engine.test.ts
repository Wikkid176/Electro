import { test } from 'node:test';
import assert from 'node:assert/strict';
import { completeLesson, initialProgress, totalXp, restoreProgress, motorReducer, initialMotor } from '../src/engine.ts';
import { lessons } from '../src/content.ts';

test('replaying a lesson improves the best score without farming XP or erasing progress', () => {
  let progress = completeLesson(initialProgress, 'safety', 2, 3);
  progress = completeLesson(progress, 'motor', 1, 3);
  progress = completeLesson(progress, 'safety', 1, 3);
  assert.equal(totalXp(progress), 75);
  progress = completeLesson(progress, 'safety', 3, 3);
  assert.equal(totalXp(progress), 100);
  assert.equal(progress.scores.motor, 1);
  assert.deepEqual(initialProgress.scores, {});
});

test('invalid scores cannot create rewards', () => {
  for (const score of [-1, 4, NaN, 1.5]) assert.throws(() => completeLesson(initialProgress, 'safety', score, 3));
});

test('saved progress round-trips and rejects malformed or unknown data', () => {
  const counts = Object.fromEntries(lessons.map(l => [l.id, l.questions.length]));
  const saved = completeLesson(initialProgress, 'safety', 3, 3);
  assert.deepEqual(restoreProgress(JSON.stringify(saved), counts), saved);
  for (const raw of [null, '{', '{}', '{"version":2,"scores":{}}']) {
    assert.deepEqual(restoreProgress(raw, counts), initialProgress);
  }
  assert.deepEqual(restoreProgress('{"version":1,"scores":{"safety":99,"motor":2,"invented":8}}', counts).scores, { motor: 2 });
});

test('emergency stop and overload block start; recovery never restarts the motor', () => {
  let state = motorReducer(initialMotor, 'start');
  assert.equal(state.running, true);
  state = motorReducer(state, 'emergency');
  state = motorReducer(state, 'start');
  assert.equal(state.running, false);
  state = motorReducer(state, 'trip');
  state = motorReducer(state, 'release');
  state = motorReducer(state, 'start');
  assert.equal(state.running, false);
  state = motorReducer(state, 'reset');
  assert.equal(state.running, false);
  state = motorReducer(state, 'start');
  assert.equal(state.running, true);
  assert.equal(motorReducer(state, 'stop').running, false);
});

test('every lesson has complete, answerable questions and unique identifiers', () => {
  assert.equal(new Set(lessons.map(l => l.id)).size, lessons.length);
  assert.equal(lessons.length, 47);
  assert.deepEqual(lessons.map(lesson => lesson.symbol), Array.from({ length: 47 }, (_, i) => String(i + 1).padStart(2, '0')));
  for (const lesson of lessons) {
    assert.equal(lesson.questions.length, 3);
    for (const question of lesson.questions) {
      assert.ok(question.correct >= 0 && question.correct < question.choices.length);
      assert.equal(new Set(question.choices).size, question.choices.length);
      assert.ok(question.explanation.length > 20);
      if (question.referenceCards) {
        assert.ok(question.referenceCards.length > 0);
        assert.equal(new Set(question.referenceCards.map(card => card.id)).size, question.referenceCards.length);
        assert.ok(question.referenceCards.every(card => card.title && card.context && card.content));
      }
    }
  }
});

test('curriculum expansion preserves every original mission score without awarding new mission XP', () => {
  const original = { safety: 3, fundamentals: 3, motor: 3, schematics: 3, plc: 3, diagnosis: 3 };
  const counts = Object.fromEntries(lessons.map(lesson => [lesson.id, lesson.questions.length]));
  const restored = restoreProgress(JSON.stringify({ version: 1, scores: original }), counts);
  assert.deepEqual(restored.scores, original);
  assert.equal(totalXp(restored), 450);
  assert.equal(lessons.find(lesson => restored.scores[lesson.id] !== lesson.questions.length)?.id, 'energy-sources');
  const previousSafetyCourse = { ...original, 'energy-sources': 3, 'loto-roles': 3, verification: 3, 'shared-protection': 3, 'electrical-hazards': 3 };
  const expanded = restoreProgress(JSON.stringify({ version: 1, scores: previousSafetyCourse }), counts);
  assert.deepEqual(expanded.scores, previousSafetyCourse);
  assert.equal(totalXp(expanded), 825);
  assert.equal(lessons.find(lesson => expanded.scores[lesson.id] !== lesson.questions.length)?.id, 'electrical-units');
  const previousMeterCourse = { ...previousSafetyCourse, 'electrical-units': 3, 'circuit-paths': 3, 'electrical-power': 3, 'meter-setup': 3, 'meter-readings': 3, 'measurement-evidence': 3 };
  const meterProgress = restoreProgress(JSON.stringify({ version: 1, scores: previousMeterCourse }), counts);
  assert.deepEqual(meterProgress.scores, previousMeterCourse);
  assert.equal(totalXp(meterProgress), 1275);
  assert.equal(lessons.find(lesson => meterProgress.scores[lesson.id] !== lesson.questions.length)?.id, 'drawing-navigation');
  const previousDrawingCourse = { ...previousMeterCourse, 'drawing-navigation': 3, 'drawing-language': 3, 'drawing-references': 3, 'complete-circuit-path': 3, 'drawing-evidence': 3 };
  const drawingProgress = restoreProgress(JSON.stringify({ version: 1, scores: previousDrawingCourse }), counts);
  assert.deepEqual(drawingProgress.scores, previousDrawingCourse);
  assert.equal(totalXp(drawingProgress), 1650);
  assert.equal(lessons.find(lesson => drawingProgress.scores[lesson.id] !== lesson.questions.length)?.id, 'standards-scope');
  const previousReferenceCourse = { ...previousDrawingCourse, 'standards-scope': 3, 'edition-evidence': 3, 'ratings-context': 3, 'reference-hunt': 3 };
  const referenceProgress = restoreProgress(JSON.stringify({ version: 1, scores: previousReferenceCourse }), counts);
  assert.deepEqual(referenceProgress.scores, previousReferenceCourse);
  assert.equal(totalXp(referenceProgress), 1950);
  assert.equal(lessons.find(lesson => referenceProgress.scores[lesson.id] !== lesson.questions.length)?.id, 'panel-layout');
  const previousPanelCourse = { ...previousReferenceCourse, 'panel-layout': 3, 'panel-terminations': 3, 'panel-bonding': 3, 'panel-protection': 3, 'panel-transformers': 3, 'panel-control-devices': 3, 'panel-inspection': 3 };
  const panelProgress = restoreProgress(JSON.stringify({ version: 1, scores: previousPanelCourse }), counts);
  assert.deepEqual(panelProgress.scores, previousPanelCourse);
  assert.equal(totalXp(panelProgress), 2475);
  assert.equal(lessons.find(lesson => panelProgress.scores[lesson.id] !== lesson.questions.length)?.id, 'diagnostic-plan');
  assert.equal(lessons.reduce((sum, lesson) => sum + lesson.questions.length * 25, 0), 3525);
});
