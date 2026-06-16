import { useRef, useEffect } from 'react';

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
}

export function ConjugationInput({ value, onChange, onSubmit }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && value.trim()) onSubmit();
  };

  return (
    <div className="input-row">
      <input
        ref={inputRef}
        type="text"
        className="conj-field"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKey}
        placeholder="Type the conjugated form…"
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
