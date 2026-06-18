import { useState, useCallback } from 'react';
import type { Exercise, Phase, Tense } from '../types';

const TENSE_LABEL: Record<Tense, string> = {
  present: 'Present tense',
  past: 'Simple past',
  perfect: 'Present perfect',
};

interface Props {
  exercise: Exercise;
  phase: Phase;
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

export function SentenceCard({ exercise, phase }: Props) {
  const [speaking, setSpeaking] = useState(false);
  const parts = exercise.dutch.split('___');

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

  return (
    <div className="sentence-card">
      <div className="sentence-card-top">
        <div className="tense-badge">{TENSE_LABEL[exercise.tense]}</div>
        <button
          className={`speak-btn${speaking ? ' speaking' : ''}`}
          onClick={handleSpeak}
          aria-label={speaking ? 'Stop' : 'Read aloud'}
          title={speaking ? 'Stop' : 'Read aloud'}
        >
          {speaking ? '■' : '🔊'}
        </button>
      </div>
      <p className="dutch-sentence">
        {parts[0]}
        <span className="blank">___</span>
        {parts[1]}
      </p>
      <p className="english-sentence">{exercise.english}</p>
    </div>
  );
}
