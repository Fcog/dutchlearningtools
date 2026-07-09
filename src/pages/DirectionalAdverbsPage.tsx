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
import { ShareScore } from '../components/ShareScore';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function DirectionalAdverbsPage() {
  const { directionalExercises, loading, error } = useAppData();
  const [index, advance] = useExerciseDeck(directionalExercises.length);
  const [phase, setPhase] = useState<Phase>('active');
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const { lang } = useLanguage();
  const ui = useUI();
  const { recordAnswer } = useProgress();

  const current = directionalExercises[index];

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
    recordAnswer(current.id, 'directional', correct);
  }, [phase, current, recordAnswer]);

  const next = useCallback(() => {
    advance();
    setPhase('active');
    setSelected(null);
  }, [advance]);

  useAdvanceOnEnter(phase === 'result', next);

  if (loading || error) return <LoadingScreen error={error} />;
  if (!current) return <LoadingScreen error="No directional exercises found." />;

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
        El prefijo es la parte fácil: <strong>voor-</strong> = delante,{' '}
        <strong>achter-</strong> = detrás. Lo que cambia el significado es el{' '}
        <strong>sufijo</strong>.
      </p>
      <div className="theory-table">
        <div className="theory-row">
          <span className="theory-verb">-aan</span>
          <span className="theory-desc">
            Posición estática — al frente / al final de un espacio o fila
            <br />
            <em className="theory-eg">Hij zit vooraan in de klas.</em>
          </span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">-uit</span>
          <span className="theory-desc">
            Dirección del movimiento — hacia adelante / marcha atrás
            <br />
            <em className="theory-eg">De auto rijdt achteruit.</em>
          </span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">-op</span>
          <span className="theory-desc">
            Sobre la parte delantera/trasera, o ir en cabeza / detrás
            <br />
            <em className="theory-eg">Ze zit achterop de fiets.</em>
          </span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">-om</span>
          <span className="theory-desc">
            La ruta rodeando por detrás. <strong>No existe «voorom»</strong>
            <br />
            <em className="theory-eg">Loop maar achterom.</em>
          </span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">naar …en</span>
          <span className="theory-desc">
            Desplazamiento hacia delante/atrás (también figurado)
            <br />
            <em className="theory-eg">Leun naar achteren. Kom naar voren.</em>
          </span>
        </div>
      </div>
    </div>
  ) : (
    <div className="theory-section">
      <p className="theory-intro">
        The prefix is the easy part: <strong>voor-</strong> = front,{' '}
        <strong>achter-</strong> = back. What changes the meaning is the{' '}
        <strong>suffix</strong>.
      </p>
      <div className="theory-table">
        <div className="theory-row">
          <span className="theory-verb">-aan</span>
          <span className="theory-desc">
            Static position — at the front / back of a space or row
            <br />
            <em className="theory-eg">Hij zit vooraan in de klas.</em>
          </span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">-uit</span>
          <span className="theory-desc">
            Movement direction — forwards / in reverse
            <br />
            <em className="theory-eg">De auto rijdt achteruit.</em>
          </span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">-op</span>
          <span className="theory-desc">
            On the front/back surface, or being in the lead / on the rear
            <br />
            <em className="theory-eg">Ze zit achterop de fiets.</em>
          </span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">-om</span>
          <span className="theory-desc">
            The route around the back. <strong>There is no “voorom”</strong>
            <br />
            <em className="theory-eg">Loop maar achterom.</em>
          </span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">naar …en</span>
          <span className="theory-desc">
            A directional shift toward the front/back (also figurative)
            <br />
            <em className="theory-eg">Leun naar achteren. Kom naar voren.</em>
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="app">
      <Header backTo="/" score={score} title={ui.directionalAdverbsTitle} />
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
              <ShareScore score={score} title={ui.directionalAdverbsTitle} onNext={next} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
