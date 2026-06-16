import { useState } from 'react';
import type { Level } from './types';
import { useExercise } from './hooks/useExercise';
import { Header } from './components/Header';
import { LevelSelector } from './components/LevelSelector';
import { SentenceCard } from './components/SentenceCard';
import { VerbChoices } from './components/VerbChoices';
import { ConjugationInput } from './components/ConjugationInput';
import { ResultFeedback } from './components/ResultFeedback';

export default function App() {
  const [selectedLevels, setSelectedLevels] = useState<Level[]>(['A1', 'A2']);
  const { state, orderedChoices, score, setInput, submit, next } =
    useExercise(selectedLevels);

  const handleLevelChange = (levels: Level[]) => {
    setSelectedLevels(levels);
    next();
  };

  if (!state) {
    return (
      <div className="empty-state">
        <p>No verbs available for the selected levels. Please choose at least one level.</p>
      </div>
    );
  }

  return (
    <div className="app">
      <Header correct={score.correct} total={score.total} />
      <main className="main">
        <LevelSelector selected={selectedLevels} onChange={handleLevelChange} />

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
