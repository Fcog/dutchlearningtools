import { useState, useCallback, useEffect } from 'react';
import { Header } from '../components/Header';
import { TheoryPanel } from '../components/TheoryPanel';
import { LoadingScreen } from '../components/LoadingScreen';
import { SpeakButton } from '../components/SpeakButton';
import { ShareScore } from '../components/ShareScore';
import { useAppData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { useUI } from '../i18n/ui';
import { useProgress } from '../hooks/useProgress';
import { useAdvanceOnEnter } from '../hooks/useAdvanceOnEnter';
import { useExerciseDeck } from '../hooks/useExerciseDeck';
import type { NegationExercise } from '../data/negationExercises';

type Placement = { word: 'niet' | 'geen'; kind: 'gap' | 'replace'; index: number };

/** The correct negated sentence, for the reveal and text-to-speech. */
function buildNegated(ex: NegationExercise): string {
  if (ex.mode === 'replace') {
    return ex.words.map((w, i) => (i === ex.position ? ex.negator : w)).join(' ');
  }
  const w = [...ex.words];
  w.splice(ex.position, 0, ex.negator);
  return w.join(' ');
}

export default function NegationPage() {
  const { negationExercises, loading, error } = useAppData();
  const [index, advance] = useExerciseDeck(negationExercises.length);
  const [armed, setArmed] = useState<'niet' | 'geen' | null>(null);
  const [placed, setPlaced] = useState<Placement | null>(null);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const { lang } = useLanguage();
  const ui = useUI();
  const { recordAnswer } = useProgress();

  const current = negationExercises[index];

  useEffect(() => {
    setArmed(null);
    setPlaced(null);
    setChecked(false);
    setIsCorrect(false);
  }, [current?.id]);

  const placeAt = useCallback((kind: 'gap' | 'replace', i: number) => {
    if (checked) return;
    setArmed(a => {
      if (!a) return a;
      setPlaced({ word: a, kind, index: i });
      return a;
    });
  }, [checked]);

  const removePlaced = useCallback(() => {
    if (checked) return;
    setPlaced(null);
  }, [checked]);

  const clear = useCallback(() => {
    if (checked) return;
    setPlaced(null);
    setArmed(null);
  }, [checked]);

  const check = useCallback(() => {
    if (checked || !current || !placed) return;
    // A 'gap' placement corresponds to mode 'insert'; a 'replace' placement to
    // mode 'replace'. Compare against the mapped kind, not the raw mode string.
    const expectedKind = current.mode === 'insert' ? 'gap' : 'replace';
    const correct =
      placed.word === current.negator &&
      placed.kind === expectedKind &&
      placed.index === current.position;
    setIsCorrect(correct);
    setChecked(true);
    setScore(s => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
    recordAnswer(current.id, 'negation', correct);
  }, [checked, current, placed, recordAnswer]);

  const next = useCallback(() => {
    setArmed(null);
    setPlaced(null);
    setChecked(false);
    setIsCorrect(false);
    advance();
  }, [advance]);

  useAdvanceOnEnter(checked, next);

  if (loading || error) return <LoadingScreen error={error} />;
  if (!current) return <LoadingScreen error="No negation exercises found." />;

  const negated = buildNegated(current);
  const chipClass = checked ? (isCorrect ? ' correct' : ' wrong') : '';

  const displayTranslation = lang === 'es'
    ? (current.translations?.es ?? current.english)
    : current.english;

  const explanation = lang === 'es'
    ? (current.explanationEs ?? current.explanation)
    : current.explanation;

  // Interleave gaps and tokens: gap 0, token 0, gap 1, token 1, …, gap N.
  const nodes: React.ReactNode[] = [];
  for (let i = 0; i <= current.words.length; i++) {
    const placedHere = placed && placed.kind === 'gap' && placed.index === i;
    if (placedHere) {
      nodes.push(
        <button
          key={`g${i}`}
          className={`word-chip placed${chipClass}`}
          onClick={removePlaced}
          disabled={checked}
        >
          {placed!.word}
        </button>,
      );
    } else {
      nodes.push(
        <button
          key={`g${i}`}
          className={`neg-gap${armed && !checked ? ' armed' : ''}`}
          onClick={() => placeAt('gap', i)}
          disabled={checked || !armed}
          aria-label={lang === 'es' ? 'Insertar aquí' : 'Insert here'}
        >
          {armed && !checked ? '+' : ''}
        </button>,
      );
    }

    if (i < current.words.length) {
      const word = current.words[i];
      const replacedHere = placed && placed.kind === 'replace' && placed.index === i;
      if (replacedHere) {
        nodes.push(
          <button
            key={`t${i}`}
            className={`word-chip placed${chipClass}`}
            onClick={removePlaced}
            disabled={checked}
          >
            {placed!.word}
          </button>,
        );
      } else if (word.toLowerCase() === 'een') {
        nodes.push(
          <button
            key={`t${i}`}
            className={`neg-token replaceable${armed && !checked ? ' armed' : ''}`}
            onClick={() => placeAt('replace', i)}
            disabled={checked || !armed}
          >
            {word}
          </button>,
        );
      } else {
        nodes.push(<span key={`t${i}`} className="vst-text">{word}</span>);
      }
    }
  }

  const theoryContent = lang === 'es' ? (
    <div className="theory-section">
      <p className="theory-intro">
        El neerlandés tiene dos negadores. Primero elige <strong>cuál</strong>, luego
        colócalo en el sitio correcto.
      </p>
      <div className="theory-table">
        <div className="theory-row">
          <span className="theory-verb">geen</span>
          <span className="theory-desc">
            Niega un sustantivo <strong>indefinido</strong> (sin artículo, con «een», plural o incontable).
            Sustituye a «een» o va justo delante del sustantivo.
            <br /><em className="theory-eg">een auto → geen auto · Ik drink geen koffie.</em>
          </span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">niet</span>
          <span className="theory-desc">
            Niega todo lo demás: verbos, adjetivos, adverbios, complementos y sustantivos
            <strong> definidos</strong> (de/het/dit/mijn, nombres propios).
            <br /><em className="theory-eg">Ik ken de man niet. · Dat is niet mijn boek.</em>
          </span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">niet: dónde</span>
          <span className="theory-desc">
            Va al <strong>final</strong>, pero <strong>delante</strong> de: adjetivo predicativo,
            complemento preposicional/lugar, prefijo separable, infinitivo y participio.
            <br /><em className="theory-eg">is niet groot · niet in Amsterdam · niet gewerkt</em>
          </span>
        </div>
      </div>
    </div>
  ) : (
    <div className="theory-section">
      <p className="theory-intro">
        Dutch has two negators. First choose <strong>which</strong> one, then put it in the
        right place.
      </p>
      <div className="theory-table">
        <div className="theory-row">
          <span className="theory-verb">geen</span>
          <span className="theory-desc">
            Negates an <strong>indefinite</strong> noun (no article, with "een", plural or uncountable).
            It replaces "een" or sits directly before the noun.
            <br /><em className="theory-eg">een auto → geen auto · Ik drink geen koffie.</em>
          </span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">niet</span>
          <span className="theory-desc">
            Negates everything else: verbs, adjectives, adverbs, phrases and
            <strong> definite</strong> nouns (de/het/dit/mijn, proper names).
            <br /><em className="theory-eg">Ik ken de man niet. · Dat is niet mijn boek.</em>
          </span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">niet: where</span>
          <span className="theory-desc">
            Goes at the <strong>end</strong>, but <strong>before</strong>: a predicate adjective,
            a prepositional/place phrase, a separable prefix, an infinitive and a past participle.
            <br /><em className="theory-eg">is niet groot · niet in Amsterdam · niet gewerkt</em>
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="app">
      <Header backTo="/" score={score} title={ui.negationTitle} />
      <main className="main">
        <TheoryPanel>{theoryContent}</TheoryPanel>

        <div className="exercise">
          {/* Question card */}
          <div className="wo-card">
            <div className="article-card-top">
              <span className={`level-badge level-badge-${current.level.toLowerCase()}`}>
                {current.level}
              </span>
              {checked && (
                <span className="wo-rule-badge">{current.negator}</span>
              )}
            </div>
            <p className="word-order-prompt">{ui.negationPrompt}</p>
            <p className="word-order-english">{displayTranslation}</p>
          </div>

          {/* Sentence with insertion gaps */}
          <div className="wo-section">
            <span className="word-section-label">{ui.negationSentenceLabel}</span>
            <div className="sentence-area-box vst-sentence neg-sentence">
              {nodes}
            </div>
          </div>

          {/* Negator bank */}
          <div className="wo-section">
            <span className="word-section-label">{ui.negationWordsLabel}</span>
            <div className="word-chips">
              {(['niet', 'geen'] as const).map(word => (
                <button
                  key={word}
                  className={`word-chip${armed === word ? ' armed' : ''}`}
                  onClick={() => !checked && setArmed(word)}
                  disabled={checked}
                >
                  {word}
                </button>
              ))}
            </div>
          </div>

          {/* Action row (hidden once checked — the result footer takes over) */}
          {!checked && (
            <div className="input-row">
              <button
                className="hint-btn"
                onClick={clear}
                disabled={!placed && !armed}
              >
                {ui.wordOrderClear}
              </button>
              <button
                className="submit-btn"
                style={{ marginLeft: 'auto' }}
                onClick={check}
                disabled={!placed}
              >
                {ui.check}
              </button>
            </div>
          )}

          {/* Result feedback */}
          {checked && (
            <div className={`result-feedback ${isCorrect ? 'success' : 'error'}`}>
              <p className="result-message">
                {isCorrect ? (
                  lang === 'es'
                    ? <>¡Correcto! <strong>{negated}</strong></>
                    : <>Correct! <strong>{negated}</strong></>
                ) : (
                  lang === 'es'
                    ? <>Incorrecto. La respuesta correcta es: <strong>{negated}</strong></>
                    : <>Wrong. The correct answer is: <strong>{negated}</strong></>
                )}
                <br />
                <span className="result-tip">{explanation}</span>
              </p>
              <ShareScore score={score} title={ui.negationTitle} onNext={next} extra={<SpeakButton key={index} text={() => negated} />} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
