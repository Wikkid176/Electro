import type { Lesson } from '../content.ts';
import type { TeachingLesson } from './types.ts';
import { foundationTeaching } from './foundations.ts';
import { drawingTeaching } from './drawings.ts';
import { panelTeaching } from './panels.ts';
import { diagnosticTeaching } from './diagnostics.ts';
import { motionTeaching } from './motion.ts';
import { sensorTeaching } from './sensors.ts';
import { deeperFoundations } from './deeper-foundations.ts';
import { deeperDrawings } from './deeper-drawings.ts';
import { deeperApplied } from './deeper-applied.ts';

// Every mission has authored teaching content. There is no generic fallback.
const coreLessons: Record<string, TeachingLesson> = {
  ...foundationTeaching, ...drawingTeaching, ...panelTeaching,
  ...diagnosticTeaching, ...motionTeaching, ...sensorTeaching,
};
export const deeperLessons = { ...deeperFoundations, ...deeperDrawings, ...deeperApplied };
const deeperTitles = ['Under the hood', 'Spot the misconception', 'Connect the dots'];
export const teachingLessons: Record<string, TeachingLesson> = Object.fromEntries(
  Object.entries(coreLessons).map(([id, lesson]) => [id, {
    ...lesson,
    sections: [...lesson.sections, ...deeperLessons[id].map((body, index) => ({ title: deeperTitles[index], body }))],
  }]),
);

export function estimatedLessonMinutes(lesson: Lesson): number {
  const words = JSON.stringify([teachingLessons[lesson.id], lesson.points, lesson.questions]).split(/\s+/).length;
  // Reading allowance plus visual exploration, practice and quiz; not measured study data.
  return Math.max(6, Math.ceil(words / 150) + 3);
}
