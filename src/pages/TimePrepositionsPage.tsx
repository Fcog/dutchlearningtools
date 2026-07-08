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
import type { TimeCategory } from '../data/timeExercises';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function TimePrepositionsPage() {
  const { timeExercises, loading, error } = useAppData();
  const [index, advance] = useExerciseDeck(timeExercises.length);
  const [phase, setPhase] = useState<Phase>('active');
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const { lang } = useLanguage();
  const ui = useUI();
  const { recordAnswer } = useProgress();

  const current = timeExercises[index];

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
    recordAnswer(current.id, 'time-prep', correct);
  }, [phase, current, recordAnswer]);

  const next = useCallback(() => {
    advance();
    setPhase('active');
    setSelected(null);
  }, [advance]);

  useAdvanceOnEnter(phase === 'result', next);

  if (loading || error) return <LoadingScreen error={error} />;
  if (!current) return <LoadingScreen error="No time-preposition exercises found." />;

  const isCorrect = selected !== null && selected === current.answer;

  const CATEGORY_LABEL: Record<TimeCategory, string> = {
    clock:    lang === 'es' ? 'hora del reloj'          : 'clock time',
    day:      lang === 'es' ? 'día / fecha'             : 'day / date',
    period:   lang === 'es' ? 'mes / estación / período' : 'month / season / period',
    sequence: lang === 'es' ? 'antes / después'         : 'before / after',
    duration: lang === 'es' ? 'duración / límite'       : 'duration / limit',
  };

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
        El núcleo difícil son tres: <strong>om</strong> (hora), <strong>op</strong> (día/fecha)
        e <strong>in</strong> (mes, estación, año, parte del día).
      </p>
      <div className="theory-table">
        <div className="theory-row">
          <span className="theory-verb">om</span>
          <span className="theory-desc">Hora exacta del reloj. <em className="theory-eg">om acht uur</em></span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">op</span>
          <span className="theory-desc">Días y fechas. <em className="theory-eg">op maandag · op 5 mei</em></span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">in</span>
          <span className="theory-desc">Meses, estaciones, años, partes del día. <em className="theory-eg">in juni · in de zomer · in de ochtend</em></span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">na / voor</span>
          <span className="theory-desc">Después / antes de. <em className="theory-eg">na het eten · voor de les</em></span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">duración</span>
          <span className="theory-desc">
            <em>tijdens</em> (durante), <em>sinds</em> (desde, pasado), <em>vanaf</em> (a partir de),{' '}
            <em>tot</em> (hasta), <em>over</em> (dentro de, futuro), <em>binnen</em> (en un plazo).
          </span>
        </div>
      </div>
      <p className="theory-intro">
        Ojo con <em>sinds</em> (inicio en el pasado) frente a <em>vanaf</em> (inicio, a menudo
        futuro), y <em>over</em> (dentro de X, futuro) frente a <em>binnen</em> (antes de que pase X).
      </p>
    </div>
  ) : (
    <div className="theory-section">
      <p className="theory-intro">
        The hard core is three: <strong>om</strong> (clock time), <strong>op</strong> (day/date)
        and <strong>in</strong> (month, season, year, part of the day).
      </p>
      <div className="theory-table">
        <div className="theory-row">
          <span className="theory-verb">om</span>
          <span className="theory-desc">Exact clock time. <em className="theory-eg">om acht uur</em></span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">op</span>
          <span className="theory-desc">Days and dates. <em className="theory-eg">op maandag · op 5 mei</em></span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">in</span>
          <span className="theory-desc">Months, seasons, years, parts of the day. <em className="theory-eg">in June · in de zomer · in de ochtend</em></span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">na / voor</span>
          <span className="theory-desc">After / before. <em className="theory-eg">na het eten · voor de les</em></span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">duration</span>
          <span className="theory-desc">
            <em>tijdens</em> (during), <em>sinds</em> (since, past), <em>vanaf</em> (from … onwards),{' '}
            <em>tot</em> (until), <em>over</em> (in … , future), <em>binnen</em> (within).
          </span>
        </div>
      </div>
      <p className="theory-intro">
        Watch <em>sinds</em> (a past start) vs <em>vanaf</em> (a start, often future), and{' '}
        <em>over</em> (in X time, future) vs <em>binnen</em> (before X elapses).
      </p>
    </div>
  );

  return (
    <div className="app">
      <Header backTo="/" score={score} title={ui.timePrepTitle} />
      <main className="main">
        <TheoryPanel>{theoryContent}</TheoryPanel>

        <div className="exercise">
          <SentenceCard exercise={exerciseForCard} phase={phase} label={CATEGORY_LABEL[current.category]} />

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
