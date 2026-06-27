import type { Level, SupportedLang } from '../types';

export type Article = 'de' | 'het';

export interface ArticleNoun {
  id: string;
  noun: string;
  article: Article;
  english: string;
  translations?: Partial<Record<SupportedLang, string>>;
  level: Level;
  tip?: string;
  tipEs?: string;
}
