import type { Level, SupportedLang } from '../types';

export type WordOrderRule = 'v2' | 'v2-fronting' | 'subordinate' | 'modal' | 'perfect';

export interface WordOrderSentence {
  id: string;
  words: string[];
  english: string;
  translations?: Partial<Record<SupportedLang, string>>;
  rule: WordOrderRule;
  explanation: string;
  explanationEs?: string;
  level: Level;
}
