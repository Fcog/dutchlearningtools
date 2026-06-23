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
import { TheoryPanel } from "../components/TheoryPanel";

export default function VerbsPage() {
  const [selectedLevels, setSelectedLevels] = useState<Level[]>(["A1", "A2"]);
  const [selectedTenses, setSelectedTenses] = useState<Tense[]>([
    "present",
    "past",
  ]);
  const [showHelp, setShowHelp] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { state, orderedChoices, score, setInput, submit, next } = useExercise(
    selectedLevels,
    selectedTenses,
  );

  const filterSidebar = (
    <>
      <div className={`filter-sidebar${sidebarOpen ? " open" : ""}`}>
        <div className="filter-sidebar-head">
          <span className="filter-sidebar-title">Filters</span>
          <button
            className="filter-sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close filters"
          >
            ✕
          </button>
        </div>
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
      </div>
      {sidebarOpen && (
        <div
          className="filter-backdrop"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );

  if (!state) {
    return (
      <div className="app">
        <Header backTo="/" score={score} title="Verb Conjugation" />
        <main className="main">
          <button
            className="filters-toggle"
            onClick={() => setSidebarOpen(true)}
          >
            Filters
          </button>
          {filterSidebar}
          <div className="empty-state">
            <p>
              No exercises match the selected filters. Try enabling more levels
              or tenses.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <Header backTo="/" score={score} title="Verb Conjugation" />
      <main className="main">
        <button
          className="filters-toggle"
          onClick={() => setSidebarOpen(true)}
        >
          Filters
        </button>
        {filterSidebar}

        <TheoryPanel>
          <div className="theory-section">
            <p className="theory-intro">
              Dutch verbs have two types: <strong>weak</strong> (regular) and{' '}
              <strong>strong</strong> (irregular vowel change). Both follow the
              same present-tense rules.
            </p>
            <div className="theory-table">
              <div className="theory-row">
                <span className="theory-verb">Present</span>
                <span className="theory-desc">
                  Stem = infinitive − <em>en</em>. &nbsp;
                  <em>ik</em>: stem &nbsp;·&nbsp; <em>jij/hij</em>: stem + t &nbsp;·&nbsp;
                  <em>wij/jullie/zij</em>: infinitive
                  <br />
                  <em className="theory-eg">werken → ik werk · hij werkt · wij werken</em>
                </span>
              </div>
              <div className="theory-row">
                <span className="theory-verb">Past (weak)</span>
                <span className="theory-desc">
                  <strong>'t kofschip</strong>: if stem ends in t k f s ch p → stem + <em>te/ten</em>,
                  otherwise + <em>de/den</em>
                  <br />
                  <em className="theory-eg">werken → werkte/werkten &nbsp;·&nbsp; leven → leefde/leefden</em>
                </span>
              </div>
              <div className="theory-row">
                <span className="theory-verb">Past (strong)</span>
                <span className="theory-desc">
                  Vowel changes — must be memorised
                  <br />
                  <em className="theory-eg">rijden → reed/reden &nbsp;·&nbsp; schrijven → schreef/schreven</em>
                </span>
              </div>
              <div className="theory-row">
                <span className="theory-verb">Perfect</span>
                <span className="theory-desc">
                  <em>hebben</em> or <em>zijn</em> + past participle. Use <em>zijn</em> for
                  movement/change of state verbs
                  <br />
                  <em className="theory-eg">Ik heb gewerkt &nbsp;·&nbsp; Ik ben gegaan</em>
                </span>
              </div>
            </div>
          </div>
        </TheoryPanel>

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
