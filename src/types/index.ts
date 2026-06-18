export type Level = 'A1' | 'A2' | 'B1';
export type Tense = 'present' | 'past' | 'perfect';
export type Phase = 'active' | 'result';

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
  dutch: string;
  english: string;
  answer: string;
  tense: Tense;
}

export interface Verb {
  id: string;
  infinitive: string;
  english: string;
  level: Level;
  auxiliary: 'hebben' | 'zijn';
  conjugation: Conjugation;
  exercises: Exercise[];
}
