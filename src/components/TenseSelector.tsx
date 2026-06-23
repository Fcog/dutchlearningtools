import type { Tense } from '../types';
import { useUI } from '../i18n/ui';

interface Props {
  selected: Tense[];
  onChange: (tenses: Tense[]) => void;
}

export function TenseSelector({ selected, onChange }: Props) {
  const ui = useUI();

  const TENSES: { value: Tense; label: string }[] = [
    { value: 'present', label: ui.present },
    { value: 'past', label: ui.simplePast },
    { value: 'perfect', label: ui.presentPerfect },
  ];

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
      <span className="level-label">{ui.tenseLabel}</span>
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
