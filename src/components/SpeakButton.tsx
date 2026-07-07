import { useState, useCallback, useEffect } from 'react';
import { useUI } from '../i18n/ui';

/**
 * Reusable Dutch text-to-speech button. `text` may be a string or a function
 * (evaluated on click, so it can reflect the current phase — e.g. read the
 * sentence with the answer filled in only after checking).
 */
export function SpeakButton({ text }: { text: string | (() => string) }) {
  const [speaking, setSpeaking] = useState(false);
  const ui = useUI();

  useEffect(() => () => window.speechSynthesis.cancel(), []);

  const handle = useCallback(() => {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const value = typeof text === 'function' ? text() : text;
    if (!value) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(value);
    u.lang = 'nl-NL';
    u.rate = 0.9;
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(u);
  }, [speaking, text]);

  return (
    <button
      type="button"
      className={`speak-btn${speaking ? ' speaking' : ''}`}
      onClick={handle}
      aria-label={speaking ? ui.stop : ui.readAloud}
      title={speaking ? ui.stop : ui.readAloud}
    >
      {speaking ? '■' : '🔊'}
    </button>
  );
}
