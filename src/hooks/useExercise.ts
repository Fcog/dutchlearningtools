import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import type { Verb, Exercise, Phase, Level, Tense } from '../types';

interface Pair { verb: Verb; exercise: Exercise }

interface ExerciseState {
  verb: Verb;
  exercise: Exercise;
  distractors: [Verb, Verb];
  phase: Phase;
  userInput: string;
  isCorrect: boolean | null;
}

function pickRandom<T>(arr: T[], exclude: T[] = []): T {
  const pool = arr.filter((x) => !exclude.includes(x));
  return pool[Math.floor(Math.random() * pool.length)];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Verbs that qualify for the current filters (used as the distractor pool).
function verbPool(verbs: Verb[], levels: Level[], tenses: Tense[]): Verb[] {
  return verbs.filter(
    (v) => levels.includes(v.level) && v.exercises.some((e) => tenses.includes(e.tense)),
  );
}

// Every (verb, exercise) pair that qualifies — one deck entry each.
function validPairs(verbs: Verb[], levels: Level[], tenses: Tense[]): Pair[] {
  const out: Pair[] = [];
  for (const v of verbs) {
    if (!levels.includes(v.level)) continue;
    for (const e of v.exercises) if (tenses.includes(e.tense)) out.push({ verb: v, exercise: e });
  }
  return out;
}

function stateFromPair(pair: Pair, pool: Verb[]): ExerciseState {
  const d1 = pickRandom(pool, [pair.verb]);
  const d2 = pickRandom(pool, [pair.verb, d1]);
  return {
    verb: pair.verb,
    exercise: pair.exercise,
    distractors: [d1, d2],
    phase: 'active',
    userInput: '',
    isCorrect: null,
  };
}

export function useExercise(
  verbs: Verb[],
  selectedLevels: Level[],
  selectedTenses: Tense[],
) {
  const [state, setState] = useState<ExerciseState | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const levelsKey = [...selectedLevels].sort().join(',');
  const tensesKey = [...selectedTenses].sort().join(',');

  // A shuffled deck of (verb, exercise) pairs so nothing repeats until the whole
  // filtered set has been shown. Rebuilt whenever the filters change.
  const deck = useRef<Pair[]>([]);

  const drawNext = useCallback((): ExerciseState | null => {
    const pool = verbPool(verbs, selectedLevels, selectedTenses);
    if (pool.length < 3) { deck.current = []; return null; }
    if (deck.current.length === 0) deck.current = shuffle(validPairs(verbs, selectedLevels, selectedTenses));
    const pair = deck.current.shift()!;
    return stateFromPair(pair, pool);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verbs, levelsKey, tensesKey]);

  // Build first exercise once verbs are available, and whenever filters change.
  useEffect(() => {
    if (verbs.length > 0) {
      deck.current = [];
      setState(drawNext());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verbs.length, levelsKey, tensesKey]);

  const orderedChoices = useMemo(
    () => (state ? shuffle([state.verb, ...state.distractors]) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state?.verb.id, state?.distractors[0]?.id, state?.distractors[1]?.id],
  );

  const setInput = useCallback((value: string) => {
    setState((prev) => {
      if (!prev || prev.phase !== 'active') return prev;
      return { ...prev, userInput: value };
    });
  }, []);

  const submit = useCallback(() => {
    setState((prev) => {
      if (!prev || prev.phase !== 'active') return prev;
      const isCorrect =
        prev.userInput.trim().toLowerCase() === prev.exercise.answer.toLowerCase();
      setScore((s) => ({
        correct: s.correct + (isCorrect ? 1 : 0),
        total: s.total + 1,
      }));
      return { ...prev, phase: 'result', isCorrect };
    });
  }, []);

  const next = useCallback(() => {
    setState(drawNext());
  }, [drawNext]);

  return { state, orderedChoices, score, setInput, submit, next };
}
