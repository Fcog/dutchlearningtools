import { useState, useCallback, useMemo } from 'react';
import { Header } from '../components/Header';
import { SentenceCard } from '../components/SentenceCard';
import { TheoryPanel } from '../components/TheoryPanel';
import { LoadingScreen } from '../components/LoadingScreen';
import { useAppData } from '../context/DataContext';
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

export default function ModalVerbsPage() {
  const { modalExercises, loading, error } = useAppData();
  const [index, advance] = useExerciseDeck(modalExercises.length);
  const [phase, setPhase] = useState<'active' | 'result'>('active');
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const { lang } = useLanguage();
  const ui = useUI();
  const { recordAnswer } = useProgress();

  const current = modalExercises[index];

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
    recordAnswer(current.id, 'modal', correct);
  }, [phase, current, recordAnswer]);

  const next = useCallback(() => {
    advance();
    setPhase('active');
    setSelected(null);
  }, [advance]);

  useAdvanceOnEnter(phase === 'result', next);

  if (loading || error) return <LoadingScreen error={error} />;
  if (!current) return <LoadingScreen error="No modal verb exercises found." />;

  const isCorrect = selected !== null && selected === current.answer;

  // exercise.tense drives SentenceCard's built-in tense badge (present / past).
  const exerciseForCard = {
    dutch: current.dutch,
    english: current.english,
    translations: current.translations,
    answer: current.answer,
    tense: current.tense,
  };

  const explanation = lang === 'es'
    ? (current.explanationEs ?? current.explanation)
    : current.explanation;

  const theoryContent = lang === 'es' ? (
    <div className="theory-section">
      <p className="theory-intro">
        Los <strong>verbos modales</strong> matizan otro verbo (en infinitivo, al
        final): expresan obligación, permiso, deseo, capacidad, futuro o necesidad.
      </p>
      <div className="theory-table">
        <div className="theory-row">
          <span className="theory-verb">moeten</span>
          <span className="theory-desc">obligación — <em>tener que / deber</em>. <em className="theory-eg">Ik moet werken.</em></span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">mogen</span>
          <span className="theory-desc">permiso — <em>poder / estar permitido</em>. <em className="theory-eg">Je mag naar huis.</em></span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">willen</span>
          <span className="theory-desc">deseo — <em>querer</em>. <em className="theory-eg">Ik wil koffie.</em></span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">kunnen</span>
          <span className="theory-desc">capacidad / posibilidad — <em>poder / saber</em>. <em className="theory-eg">Zij kan zwemmen.</em></span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">zullen</span>
          <span className="theory-desc">futuro / sugerencia — <em>ir a / ¿…?</em>. <em className="theory-eg">Ik zal bellen. Zullen we gaan?</em></span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">hoeven</span>
          <span className="theory-desc">no hace falta — solo en negativo, con <em>niet/geen + te</em>. <em className="theory-eg">Je hoeft niet te komen.</em></span>
        </div>
      </div>
      <p className="theory-intro">
        Pasado simple: <em>moest, mocht, wilde, kon, zou, hoefde</em> (plural: <em>-en</em>).
      </p>
    </div>
  ) : (
    <div className="theory-section">
      <p className="theory-intro">
        <strong>Modal verbs</strong> colour another verb (an infinitive at the end):
        they express obligation, permission, wish, ability, future or (lack of) necessity.
      </p>
      <div className="theory-table">
        <div className="theory-row">
          <span className="theory-verb">moeten</span>
          <span className="theory-desc">obligation — <em>must / have to</em>. <em className="theory-eg">Ik moet werken.</em></span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">mogen</span>
          <span className="theory-desc">permission — <em>may / be allowed to</em>. <em className="theory-eg">Je mag naar huis.</em></span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">willen</span>
          <span className="theory-desc">wish — <em>to want</em>. <em className="theory-eg">Ik wil koffie.</em></span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">kunnen</span>
          <span className="theory-desc">ability / possibility — <em>can / be able to</em>. <em className="theory-eg">Zij kan zwemmen.</em></span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">zullen</span>
          <span className="theory-desc">future / suggestion — <em>shall / will</em>. <em className="theory-eg">Ik zal bellen. Zullen we gaan?</em></span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">hoeven</span>
          <span className="theory-desc">no necessity — negative only, with <em>niet/geen + te</em>. <em className="theory-eg">Je hoeft niet te komen.</em></span>
        </div>
      </div>
      <p className="theory-intro">
        Simple past: <em>moest, mocht, wilde, kon, zou, hoefde</em> (plural: <em>-en</em>).
      </p>
    </div>
  );

  return (
    <div className="app">
      <Header backTo="/" score={score} title={ui.modalTitle} />
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
              <ShareScore score={score} title={ui.modalTitle} onNext={next} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
