import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { Verb, Exercise, Conjugation, Level, Tense, SupportedLang } from '../types';
import type { SeparableVerbSet, SeparableExercise, SeparableContext } from '../data/separableVerbs';
import type { PositionalExercise, PositionalVerb } from '../data/positionalVerbs';

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

// ── Context ────────────────────────────────────────────────────────────────

interface DataContextValue {
  verbs:               Verb[];
  separableVerbSets:   SeparableVerbSet[];
  positionalExercises: PositionalExercise[];
  loading:             boolean;
  error:               string | null;
}

const DataContext = createContext<DataContextValue>({
  verbs: [], separableVerbSets: [], positionalExercises: [],
  loading: true, error: null,
});

export function DataProvider({ children }: { children: ReactNode }) {
  const [verbs, setVerbs] = useState<Verb[]>([]);
  const [separableVerbSets, setSeparable] = useState<SeparableVerbSet[]>([]);
  const [positionalExercises, setPositional] = useState<PositionalExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAll() {
      try {
        const [verbsRes, sepRes, posRes] = await Promise.all([
          supabase.from('verbs').select('*, exercises(*)').order('id'),
          supabase.from('separable_verb_sets').select('*, separable_exercises(*)').order('infinitive'),
          supabase.from('positional_exercises').select('*').order('created_at'),
        ]);

        if (verbsRes.error) throw verbsRes.error;
        if (sepRes.error)   throw sepRes.error;
        if (posRes.error)   throw posRes.error;

        setVerbs((verbsRes.data ?? []).map(toVerb));
        setSeparable((sepRes.data ?? []).map(toSeparableVerbSet));
        setPositional((posRes.data ?? []).map(toPositionalExercise));
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load exercises.');
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, []);

  return (
    <DataContext.Provider value={{ verbs, separableVerbSets, positionalExercises, loading, error }}>
      {children}
    </DataContext.Provider>
  );
}

export function useAppData() {
  return useContext(DataContext);
}
