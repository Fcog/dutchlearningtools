import { useState, useCallback } from "react";
import { Header } from "../components/Header";
import { SentenceCard } from "../components/SentenceCard";
import { ConjugationInput } from "../components/ConjugationInput";
import { TheoryPanel } from "../components/TheoryPanel";
import { LoadingScreen } from "../components/LoadingScreen";
import { useAppData } from "../context/DataContext";
import type { SeparableContext } from "../data/separableVerbs";
import type { Phase, SupportedLang } from "../types";
import { useLanguage } from "../context/LanguageContext";
import { useUI } from "../i18n/ui";
import { useProgress } from "../hooks/useProgress";
import { useAdvanceOnEnter } from "../hooks/useAdvanceOnEnter";

function shuffled<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getContextLabel(ctx: SeparableContext, ui: ReturnType<typeof useUI>): string {
  switch (ctx) {
    case 'main': return ui.mainClause;
    case 'perfect': return ui.presentPerfect;
    case 'subordinate': return ui.subordinateClause;
    case 'modal': return ui.modalVerb;
  }
}

function getContextFeedback(ctx: SeparableContext, ui: ReturnType<typeof useUI>): string {
  switch (ctx) {
    case 'main': return ui.splitPrefix;
    case 'perfect': return ui.gePrefixStem;
    case 'subordinate': return ui.togetherEnd;
    case 'modal': return ui.fullInfinitive;
  }
}

export default function SeparableVerbsPage() {
  const { separableVerbSets, loading, error } = useAppData();
  const [order] = useState(() => shuffled(separableVerbSets.map((_, i) => i)));
  const [verbIdx, setVerbIdx] = useState(0);
  const [ctxIdx, setCtxIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>("active");
  const [userInput, setUserInput] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const { lang } = useLanguage();
  const ui = useUI();
  const { recordAnswer } = useProgress();

  if (loading || error) return <LoadingScreen error={error} />;

  const verbSet = separableVerbSets[order[verbIdx % order.length]];
  const exercise = verbSet.exercises[ctxIdx];

  const submit = useCallback(() => {
    if (!userInput.trim()) return;
    const correct =
      userInput.trim().toLowerCase() === exercise.answer.toLowerCase();
    setIsCorrect(correct);
    setPhase("result");
    setScore((s) => ({
      correct: s.correct + (correct ? 1 : 0),
      total: s.total + 1,
    }));
    recordAnswer(exercise.id, 'separable', correct);
  }, [userInput, exercise.answer, exercise.id, recordAnswer]);

  const next = useCallback(() => {
    if (ctxIdx < 3) {
      setCtxIdx((i) => i + 1);
    } else {
      setVerbIdx((i) => i + 1);
      setCtxIdx(0);
    }
    setPhase("active");
    setUserInput("");
    setIsCorrect(null);
  }, [ctxIdx]);

  useAdvanceOnEnter(phase === "result", next);

  const exerciseForCard = {
    dutch: exercise.dutch,
    english: exercise.english,
    translations: exercise.translations,
    answer: exercise.answer,
    tense: "present" as const,
  };

  const verbEnglish = (verbSet.translations as Partial<Record<SupportedLang, string>>)?.[lang] ?? verbSet.english;
  const contextLabel = getContextLabel(exercise.context, ui);
  const contextFeedback = getContextFeedback(exercise.context, ui);

  const theoryContent = lang === 'es' ? (
    <div className="theory-section">
      <p className="theory-intro">
        Los verbos separables (p. ej. <strong>opbellen</strong>,{" "}
        <strong>meenemen</strong>) separan su prefijo en algunos tipos de oración,
        pero lo mantienen unido en otros.
      </p>
      <div className="theory-table">
        <div className="theory-row">
          <span className="theory-verb">Oración principal</span>
          <span className="theory-desc">
            Verbo conjugado en posición 2, prefijo al <em>final</em>
            <br />
            <em className="theory-eg">Hij belt zijn moeder op.</em>
          </span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">Perfecto</span>
          <span className="theory-desc">
            <em>ge-</em> se inserta <em>entre</em> el prefijo y el radical:
            prefijo + ge + radical
            <br />
            <em className="theory-eg">Hij heeft zijn moeder opgebeld.</em>
          </span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">Subordinada</span>
          <span className="theory-desc">
            El prefijo y el verbo permanecen <em>juntos</em> al final de la oración
            <br />
            <em className="theory-eg">Ze weet dat hij zijn moeder opbelt.</em>
          </span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">Verbo modal</span>
          <span className="theory-desc">
            Infinitivo completo (prefijo + verbo) después del modal
            <br />
            <em className="theory-eg">Hij moet zijn moeder opbellen.</em>
          </span>
        </div>
      </div>
    </div>
  ) : (
    <div className="theory-section">
      <p className="theory-intro">
        Separable verbs (e.g. <strong>opbellen</strong>,{" "}
        <strong>meenemen</strong>) split their prefix off in some sentence
        types but keep it attached in others.
      </p>
      <div className="theory-table">
        <div className="theory-row">
          <span className="theory-verb">Main clause</span>
          <span className="theory-desc">
            Conjugated verb in position 2, prefix at the <em>end</em>
            <br />
            <em className="theory-eg">Hij belt zijn moeder op.</em>
          </span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">Perfect</span>
          <span className="theory-desc">
            <em>ge-</em> is inserted <em>between</em> prefix and stem:
            prefix + ge + stem
            <br />
            <em className="theory-eg">Hij heeft zijn moeder opgebeld.</em>
          </span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">Subordinate</span>
          <span className="theory-desc">
            Prefix and verb stay <em>together</em> at the end of the clause
            <br />
            <em className="theory-eg">Ze weet dat hij zijn moeder opbelt.</em>
          </span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">Modal verb</span>
          <span className="theory-desc">
            Full infinitive (prefix + verb) after the modal
            <br />
            <em className="theory-eg">Hij moet zijn moeder opbellen.</em>
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="app">
      <Header backTo="/" score={score} title={ui.separableVerbsTitle} />
      <main className="main">
        <TheoryPanel>{theoryContent}</TheoryPanel>

        <div className="exercise">
          <div className="sep-verb-header">
            <div className="sep-verb-title">
              <span className="sep-verb-infinitive">{verbSet.infinitive}</span>
              <span className="sep-verb-english">{verbEnglish}</span>
            </div>
            <div className="sep-verb-progress">
              {verbSet.exercises.map((_, i) => (
                <span
                  key={i}
                  className={`sep-progress-dot${i < ctxIdx ? " done" : ""}${i === ctxIdx ? " current" : ""}`}
                />
              ))}
            </div>
          </div>

          <SentenceCard
            exercise={exerciseForCard}
            phase={phase}
            label={contextLabel}
          />

          {phase === "active" && (
            <ConjugationInput
              tense="present"
              value={userInput}
              onChange={setUserInput}
              onSubmit={submit}
            />
          )}

          {phase === "result" && isCorrect !== null && (
            <div
              className={`result-feedback ${isCorrect ? "success" : "error"}`}
            >
              <p className="result-message">
                {isCorrect ? (
                  lang === 'es' ? (
                    <>
                      ¡Correcto! <strong>{exercise.answer}</strong> —{" "}
                      {contextLabel.toLowerCase()}: el verbo {contextFeedback}.
                    </>
                  ) : (
                    <>
                      Correct! <strong>{exercise.answer}</strong> —{" "}
                      {contextLabel.toLowerCase()}: the verb {contextFeedback}.
                    </>
                  )
                ) : (
                  lang === 'es' ? (
                    <>
                      <strong>{userInput}</strong> es incorrecto. La respuesta es{" "}
                      <strong>{exercise.answer}</strong>.
                    </>
                  ) : (
                    <>
                      <strong>{userInput}</strong> is wrong. The answer is{" "}
                      <strong>{exercise.answer}</strong>.
                    </>
                  )
                )}
              </p>
              <button className="next-btn" onClick={next}>
                {ui.next}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
