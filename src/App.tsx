import { useState } from 'react';
import type { Level, Tense } from './types';
import { useExercise } from './hooks/useExercise';
import { Header } from './components/Header';
import { LevelSelector } from './components/LevelSelector';
import { TenseSelector } from './components/TenseSelector';
import { SentenceCard } from './components/SentenceCard';
import { VerbChoices } from './components/VerbChoices';
import { ConjugationInput } from './components/ConjugationInput';
import { ResultFeedback } from './components/ResultFeedback';

export default function App() {
  const [selectedLevels, setSelectedLevels] = useState<Level[]>(['A1', 'A2']);
  const [selectedTenses, setSelectedTenses] = useState<Tense[]>(['present', 'past']);

  const { state, orderedChoices, score, setInput, submit, next } =
    useExercise(selectedLevels, selectedTenses);

  if (!state) {
    return (
      <div className="empty-state">
        <p>No exercises match the selected filters. Try enabling more levels or tenses.</p>
      </div>
    );
  }

  return (
    <div className="app">
      <Header correct={score.correct} total={score.total} />
      <main className="main">
        <div className="filters">
          <LevelSelector selected={selectedLevels} onChange={setSelectedLevels} />
          <TenseSelector selected={selectedTenses} onChange={setSelectedTenses} />
        </div>

        <div className="exercise">
          <SentenceCard exercise={state.exercise} />

          <VerbChoices
            key={state.exercise.answer + state.verb.id}
            choices={orderedChoices}
            correctVerb={state.verb}
            phase={state.phase}
          />

          {state.phase === 'active' && (
            <ConjugationInput
              tense={state.exercise.tense}
              value={state.userInput}
              onChange={setInput}
              onSubmit={submit}
            />
          )}

          {state.phase === 'result' && state.isCorrect !== null && (
            <ResultFeedback
              isCorrect={state.isCorrect}
              exercise={state.exercise}
              userInput={state.userInput}
              onNext={next}
            />
          )}
        </div>
      </main>
    </div>
  );
}
