import type { Level, SupportedLang } from '../types';

export interface FromToExercise {
  id?: string;
  dutch: string;
  english: string;
  translations?: Partial<Record<SupportedLang, string>>;
  /** The correct direction word that fills the blank (vandaan / heen / toe). */
  answer: string;
  /** The choice chips shown to the learner (includes the answer). */
  options: string[];
  explanation: string;
  explanationEs?: string;
  level: Level;
}
