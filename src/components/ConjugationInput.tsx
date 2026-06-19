import { useRef, useEffect } from 'react';
import type { Tense } from '../types';

interface Props {
  tense: Tense;
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
}

function scrollSentenceCardIntoView() {
  const card = document.querySelector('.sentence-card') as HTMLElement | null;
  if (!card) return;
  const cardTop = card.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top: Math.max(0, cardTop - 64), behavior: 'smooth' });
}

export function ConjugationInput({ tense, value, onChange, onSubmit }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleFocus = () => {
    // The browser scrolls the focused input into view as the keyboard appears,
    // which can push the sentence card above the visible area.
    // Wait ~300 ms for the keyboard animation to finish, then scroll the card
    // back to just below the sticky header.
    setTimeout(scrollSentenceCardIntoView, 300);
  };

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
        onFocus={handleFocus}
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
