import { useState, useCallback } from 'react';
import { Header } from '../components/Header';
import { SentenceCard } from '../components/SentenceCard';
import { ConjugationInput } from '../components/ConjugationInput';
import { TheoryPanel } from '../components/TheoryPanel';
import { separableVerbSets, CONTEXT_LABEL } from '../data/separableVerbs';
import type { Phase } from '../types';

function shuffled<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function SeparableVerbsPage() {
  const [order] = useState(() => shuffled(separableVerbSets.map((_, i) => i)));
  const [verbIdx, setVerbIdx] = useState(0);
  const [ctxIdx, setCtxIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>('active');
  const [userInput, setUserInput] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const verbSet = separableVerbSets[order[verbIdx % order.length]];
  const exercise = verbSet.exercises[ctxIdx];

  const submit = useCallback(() => {
    if (!userInput.trim()) return;
    const correct = userInput.trim().toLowerCase() === exercise.answer.toLowerCase();
    setIsCorrect(correct);
    setPhase('result');
    setScore((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
  }, [userInput, exercise.answer]);

  const next = useCallback(() => {
    if (ctxIdx < 3) {
      setCtxIdx((i) => i + 1);
    } else {
      setVerbIdx((i) => i + 1);
      setCtxIdx(0);
    }
    setPhase('active');
    setUserInput('');
    setIsCorrect(null);
  }, [ctxIdx]);

  const exerciseForCard = {
    dutch: exercise.dutch,
    english: exercise.english,
    answer: exercise.answer,
    tense: 'present' as const,
  };

  return (
    <div className="app">
      <Header backTo="/" score={score} title="Separable Verbs" />
      <main className="main">
        <TheoryPanel>
          <div className="theory-section">
            <p className="theory-intro">
              Separable verbs (e.g. <strong>opbellen</strong>, <strong>meenemen</strong>) split their
              prefix off in some sentence types but keep it attached in others.
            </p>
            <div className="theory-table">
              <div className="theory-row">
                <span className="theory-verb">Main clause</span>
                <span className="theory-desc">
                  Conjugated verb in position 2, prefix at the <em>end</em>
                  <br />
                  <em className="theory-eg">Hij belt zijn moeder op.</em>
                </span>
              </div>
              <div className="theory-row">
                <span className="theory-verb">Perfect</span>
                <span className="theory-desc">
                  <em>ge-</em> is inserted <em>between</em> prefix and stem: prefix + ge + stem
                  <br />
                  <em className="theory-eg">Hij heeft zijn moeder opgebeld.</em>
                </span>
              </div>
              <div className="theory-row">
                <span className="theory-verb">Subordinate</span>
                <span className="theory-desc">
                  Prefix and verb stay <em>together</em> at the end of the clause
                  <br />
                  <em className="theory-eg">Ze weet dat hij zijn moeder opbelt.</em>
                </span>
              </div>
              <div className="theory-row">
                <span className="theory-verb">Modal verb</span>
                <span className="theory-desc">
                  Full infinitive (prefix + verb) after the modal
                  <br />
                  <em className="theory-eg">Hij moet zijn moeder opbellen.</em>
                </span>
              </div>
            </div>
          </div>
        </TheoryPanel>

        <div className="sep-verb-header">
          <div className="sep-verb-title">
            <span className="sep-verb-infinitive">{verbSet.infinitive}</span>
            <span className="sep-verb-english">{verbSet.english}</span>
          </div>
          <div className="sep-verb-progress">
            {verbSet.exercises.map((_, i) => (
              <span
                key={i}
                className={`sep-progress-dot${i < ctxIdx ? ' done' : ''}${i === ctxIdx ? ' current' : ''}`}
              />
            ))}
          </div>
        </div>

        <div className="exercise">
          <SentenceCard
            exercise={exerciseForCard}
            phase={phase}
            label={CONTEXT_LABEL[exercise.context]}
          />

          {phase === 'active' && (
            <ConjugationInput
              tense="present"
              value={userInput}
              onChange={setUserInput}
              onSubmit={submit}
            />
          )}

          {phase === 'result' && isCorrect !== null && (
            <div className={`result-feedback ${isCorrect ? 'success' : 'error'}`}>
              <p className="result-message">
                {isCorrect ? (
                  <>Correct! <strong>{exercise.answer}</strong> — {CONTEXT_LABEL[exercise.context].toLowerCase()}: the verb {exercise.context === 'main' ? 'splits, prefix goes to the end' : exercise.context === 'perfect' ? 'gets ge- between prefix and stem' : exercise.context === 'subordinate' ? 'stays together at the end of the clause' : 'stays as a full infinitive after the modal'}.</>
                ) : (
                  <>
                    <strong>{userInput}</strong> is wrong. The answer is{' '}
                    <strong>{exercise.answer}</strong>.
                  </>
                )}
              </p>
              <button className="next-btn" onClick={next}>
                {ctxIdx < 3 ? 'Next context →' : 'Next verb →'}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
