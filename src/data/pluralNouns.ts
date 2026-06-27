import type { Level, SupportedLang } from '../types';

export type PluralRule = 'en' | 's' | 'eren' | 'irregular';

export interface PluralNoun {
  id: string;
  singular: string;
  article: 'de' | 'het';
  plural: string;
  plural_type: PluralRule;
  english: string;
  translations?: Partial<Record<SupportedLang, string>>;
  tip?: string;
  tipEs?: string;
  level: Level;
}
