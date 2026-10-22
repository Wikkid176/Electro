import { lessons, type Lesson } from '../../src/content.ts';
import { componentChallenges } from '../../src/components.ts';
import { coachHint } from '../../src/coach.ts';

export const modelVersion = 'electro-beta-2026-10-19-v1';
export type Profile = {
  id: string; group: string; age: number; professional: boolean;
  seed: number; wpm: number; decisionSeconds: number; navigationSeconds: number;
  probabilityOffset: number; hintRate: number; labMinutes: number;
  width: number; height: number; keyboard: boolean; interrupt: boolean;
};
// Age labels never enter the probability or duration formulas. Pace and prior
// knowledge are explicit scenario inputs, not observations about demographic groups.
export const profiles: Profile[] = [
  { id: 'A01', group: 'Adults 30–45 / novice', age: 30, professional: false, seed: 401, wpm: 180, decisionSeconds: 24, navigationSeconds: 7, probabilityOffset: 0, hintRate: .3, labMinutes: 34, width: 390, height: 844, keyboard: false, interrupt: true },
  { id: 'A02', group: 'Adults 30–45 / novice', age: 34, professional: false, seed: 402, wpm: 150, decisionSeconds: 30, navigationSeconds: 9, probabilityOffset: -.04, hintRate: .45, labMinutes: 40, width: 320, height: 740, keyboard: false, interrupt: false },
  { id: 'A03', group: 'Adults 30–45 / novice', age: 38, professional: false, seed: 403, wpm: 205, decisionSeconds: 22, navigationSeconds: 6, probabilityOffset: .04, hintRate: .2, labMinutes: 30, width: 1280, height: 900, keyboard: true, interrupt: false },
  { id: 'A04', group: 'Adults 30–45 / novice', age: 42, professional: false, seed: 404, wpm: 165, decisionSeconds: 28, navigationSeconds: 8, probabilityOffset: -.02, hintRate: .35, labMinutes: 36, width: 390, height: 844, keyboard: false, interrupt: false },
  { id: 'A05', group: 'Adults 30–45 / novice', age: 45, professional: false, seed: 405, wpm: 190, decisionSeconds: 25, navigationSeconds: 7, probabilityOffset: .02, hintRate: .25, labMinutes: 32, width: 1280, height: 900, keyboard: true, interrupt: false },
  { id: 'T01', group: 'Teens / assumed novice', age: 16, professional: false, seed: 501, wpm: 190, decisionSeconds: 25, navigationSeconds: 7, probabilityOffset: .02, hintRate: .25, labMinutes: 32, width: 390, height: 844, keyboard: false, interrupt: true },
  { id: 'T02', group: 'Teens / assumed novice', age: 17, professional: false, seed: 502, wpm: 150, decisionSeconds: 30, navigationSeconds: 9, probabilityOffset: -.04, hintRate: .45, labMinutes: 40, width: 320, height: 740, keyboard: false, interrupt: false },
  { id: 'Y01', group: 'Adults 18–30 / novice', age: 22, professional: false, seed: 601, wpm: 180, decisionSeconds: 24, navigationSeconds: 7, probabilityOffset: 0, hintRate: .3, labMinutes: 34, width: 1280, height: 900, keyboard: true, interrupt: false },
  { id: 'Y02', group: 'Adults 18–30 / novice', age: 28, professional: false, seed: 602, wpm: 205, decisionSeconds: 22, navigationSeconds: 6, probabilityOffset: .04, hintRate: .2, labMinutes: 30, width: 390, height: 844, keyboard: false, interrupt: true },
  { id: 'P01', group: 'Electrical professionals', age: 32, professional: true, seed: 701, wpm: 240, decisionSeconds: 13, navigationSeconds: 5, probabilityOffset: 0, hintRate: .08, labMinutes: 22, width: 1280, height: 900, keyboard: true, interrupt: false },
  { id: 'P02', group: 'Electrical professionals', age: 41, professional: true, seed: 702, wpm: 220, decisionSeconds: 16, navigationSeconds: 6, probabilityOffset: -.02, hintRate: .12, labMinutes: 25, width: 390, height: 844, keyboard: false, interrupt: true },
  { id: 'P03', group: 'Electrical professionals', age: 37, professional: true, seed: 703, wpm: 260, decisionSeconds: 11, navigationSeconds: 4, probabilityOffset: .02, hintRate: .05, labMinutes: 20, width: 390, height: 844, keyboard: false, interrupt: false },
];

export function topic(lesson: Lesson): string {
  if (/FOUNDATIONS|SAFETY/.test(lesson.category)) return 'Safety';
  if (/METER/.test(lesson.category)) return 'Meters';
  if (/SCHEMATIC|PRINT/.test(lesson.category)) return 'Print reading';
  if (/REFERENCE/.test(lesson.category)) return 'Reference skills';
  if (/PANEL/.test(lesson.category)) return 'Panel build';
  if (/TROUBLESHOOT/.test(lesson.category)) return 'Troubleshooting';
  if (/MOTION|MOTOR/.test(lesson.category)) return 'Motors and drives';
  if (/SENSOR/.test(lesson.category)) return 'Sensors';
  if (/AUTOMATION/.test(lesson.category)) return 'Automation';
  return 'Fundamentals';
}
export const probabilities: Record<string, [number, number]> = {
  'Safety': [.78, .93], 'Fundamentals': [.56, .87], 'Meters': [.56, .90],
  'Print reading': [.55, .88], 'Reference skills': [.57, .86],
  'Panel build': [.58, .90], 'Troubleshooting': [.68, .92],
  'Motors and drives': [.54, .90], 'Sensors': [.55, .89], 'Automation': [.60, .90],
};
export function words(text: string): number { return text.trim().split(/\s+/).filter(Boolean).length; }
export const lessonWords = lessons.reduce((sum, lesson) => sum + words([lesson.title, lesson.brief, ...lesson.points, ...lesson.questions.flatMap(question => [question.prompt, ...question.choices, question.explanation])].join(' ')), 0);
export const referenceWords = lessons.reduce((sum, lesson) => {
  const cards = new Map(lesson.questions.flatMap(question => question.referenceCards ?? []).map(card => [card.id, card]));
  return sum + [...cards.values()].reduce((count, card) => count + words([card.title, card.context, card.content].join(' ')), 0);
}, 0);
export function planProfile(profile: Profile) {
  let seed = profile.seed >>> 0;
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  const questions = lessons.flatMap(lesson => lesson.questions.map((question, index) => {
    const probability = Math.min(.99, Math.max(.25, probabilities[topic(lesson)][profile.professional ? 1 : 0] + profile.probabilityOffset));
    const draw = random();
    const wrong = question.choices.map((_, i) => i).filter(i => i !== question.correct);
    const distractorDraw = random();
    const answer = draw < probability ? question.correct : wrong[Math.floor(distractorDraw * wrong.length)];
    const hint = random() < profile.hintRate;
    return { lessonId: lesson.id, topic: topic(lesson), index, answer, correct: answer === question.correct, probability, draw, hint, hintWords: hint ? words(coachHint(lesson.id, index)) : 0, rereadWords: answer === question.correct ? 0 : words(question.explanation) };
  }));
  const components = componentChallenges.map(challenge => {
    const probability = (profile.professional ? .92 : challenge.kind === 'identify' ? .70 : .62) + profile.probabilityOffset;
    const draw = random();
    const wrong = challenge.choices.filter(choice => choice.id !== challenge.answer);
    const distractorDraw = random();
    const answer = draw < probability ? challenge.answer : wrong[Math.floor(distractorDraw * wrong.length)].id;
    return { id: challenge.id, answer, correct: answer === challenge.answer, probability, draw };
  });
  const hinted = questions.filter(question => question.hint).length;
  const reading = (lessonWords + referenceWords + questions.reduce((sum, question) => sum + question.hintWords + question.rereadWords, 0)) / profile.wpm;
  const decisions = questions.length * profile.decisionSeconds / 60;
  const navigation = lessons.length * profile.navigationSeconds / 60;
  const hintReflection = hinted * 8 / 60;
  const time = { reading, decisions, navigation, hintReflection, labs: profile.labMinutes, interruptionRecovery: profile.interrupt ? 1 : 0 };
  return { profile, questions, components, time, estimatedMinutes: Object.values(time).reduce((sum, value) => sum + value, 0) };
}
