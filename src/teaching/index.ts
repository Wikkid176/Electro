import type { Lesson } from '../content.ts';
import type { TeachingLesson } from './types.ts';
import { foundationTeaching } from './foundations.ts';
import { drawingTeaching } from './drawings.ts';
import { panelTeaching } from './panels.ts';
import { diagnosticTeaching } from './diagnostics.ts';
import { motionTeaching } from './motion.ts';
import { sensorTeaching } from './sensors.ts';

// Every mission has authored teaching content. There is no generic fallback.
export const teachingLessons: Record<string, TeachingLesson> = {
  ...foundationTeaching, ...drawingTeaching, ...panelTeaching,
  ...diagnosticTeaching, ...motionTeaching, ...sensorTeaching,
};

export function estimatedLessonMinutes(lesson: Lesson): number {
  const words = JSON.stringify([teachingLessons[lesson.id], lesson.points, lesson.questions]).split(/\s+/).length;
  // Reading allowance plus visual exploration, practice and quiz; not measured study data.
  return Math.max(6, Math.ceil(words / 150) + 3);
}
