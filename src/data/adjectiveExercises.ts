import type { Level } from '../types';

/** The four adjective sub-exercises, grouped under one "Adjectives" section. */
export type AdjectiveKind = 'inflection' | 'vocab' | 'degree' | 'opposite';

export interface AdjectiveExercise {
  id?: string;
  kind: AdjectiveKind;
  /** The Dutch word or phrase shown. For inflection it contains a `___` blank. */
  prompt: string;
  /** Secondary line under the prompt (meaning for inflection/opposite, degree label for degree). */
  glossEn?: string;
  glossEs?: string;
  /** Correct option in the default language (English for vocab; Dutch/neutral otherwise). */
  answer: string;
  /** Vocab only: the correct meaning in Spanish (parallel to answer). */
  answerEs?: string;
  /** The choice chips. Dutch/neutral for most kinds; English meanings for vocab. */
  options: string[];
  /** Vocab only: Spanish meanings, parallel to `options`. */
  optionsEs?: string[];
  explanation: string;
  explanationEs?: string;
  level: Level;
}
