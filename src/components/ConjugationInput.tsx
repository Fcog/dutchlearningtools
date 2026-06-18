import { useRef, useEffect } from 'react';
import type { Tense } from '../types';

interface Props {
  tense: Tense;
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
}

export function ConjugationInput({ tense, value, onChange, onSubmit }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && value.trim()) onSubmit();
  };

  const placeholder =
    tense === 'perfect' ? 'Type the past participle…' : 'Type the conjugated form…';

  return (
    <div className="input-row">
      <input
        ref={inputRef}
        type="text"
        className="conj-field"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKey}
        placeholder={placeholder}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
      />
      <button
        className="submit-btn"
        onClick={onSubmit}
        disabled={!value.trim()}
      >
        Check
      </button>
    </div>
  );
}
