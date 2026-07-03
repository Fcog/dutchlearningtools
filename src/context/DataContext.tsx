import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { Verb, Exercise, Conjugation, Level, Tense, SupportedLang } from '../types';
import type { SeparableVerbSet, SeparableExercise, SeparableContext } from '../data/separableVerbs';
import type { PositionalExercise, PositionalVerb } from '../data/positionalVerbs';
import type { DirectionalExercise } from '../data/directionalAdverbs';
import type { FromToExercise } from '../data/fromToAdverbs';
import type { ArticleNoun, Article } from '../data/articleNouns';
import type { PluralNoun, PluralRule } from '../data/pluralNouns';
import type { WordOrderSentence, WordOrderRule } from '../data/wordOrderSentences';
import type { VoorstellenExercise, VoorstellenMeaning } from '../data/voorstellenExercises';

// ── Transformers ───────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toExercise(row: any): Exercise {
  return {
    id:           row.id,
    dutch:        row.dutch,
    english:      row.english,
    answer:       row.answer,
    tense:        row.tense as Tense,
    translations: row.translation_es ? ({ es: row.translation_es } as Partial<Record<SupportedLang, string>>) : undefined,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toVerb(row: any): Verb {
  return {
    id:           row.id,
    infinitive:   row.infinitive,
    english:      row.english,
    translations: row.translation_es ? ({ es: row.translation_es } as Partial<Record<SupportedLang, string>>) : undefined,
    level:        row.level as Level,
    auxiliary:    row.auxiliary as 'hebben' | 'zijn',
    conjugation:  row.conjugation as Conjugation,
    exercises:    (row.exercises ?? []).map(toExercise),
  };
}

const CTX_ORDER: Record<SeparableContext, number> = {
  main: 0, perfect: 1, subordinate: 2, modal: 3,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toSeparableExercise(row: any): SeparableExercise {
  return {
    id:           row.id,
    dutch:        row.dutch,
    english:      row.english,
    answer:       row.answer,
    context:      row.context as SeparableContext,
    translations: row.translation_es ? { es: row.translation_es } : undefined,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toSeparableVerbSet(row: any): SeparableVerbSet {
  const exercises = [...(row.separable_exercises ?? [])]
    .sort((a, b) => CTX_ORDER[a.context as SeparableContext] - CTX_ORDER[b.context as SeparableContext])
    .map(toSeparableExercise) as SeparableVerbSet['exercises'];
  return {
    infinitive:   row.infinitive,
    english:      row.english,
    translations: row.translation_es ? { es: row.translation_es } : undefined,
    exercises,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toArticleNoun(row: any): ArticleNoun {
  return {
    id:           row.id,
    noun:         row.noun,
    article:      row.article as Article,
    english:      row.english,
    translations: row.translation_es ? { es: row.translation_es } : undefined,
    level:        row.level as 'A1' | 'A2' | 'B1',
    tip:          row.tip ?? undefined,
    tipEs:        row.tip_es ?? undefined,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toPositionalExercise(row: any): PositionalExercise {
  return {
    id:             row.id,
    dutch:          row.dutch,
    english:        row.english,
    verb:           row.verb as PositionalVerb,
    answer:         row.answer,
    explanation:    row.explanation,
    explanationEs:  row.explanation_es ?? undefined,
    level:          row.level as Level,
    translations:   row.translation_es ? { es: row.translation_es } : undefined,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toDirectionalExercise(row: any): DirectionalExercise {
  return {
    id:             row.id,
    dutch:          row.dutch,
    english:        row.english,
    answer:         row.answer,
    options:        (row.options ?? []) as string[],
    explanation:    row.explanation,
    explanationEs:  row.explanation_es ?? undefined,
    level:          row.level as Level,
    translations:   row.translation_es ? { es: row.translation_es } : undefined,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toFromToExercise(row: any): FromToExercise {
  return {
    id:             row.id,
    dutch:          row.dutch,
    english:        row.english,
    answer:         row.answer,
    options:        (row.options ?? []) as string[],
    explanation:    row.explanation,
    explanationEs:  row.explanation_es ?? undefined,
    level:          row.level as Level,
    translations:   row.translation_es ? { es: row.translation_es } : undefined,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toPluralNoun(row: any): PluralNoun {
  return {
    id:           row.id,
    singular:     row.singular,
    article:      row.article as 'de' | 'het',
    plural:       row.plural,
    plural_type:  row.plural_type as PluralRule,
    english:      row.english,
    translations: row.translation_es ? { es: row.translation_es } : undefined,
    tip:          row.tip ?? undefined,
    tipEs:        row.tip_es ?? undefined,
    level:        row.level as Level,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toWordOrderSentence(row: any): WordOrderSentence {
  return {
    id:            row.id,
    words:         row.words as string[],
    english:       row.english,
    translations:  row.translation_es ? { es: row.translation_es } : undefined,
    rule:          row.rule as WordOrderRule,
    explanation:   row.explanation,
    explanationEs: row.explanation_es ?? undefined,
    level:         row.level as Level,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toVoorstellenExercise(row: any): VoorstellenExercise {
  return {
    id:             row.id,
    english:        row.english,
    dutch:          row.dutch,
    gapped:         row.gapped,
    answers:        (row.answers ?? []) as string[],
    bank:           (row.bank ?? []) as string[],
    meaning:        row.meaning as VoorstellenMeaning,
    explanation:    row.explanation,
    explanationEs:  row.explanation_es ?? undefined,
    level:          row.level as Level,
    translations:   row.translation_es ? { es: row.translation_es } : undefined,
  };
}

// ── Context ────────────────────────────────────────────────────────────────

interface DataContextValue {
  verbs:                Verb[];
  separableVerbSets:    SeparableVerbSet[];
  positionalExercises:  PositionalExercise[];
  directionalExercises: DirectionalExercise[];
  fromToExercises:      FromToExercise[];
  articleNouns:         ArticleNoun[];
  pluralNouns:          PluralNoun[];
  wordOrderSentences:   WordOrderSentence[];
  voorstellenExercises: VoorstellenExercise[];
  loading:              boolean;
  error:                string | null;
}

const DataContext = createContext<DataContextValue>({
  verbs: [], separableVerbSets: [], positionalExercises: [], directionalExercises: [], fromToExercises: [], articleNouns: [], pluralNouns: [], wordOrderSentences: [], voorstellenExercises: [],
  loading: true, error: null,
});

export function DataProvider({ children }: { children: ReactNode }) {
  const [verbs, setVerbs] = useState<Verb[]>([]);
  const [separableVerbSets, setSeparable] = useState<SeparableVerbSet[]>([]);
  const [positionalExercises, setPositional] = useState<PositionalExercise[]>([]);
  const [directionalExercises, setDirectional] = useState<DirectionalExercise[]>([]);
  const [fromToExercises, setFromTo] = useState<FromToExercise[]>([]);
  const [articleNouns, setArticleNouns] = useState<ArticleNoun[]>([]);
  const [pluralNouns, setPluralNouns] = useState<PluralNoun[]>([]);
  const [wordOrderSentences, setWordOrderSentences] = useState<WordOrderSentence[]>([]);
  const [voorstellenExercises, setVoorstellen] = useState<VoorstellenExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAll() {
      try {
        const [verbsRes, sepRes, posRes, dirRes, ftRes, artRes, pluralRes, woRes, vstRes] = await Promise.all([
          supabase.from('verbs').select('*, exercises(*)').order('id'),
          supabase.from('separable_verb_sets').select('*, separable_exercises(*)').order('infinitive'),
          supabase.from('positional_exercises').select('*').order('created_at'),
          supabase.from('directional_exercises').select('*').order('level').order('id'),
          supabase.from('from_to_exercises').select('*').order('level').order('id'),
          supabase.from('article_nouns').select('*').order('level').order('id'),
          supabase.from('plural_nouns').select('*').order('level').order('id'),
          supabase.from('word_order_sentences').select('*').order('level').order('id'),
          supabase.from('voorstellen_exercises').select('*').order('level').order('id'),
        ]);

        if (verbsRes.error)  throw verbsRes.error;
        if (sepRes.error)    throw sepRes.error;
        if (posRes.error)    throw posRes.error;
        if (artRes.error)    throw artRes.error;
        if (pluralRes.error) throw pluralRes.error;
        if (woRes.error)     throw woRes.error;
        // Tolerated: these tables may not exist yet before their migration is
        // applied — keep the rest of the app working in that case.
        if (dirRes.error) console.warn('directional_exercises unavailable:', dirRes.error.message);
        if (ftRes.error)  console.warn('from_to_exercises unavailable:', ftRes.error.message);
        if (vstRes.error) console.warn('voorstellen_exercises unavailable:', vstRes.error.message);

        setVerbs((verbsRes.data ?? []).map(toVerb));
        setSeparable((sepRes.data ?? []).map(toSeparableVerbSet));
        setPositional((posRes.data ?? []).map(toPositionalExercise));
        setDirectional((dirRes.data ?? []).map(toDirectionalExercise));
        setFromTo((ftRes.data ?? []).map(toFromToExercise));
        setArticleNouns((artRes.data ?? []).map(toArticleNoun));
        setPluralNouns((pluralRes.data ?? []).map(toPluralNoun));
        setWordOrderSentences((woRes.data ?? []).map(toWordOrderSentence));
        setVoorstellen((vstRes.data ?? []).map(toVoorstellenExercise));
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load exercises.');
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, []);

  return (
    <DataContext.Provider value={{ verbs, separableVerbSets, positionalExercises, directionalExercises, fromToExercises, articleNouns, pluralNouns, wordOrderSentences, voorstellenExercises, loading, error }}>
      {children}
    </DataContext.Provider>
  );
}

export function useAppData() {
  return useContext(DataContext);
}
