import { useState } from "react";
import type { Level, Tense } from "../types";
import { useExercise } from "../hooks/useExercise";
import { Header } from "../components/Header";
import { LevelSelector } from "../components/LevelSelector";
import { TenseSelector } from "../components/TenseSelector";
import { SentenceCard } from "../components/SentenceCard";
import { VerbChoices } from "../components/VerbChoices";
import { ConjugationInput } from "../components/ConjugationInput";
import { ResultFeedback } from "../components/ResultFeedback";
import { HelpBubble } from "../components/HelpBubble";

export default function VerbsPage() {
  const [selectedLevels, setSelectedLevels] = useState<Level[]>(["A1", "A2"]);
  const [selectedTenses, setSelectedTenses] = useState<Tense[]>([
    "present",
    "past",
  ]);
  const [showHelp, setShowHelp] = useState(false);

  const { state, orderedChoices, score, setInput, submit, next } = useExercise(
    selectedLevels,
    selectedTenses,
  );

  if (!state) {
    return (
      <div className="app">
        <Header backTo="/" score={score} />
        <div className="empty-state">
          <p>
            No exercises match the selected filters. Try enabling more levels or
            tenses.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Header backTo="/" score={score} />
      <main className="main">
        <div className="filters">
          <LevelSelector
            selected={selectedLevels}
            onChange={setSelectedLevels}
          />
          <TenseSelector
            selected={selectedTenses}
            onChange={setSelectedTenses}
          />
        </div>

        <button
          className={`help-toggle${showHelp ? " active" : ""}`}
          onClick={() => setShowHelp((v) => !v)}
          aria-pressed={showHelp}
          aria-label="How to play"
        >
          {showHelp ? "✕" : "?"}
        </button>

        <div className="exercise">
          <SentenceCard exercise={state.exercise} phase={state.phase} />
          {showHelp && (
            <HelpBubble>
              This sentence has a missing verb shown as <strong>___</strong>.
              Read it carefully — the English translation below gives you the
              context you need.
            </HelpBubble>
          )}

          <VerbChoices
            key={state.exercise.answer + state.verb.id}
            choices={orderedChoices}
            correctVerb={state.verb}
            phase={state.phase}
          />
          {showHelp && (
            <HelpBubble>
              Three verbs are shown as reference. Pick the one that fits the
              sentence. Tap <strong>Help</strong> on any card to reveal its
              English translation.
            </HelpBubble>
          )}

          {state.phase === "active" && (
            <ConjugationInput
              tense={state.exercise.tense}
              value={state.userInput}
              onChange={setInput}
              onSubmit={submit}
            />
          )}
          {showHelp && state.phase === "active" && (
            <HelpBubble>
              Type the chosen verb in its correct conjugated form — matching the
              subject and tense shown above. Then press <strong>Enter</strong>{" "}
              or tap <strong>Check</strong>.
            </HelpBubble>
          )}

          {state.phase === "result" && state.isCorrect !== null && (
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
