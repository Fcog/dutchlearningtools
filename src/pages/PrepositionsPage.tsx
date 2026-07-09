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
import type { PrepositionCategory } from '../data/prepositionExercises';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function PrepositionsPage() {
  const { prepositionExercises, loading, error } = useAppData();
  const [index, advance] = useExerciseDeck(prepositionExercises.length);
  const [phase, setPhase] = useState<Phase>('active');
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const { lang } = useLanguage();
  const ui = useUI();
  const { recordAnswer } = useProgress();

  const current = prepositionExercises[index];

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
    recordAnswer(current.id, 'preposition', correct);
  }, [phase, current, recordAnswer]);

  const next = useCallback(() => {
    advance();
    setPhase('active');
    setSelected(null);
  }, [advance]);

  useAdvanceOnEnter(phase === 'result', next);

  if (loading || error) return <LoadingScreen error={error} />;
  if (!current) return <LoadingScreen error="No preposition exercises found." />;

  const isCorrect = selected !== null && selected === current.answer;

  const CATEGORY_LABEL: Record<PrepositionCategory, string> = {
    verb:      lang === 'es' ? 'verbo + preposición'     : 'verb + preposition',
    adjective: lang === 'es' ? 'adjetivo + preposición'  : 'adjective + preposition',
    noun:      lang === 'es' ? 'sustantivo + preposición' : 'noun + preposition',
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
        Muchos verbos, adjetivos y sustantivos neerlandeses exigen una{' '}
        <strong>preposición fija</strong>. No sigue una lógica clara, así que la clave
        es aprender la combinación <em>entera</em>: <em>wachten op</em>, no solo{' '}
        <em>wachten</em>.
      </p>
      <div className="theory-table">
        <div className="theory-row">
          <span className="theory-verb">verbo + prep.</span>
          <span className="theory-desc">
            <em>wachten op</em> (esperar), <em>luisteren naar</em> (escuchar),{' '}
            <em>houden van</em> (querer), <em>denken aan</em> (pensar en).
          </span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">adjetivo + prep.</span>
          <span className="theory-desc">
            <em>bang voor</em> (miedo a), <em>trots op</em> (orgulloso de),{' '}
            <em>tevreden met</em> (contento con), <em>geïnteresseerd in</em> (interesado en).
          </span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">sustantivo + prep.</span>
          <span className="theory-desc">
            <em>behoefte aan</em> (necesidad de), <em>gebrek aan</em> (falta de),{' '}
            <em>interesse in</em> (interés en).
          </span>
        </div>
      </div>
      <p className="theory-intro">
        Cuidado: la preposición neerlandesa rara vez coincide con la del español o el
        inglés. Memoriza el bloque completo.
      </p>
    </div>
  ) : (
    <div className="theory-section">
      <p className="theory-intro">
        Many Dutch verbs, adjectives and nouns require a <strong>fixed preposition</strong>.
        There's little logic to it, so the trick is to learn the <em>whole</em> chunk:{' '}
        <em>wachten op</em>, not just <em>wachten</em>.
      </p>
      <div className="theory-table">
        <div className="theory-row">
          <span className="theory-verb">verb + prep.</span>
          <span className="theory-desc">
            <em>wachten op</em> (wait for), <em>luisteren naar</em> (listen to),{' '}
            <em>houden van</em> (love), <em>denken aan</em> (think of).
          </span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">adjective + prep.</span>
          <span className="theory-desc">
            <em>bang voor</em> (afraid of), <em>trots op</em> (proud of),{' '}
            <em>tevreden met</em> (happy with), <em>geïnteresseerd in</em> (interested in).
          </span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">noun + prep.</span>
          <span className="theory-desc">
            <em>behoefte aan</em> (need for), <em>gebrek aan</em> (lack of),{' '}
            <em>interesse in</em> (interest in).
          </span>
        </div>
      </div>
      <p className="theory-intro">
        Beware: the Dutch preposition rarely matches the English (or Spanish) one.
        Memorise the whole block.
      </p>
    </div>
  );

  return (
    <div className="app">
      <Header backTo="/" score={score} title={ui.prepositionsTitle} />
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
              <ShareScore score={score} title={ui.prepositionsTitle} />
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
