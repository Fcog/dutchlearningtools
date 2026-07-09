import { useState, useCallback } from 'react';
import { Header } from '../components/Header';
import { SentenceCard } from '../components/SentenceCard';
import { TheoryPanel } from '../components/TheoryPanel';
import { LoadingScreen } from '../components/LoadingScreen';
import { useAppData } from '../context/DataContext';
import type { PositionalVerb } from '../data/positionalVerbs';
import type { Phase } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useUI } from '../i18n/ui';
import { useProgress } from '../hooks/useProgress';
import { useAdvanceOnEnter } from '../hooks/useAdvanceOnEnter';
import { useExerciseDeck } from '../hooks/useExerciseDeck';
import { ShareScore } from '../components/ShareScore';

const VERBS: PositionalVerb[] = ['zijn', 'zitten', 'liggen', 'staan'];

export default function PositionalVerbsPage() {
  const { positionalExercises, loading, error } = useAppData();
  const [index, advance] = useExerciseDeck(positionalExercises.length);
  const [phase, setPhase] = useState<Phase>('active');
  const [selected, setSelected] = useState<PositionalVerb | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const { lang } = useLanguage();
  const ui = useUI();
  const { recordAnswer } = useProgress();

  const current = positionalExercises[index];
  const isCorrect = selected !== null && !!current && selected === current.verb;

  const select = useCallback((verb: PositionalVerb) => {
    if (phase !== 'active' || !current) return;
    const correct = verb === current.verb;
    setSelected(verb);
    setPhase('result');
    setScore((s) => ({
      correct: s.correct + (correct ? 1 : 0),
      total: s.total + 1,
    }));
    recordAnswer(current.id, 'positional', correct);
  }, [phase, current, recordAnswer]);

  const next = useCallback(() => {
    advance();
    setPhase('active');
    setSelected(null);
  }, [advance]);

  useAdvanceOnEnter(phase === 'result', next);

  // Early returns after all hooks (keeps hook order stable on direct load).
  if (loading || error) return <LoadingScreen error={error} />;
  if (!current) return <LoadingScreen error="No positional exercises found." />;

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
        El neerlandés usa <strong>verbos de posición</strong> específicos en lugar
        del verbo general <em>zijn</em> (ser/estar) para describir dónde o cómo
        está colocado algo.
      </p>
      <div className="theory-table">
        <div className="theory-row">
          <span className="theory-verb">staan</span>
          <span className="theory-desc">
            Cosas erguidas — personas/animales de pie, árboles, botellas,
            vehículos, <em>texto escrito en algo</em>
            <br />
            <em className="theory-eg">De leraar staat voor de klas.</em>
          </span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">liggen</span>
          <span className="theory-desc">
            Cosas planas/horizontales — objetos sobre una superficie, personas
            tumbadas, <em>ubicaciones geográficas</em>
            <br />
            <em className="theory-eg">Het boek ligt op de tafel.</em>
          </span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">zitten</span>
          <span className="theory-desc">
            Cosas encerradas/contenidas — personas/animales sentados, objetos
            dentro de recipientes o espacios, <em>errores o ingredientes ocultos</em>
            <br />
            <em className="theory-eg">Er zit een fout in de tekst.</em>
          </span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">zijn</span>
          <span className="theory-desc">
            Estados abstractos — propiedades, sentimientos, eventos, tiempo
            <br />
            <em className="theory-eg">Hij is ziek. De les is om drie uur.</em>
          </span>
        </div>
      </div>
    </div>
  ) : (
    <div className="theory-section">
      <p className="theory-intro">
        Dutch uses specific <strong>position verbs</strong> instead of the
        general verb <em>zijn</em> (to be) when describing where or how
        something is placed.
      </p>
      <div className="theory-table">
        <div className="theory-row">
          <span className="theory-verb">staan</span>
          <span className="theory-desc">
            Upright things — people/animals standing, trees, bottles,
            vehicles, <em>text written on something</em>
            <br />
            <em className="theory-eg">De leraar staat voor de klas.</em>
          </span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">liggen</span>
          <span className="theory-desc">
            Flat / horizontal things — objects on a surface, people lying
            down, <em>geographic locations</em>
            <br />
            <em className="theory-eg">Het boek ligt op de tafel.</em>
          </span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">zitten</span>
          <span className="theory-desc">
            Enclosed / contained things — people/animals sitting, objects
            inside containers or spaces, <em>hidden errors or ingredients</em>
            <br />
            <em className="theory-eg">Er zit een fout in de tekst.</em>
          </span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">zijn</span>
          <span className="theory-desc">
            Abstract states — properties, feelings, events, time
            <br />
            <em className="theory-eg">Hij is ziek. De les is om drie uur.</em>
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="app">
      <Header backTo="/" score={score} title={ui.positionVerbsTitle} />
      <main className="main">
        <TheoryPanel>{theoryContent}</TheoryPanel>

        <div className="exercise">
          <SentenceCard exercise={exerciseForCard} phase={phase} />

          <div className="pos-verb-grid">
            {VERBS.map((verb) => {
              let cls = 'pos-verb-btn';
              if (phase === 'result') {
                if (verb === current.verb) cls += ' correct';
                else if (verb === selected) cls += ' wrong';
                else cls += ' dim';
              }
              return (
                <button
                  key={verb}
                  className={cls}
                  onClick={() => select(verb)}
                  disabled={phase === 'result'}
                >
                  {verb}
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
                      <strong>{current.verb}</strong> ({current.answer}). {explanation}
                    </>
                  ) : (
                    <>
                      <strong>{selected}</strong> is wrong. The answer is{' '}
                      <strong>{current.verb}</strong> ({current.answer}). {explanation}
                    </>
                  )
                )}
              </p>
              <ShareScore score={score} title={ui.positionVerbsTitle} onNext={next} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
