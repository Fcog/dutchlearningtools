import type { Level, SupportedLang } from '../types';

/**
 * How the negator lands in the sentence:
 *  - 'insert'  — niet/geen is dropped into a gap (before token at `position`,
 *                where position runs 0..words.length).
 *  - 'replace' — geen replaces an indefinite article: the token at `position`
 *                (an "een") is swapped for "geen".
 */
export type NegationMode = 'insert' | 'replace';

export interface NegationExercise {
  id?: string;
  /** English gloss of the *negative* sentence, shown as the prompt. */
  english: string;
  translations?: Partial<Record<SupportedLang, string>>;
  /** The affirmative sentence as ordered word tokens (what the learner starts from). */
  words: string[];
  /** Which negator is correct. */
  negator: 'niet' | 'geen';
  /** Whether the negator is inserted into a gap or replaces a token. */
  mode: NegationMode;
  /** Gap index (insert) or token index (replace). */
  position: number;
  explanation: string;
  explanationEs?: string;
  level: Level;
}
