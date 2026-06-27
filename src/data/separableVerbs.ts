import type { SupportedLang } from '../types';

export type SeparableContext = 'main' | 'perfect' | 'subordinate' | 'modal';

export interface SeparableExercise {
  id?: string;
  dutch: string;
  english: string;
  translations?: Partial<Record<SupportedLang, string>>;
  answer: string;
  context: SeparableContext;
}

export interface SeparableVerbSet {
  infinitive: string;
  english: string;
  translations?: Partial<Record<SupportedLang, string>>;
  exercises: [SeparableExercise, SeparableExercise, SeparableExercise, SeparableExercise];
}
