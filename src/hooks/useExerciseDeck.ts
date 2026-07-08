import { useState, useRef, useCallback, useLayoutEffect } from 'react';

function shuffledRange(n: number): number[] {
  const d = Array.from({ length: n }, (_, i) => i);
  for (let i = d.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [d[i], d[j]] = [d[j], d[i]];
  }
  return d;
}

/**
 * Drop-in replacement for the old "random index + avoid last" pattern that
 * guarantees no exercise repeats until every item has been shown. It shuffles
 * all indices into a deck, plays through them in order, and only reshuffles once
 * the deck is exhausted (avoiding an immediate repeat across the boundary).
 *
 * Returns [index, advance]: `index` into the data array, and `advance()` to move
 * to the next card. Rebuilds when `total` changes (async load, or a filtered
 * sub-list such as the adjectives kinds).
 */
export function useExerciseDeck(total: number): [number, () => void] {
  const [index, setIndex] = useState(0);
  const deck = useRef<number[]>([]);
  const pos = useRef(0);
  const builtFor = useRef(0);

  useLayoutEffect(() => {
    if (total > 0 && builtFor.current !== total) {
      builtFor.current = total;
      deck.current = shuffledRange(total);
      pos.current = 0;
      setIndex(deck.current[0]);
    }
  }, [total]);

  const advance = useCallback(() => {
    if (total <= 0) return;
    if (deck.current.length !== total) {
      builtFor.current = total;
      deck.current = shuffledRange(total);
      pos.current = 0;
      setIndex(deck.current[0]);
      return;
    }
    let nextPos = pos.current + 1;
    if (nextPos >= deck.current.length) {
      const last = deck.current[deck.current.length - 1];
      let reshuffled = shuffledRange(total);
      // Don't let the new deck open with the card we just showed.
      if (total > 1 && reshuffled[0] === last) [reshuffled[0], reshuffled[1]] = [reshuffled[1], reshuffled[0]];
      deck.current = reshuffled;
      nextPos = 0;
    }
    pos.current = nextPos;
    setIndex(deck.current[nextPos]);
  }, [total]);

  return [index, advance];
}
