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

export default function DiminutivesPage() {
  const { diminutiveExercises, loading, error } = useAppData();
  const [index, advance] = useExerciseDeck(diminutiveExercises.length);
  const [phase, setPhase] = useState<Phase>('active');
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const { lang } = useLanguage();
  const ui = useUI();
  const { recordAnswer } = useProgress();

  const current = diminutiveExercises[index];

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
    recordAnswer(current.id, 'diminutive', correct);
  }, [phase, current, recordAnswer]);

  const next = useCallback(() => {
    advance();
    setPhase('active');
    setSelected(null);
  }, [advance]);

  useAdvanceOnEnter(phase === 'result', next);

  if (loading || error) return <LoadingScreen error={error} />;
  if (!current) return <LoadingScreen error="No diminutive exercises found." />;

  const isCorrect = selected !== null && selected === current.answer;

  // Neutral badge — don't reveal which suffix rule before the learner answers.
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
        El diminutivo (<em>verkleinwoord</em>) siempre es <strong>het</strong>. El sufijo
        depende del <strong>final</strong> de la palabra.
      </p>
      <div className="theory-table">
        <div className="theory-row"><span className="theory-verb">-je</span><span className="theory-desc">Tras la mayoría de consonantes (b, d, t, k, p, f, s, ch, g). <em className="theory-eg">boek → boekje</em></span></div>
        <div className="theory-row"><span className="theory-verb">-tje</span><span className="theory-desc">Tras vocal/diptongo, o l/n/r/w tras vocal larga. <em className="theory-eg">stoel → stoeltje, ei → eitje</em></span></div>
        <div className="theory-row"><span className="theory-verb">-etje</span><span className="theory-desc">Tras l, m, n, ng, r con vocal corta tónica (se dobla la consonante). <em className="theory-eg">bal → balletje</em></span></div>
        <div className="theory-row"><span className="theory-verb">-pje</span><span className="theory-desc">Tras -m con vocal larga, diptongo o consonante. <em className="theory-eg">boom → boompje, film → filmpje</em></span></div>
        <div className="theory-row"><span className="theory-verb">-kje</span><span className="theory-desc">Tras -ing átona (la g se pierde). <em className="theory-eg">koning → koninkje</em></span></div>
        <div className="theory-row"><span className="theory-verb">irregular</span><span className="theory-desc">La vocal se alarga o cambia. <em className="theory-eg">glas → glaasje, schip → scheepje</em></span></div>
      </div>
    </div>
  ) : (
    <div className="theory-section">
      <p className="theory-intro">
        A diminutive (<em>verkleinwoord</em>) is always <strong>het</strong>. The suffix
        depends on how the word <strong>ends</strong>.
      </p>
      <div className="theory-table">
        <div className="theory-row"><span className="theory-verb">-je</span><span className="theory-desc">After most consonants (b, d, t, k, p, f, s, ch, g). <em className="theory-eg">boek → boekje</em></span></div>
        <div className="theory-row"><span className="theory-verb">-tje</span><span className="theory-desc">After a vowel/diphthong, or l/n/r/w after a long vowel. <em className="theory-eg">stoel → stoeltje, ei → eitje</em></span></div>
        <div className="theory-row"><span className="theory-verb">-etje</span><span className="theory-desc">After l, m, n, ng, r with a short stressed vowel (double the consonant). <em className="theory-eg">bal → balletje</em></span></div>
        <div className="theory-row"><span className="theory-verb">-pje</span><span className="theory-desc">After -m preceded by a long vowel, diphthong or consonant. <em className="theory-eg">boom → boompje, film → filmpje</em></span></div>
        <div className="theory-row"><span className="theory-verb">-kje</span><span className="theory-desc">After unstressed -ing (the g drops). <em className="theory-eg">koning → koninkje</em></span></div>
        <div className="theory-row"><span className="theory-verb">irregular</span><span className="theory-desc">The stem vowel lengthens or changes. <em className="theory-eg">glas → glaasje, schip → scheepje</em></span></div>
      </div>
    </div>
  );

  return (
    <div className="app">
      <Header backTo="/" score={score} title={ui.diminutivesTitle} />
      <main className="main">
        <TheoryPanel>{theoryContent}</TheoryPanel>

        <div className="exercise">
          <SentenceCard exercise={exerciseForCard} phase={phase} label={ui.diminutivesBadge} />

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
                  lang === 'es'
                    ? <>¡Correcto! <strong>{current.answer}</strong> — {explanation}</>
                    : <>Correct! <strong>{current.answer}</strong> — {explanation}</>
                ) : (
                  lang === 'es'
                    ? <><strong>{selected}</strong> es incorrecto. La respuesta es <strong>{current.answer}</strong>. {explanation}</>
                    : <><strong>{selected}</strong> is wrong. The answer is <strong>{current.answer}</strong>. {explanation}</>
                )}
              </p>
              <ShareScore score={score} title={ui.diminutivesTitle} onNext={next} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
