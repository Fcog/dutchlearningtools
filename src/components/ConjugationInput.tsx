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

  // When the virtual keyboard opens on mobile (visualViewport shrinks),
  // scroll the sentence card into view so the user can read what to type.
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const onResize = () => {
      if (document.activeElement !== inputRef.current) return;
      requestAnimationFrame(() => {
        const card = document.querySelector('.sentence-card') as HTMLElement | null;
        if (!card) return;
        const cardTop = card.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: Math.max(0, cardTop - 64), behavior: 'smooth' });
      });
    };

    vv.addEventListener('resize', onResize);
    return () => vv.removeEventListener('resize', onResize);
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
