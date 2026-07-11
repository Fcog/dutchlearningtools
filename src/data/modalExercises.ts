import type { Level, SupportedLang } from '../types';

/** Which tense the modal is in — drives the card's badge (present / simple past). */
export type ModalTense = 'present' | 'past';

export interface ModalExercise {
  id?: string;
  /** Dutch sentence with the modal verb written as `___`. */
  dutch: string;
  english: string;
  translations?: Partial<Record<SupportedLang, string>>;
  /** The correct conjugated modal that fills the blank (e.g. `moet`, `moest`). */
  answer: string;
  /** The choice chips shown to the learner — modals conjugated to the same
   *  subject & tense, so the challenge is meaning, not conjugation. */
  options: string[];
  /** present / simple past. */
  tense: ModalTense;
  explanation: string;
  explanationEs?: string;
  level: Level;
}
