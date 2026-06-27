import type { Level, SupportedLang } from '../types';

export type PositionalVerb = 'zijn' | 'zitten' | 'liggen' | 'staan';

export interface PositionalExercise {
  id?: string;
  dutch: string;
  english: string;
  translations?: Partial<Record<SupportedLang, string>>;
  verb: PositionalVerb;
  answer: string;
  explanation: string;
  explanationEs?: string;
  level: Level;
}
