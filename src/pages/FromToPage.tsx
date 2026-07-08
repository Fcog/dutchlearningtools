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
import { useExerciseDeck } from '../hooks/useExerciseDeck';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function FromToPage() {
  const { fromToExercises, loading, error } = useAppData();
  const [index, advance] = useExerciseDeck(fromToExercises.length);
  const [phase, setPhase] = useState<Phase>('active');
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const { lang } = useLanguage();
  const ui = useUI();
  const { recordAnswer } = useProgress();

  const current = fromToExercises[index];

  // Shuffle the chips once per exercise so the answer's position isn't a tell.
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
    setScore((s) => ({
      correct: s.correct + (correct ? 1 : 0),
      total: s.total + 1,
    }));
    recordAnswer(current.id, 'from-to', correct);
  }, [phase, current, recordAnswer]);

  const next = useCallback(() => {
    advance();
    setPhase('active');
    setSelected(null);
  }, [advance]);

  useAdvanceOnEnter(phase === 'result', next);

  if (loading || error) return <LoadingScreen error={error} />;
  if (!current) return <LoadingScreen error="No from/to exercises found." />;

  const isCorrect = selected !== null && selected === current.answer;

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
        Estas palabras dicen <strong>de dónde</strong> vienes y{' '}
        <strong>a dónde</strong> vas. La clave: <em>heen</em> va solo, mientras
        que <em>toe</em> necesita <strong>naar</strong>.
      </p>
      <div className="theory-table">
        <div className="theory-row">
          <span className="theory-verb">vandaan</span>
          <span className="theory-desc">
            <strong>De dónde</strong> — el origen (movimiento desde un lugar)
            <br />
            <em className="theory-eg">Waar kom je vandaan?</em>
          </span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">heen</span>
          <span className="theory-desc">
            <strong>A dónde</strong> — el destino, <em>sin</em> «naar»
            <br />
            <em className="theory-eg">Waar ga je heen?</em>
          </span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">toe</span>
          <span className="theory-desc">
            <strong>A dónde</strong> — el destino, siempre con{' '}
            <strong>naar … toe</strong>
            <br />
            <em className="theory-eg">Ik ga naar huis toe.</em>
          </span>
        </div>
      </div>
      <p className="theory-intro">
        Con <em>er/hier/daar</em> se unen: <em>hier vandaan</em>,{' '}
        <em>erheen</em>, <em>ernaartoe</em>. Y recuerda la expresión{' '}
        <em>heen en weer</em> (de ida y vuelta).
      </p>
    </div>
  ) : (
    <div className="theory-section">
      <p className="theory-intro">
        These words say <strong>where from</strong> and <strong>where to</strong>.
        The key: <em>heen</em> stands alone, while <em>toe</em> needs{' '}
        <strong>naar</strong>.
      </p>
      <div className="theory-table">
        <div className="theory-row">
          <span className="theory-verb">vandaan</span>
          <span className="theory-desc">
            <strong>From</strong> — the origin (movement away from a place)
            <br />
            <em className="theory-eg">Waar kom je vandaan?</em>
          </span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">heen</span>
          <span className="theory-desc">
            <strong>To</strong> — the destination, with <em>no</em> “naar”
            <br />
            <em className="theory-eg">Waar ga je heen?</em>
          </span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">toe</span>
          <span className="theory-desc">
            <strong>To</strong> — the destination, always with{' '}
            <strong>naar … toe</strong>
            <br />
            <em className="theory-eg">Ik ga naar huis toe.</em>
          </span>
        </div>
      </div>
      <p className="theory-intro">
        With <em>er/hier/daar</em> they attach: <em>hier vandaan</em>,{' '}
        <em>erheen</em>, <em>ernaartoe</em>. And note the set phrase{' '}
        <em>heen en weer</em> (back and forth).
      </p>
    </div>
  );

  return (
    <div className="app">
      <Header backTo="/" score={score} title={ui.fromToTitle} />
      <main className="main">
        <TheoryPanel>{theoryContent}</TheoryPanel>

        <div className="exercise">
          <SentenceCard exercise={exerciseForCard} phase={phase} />

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
