import { useState, useMemo, useCallback, useEffect } from 'react';
import { Header } from '../components/Header';
import { LoadingScreen } from '../components/LoadingScreen';
import { useAppData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { useUI } from '../i18n/ui';
import { useProgress } from '../hooks/useProgress';
import { buildMixPool, MixCardRenderer, type MixEntry } from '../components/mix/MixCards';

export const TOPIC_LABEL: Record<string, { en: string; es: string }> = {
  verb:          { en: 'Verb conjugation',   es: 'Conjugación de verbos' },
  separable:     { en: 'Separable verbs',    es: 'Verbos separables' },
  positional:    { en: 'Position verbs',     es: 'Verbos de posición' },
  directional:   { en: 'Directional adverbs', es: 'Adverbios direccionales' },
  'from-to':     { en: 'From & to',          es: 'Origen y destino' },
  preposition:   { en: 'Fixed prepositions', es: 'Preposiciones fijas' },
  'time-prep':   { en: 'Time prepositions',  es: 'Preposiciones de tiempo' },
  article:       { en: 'De / het articles',  es: 'Artículos de / het' },
  plural:        { en: 'Plural forms',       es: 'Formas del plural' },
  'word-order':  { en: 'Word order',         es: 'Orden de palabras' },
  voorstellen:   { en: 'The verb voorstellen', es: 'El verbo voorstellen' },
  negation:      { en: 'Negation',           es: 'Negación' },
};

function pickFrom<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}

export default function MixPage() {
  const {
    verbs, separableVerbSets, positionalExercises, directionalExercises,
    fromToExercises, prepositionExercises, timeExercises, articleNouns,
    pluralNouns, wordOrderSentences, voorstellenExercises, negationExercises,
    loading, error,
  } = useAppData();
  const { lang } = useLanguage();
  const ui = useUI();
  const { recordAnswer } = useProgress();

  const pool = useMemo(
    () => buildMixPool({
      verbs, separableVerbSets, positionalExercises, directionalExercises,
      fromToExercises, prepositionExercises, timeExercises, articleNouns,
      pluralNouns, wordOrderSentences, voorstellenExercises, negationExercises,
    }),
    [verbs, separableVerbSets, positionalExercises, directionalExercises,
     fromToExercises, prepositionExercises, timeExercises, articleNouns,
     pluralNouns, wordOrderSentences, voorstellenExercises, negationExercises],
  );

  // Group by topic so a random topic is drawn first — otherwise the 260+ verb
  // items would dominate every draw.
  const grouped = useMemo(() => {
    const g: Record<string, MixEntry[]> = {};
    for (const e of pool) (g[e.topic] ??= []).push(e);
    return g;
  }, [pool]);
  const topics = useMemo(() => Object.keys(grouped), [grouped]);

  const pickEntry = useCallback((prevKey: string | null): MixEntry | null => {
    if (!topics.length) return null;
    const list = grouped[pickFrom(topics)];
    let e = pickFrom(list);
    if (list.length > 1 && e.key === prevKey) e = pickFrom(list);
    return e;
  }, [topics, grouped]);

  const [current, setCurrent] = useState<MixEntry | null>(null);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  useEffect(() => {
    if (!current && pool.length) setCurrent(pickEntry(null));
  }, [pool, current, pickEntry]);

  const next = useCallback(() => {
    setCurrent((prev) => pickEntry(prev?.key ?? null));
    setRound((r) => r + 1);
  }, [pickEntry]);

  if (loading || error) return <LoadingScreen error={error} />;
  if (!current) return <LoadingScreen error={pool.length ? null : 'No exercises available yet.'} />;

  const handleResult = (correct: boolean) => {
    setScore((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
    recordAnswer(current.exerciseId, current.progressType, correct);
  };

  const topicLabel = TOPIC_LABEL[current.topic]?.[lang] ?? current.topic;

  return (
    <div className="app">
      <Header backTo="/" score={score} title={ui.mixTitle} />
      <main className="main">
        <div className="exercise">
          <div className="mix-topic-badge">{topicLabel}</div>
          <MixCardRenderer key={`${current.key}-${round}`} entry={current} onResult={handleResult} onNext={next} />
        </div>
      </main>
    </div>
  );
}
