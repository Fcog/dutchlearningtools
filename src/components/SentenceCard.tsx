import type { Exercise, Phase, Tense } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useUI } from '../i18n/ui';
import { SpeakButton } from './SpeakButton';
import { canonicalAnswer } from '../lib/answerCheck';

interface Props {
  exercise: Exercise;
  phase: Phase;
  label?: string;
}

export function SentenceCard({ exercise, phase, label }: Props) {
  const { lang } = useLanguage();
  const ui = useUI();
  const parts = exercise.dutch.split('___');

  const TENSE_LABEL: Record<Tense, string> = {
    present: ui.presentTense,
    past: ui.simplePast,
    perfect: ui.presentPerfect,
  };

  // Read the sentence with the answer filled in once solved, otherwise with a pause in the gap.
  const speakText = () => (phase === 'result'
    ? exercise.dutch.replace('___', canonicalAnswer(exercise.dutch, exercise.answer))
    : parts[0].trimEnd() + ' … ' + (parts[1] ?? '').trimStart());

  const translation = exercise.translations?.[lang] ?? exercise.english;

  return (
    <div className="sentence-card">
      <div className="sentence-card-top">
        <div className="tense-badge">{label ?? TENSE_LABEL[exercise.tense]}</div>
        <SpeakButton key={exercise.dutch} text={speakText} />
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
