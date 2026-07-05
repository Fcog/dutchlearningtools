import { useState, useCallback, useMemo } from 'react';
import { Header } from '../components/Header';
import { SentenceCard } from '../components/SentenceCard';
import { TheoryPanel } from '../components/TheoryPanel';
import { LoadingScreen } from '../components/LoadingScreen';
import { useAppData } from '../context/DataContext';
import type { Phase } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useUI } from '../i18n/ui';
import { useProgress } from '../hooks/useProgress';
import { useAdvanceOnEnter } from '../hooks/useAdvanceOnEnter';
import { useRandomStartIndex } from '../hooks/useRandomStartIndex';

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

export default function ExpressionsPage() {
  const { expressionExercises, loading, error } = useAppData();
  const [index, setIndex] = useRandomStartIndex(expressionExercises.length);
  const [phase, setPhase] = useState<Phase>('active');
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const { lang } = useLanguage();
  const ui = useUI();
  const { recordAnswer } = useProgress();

  const current = expressionExercises[index];

  const options = useMemo(
    () => (current ? shuffle(current.options) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [index, current?.id],
  );

  const select = useCallback((option: string) => {
    if (phase !== 'active' || !current) return;
    const correct = option === current.answer;
    setSelected(option);
    setPhase('result');
    setScore((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
    recordAnswer(current.id, 'expression', correct);
  }, [phase, current, recordAnswer]);

  const next = useCallback(() => {
    setIndex((i) => randomIndex(i, expressionExercises.length));
    setPhase('active');
    setSelected(null);
  }, [expressionExercises.length, setIndex]);

  useAdvanceOnEnter(phase === 'result', next);

  if (loading || error) return <LoadingScreen error={error} />;
  if (!current) return <LoadingScreen error="No expression exercises found." />;

  const isCorrect = selected !== null && selected === current.answer;

  // Show the meaning (english/es) as the gloss — it's what the learner reasons from.
  const exerciseForCard = {
    dutch: current.dutch,
    english: current.english,
    translations: current.translations,
    answer: current.answer,
    tense: 'present' as const,
  };

  const explanation = lang === 'es'
    ? (current.explanationEs ?? current.explanation)
    : current.explanation;

  const theoryContent = lang === 'es' ? (
    <div className="theory-section">
      <p className="theory-intro">
        Las <strong>expresiones idiomáticas</strong> son bloques fijos: su significado no
        se deduce palabra por palabra, y no puedes cambiar las palabras clave. Aprende la
        expresión <em>entera</em>. Aquí completas la palabra que la define.
      </p>
      <div className="theory-table">
        <div className="theory-row">
          <span className="theory-verb">forma fija</span>
          <span className="theory-desc">Es «de spijker op z’n <strong>kop</strong> slaan», nunca «op z’n hoofd».</span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">imagen</span>
          <span className="theory-desc">La imagen literal suele ayudar a recordarla: <em>in de gaten houden</em> = «tener en los agujeros» (vigilar).</span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">significado</span>
          <span className="theory-desc">Arriba se muestra el significado; elige la palabra que completa la expresión.</span>
        </div>
      </div>
    </div>
  ) : (
    <div className="theory-section">
      <p className="theory-intro">
        <strong>Idioms</strong> are fixed chunks: their meaning isn't literal and you can't
        swap the key words. Learn the <em>whole</em> expression. Here you complete the word
        that defines it.
      </p>
      <div className="theory-table">
        <div className="theory-row">
          <span className="theory-verb">fixed form</span>
          <span className="theory-desc">It's “de spijker op z’n <strong>kop</strong> slaan”, never “op z’n hoofd”.</span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">image</span>
          <span className="theory-desc">The literal picture often helps you remember: <em>in de gaten houden</em> = “keep in the holes” (to watch).</span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">meaning</span>
          <span className="theory-desc">The meaning is shown above the sentence — pick the word that completes the idiom.</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="app">
      <Header backTo="/" score={score} title={ui.expressionsTitle} />
      <main className="main">
        <TheoryPanel>{theoryContent}</TheoryPanel>

        <div className="exercise">
          <SentenceCard exercise={exerciseForCard} phase={phase} label={ui.expressionsPrompt} />

          <div className="pos-verb-grid">
            {options.map((option) => {
              let cls = 'pos-verb-btn';
              if (phase === 'result') {
                if (option === current.answer) cls += ' correct';
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
                  lang === 'es' ? (
                    <>¡Correcto! <strong>{current.answer}</strong> — {explanation}</>
                  ) : (
                    <>Correct! <strong>{current.answer}</strong> — {explanation}</>
                  )
                ) : (
                  lang === 'es' ? (
                    <>
                      <strong>{selected}</strong> es incorrecto. La respuesta es{' '}
                      <strong>{current.answer}</strong>. {explanation}
                    </>
                  ) : (
                    <>
                      <strong>{selected}</strong> is wrong. The answer is{' '}
                      <strong>{current.answer}</strong>. {explanation}
                    </>
                  )
                )}
              </p>
              <button className="next-btn" onClick={next}>
                {ui.next}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
