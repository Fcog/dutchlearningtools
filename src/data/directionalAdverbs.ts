import type { Level, SupportedLang } from '../types';

export interface DirectionalExercise {
  id?: string;
  dutch: string;
  english: string;
  translations?: Partial<Record<SupportedLang, string>>;
  /** The correct directional/positional adverb that fills the blank. */
  answer: string;
  /** The choice chips shown to the learner (includes the answer). */
  options: string[];
  explanation: string;
  explanationEs?: string;
  level: Level;
}
