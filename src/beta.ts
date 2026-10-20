import { lessons } from './content.ts';
import { componentChallenges } from './components.ts';
import { release } from './build.ts';

export const BETA_KEY = 'electro.human-beta.v1';
export const cohorts = ['Adults 30–45 / beginner', 'Teens / beginner', 'Adults 18–30 / beginner', 'Electrical professionals', 'Other / prefer not to say'] as const;
export type Cohort = typeof cohorts[number];
export type StudyAnswer = { index: number; choice: number; correct: boolean; hintUsed: boolean };
export type StudyAttempt = { id: string; lessonId: string; startedAt: string; finishedAt: string | null; score: number | null; seconds: number; hintIndexes: number[]; answers: StudyAnswer[] };
export type WorkshopRun = { id: string; answers: { index: number; choice: string; correct: boolean }[] };
export type StudyData = {
  version: 1; build: string; participant: { code: string; cohort: Cohort }; startedAt: string;
  recording: boolean; baselineScores: Record<string, number>; trainingSeconds: number;
  attempts: StudyAttempt[]; workshops: WorkshopRun[]; labsVisited: string[];
  feedback: { at: string; category: string; location: string; note: string }[];
};
export function validTesterCode(code: string) { return /^[A-Z0-9][A-Z0-9_-]{1,15}$/.test(code); }
export function newStudy(code: string, cohort: Cohort, baselineScores: Record<string, number>, now = new Date().toISOString()): StudyData {
  if (!validTesterCode(code) || !cohorts.includes(cohort)) throw new Error('Use the tester code and group provided by your organizer.');
  return { version: 1, build: release.label, participant: { code, cohort }, startedAt: now, recording: true, baselineScores: { ...baselineScores }, trainingSeconds: 0, attempts: [], workshops: [], labsVisited: [], feedback: [] };
}
const finiteSeconds = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value) && value >= 0;
const timestamp = (value: unknown): value is string => typeof value === 'string' && Number.isFinite(Date.parse(value));
const boundedText = (value: unknown, max: number): value is string => typeof value === 'string' && value.length <= max;
export function restoreStudy(raw: string | null): StudyData | null {
  if (raw === null) return null;
  try {
    if (raw.length > 2_000_000) return null;
    const value = JSON.parse(raw) as StudyData;
    if (!value || value.version !== 1 || ![release.label, '0.3.0-beta.2', '0.2.0-beta.1'].includes(value.build) || !value.participant || !validTesterCode(value.participant.code) || !cohorts.includes(value.participant.cohort) || typeof value.recording !== 'boolean' || !timestamp(value.startedAt) || !finiteSeconds(value.trainingSeconds)) return null;
    if (!value.baselineScores || typeof value.baselineScores !== 'object' || Array.isArray(value.baselineScores)) return null;
    for (const [id, score] of Object.entries(value.baselineScores)) if (!lessons.some(lesson => lesson.id === id && Number.isInteger(score) && score >= 0 && score <= lesson.questions.length)) return null;
    if (!Array.isArray(value.attempts) || value.attempts.length > 150 || new Set(value.attempts.map(attempt => attempt.id)).size !== value.attempts.length) return null;
    for (const attempt of value.attempts) {
      const lesson = lessons.find(lesson => lesson.id === attempt.lessonId);
      if (!lesson || !boundedText(attempt.id, 80) || !timestamp(attempt.startedAt) || !(attempt.finishedAt === null || timestamp(attempt.finishedAt)) || !finiteSeconds(attempt.seconds) || !Array.isArray(attempt.answers) || attempt.answers.length > lesson.questions.length || new Set(attempt.answers.map(answer => answer.index)).size !== attempt.answers.length) return null;
      if (!(attempt.score === null || (Number.isInteger(attempt.score) && attempt.score >= 0 && attempt.score <= lesson.questions.length))) return null;
      if ((attempt.finishedAt === null) !== (attempt.score === null)) return null;
      if (!Array.isArray(attempt.hintIndexes) || attempt.hintIndexes.length > lesson.questions.length || !attempt.hintIndexes.every(index => Number.isInteger(index) && index >= 0 && index < lesson.questions.length)) return null;
      for (const answer of attempt.answers) {
        const question = lesson.questions[answer.index];
        if (!Number.isInteger(answer.index) || !question || !Number.isInteger(answer.choice) || answer.choice < 0 || answer.choice >= question.choices.length || answer.correct !== (answer.choice === question.correct) || typeof answer.hintUsed !== 'boolean') return null;
      }
      if (attempt.answers.length === lesson.questions.length && attempt.score !== null && attempt.score !== attempt.answers.filter(answer => answer.correct).length) return null;
    }
    if (!Array.isArray(value.workshops) || value.workshops.length > 50 || new Set(value.workshops.map(run => run.id)).size !== value.workshops.length) return null;
    for (const run of value.workshops) {
      if (!boundedText(run.id, 80) || !Array.isArray(run.answers) || run.answers.length > componentChallenges.length || new Set(run.answers.map(answer => answer.index)).size !== run.answers.length) return null;
      for (const answer of run.answers) {
        const challenge = componentChallenges[answer.index];
        if (!Number.isInteger(answer.index) || !challenge || !challenge.choices.some(choice => choice.id === answer.choice) || answer.correct !== (answer.choice === challenge.answer)) return null;
      }
    }
    if (!Array.isArray(value.labsVisited) || value.labsVisited.length > 4 || !value.labsVisited.every(lab => ['motor', 'meter', 'trace', 'components'].includes(lab))) return null;
    if (!Array.isArray(value.feedback) || value.feedback.length > 100 || !value.feedback.every(item => timestamp(item.at) && boundedText(item.category, 40) && boundedText(item.location, 120) && boundedText(item.note, 2000))) return null;
    // Keep the earlier study exportable, without mixing its timing or answers
    // with the expanded course. Course scores and reading checkpoints are separate.
    return value.build === release.label ? value : { ...value, recording: false };
  } catch { return null; }
}

// Background/closed time is excluded. Cap unexpectedly late heartbeats rather
// than attributing an overnight suspension to study. This remains an estimate.
export function heartbeatSeconds(previous: number, current: number, foreground: boolean): number {
  return foreground ? Math.max(0, Math.min(15, (current - previous) / 1000)) : 0;
}
export function studySummary(data: StudyData) {
  const first = lessons.flatMap(lesson => { const attempt = data.attempts.find(attempt => attempt.lessonId === lesson.id); return attempt ? [attempt] : []; });
  const completed = first.filter(attempt => attempt.finishedAt !== null && attempt.answers.length === 3);
  const answers = completed.flatMap(attempt => attempt.answers);
  const componentAnswers = data.workshops[0]?.answers ?? [];
  return { attemptedMissions: first.length, completedFirstAttempts: completed.length, firstPassCorrect: answers.filter(answer => answer.correct).length, firstPassQuestions: answers.length, firstPassAccuracy: answers.length ? answers.filter(answer => answer.correct).length / answers.length : null, firstPassMastered: completed.filter(attempt => attempt.score === 3).length, hintQuestions: answers.filter(answer => answer.hintUsed).length, foregroundTrainingMinutes: Math.round(data.trainingSeconds / 6) / 10, visitedLabs: data.labsVisited.length, firstWorkshopCorrect: componentAnswers.filter(answer => answer.correct).length, firstWorkshopQuestions: componentAnswers.length, baselineHasProgress: Object.keys(data.baselineScores).length > 0 };
}
export function studyExport(data: StudyData, platform: string) {
  return { kind: 'ElectroLessonLab voluntary human beta record', exportedAt: new Date().toISOString(), platform, timingMethod: 'Estimated foreground training time; includes visible idle time, excludes Beta tab and background time. Saved in five-second intervals; up to five seconds may be lost on abrupt close. Delayed intervals are capped at fifteen seconds. Replays are included in total time.', summary: studySummary(data), data };
}
