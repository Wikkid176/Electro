import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lessons } from '../src/content.ts';
import { lessonFingerprint, restoreSession, type MissionSession } from '../src/session.ts';

const lesson = lessons[0];
const checkpoint: MissionSession = { version: 1, lessonId: lesson.id, fingerprint: lessonFingerprint(lesson), phase: 'quiz', questionIndex: 0, selection: lesson.questions[0].correct, checked: true, score: 1, hintVisible: true };

test('unfinished missions round-trip checked feedback, hints and the next ungraded selection', () => {
  assert.deepEqual(restoreSession(JSON.stringify(checkpoint), lessons), checkpoint);
  const next = { ...checkpoint, questionIndex: 1, checked: false, selection: null, hintVisible: false };
  assert.deepEqual(restoreSession(JSON.stringify(next), lessons), next);
});

test('malformed, stale and impossible mission checkpoints are rejected', () => {
  for (const raw of [null, '{', 'null', '{}']) assert.equal(restoreSession(raw, lessons), null);
  for (const patch of [{ version: 2 }, { lessonId: 'missing' }, { fingerprint: 'old' }, { phase: 'result' }, { questionIndex: -1 }, { questionIndex: 3 }, { questionIndex: 0.5 }, { score: 99 }, { score: 0 }, { selection: null }, { selection: 99 }, { checked: 'yes' }, { hintVisible: null }, { phase: 'brief' }]) {
    assert.equal(restoreSession(JSON.stringify({ ...checkpoint, ...patch }), lessons), null, JSON.stringify(patch));
  }
  const changed = { ...lesson, questions: lesson.questions.map((question, i) => i === 0 ? { ...question, correct: (question.correct + 1) % question.choices.length } : question) };
  assert.equal(restoreSession(JSON.stringify(checkpoint), [changed]), null);
});
