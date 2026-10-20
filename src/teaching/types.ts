import type { ComponentId } from '../components.ts';

export type VisualKind = 'energy' | 'loop' | 'compare' | 'meter' | 'document' | 'chain' | 'scale' | 'timeline';
export type TeachingLesson = {
  coach: string;
  sections: { title: string; body: string }[];
  visual: {
    kind: VisualKind; title: string; caption: string; component?: ComponentId;
    nodes: { label: string; detail: string; value?: string; level?: number }[];
  };
  example: { scenario: string; steps: string[]; takeaway: string };
  practice: { prompt: string; choices: string[]; correct: number; explanation: string };
};

export const lessonPages = ['Learn', 'Explore', 'Practice', 'Recap'] as const;
