import { useEffect } from 'react';

/**
 * While `enabled` (i.e. the result feedback is showing) lets the Enter key
 * advance to the next exercise, mirroring the Enter-to-submit behaviour during
 * input.
 *
 * Activation is deferred to the next tick so the same Enter keystroke that
 * submitted the answer (and switched the page into the result phase) doesn't
 * immediately skip the feedback, and key-repeat from a held key is ignored for
 * the same reason.
 */
export function useAdvanceOnEnter(enabled: boolean, onAdvance: () => void): void {
  useEffect(() => {
    if (!enabled) return;
    let active = false;
    const armTimer = window.setTimeout(() => { active = true; }, 0);
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && active && !e.repeat) onAdvance();
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      window.clearTimeout(armTimer);
      window.removeEventListener('keydown', handleKey);
    };
  }, [enabled, onAdvance]);
}
