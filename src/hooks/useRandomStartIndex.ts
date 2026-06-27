import { useState, useLayoutEffect, useRef, type Dispatch, type SetStateAction } from 'react';

/**
 * Drop-in replacement for `useState(0)` that tracks the current exercise index
 * but starts on a random item instead of always the first one.
 *
 * Exercise data is fetched asynchronously, so `total` is 0 on the first render.
 * Once the data arrives we pick a random starting index — exactly once — in a
 * layout effect so it's applied before the browser paints (no flash of item 0).
 */
export function useRandomStartIndex(total: number): [number, Dispatch<SetStateAction<number>>] {
  const [index, setIndex] = useState(0);
  const initialized = useRef(false);

  useLayoutEffect(() => {
    if (!initialized.current && total > 0) {
      initialized.current = true;
      setIndex(Math.floor(Math.random() * total));
    }
  }, [total]);

  return [index, setIndex];
}
