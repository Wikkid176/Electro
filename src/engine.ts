export type Progress = { version: 1; scores: Record<string, number> };
export const initialProgress: Progress = { version: 1, scores: {} };
export const XP_PER_ANSWER = 25;

export function completeLesson(progress: Progress, id: string, score: number, total: number): Progress {
  if (!Number.isInteger(score) || !Number.isInteger(total) || score < 0 || score > total || total < 1) {
    throw new Error('Invalid lesson score');
  }
  return { version: 1, scores: { ...progress.scores, [id]: Math.max(progress.scores[id] ?? 0, score) } };
}

export function totalXp(progress: Progress): number {
  return Object.values(progress.scores).reduce((sum, score) => sum + score * XP_PER_ANSWER, 0);
}

export function restoreProgress(raw: string | null, questionCounts: Record<string, number>): Progress {
  try {
    const value = JSON.parse(raw ?? 'null');
    if (value?.version !== 1 || !value.scores || typeof value.scores !== 'object') return initialProgress;
    const scores: Record<string, number> = {};
    for (const [id, max] of Object.entries(questionCounts)) {
      const score = value.scores[id];
      if (Number.isInteger(score) && score >= 0 && score <= max) scores[id] = score;
    }
    return { version: 1, scores };
  } catch { return initialProgress; }
}

export type MotorState = { running: boolean; emergency: boolean; overload: boolean };
export type MotorAction = 'start' | 'stop' | 'emergency' | 'release' | 'trip' | 'reset';
export const initialMotor: MotorState = { running: false, emergency: false, overload: false };
export function motorReducer(state: MotorState, action: MotorAction): MotorState {
  switch (action) {
    case 'start': return { ...state, running: !state.emergency && !state.overload };
    case 'stop': return { ...state, running: false };
    case 'emergency': return { ...state, emergency: true, running: false };
    case 'release': return { ...state, emergency: false };
    case 'trip': return { ...state, overload: true, running: false };
    case 'reset': return { ...state, overload: false };
  }
}
