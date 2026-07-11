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
import type { ErUsage } from '../data/erPrepositionExercises';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ErPrepositionsPage() {
  const { erPrepositionExercises, loading, error } = useAppData();
  const [index, advance] = useExerciseDeck(erPrepositionExercises.length);
  const [phase, setPhase] = useState<Phase>('active');
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const { lang } = useLanguage();
  const ui = useUI();
  const { recordAnswer } = useProgress();

  const current = erPrepositionExercises[index];

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
    recordAnswer(current.id, 'er-preposition', correct);
  }, [phase, current, recordAnswer]);

  const next = useCallback(() => {
    advance();
    setPhase('active');
    setSelected(null);
  }, [advance]);

  useAdvanceOnEnter(phase === 'result', next);

  if (loading || error) return <LoadingScreen error={error} />;
  if (!current) return <LoadingScreen error="No er + preposition exercises found." />;

  const isCorrect = selected !== null && selected === current.answer;

  const USAGE_LABEL: Record<ErUsage, string> = {
    place:         lang === 'es' ? 'lugar / dirección'      : 'place / direction',
    prepositional: lang === 'es' ? 'objeto de preposición'  : 'object of a preposition',
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
        Cuando un pronombre (<em>het, dat, dit</em>) se combina con una preposición y
        se refiere a una <strong>cosa</strong> (no a una persona), el neerlandés usa un
        <strong> adverbio pronominal</strong>: <em>er</em> + preposición, escrito junto.
      </p>
      <div className="theory-table">
        <div className="theory-row">
          <span className="theory-verb">lugar / dirección</span>
          <span className="theory-desc">
            Sustituye un lugar ya conocido: <em>erin</em> (dentro), <em>eruit</em> (fuera),{' '}
            <em>erop</em> (encima), <em>eraf</em> (de encima).
            <br />
            <em className="theory-eg">Ik draai de lamp erin. = Enrosco la bombilla.</em>
          </span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">objeto de prep.</span>
          <span className="theory-desc">
            Sustituye el complemento de un verbo con preposición fija: <em>denken aan →
            eraan</em>, <em>wachten op → erop</em>, <em>kiezen voor → ervoor</em>.
            <br />
            <em className="theory-eg">Ik denk eraan. = Pienso en eso.</em>
          </span>
        </div>
      </div>
      <p className="theory-intro">
        Ojo: <em>er</em> puede <strong>separarse</strong> de la preposición cuando hay
        otra palabra en medio: <em>Ik denk er niet aan.</em>
      </p>
    </div>
  ) : (
    <div className="theory-section">
      <p className="theory-intro">
        When a pronoun (<em>het, dat, dit</em>) combines with a preposition and refers to
        a <strong>thing</strong> (not a person), Dutch uses a <strong>pronominal
        adverb</strong>: <em>er</em> + preposition, written as one word.
      </p>
      <div className="theory-table">
        <div className="theory-row">
          <span className="theory-verb">place / direction</span>
          <span className="theory-desc">
            Replaces a known location: <em>erin</em> (in it), <em>eruit</em> (out of it),{' '}
            <em>erop</em> (on it), <em>eraf</em> (off it).
            <br />
            <em className="theory-eg">Ik draai de lamp erin. = I screw the bulb in.</em>
          </span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">object of prep.</span>
          <span className="theory-desc">
            Replaces the object of a verb with a fixed preposition: <em>denken aan →
            eraan</em>, <em>wachten op → erop</em>, <em>kiezen voor → ervoor</em>.
            <br />
            <em className="theory-eg">Ik denk eraan. = I think about it.</em>
          </span>
        </div>
      </div>
      <p className="theory-intro">
        Note: <em>er</em> can <strong>split</strong> from the preposition when another
        word comes between them: <em>Ik denk er niet aan.</em>
      </p>
    </div>
  );

  return (
    <div className="app">
      <Header backTo="/" score={score} title={ui.erPrepTitle} />
      <main className="main">
        <TheoryPanel>{theoryContent}</TheoryPanel>

        <div className="exercise">
          <SentenceCard exercise={exerciseForCard} phase={phase} label={USAGE_LABEL[current.usage]} />

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
              <ShareScore score={score} title={ui.erPrepTitle} onNext={next} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
