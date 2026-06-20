import { useState, useCallback } from 'react';
import { Header } from '../components/Header';
import { SentenceCard } from '../components/SentenceCard';
import { TheoryPanel } from '../components/TheoryPanel';
import { positionalExercises, type PositionalVerb } from '../data/positionalVerbs';
import type { Phase } from '../types';

const VERBS: PositionalVerb[] = ['zijn', 'zitten', 'liggen', 'staan'];

function randomIndex(exclude: number) {
  let i: number;
  do { i = Math.floor(Math.random() * positionalExercises.length); } while (i === exclude);
  return i;
}

export default function PositionalVerbsPage() {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * positionalExercises.length));
  const [phase, setPhase] = useState<Phase>('active');
  const [selected, setSelected] = useState<PositionalVerb | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const current = positionalExercises[index];
  const isCorrect = selected !== null && selected === current.verb;

  const select = useCallback((verb: PositionalVerb) => {
    if (phase !== 'active') return;
    setSelected(verb);
    setPhase('result');
    setScore((s) => ({
      correct: s.correct + (verb === current.verb ? 1 : 0),
      total: s.total + 1,
    }));
  }, [phase, current.verb]);

  const next = useCallback(() => {
    setIndex((i) => randomIndex(i));
    setPhase('active');
    setSelected(null);
  }, []);

  const exerciseForCard = {
    dutch: current.dutch,
    english: current.english,
    answer: current.answer,
    tense: 'present' as const,
  };

  return (
    <div className="app">
      <Header backTo="/" score={score} />
      <main className="main">
        <TheoryPanel>
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
        </TheoryPanel>

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
                  <>Correct! <strong>{current.answer}</strong> — {current.explanation}</>
                ) : (
                  <>
                    <strong>{selected}</strong> is wrong. The answer is{' '}
                    <strong>{current.verb}</strong> ({current.answer}). {current.explanation}
                  </>
                )}
              </p>
              <button className="next-btn" onClick={next}>
                Next exercise →
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
