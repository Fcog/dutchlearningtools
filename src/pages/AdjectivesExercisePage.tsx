import { useState, useCallback, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { TheoryPanel } from '../components/TheoryPanel';
import { LoadingScreen } from '../components/LoadingScreen';
import { SpeakButton } from '../components/SpeakButton';
import { useAppData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { useUI } from '../i18n/ui';
import { useProgress } from '../hooks/useProgress';
import { useAdvanceOnEnter } from '../hooks/useAdvanceOnEnter';
import { useRandomStartIndex } from '../hooks/useRandomStartIndex';
import type { AdjectiveKind } from '../data/adjectiveExercises';

function randomIndex(exclude: number, total: number) {
  let i: number;
  do { i = Math.floor(Math.random() * total); } while (i === exclude && total > 1);
  return i;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function AdjectivesExercisePage() {
  const { kind } = useParams<{ kind: AdjectiveKind }>();
  const { adjectiveExercises, loading, error } = useAppData();
  const { lang } = useLanguage();
  const ui = useUI();
  const { recordAnswer } = useProgress();

  const list = useMemo(
    () => adjectiveExercises.filter((e) => e.kind === kind),
    [adjectiveExercises, kind],
  );

  const [index, setIndex] = useRandomStartIndex(list.length);
  const [phase, setPhase] = useState<'active' | 'result'>('active');
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const current = list[index];

  // Localised option set + correct value (vocab stores parallel ES arrays).
  const localOptions = current
    ? (lang === 'es' && current.optionsEs ? current.optionsEs : current.options)
    : [];
  const correct = current
    ? (lang === 'es' && current.answerEs ? current.answerEs : current.answer)
    : '';

  const options = useMemo(
    () => shuffle(localOptions),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [index, current?.id, lang],
  );

  const select = useCallback((option: string) => {
    if (phase !== 'active' || !current) return;
    const isCorrect = option === correct;
    setSelected(option);
    setPhase('result');
    setScore((s) => ({ correct: s.correct + (isCorrect ? 1 : 0), total: s.total + 1 }));
    recordAnswer(current.id, 'adjective', isCorrect);
  }, [phase, current, correct, recordAnswer]);

  const next = useCallback(() => {
    setIndex((i) => randomIndex(i, list.length));
    setPhase('active');
    setSelected(null);
  }, [list.length, setIndex]);

  useAdvanceOnEnter(phase === 'result', next);

  if (loading || error) return <LoadingScreen error={error} />;

  const INSTRUCTION: Record<AdjectiveKind, string> = {
    inflection: ui.adjInflectionInstr,
    vocab:      ui.adjVocabInstr,
    degree:     ui.adjDegreeInstr,
    opposite:   ui.adjOppositeInstr,
  };
  const TITLE: Record<AdjectiveKind, string> = {
    inflection: ui.adjInflectionName,
    vocab:      ui.adjVocabName,
    degree:     ui.adjDegreeName,
    opposite:   ui.adjOppositeName,
  };

  if (!current) {
    return (
      <div className="app">
        <Header backTo="/adjectives" title={kind ? TITLE[kind] : ui.adjectivesTitle} />
        <main className="main">
          <div className="exercise">
            <p className="account-note">{ui.exerciseNotFound}</p>
            <Link to="/adjectives" className="next-btn" style={{ display: 'inline-block', textDecoration: 'none' }}>
              {ui.adjectivesTitle} →
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const isCorrect = selected !== null && selected === correct;
  const gloss = lang === 'es' ? (current.glossEs ?? current.glossEn) : current.glossEn;
  const explanation = lang === 'es' ? (current.explanationEs ?? current.explanation) : current.explanation;
  const promptParts = current.prompt.split('___');

  // What to read aloud (Dutch). Never read the vocab answer — it's a meaning, not Dutch.
  const speakText = () => {
    const done = phase === 'result';
    switch (current.kind) {
      case 'inflection': return current.prompt.replace('___', done ? current.answer : '');
      case 'opposite':   return done ? `${current.prompt}. ${current.answer}` : current.prompt;
      case 'degree':     return done ? current.answer : current.prompt;
      default:           return current.prompt; // vocab: the Dutch word
    }
  };

  return (
    <div className="app">
      <Header backTo="/adjectives" score={score} title={TITLE[kind!]} />
      <main className="main">
        <div className="exercise">
          {/* Prompt card */}
          <div className="wo-card">
            <div className="article-card-top">
              <span className={`level-badge level-badge-${current.level.toLowerCase()}`}>
                {current.level}
              </span>
              <SpeakButton text={speakText} />
            </div>
            <p className="word-order-prompt">{INSTRUCTION[kind!]}</p>
            {promptParts.length > 1 ? (
              <p className="adj-prompt">
                {promptParts[0]}
                <span className="blank">___</span>
                {promptParts[1]}
              </p>
            ) : (
              <p className="adj-prompt adj-prompt-word">{current.prompt}</p>
            )}
            {gloss && <p className="word-order-english">{gloss}</p>}
          </div>

          {/* Options */}
          <div className="pos-verb-grid">
            {options.map((option) => {
              let cls = 'pos-verb-btn';
              if (phase === 'result') {
                if (option === correct) cls += ' correct';
                else if (option === selected) cls += ' wrong';
                else cls += ' dim';
              }
              return (
                <button
                  key={option}
                  className={cls}
                  onClick={() => select(option)}
                  disabled={phase === 'result'}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {phase === 'result' && (
            <div className={`result-feedback ${isCorrect ? 'success' : 'error'}`}>
              <p className="result-message">
                {isCorrect ? (
                  lang === 'es'
                    ? <>¡Correcto! <strong>{correct}</strong> — {explanation}</>
                    : <>Correct! <strong>{correct}</strong> — {explanation}</>
                ) : (
                  lang === 'es'
                    ? <><strong>{selected}</strong> es incorrecto. La respuesta es <strong>{correct}</strong>. {explanation}</>
                    : <><strong>{selected}</strong> is wrong. The answer is <strong>{correct}</strong>. {explanation}</>
                )}
              </p>
              <button className="next-btn" onClick={next}>{ui.next}</button>
            </div>
          )}

          <TheoryPanel>
            <div className="theory-section">
              <p className="theory-intro">{ui.adjTheoryIntro}</p>
            </div>
          </TheoryPanel>
        </div>
      </main>
    </div>
  );
}
