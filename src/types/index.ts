export type Level = 'A1' | 'A2' | 'B1';
export type Tense = 'present' | 'past' | 'perfect';
export type Phase = 'active' | 'result';
export type SupportedLang = 'en' | 'es';

export interface PresentConjugation {
  ik: string;
  jij: string;
  hij: string;
  wij: string;
  jullie: string;
  zij: string;
}

export interface Conjugation {
  present: PresentConjugation;
  pastSingular: string;
  pastPlural: string;
  pastParticiple: string;
}

export interface Exercise {
  id?: string;
  dutch: string;
  english: string;
  translations?: Partial<Record<SupportedLang, string>>;
  answer: string;
  tense: Tense;
}

export interface Verb {
  id: string;
  infinitive: string;
  english: string;
  translations?: Partial<Record<SupportedLang, string>>;
  level: Level;
  auxiliary: 'hebben' | 'zijn';
  conjugation: Conjugation;
  exercises: Exercise[];
}
