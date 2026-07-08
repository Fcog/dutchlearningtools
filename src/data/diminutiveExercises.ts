import type { Level, SupportedLang } from '../types';

/** Which diminutive-suffix rule the noun follows — drives the badge/theory. */
export type DiminutiveRule = 'je' | 'tje' | 'etje' | 'pje' | 'kje' | 'irregular';

export interface DiminutiveExercise {
  id?: string;
  /** The noun, followed by `→ ___` for the diminutive to fill. */
  dutch: string;
  /** English meaning of the noun — shown as the gloss. */
  english: string;
  translations?: Partial<Record<SupportedLang, string>>;
  /** The correct diminutive. */
  answer: string;
  /** The four choice chips (includes the answer). */
  options: string[];
  /** The suffix rule this noun follows. */
  category: DiminutiveRule;
  explanation: string;
  explanationEs?: string;
  level: Level;
}
