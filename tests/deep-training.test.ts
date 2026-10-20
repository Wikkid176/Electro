import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const deep = JSON.parse(readFileSync(new URL('../src/training/deep_lessons.json', import.meta.url), 'utf8'));
const work = JSON.parse(readFileSync(new URL('../src/training/work_orders.json', import.meta.url), 'utf8'));

test('21 deep lessons provide authored instruction, examples, checks and safety context', () => {
  assert.equal(deep.lessons.length, 21);
  assert.equal(new Set(deep.lessons.map((x: { id: string }) => x.id)).size, 21);
  const refs = new Set(Object.keys(deep.referenceRegistry));
  for (const lesson of deep.lessons) {
    assert.ok(lesson.id.startsWith('deep-'));
    assert.ok(lesson.title && lesson.track && lesson.estimatedMinutes >= 10, lesson.id);
    assert.ok(lesson.objectives.length >= 2 && lesson.sections.length >= 3, lesson.id);
    for (const section of lesson.sections) assert.ok(section.heading && section.body.length >= 160, lesson.id);
    assert.ok(lesson.workedExample.problem && lesson.workedExample.solution && lesson.workedExample.interpretation, lesson.id);
    assert.ok(lesson.commonMisconception.claim && lesson.commonMisconception.correction, lesson.id);
    assert.equal(lesson.knowledgeChecks.length, 2, lesson.id);
    for (const check of lesson.knowledgeChecks) {
      assert.ok(check.choices.length >= 3 && check.correctIndex >= 0 && check.correctIndex < check.choices.length);
      assert.ok(check.question && check.explanation);
    }
    assert.ok(lesson.virtualExercise.prompt && lesson.virtualExercise.expectedReasoning && lesson.virtualExercise.safetyGate, lesson.id);
    assert.ok(lesson.trainingNotice.includes('TRAINING ONLY'), lesson.id);
    assert.ok(Array.isArray(lesson.referenceIds) && lesson.referenceIds.every((id: string) => refs.has(id)), lesson.id);
  }
});

test('12 fictional maintenance work orders have discriminating evidence and explicit boundaries', () => {
  assert.equal(work.cases.length, 12);
  assert.equal(new Set(work.cases.map((x: { id: string }) => x.id)).size, 12);
  const ids = new Set(deep.lessons.map((x: { id: string }) => x.id));
  for (const entry of work.cases) {
    assert.equal(entry.mode, 'fictional_offline_simulation', entry.id);
    assert.ok(entry.symptom && entry.debrief && entry.safetyBoundary, entry.id);
    assert.ok(entry.observations.length >= 2 && entry.candidateCauses.length >= 2 && entry.discriminatingVirtualEvidence.length >= 2, entry.id);
    assert.ok(entry.relatedLessons.length && entry.relatedLessons.every((id: string) => ids.has(id)), entry.id);
    assert.equal(Object.values(entry.grading as Record<string, number>).reduce((a, b) => a + b, 0), 100, entry.id);
  }
});
