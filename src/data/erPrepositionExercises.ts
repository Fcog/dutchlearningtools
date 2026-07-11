import type { Level, SupportedLang } from '../types';

/**
 * Which use of the pronominal adverb (er + preposition) is being practised —
 * drives the card's badge.
 *  - 'place'        → direction/location: erin, eruit, erop, eraf… (Ik draai de lamp erin.)
 *  - 'prepositional' → object of a preposition: eraan denken, erop wachten… (Ik denk eraan.)
 */
export type ErUsage = 'place' | 'prepositional';

export interface ErPrepositionExercise {
  id?: string;
  /** Dutch sentence with the er-word written as `___`. */
  dutch: string;
  english: string;
  translations?: Partial<Record<SupportedLang, string>>;
  /** The correct er-word that fills the blank (e.g. `eraan`). */
  answer: string;
  /** The choice chips shown to the learner (includes the answer). */
  options: string[];
  /** place/direction vs object of a preposition. */
  usage: ErUsage;
  explanation: string;
  explanationEs?: string;
  level: Level;
}
