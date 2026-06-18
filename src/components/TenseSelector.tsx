import type { Tense } from '../types';

const TENSES: { value: Tense; label: string }[] = [
  { value: 'present', label: 'Present' },
  { value: 'past', label: 'Simple past' },
  { value: 'perfect', label: 'Present perfect' },
];

interface Props {
  selected: Tense[];
  onChange: (tenses: Tense[]) => void;
}

export function TenseSelector({ selected, onChange }: Props) {
  const toggle = (tense: Tense) => {
    if (selected.includes(tense)) {
      if (selected.length === 1) return;
      onChange(selected.filter((t) => t !== tense));
    } else {
      onChange([...selected, tense]);
    }
  };

  return (
    <div className="level-selector">
      <span className="level-label">Tense:</span>
      <div className="level-buttons">
        {TENSES.map(({ value, label }) => (
          <button
            key={value}
            className={`level-btn ${selected.includes(value) ? 'active' : ''}`}
            onClick={() => toggle(value)}
          >
            <span className="level-btn-code">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
