import type { Level, SupportedLang } from '../types';

/**
 * The six meanings of the separable verb `voorstellen`. Which one applies is
 * decided by the grammar — whether there is a reflexive pronoun, whether that
 * pronoun is joined by an object, whether it is followed by `dat/om`, and what
 * the subject is. That is exactly what the learner has to reproduce.
 */
export type VoorstellenMeaning =
  | 'introduce'       // iemand aan iemand voorstellen — to introduce someone
  | 'introduce_self'  // zich voorstellen (no object) — to introduce oneself
  | 'imagine'         // zich iets voorstellen (reflexive + object) — to imagine
  | 'suggest'         // voorstellen (dat/om…) — to suggest / propose
  | 'represent'       // iets stelt iets voor (thing as subject) — to depict
  | 'worth';          // niet veel voorstellen — to amount to much

export interface VoorstellenExercise {
  id?: string;
  /** English gloss shown as the prompt. */
  english: string;
  translations?: Partial<Record<SupportedLang, string>>;
  /** The full, correct Dutch sentence (used for the reveal and text-to-speech). */
  dutch: string;
  /** The sentence with each gap written as `___`; blanks are filled left to right. */
  gapped: string;
  /** The correct fill for each blank, in order. Compared word-for-word. */
  answers: string[];
  /** Tap-mode chips: the answer words plus distractors. Shuffled at render time. */
  bank: string[];
  /** Which use of voorstellen this sentence shows — drives the result badge. */
  meaning: VoorstellenMeaning;
  explanation: string;
  explanationEs?: string;
  level: Level;
}
