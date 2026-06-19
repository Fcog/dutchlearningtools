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
  // scroll so the sentence card sits just below the sticky header.
  // The keyboard fires many resize events while animating in; we debounce
  // so the scroll only runs once the keyboard has fully settled.
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    let timer: ReturnType<typeof setTimeout>;

    const scrollCardIntoView = () => {
      const card = document.querySelector('.sentence-card') as HTMLElement | null;
      if (!card) return;
      const cardTop = card.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: Math.max(0, cardTop - 64), behavior: 'smooth' });
    };

    const onResize = () => {
      if (document.activeElement !== inputRef.current) return;
      clearTimeout(timer);
      timer = setTimeout(scrollCardIntoView, 150);
    };

    vv.addEventListener('resize', onResize);
    return () => {
      vv.removeEventListener('resize', onResize);
      clearTimeout(timer);
    };
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
