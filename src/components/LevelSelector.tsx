import type { Level } from '../types';

const LEVELS: { value: Level; label: string; description: string }[] = [
  { value: 'A1', label: 'A1', description: 'Beginner' },
  { value: 'A2', label: 'A2', description: 'Elementary' },
  { value: 'B1', label: 'B1', description: 'Intermediate' },
];

interface Props {
  selected: Level[];
  onChange: (levels: Level[]) => void;
}

export function LevelSelector({ selected, onChange }: Props) {
  const toggle = (level: Level) => {
    if (selected.includes(level)) {
      if (selected.length === 1) return;
      onChange(selected.filter((l) => l !== level));
    } else {
      onChange([...selected, level]);
    }
  };

  return (
    <div className="level-selector">
      <span className="level-label">Level:</span>
      <div className="level-buttons">
        {LEVELS.map(({ value, label, description }) => (
          <button
            key={value}
            className={`level-btn ${selected.includes(value) ? 'active' : ''}`}
            onClick={() => toggle(value)}
          >
            <span className="level-btn-code">{label}</span>
            <span className="level-btn-desc">{description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
