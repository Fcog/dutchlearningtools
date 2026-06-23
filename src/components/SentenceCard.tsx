import { useState, useCallback } from 'react';
import type { Exercise, Phase, Tense } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useUI } from '../i18n/ui';
import { getExerciseTranslation } from '../data/verbTranslations';

interface Props {
  exercise: Exercise;
  phase: Phase;
  label?: string;
}

function speak(text: string, onEnd: () => void) {
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'nl-NL';
  utterance.rate = 0.9;
  utterance.onend = onEnd;
  utterance.onerror = onEnd;
  window.speechSynthesis.speak(utterance);
}

export function SentenceCard({ exercise, phase, label }: Props) {
  const [speaking, setSpeaking] = useState(false);
  const { lang } = useLanguage();
  const ui = useUI();
  const parts = exercise.dutch.split('___');

  const TENSE_LABEL: Record<Tense, string> = {
    present: ui.presentTense,
    past: ui.simplePast,
    perfect: ui.presentPerfect,
  };

  const handleSpeak = useCallback(() => {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const text = phase === 'result'
      ? exercise.dutch.replace('___', exercise.answer)
      : parts[0].trimEnd() + ' … ' + (parts[1] ?? '').trimStart();
    setSpeaking(true);
    speak(text, () => setSpeaking(false));
  }, [speaking, phase, exercise, parts]);

  const translation =
    exercise.translations?.[lang] ??
    getExerciseTranslation(exercise.english, lang) ??
    exercise.english;

  return (
    <div className="sentence-card">
      <div className="sentence-card-top">
        <div className="tense-badge">{label ?? TENSE_LABEL[exercise.tense]}</div>
        <button
          className={`speak-btn${speaking ? ' speaking' : ''}`}
          onClick={handleSpeak}
          aria-label={speaking ? ui.stop : ui.readAloud}
          title={speaking ? ui.stop : ui.readAloud}
        >
          {speaking ? '■' : '🔊'}
        </button>
      </div>
      <p className="dutch-sentence">
        {parts[0]}
        <span className="blank">___</span>
        {parts[1]}
      </p>
      <p className="english-sentence">{translation}</p>
    </div>
  );
}
