import type { Lesson } from './content.ts';

export const SESSION_KEY = 'electro.session.v1';
export type MissionSession = {
  version: 1;
  lessonId: string;
  fingerprint: string;
  phase: 'brief' | 'quiz';
  questionIndex: number;
  selection: number | null;
  checked: boolean;
  score: number;
  hintVisible: boolean;
};

// Invalidate a checkpoint if a lesson's questions or answer order changes.
export function lessonFingerprint(lesson: Lesson): string {
  const text = JSON.stringify([lesson.brief, lesson.points, lesson.questions]);
  let hash = 2166136261;
  for (let i = 0; i < text.length; i++) hash = Math.imul(hash ^ text.charCodeAt(i), 16777619);
  return (hash >>> 0).toString(16);
}

export function restoreSession(raw: string | null, lessons: Lesson[]): MissionSession | null {
  try {
    if (!raw) return null;
    const value = JSON.parse(raw) as MissionSession;
    if (!value || value.version !== 1) return null;
    const lesson = lessons.find(item => item.id === value.lessonId);
    if (!lesson || value.fingerprint !== lessonFingerprint(lesson)) return null;
    if (value.phase !== 'brief' && value.phase !== 'quiz') return null;
    if (!Number.isInteger(value.questionIndex) || value.questionIndex < 0 || value.questionIndex >= lesson.questions.length) return null;
    const question = lesson.questions[value.questionIndex];
    if (value.selection !== null && (!Number.isInteger(value.selection) || value.selection < 0 || value.selection >= question.choices.length)) return null;
    if (typeof value.checked !== 'boolean' || typeof value.hintVisible !== 'boolean') return null;
    if (value.checked && value.selection === null) return null;
    const currentCorrect = value.checked && value.selection === question.correct ? 1 : 0;
    if (!Number.isInteger(value.score) || value.score < currentCorrect || value.score > value.questionIndex + currentCorrect) return null;
    if (value.phase === 'brief' && (value.questionIndex !== 0 || value.selection !== null || value.checked || value.score !== 0 || value.hintVisible)) return null;
    return { version: 1, lessonId: lesson.id, fingerprint: value.fingerprint, phase: value.phase, questionIndex: value.questionIndex, selection: value.selection, checked: value.checked, score: value.score, hintVisible: value.hintVisible };
  } catch { return null; }
}
