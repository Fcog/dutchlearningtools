import { useState, useCallback, useMemo } from 'react';
import type { Verb, Exercise, Phase, Level } from '../types';
import { verbs } from '../data/verbs';

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

function buildExercise(selectedLevels: Level[]): ExerciseState | null {
  const pool = verbs.filter((v) => selectedLevels.includes(v.level));
  if (pool.length < 3) return null;

  const verb = pickRandom(pool);
  const exercise = pickRandom(verb.exercises);
  const d1 = pickRandom(pool, [verb]);
  const d2 = pickRandom(pool, [verb, d1]);

  return {
    verb,
    exercise,
    distractors: [d1, d2],
    phase: 'active',
    userInput: '',
    isCorrect: null,
  };
}

export function useExercise(selectedLevels: Level[]) {
  const [state, setState] = useState<ExerciseState | null>(() =>
    buildExercise(selectedLevels)
  );
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const orderedChoices = useMemo(
    () => (state ? shuffle([state.verb, ...state.distractors]) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state?.verb.id, state?.distractors[0]?.id, state?.distractors[1]?.id]
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
    setState(buildExercise(selectedLevels));
  }, [selectedLevels]);

  return { state, orderedChoices, score, setInput, submit, next };
}
