import { questionHints, type MissionHints } from './coaching/questions.ts';
import { appliedQuestionHints } from './coaching/applied.ts';

export type CoachMood = 'welcome' | 'think' | 'encourage' | 'celebrate';
export const coachAtlasSize = { width: 1294, height: 1216 };
export const coachFrames: Record<CoachMood, { x: number; y: number; width: number; height: number }> = {
  welcome: { x: 0, y: 0, width: 647, height: 608 },
  think: { x: 647, y: 0, width: 647, height: 608 },
  encourage: { x: 0, y: 608, width: 647, height: 608 },
  celebrate: { x: 647, y: 608, width: 647, height: 608 },
};
export const missionCoaching: Record<string, MissionHints> = { ...questionHints, ...appliedQuestionHints };

export function coachHint(lessonId: string, questionIndex: number, level: 0 | 1 = 0): string {
  const hint = missionCoaching[lessonId]?.[questionIndex]?.[level];
  if (!hint) throw new RangeError(`Missing question coaching: ${lessonId}/${questionIndex}/${level}`);
  return hint;
}
