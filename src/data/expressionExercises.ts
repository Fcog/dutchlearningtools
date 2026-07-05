import type { Level, SupportedLang } from '../types';

export interface ExpressionExercise {
  id?: string;
  /** The idiom (in a short context) with its key word written as `___`. */
  dutch: string;
  /** The English meaning of the idiom — shown as the gloss/prompt. */
  english: string;
  translations?: Partial<Record<SupportedLang, string>>;
  /** The key word that completes the expression. */
  answer: string;
  /** The choice chips (includes the answer); distractors are plausible near-words. */
  options: string[];
  /** Full idiom + literal image + meaning. */
  explanation: string;
  explanationEs?: string;
  level: Level;
}
