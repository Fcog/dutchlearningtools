import type { Level, SupportedLang } from '../types';

/** The kind of time expression the preposition introduces — drives the badge. */
export type TimeCategory = 'clock' | 'day' | 'period' | 'sequence' | 'duration';

export interface TimeExercise {
  id?: string;
  /** Dutch sentence with the time preposition written as `___`. */
  dutch: string;
  english: string;
  translations?: Partial<Record<SupportedLang, string>>;
  /** The correct time preposition that fills the blank. */
  answer: string;
  /** The choice chips shown to the learner (includes the answer). */
  options: string[];
  /** clock / day / period / sequence / duration. */
  category: TimeCategory;
  explanation: string;
  explanationEs?: string;
  level: Level;
}
