import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Header } from '../components/Header';
import { LoadingScreen } from '../components/LoadingScreen';
import { useAppData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { useUI } from '../i18n/ui';
import { useProgress } from '../hooks/useProgress';
import { buildMixPool, MixCardRenderer, type MixEntry } from '../components/mix/MixCards';
import { ShareScore } from '../components/ShareScore';

export const TOPIC_LABEL: Record<string, { en: string; es: string }> = {
  verb:          { en: 'Verb conjugation',   es: 'Conjugación de verbos' },
  separable:     { en: 'Separable verbs',    es: 'Verbos separables' },
  positional:    { en: 'Position verbs',     es: 'Verbos de posición' },
  directional:   { en: 'Directional adverbs', es: 'Adverbios direccionales' },
  'from-to':     { en: 'From & to',          es: 'Origen y destino' },
  preposition:   { en: 'Fixed prepositions', es: 'Preposiciones fijas' },
  'er-preposition': { en: 'Er + preposition', es: 'Er + preposición' },
  'time-prep':   { en: 'Time prepositions',  es: 'Preposiciones de tiempo' },
  expression:    { en: 'Idiomatic expressions', es: 'Expresiones idiomáticas' },
  diminutive:    { en: 'Diminutives',         es: 'Diminutivos' },
  article:       { en: 'De / het articles',  es: 'Artículos de / het' },
  plural:        { en: 'Plural forms',       es: 'Formas del plural' },
  'word-order':  { en: 'Word order',         es: 'Orden de palabras' },
  voorstellen:   { en: 'The verb voorstellen', es: 'El verbo voorstellen' },
  negation:      { en: 'Negation',           es: 'Negación' },
};

function pickFrom<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}

function shuffledRange(n: number): number[] {
  const d = Array.from({ length: n }, (_, i) => i);
  for (let i = d.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [d[i], d[j]] = [d[j], d[i]];
  }
  return d;
}

export default function MixPage() {
  const {
    verbs, separableVerbSets, positionalExercises, directionalExercises,
    fromToExercises, prepositionExercises, erPrepositionExercises, timeExercises, expressionExercises,
    diminutiveExercises, articleNouns, pluralNouns, wordOrderSentences,
    voorstellenExercises, negationExercises, loading, error,
  } = useAppData();
  const { lang } = useLanguage();
  const ui = useUI();
  const { recordAnswer } = useProgress();

  const pool = useMemo(
    () => buildMixPool({
      verbs, separableVerbSets, positionalExercises, directionalExercises,
      fromToExercises, prepositionExercises, erPrepositionExercises, timeExercises, expressionExercises,
      diminutiveExercises, articleNouns, pluralNouns, wordOrderSentences, voorstellenExercises, negationExercises,
    }),
    [verbs, separableVerbSets, positionalExercises, directionalExercises,
     fromToExercises, prepositionExercises, erPrepositionExercises, timeExercises, expressionExercises,
     diminutiveExercises, articleNouns, pluralNouns, wordOrderSentences, voorstellenExercises, negationExercises],
  );

  // Group by topic so a random topic is drawn first — otherwise the 260+ verb
  // items would dominate every draw.
  const grouped = useMemo(() => {
    const g: Record<string, MixEntry[]> = {};
    for (const e of pool) (g[e.topic] ??= []).push(e);
    return g;
  }, [pool]);
  const topics = useMemo(() => Object.keys(grouped), [grouped]);

  // One shuffled deck per topic so items don't repeat within a topic until it's
  // exhausted. Reset whenever the pool (grouped) changes.
  const decks = useRef<Record<string, { order: number[]; pos: number }>>({});
  useEffect(() => { decks.current = {}; }, [grouped]);

  const pickEntry = useCallback((): MixEntry | null => {
    if (!topics.length) return null;
    const topic = pickFrom(topics);
    const items = grouped[topic];
    let deck = decks.current[topic];
    if (!deck || deck.order.length !== items.length) {
      deck = { order: shuffledRange(items.length), pos: 0 };
      decks.current[topic] = deck;
      return items[deck.order[0]];
    }
    deck.pos += 1;
    if (deck.pos >= deck.order.length) {
      const last = deck.order[deck.order.length - 1];
      const reshuffled = shuffledRange(items.length);
      if (items.length > 1 && reshuffled[0] === last) [reshuffled[0], reshuffled[1]] = [reshuffled[1], reshuffled[0]];
      deck.order = reshuffled;
      deck.pos = 0;
    }
    return items[deck.order[deck.pos]];
  }, [topics, grouped]);

  const [current, setCurrent] = useState<MixEntry | null>(null);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    if (!current && pool.length) setCurrent(pickEntry());
  }, [pool, current, pickEntry]);

  const next = useCallback(() => {
    setAnswered(false);
    setCurrent(pickEntry());
    setRound((r) => r + 1);
  }, [pickEntry]);

  if (loading || error) return <LoadingScreen error={error} />;
  if (!current) return <LoadingScreen error={pool.length ? null : 'No exercises available yet.'} />;

  const handleResult = (correct: boolean) => {
    setScore((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
    recordAnswer(current.exerciseId, current.progressType, correct);
    setAnswered(true);
  };

  const topicLabel = TOPIC_LABEL[current.topic]?.[lang] ?? current.topic;

  return (
    <div className="app">
      <Header backTo="/" title={ui.mixTitle} />
      <main className="main">
        <div className="exercise">
          <div className="mix-topic-badge">{topicLabel}</div>
          <MixCardRenderer key={`${current.key}-${round}`} entry={current} onResult={handleResult} onNext={next} />
          {answered && <ShareScore score={score} title={ui.mixTitle} />}
        </div>
      </main>
    </div>
  );
}
