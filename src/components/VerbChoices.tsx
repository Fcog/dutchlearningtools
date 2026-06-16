import { useState } from 'react';
import type { Verb, Phase } from '../types';

interface Props {
  choices: Verb[];
  correctVerb: Verb;
  phase: Phase;
}

export function VerbChoices({ choices, correctVerb, phase }: Props) {
  const [showHints, setShowHints] = useState(false);

  return (
    <div className="verb-choices">
      <div className="verb-choices-header">
        <span className="verb-choices-label">Verbs</span>
        {phase === 'active' && (
          <button
            className={`hint-btn ${showHints ? 'active' : ''}`}
            onClick={() => setShowHints((v) => !v)}
          >
            {showHints ? 'Hide hints' : 'Help'}
          </button>
        )}
      </div>
      <div className="verb-grid">
        {choices.map((verb) => {
          const isResult = phase === 'result';
          const isCorrectVerb = verb.id === correctVerb.id;

          let cls = 'verb-card';
          if (isResult) {
            cls += isCorrectVerb ? ' correct' : ' dim';
          }

          return (
            <div key={verb.id} className={cls}>
              <span className="verb-infinitive">{verb.infinitive}</span>
              {(showHints || isResult) && (
                <span className="verb-english">{verb.english}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
