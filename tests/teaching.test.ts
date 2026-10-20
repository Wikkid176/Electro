import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lessons } from '../src/content.ts';
import { teachingLessons, estimatedLessonMinutes } from '../src/teaching/index.ts';
import { workshopComponents } from '../src/components.ts';
import { lessonFingerprint, restoreSession } from '../src/session.ts';
import { newStudy, restoreStudy } from '../src/beta.ts';

test('all 47 missions have substantive teaching, explorable visuals, worked examples and separate practice', () => {
  assert.deepEqual(Object.keys(teachingLessons).sort(), lessons.map(lesson => lesson.id).sort());
  const practices = new Set<string>();
  for (const lesson of lessons) {
    const teaching = teachingLessons[lesson.id];
    assert.ok(teaching.coach.length > 40, lesson.id);
    assert.ok(teaching.sections.length >= 2);
    assert.ok(teaching.sections.every(section => section.title && section.body.split(/\s+/).length >= 35), lesson.id);
    assert.ok(teaching.visual.nodes.length >= 3);
    assert.equal(new Set(teaching.visual.nodes.map(node => node.label)).size, teaching.visual.nodes.length);
    assert.ok(teaching.visual.nodes.every(node => node.detail.length > 35));
    if (teaching.visual.component) assert.ok(workshopComponents.some(component => component.id === teaching.visual.component));
    if (teaching.visual.kind === 'scale') assert.ok(teaching.visual.nodes.every(node => typeof node.level === 'number' && node.level >= 0 && node.level <= 1));
    assert.ok(teaching.example.scenario && teaching.example.steps.length >= 3 && teaching.example.takeaway);
    assert.ok(teaching.practice.correct >= 0 && teaching.practice.correct < teaching.practice.choices.length);
    assert.equal(new Set(teaching.practice.choices).size, teaching.practice.choices.length);
    assert.ok(teaching.practice.explanation.length > 50);
    assert.ok(!lesson.questions.some(question => question.prompt === teaching.practice.prompt));
    assert.ok(!practices.has(teaching.practice.prompt)); practices.add(teaching.practice.prompt);
    assert.ok(estimatedLessonMinutes(lesson) >= 6);
  }
  assert.equal(new Set(Object.values(teachingLessons).map(lesson => lesson.visual.kind)).size, 8);
});

test('reading pages resume safely and legacy reading/quiz checkpoints remain compatible', () => {
  const lesson = lessons[0];
  const checkpoint = { version: 1, lessonId: lesson.id, fingerprint: lessonFingerprint(lesson), phase: 'brief', questionIndex: 0, selection: null, checked: false, score: 0, hintVisible: false };
  for (const lessonPage of [0, 1, 2, 3]) assert.deepEqual(restoreSession(JSON.stringify({ ...checkpoint, lessonPage }), lessons), { ...checkpoint, lessonPage });
  assert.deepEqual(restoreSession(JSON.stringify(checkpoint), lessons), checkpoint);
  for (const lessonPage of [-1, 4, 0.5, '2', null]) assert.equal(restoreSession(JSON.stringify({ ...checkpoint, lessonPage }), lessons), null);
});

test('an earlier beta record remains exportable but is paused to keep course versions separate', () => {
  const earlier = { ...newStudy('A01', 'Adults 30–45 / beginner', { safety: 2 }), build: '0.2.0-beta.1', recording: true };
  assert.deepEqual(restoreStudy(JSON.stringify(earlier)), { ...earlier, recording: false });
  assert.equal(restoreStudy(JSON.stringify({ ...earlier, build: 'unknown-build' })), null);
});
