import { useState, useCallback, useMemo, useEffect } from 'react';
import { Header } from '../components/Header';
import { TheoryPanel } from '../components/TheoryPanel';
import { LoadingScreen } from '../components/LoadingScreen';
import { useAppData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { useUI } from '../i18n/ui';
import { useProgress } from '../hooks/useProgress';
import { useAdvanceOnEnter } from '../hooks/useAdvanceOnEnter';
import { useExerciseDeck } from '../hooks/useExerciseDeck';
import { SpeakButton } from '../components/SpeakButton';
import { ShareScore } from '../components/ShareScore';
import type { VoorstellenMeaning } from '../data/voorstellenExercises';

interface Token { word: string; id: number }

function shuffle(arr: Token[]): Token[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function VoorstellenPage() {
  const { voorstellenExercises, loading, error } = useAppData();
  const [index, advance] = useExerciseDeck(voorstellenExercises.length);
  const [slots, setSlots] = useState<(number | null)[]>([]);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const { lang } = useLanguage();
  const ui = useUI();
  const { recordAnswer } = useProgress();

  const current = voorstellenExercises[index];

  // The static text around the blanks. segments.length === answers.length + 1.
  const segments = useMemo(
    () => (current ? current.gapped.split('___') : []),
    [current?.id], // eslint-disable-line react-hooks/exhaustive-deps
  );

  // Shuffle the chips once per exercise so chip order isn't a tell.
  const tokens = useMemo<Token[]>(
    () => (current ? shuffle(current.bank.map((word, i) => ({ word, id: i }))) : []),
    [current?.id], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const numBlanks = current?.answers.length ?? 0;

  useEffect(() => {
    setSlots(Array(numBlanks).fill(null));
    setChecked(false);
    setIsCorrect(false);
  }, [current?.id, numBlanks]);

  const placeToken = useCallback((pos: number) => {
    if (checked) return;
    setSlots(prev => {
      const firstEmpty = prev.indexOf(null);
      if (firstEmpty === -1) return prev;
      const next = [...prev];
      next[firstEmpty] = pos;
      return next;
    });
  }, [checked]);

  const returnSlot = useCallback((slotIdx: number) => {
    if (checked) return;
    setSlots(prev => {
      const next = [...prev];
      next[slotIdx] = null;
      return next;
    });
  }, [checked]);

  const clear = useCallback(() => {
    if (checked) return;
    setSlots(Array(numBlanks).fill(null));
  }, [checked, numBlanks]);

  const check = useCallback(() => {
    if (checked || !current || slots.some(s => s === null)) return;
    const correct = slots.every(
      (pos, i) => pos !== null && tokens[pos].word === current.answers[i],
    );
    setIsCorrect(correct);
    setChecked(true);
    setScore(s => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
    recordAnswer(current.id, 'voorstellen', correct);
  }, [checked, current, slots, tokens, recordAnswer]);

  const next = useCallback(() => {
    setSlots([]);
    setChecked(false);
    setIsCorrect(false);
    advance();
  }, [advance]);

  useAdvanceOnEnter(checked, next);

  if (loading || error) return <LoadingScreen error={error} />;
  if (!current) return <LoadingScreen error="No voorstellen exercises found." />;

  const usedPositions = new Set(slots.filter((s): s is number => s !== null));
  const bankPositions = tokens
    .map((_, pos) => pos)
    .filter(pos => !usedPositions.has(pos));

  const displayTranslation = lang === 'es'
    ? (current.translations?.es ?? current.english)
    : current.english;

  const explanation = lang === 'es'
    ? (current.explanationEs ?? current.explanation)
    : current.explanation;

  const MEANING_LABEL: Record<VoorstellenMeaning, string> = {
    introduce:      lang === 'es' ? 'presentar a alguien' : 'introduce someone',
    introduce_self: lang === 'es' ? 'presentarse'         : 'introduce oneself',
    imagine:        lang === 'es' ? 'imaginar'            : 'imagine',
    suggest:        lang === 'es' ? 'proponer'            : 'suggest',
    represent:      lang === 'es' ? 'representar'         : 'represent',
    worth:          lang === 'es' ? 'valer / ser gran cosa' : 'amount to much',
  };

  const theoryContent = lang === 'es' ? (
    <div className="theory-section">
      <p className="theory-intro">
        <strong>voorstellen</strong> es un verbo separable con varios significados.
        Lo que decide cuál es no es el vocabulario, sino la <strong>gramática</strong>:
        el pronombre reflexivo (me/je/zich/ons), si va acompañado de un objeto, y el sujeto.
      </p>
      <div className="theory-table">
        <div className="theory-row">
          <span className="theory-verb">iemand … voor</span>
          <span className="theory-desc">
            Sin reflexivo, con objeto (+ «aan …») → <strong>presentar a alguien</strong>
            <br /><em className="theory-eg">Ik stel mijn collega aan je voor.</em>
          </span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">zich … voor</span>
          <span className="theory-desc">
            Reflexivo solo, sin objeto → <strong>presentarse</strong>
            <br /><em className="theory-eg">Mag ik me even voorstellen?</em>
          </span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">zich iets … voor</span>
          <span className="theory-desc">
            Reflexivo <strong>+</strong> objeto → <strong>imaginar</strong>
            <br /><em className="theory-eg">Ik kan me dat goed voorstellen.</em>
          </span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">… voor (dat/om)</span>
          <span className="theory-desc">
            Sin reflexivo + «dat…/om… te…» → <strong>proponer</strong>
            <br /><em className="theory-eg">Ik stel voor dat we beginnen.</em>
          </span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">iets stelt … voor</span>
          <span className="theory-desc">
            El sujeto es una cosa → <strong>representar</strong>; en «niet veel voorstellen» → <strong>valer poco</strong>
            <br /><em className="theory-eg">Wat stelt dit schilderij voor?</em>
          </span>
        </div>
      </div>
      <p className="theory-intro">
        Recuerda que el reflexivo cambia con el sujeto:
        <strong> ik → me, jij → je, hij/zij/u → zich, wij → ons</strong>.
      </p>
    </div>
  ) : (
    <div className="theory-section">
      <p className="theory-intro">
        <strong>voorstellen</strong> is a separable verb with several meanings.
        What decides which one applies isn't vocabulary but <strong>grammar</strong>:
        the reflexive pronoun (me/je/zich/ons), whether it is joined by an object, and the subject.
      </p>
      <div className="theory-table">
        <div className="theory-row">
          <span className="theory-verb">iemand … voor</span>
          <span className="theory-desc">
            No reflexive, with an object (+ "aan …") → <strong>introduce someone</strong>
            <br /><em className="theory-eg">Ik stel mijn collega aan je voor.</em>
          </span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">zich … voor</span>
          <span className="theory-desc">
            Reflexive alone, no object → <strong>introduce oneself</strong>
            <br /><em className="theory-eg">Mag ik me even voorstellen?</em>
          </span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">zich iets … voor</span>
          <span className="theory-desc">
            Reflexive <strong>+</strong> object → <strong>imagine</strong>
            <br /><em className="theory-eg">Ik kan me dat goed voorstellen.</em>
          </span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">… voor (dat/om)</span>
          <span className="theory-desc">
            No reflexive + "dat…/om… te…" → <strong>suggest / propose</strong>
            <br /><em className="theory-eg">Ik stel voor dat we beginnen.</em>
          </span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">iets stelt … voor</span>
          <span className="theory-desc">
            A thing is the subject → <strong>represent</strong>; in "niet veel voorstellen" → <strong>be worth little</strong>
            <br /><em className="theory-eg">Wat stelt dit schilderij voor?</em>
          </span>
        </div>
      </div>
      <p className="theory-intro">
        Remember the reflexive changes with the subject:
        <strong> ik → me, jij → je, hij/zij/u → zich, wij → ons</strong>.
      </p>
    </div>
  );

  return (
    <div className="app">
      <Header backTo="/" score={score} title={ui.voorstellenTitle} />
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
                <span className="wo-rule-badge">{MEANING_LABEL[current.meaning]}</span>
              )}
            </div>
            <p className="word-order-prompt">{ui.voorstellenPrompt}</p>
            <p className="word-order-english">{displayTranslation}</p>
          </div>

          {/* Sentence with blanks */}
          <div className="wo-section">
            <span className="word-section-label">{ui.voorstellenSentenceLabel}</span>
            <div className="sentence-area-box vst-sentence">
              {segments.map((seg, i) => {
                // The blank after segment i fills slot i (there are numBlanks slots).
                const slotPos = i < numBlanks ? slots[i] : undefined;
                return (
                  <span key={i} className="vst-segment">
                    {seg && <span className="vst-text">{seg}</span>}
                    {i < numBlanks && (
                      slotPos != null ? (
                        <button
                          className={`word-chip placed${checked ? (isCorrect ? ' correct' : ' wrong') : ''}`}
                          onClick={() => returnSlot(i)}
                          disabled={checked}
                        >
                          {tokens[slotPos].word}
                        </button>
                      ) : (
                        <span className="vst-blank">_____</span>
                      )
                    )}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Word bank */}
          <div className="wo-section">
            <span className="word-section-label">{ui.voorstellenWordsLabel}</span>
            <div className="word-chips">
              {bankPositions.map(pos => (
                <button
                  key={pos}
                  className="word-chip"
                  onClick={() => placeToken(pos)}
                  disabled={checked}
                >
                  {tokens[pos].word}
                </button>
              ))}
              {bankPositions.length === 0 && !checked && (
                <span className="sentence-placeholder" style={{ fontSize: '0.8rem' }}>
                  {lang === 'es' ? 'Todas las fichas colocadas' : 'All chips placed'}
                </span>
              )}
            </div>
          </div>

          {/* Action row */}
          <div className="input-row">
            {!checked && (
              <button
                className="hint-btn"
                onClick={clear}
                disabled={slots.every(s => s === null)}
              >
                {ui.wordOrderClear}
              </button>
            )}
            <button
              className="submit-btn"
              style={{ marginLeft: 'auto' }}
              onClick={checked ? next : check}
              disabled={!checked && slots.some(s => s === null)}
            >
              {checked ? ui.next : ui.check}
            </button>
          </div>

          {/* Result feedback */}
          {checked && (
            <div className={`result-feedback ${isCorrect ? 'success' : 'error'}`}>
              <p className="result-message">
                {isCorrect ? (
                  lang === 'es'
                    ? <>¡Correcto! <strong>{current.dutch}</strong></>
                    : <>Correct! <strong>{current.dutch}</strong></>
                ) : (
                  lang === 'es'
                    ? <>Incorrecto. La respuesta correcta es: <strong>{current.dutch}</strong></>
                    : <>Wrong. The correct answer is: <strong>{current.dutch}</strong></>
                )}
                <br />
                <span className="result-tip">{explanation}</span>
              </p>
              <ShareScore score={score} title={ui.voorstellenTitle} />
              <div className="wo-result-footer">
                <SpeakButton key={index} text={() => current.dutch} />
                <button className="next-btn" onClick={next}>{ui.next}</button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
