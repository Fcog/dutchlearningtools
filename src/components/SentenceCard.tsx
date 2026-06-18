import type { Exercise, Tense } from '../types';

const TENSE_LABEL: Record<Tense, string> = {
  present: 'Present tense',
  past: 'Simple past',
  perfect: 'Present perfect',
};

interface Props {
  exercise: Exercise;
}

export function SentenceCard({ exercise }: Props) {
  const parts = exercise.dutch.split('___');

  return (
    <div className="sentence-card">
      <div className="tense-badge">{TENSE_LABEL[exercise.tense]}</div>
      <p className="dutch-sentence">
        {parts[0]}
        <span className="blank">___</span>
        {parts[1]}
      </p>
      <p className="english-sentence">{exercise.english}</p>
    </div>
  );
}
