import { useState } from 'react';
import type { Verb, Phase } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useUI } from '../i18n/ui';
import { getVerbTranslation } from '../data/verbTranslations';

interface Props {
  choices: Verb[];
  correctVerb: Verb;
  phase: Phase;
}

export function VerbChoices({ choices, correctVerb, phase }: Props) {
  const [showHints, setShowHints] = useState(false);
  const { lang } = useLanguage();
  const ui = useUI();

  return (
    <div className="verb-choices">
      <div className="verb-choices-header">
        <span className="verb-choices-label">{ui.verbs}</span>
        {phase === 'active' && (
          <button
            className={`hint-btn ${showHints ? 'active' : ''}`}
            onClick={() => setShowHints((v) => !v)}
          >
            {showHints ? ui.hideHints : ui.help}
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

          const verbTranslation = getVerbTranslation(verb.id, lang) ?? verb.translations?.[lang] ?? verb.english;

          return (
            <div key={verb.id} className={cls}>
              <span className="verb-infinitive">{verb.infinitive}</span>
              {(showHints || isResult) && (
                <span className="verb-english">{verbTranslation}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
