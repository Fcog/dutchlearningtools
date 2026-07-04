import type { Level, SupportedLang } from '../types';

/** What the fixed preposition attaches to — drives the card's badge. */
export type PrepositionCategory = 'verb' | 'adjective' | 'noun';

export interface PrepositionExercise {
  id?: string;
  /** Dutch sentence with the preposition written as `___`. */
  dutch: string;
  english: string;
  translations?: Partial<Record<SupportedLang, string>>;
  /** The correct fixed preposition that fills the blank. */
  answer: string;
  /** The choice chips shown to the learner (includes the answer). */
  options: string[];
  /** verb / adjective / noun + preposition. */
  category: PrepositionCategory;
  explanation: string;
  explanationEs?: string;
  level: Level;
}
