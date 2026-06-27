import { useState, useCallback, useMemo, useEffect } from 'react';
import { Header } from '../components/Header';
import { TheoryPanel } from '../components/TheoryPanel';
import { LoadingScreen } from '../components/LoadingScreen';
import { useAppData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { useUI } from '../i18n/ui';
import { useProgress } from '../hooks/useProgress';
import { useAdvanceOnEnter } from '../hooks/useAdvanceOnEnter';

interface Token { word: string; id: number }

function shuffle(arr: Token[]): Token[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function randomIndex(exclude: number, total: number) {
  let i: number;
  do { i = Math.floor(Math.random() * total); } while (i === exclude && total > 1);
  return i;
}

function speakText(text: string, onEnd: () => void) {
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'nl-NL';
  u.rate = 0.9;
  u.onend = onEnd;
  u.onerror = onEnd;
  window.speechSynthesis.speak(u);
}

export default function WordOrderPage() {
  const { wordOrderSentences, loading, error } = useAppData();
  const [index, setIndex] = useState(0);
  const [bank, setBank] = useState<number[]>([]);   // positions in tokens[]
  const [placed, setPlaced] = useState<number[]>([]); // positions in tokens[], in placement order
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [speaking, setSpeaking] = useState(false);
  const { lang } = useLanguage();
  const ui = useUI();
  const { recordAnswer } = useProgress();

  if (loading || error) return <LoadingScreen error={error} />;

  const current = wordOrderSentences[index];

  const tokens = useMemo<Token[]>(() => {
    const base = current.words.map((word, i) => ({ word, id: i }));
    let shuffled = shuffle(base);
    while (
      shuffled.length > 1 &&
      shuffled.map(t => t.word).join(' ') === current.words.join(' ')
    ) {
      shuffled = shuffle(shuffled);
    }
    return shuffled;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current.id]);

  useEffect(() => {
    setBank(tokens.map((_, i) => i));
    setPlaced([]);
    setChecked(false);
    setIsCorrect(false);
    setSpeaking(false);
  }, [tokens]);

  useEffect(() => {
    return () => { window.speechSynthesis.cancel(); };
  }, [index]);

  const placeToken = useCallback((pos: number) => {
    if (checked) return;
    setBank(b => b.filter(p => p !== pos));
    setPlaced(p => [...p, pos]);
  }, [checked]);

  const returnToken = useCallback((pos: number) => {
    if (checked) return;
    setPlaced(p => p.filter(p2 => p2 !== pos));
    setBank(b => [...b, pos]);
  }, [checked]);

  const clear = useCallback(() => {
    if (checked) return;
    setPlaced([]);
    setBank(tokens.map((_, i) => i));
  }, [checked, tokens]);

  const check = useCallback(() => {
    if (checked || placed.length !== tokens.length) return;
    const userSentence = placed.map(pos => tokens[pos].word).join(' ');
    const correct = userSentence === current.words.join(' ');
    setIsCorrect(correct);
    setChecked(true);
    setScore(s => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
    recordAnswer(current.id, 'word-order', correct);
  }, [checked, placed, tokens, current, recordAnswer]);

  const next = useCallback(() => {
    window.speechSynthesis.cancel();
    // Clear immediately so the intermediate render (before useEffect fires) is safe.
    // tokens recomputes synchronously when index changes; placed must be empty by then.
    setPlaced([]);
    setBank([]);
    setChecked(false);
    setIsCorrect(false);
    setSpeaking(false);
    setIndex(i => randomIndex(i, wordOrderSentences.length));
  }, [wordOrderSentences.length]);

  useAdvanceOnEnter(checked, next);

  const handleSpeak = useCallback(() => {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    setSpeaking(true);
    speakText(current.words.join(' '), () => setSpeaking(false));
  }, [speaking, current.words]);

  const displayTranslation = lang === 'es'
    ? (current.translations?.es ?? current.english)
    : current.english;

  const explanation = lang === 'es'
    ? (current.explanationEs ?? current.explanation)
    : current.explanation;

  const RULE_LABEL: Record<string, string> = {
    'v2':          lang === 'es' ? 'Regla V2'              : 'V2 rule',
    'v2-fronting': lang === 'es' ? 'V2 + anteposición'     : 'V2 + fronting',
    'subordinate': lang === 'es' ? 'Oración subordinada'   : 'Subordinate clause',
    'modal':       lang === 'es' ? 'Verbo modal'           : 'Modal verb',
    'perfect':     lang === 'es' ? 'Pretérito perfecto'    : 'Perfect tense',
  };

  const theoryContent = lang === 'es' ? (
    <div className="theory-section">
      <p className="theory-intro">
        En neerlandés, el orden de las palabras sigue reglas estrictas. La regla más importante
        es la <strong>regla V2</strong>: en una oración principal, el verbo siempre ocupa
        la <strong>segunda posición</strong>.
      </p>
      <div className="theory-table">
        <div className="theory-row">
          <span className="theory-verb">V2</span>
          <span className="theory-desc">
            El verbo finito siempre va en 2ª posición en la oración principal.
            {' '}<em>Ik eet brood. / Elke dag eet ik brood.</em>
          </span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">Anteposición</span>
          <span className="theory-desc">
            Al anteponer un adverbio o frase, el verbo sigue en 2ª posición y el sujeto se desplaza a 3ª (inversión).
            {' '}<em>Morgen ga ik naar school.</em>
          </span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">Subordinada</span>
          <span className="theory-desc">
            Después de conjunciones subordinantes (<em>dat, omdat, als, of, wanneer, toen, waarom…</em>),
            el verbo va al <strong>final</strong> de la oración subordinada.
            {' '}<em>Ik weet dat hij ziek is.</em>
          </span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">Modal + inf.</span>
          <span className="theory-desc">
            El verbo modal ocupa la 2ª posición (principal) o el final (subordinada).
            El infinitivo siempre va después del modal.
            {' '}<em>Ik kan zwemmen. / dat hij kan zwemmen.</em>
          </span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">Perfecto</span>
          <span className="theory-desc">
            El auxiliar (hebben/zijn) ocupa la 2ª posición (principal) o va al final (subordinada).
            El participio pasado siempre va después del auxiliar.
            {' '}<em>Ik heb gegeten. / dat hij gegeten heeft.</em>
          </span>
        </div>
      </div>
    </div>
  ) : (
    <div className="theory-section">
      <p className="theory-intro">
        Dutch word order follows strict rules. The most important is the <strong>V2 rule</strong>:
        in a main clause, the finite verb always occupies the <strong>second position</strong>.
      </p>
      <div className="theory-table">
        <div className="theory-row">
          <span className="theory-verb">V2</span>
          <span className="theory-desc">
            The finite verb is always in 2nd position in a main clause.
            {' '}<em>Ik eet brood. / Elke dag eet ik brood.</em>
          </span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">Fronting</span>
          <span className="theory-desc">
            Any element can be moved to 1st position for emphasis. The verb stays in 2nd position
            and the subject shifts to 3rd (inversion).{' '}
            <em>Morgen ga ik naar school.</em>
          </span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">Subordinate</span>
          <span className="theory-desc">
            After subordinating conjunctions (<em>dat, omdat, als, of, wanneer, toen, waarom…</em>),
            the finite verb moves to the <strong>end</strong> of the clause.{' '}
            <em>Ik weet dat hij ziek is.</em>
          </span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">Modal + inf.</span>
          <span className="theory-desc">
            The modal verb takes 2nd position (main) or end position (subordinate).
            The infinitive always follows the modal.{' '}
            <em>Ik kan zwemmen. / dat hij kan zwemmen.</em>
          </span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">Perfect</span>
          <span className="theory-desc">
            The auxiliary (hebben/zijn) takes 2nd position (main) or end position (subordinate).
            The past participle always follows the auxiliary.{' '}
            <em>Ik heb gegeten. / dat hij gegeten heeft.</em>
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="app">
      <Header backTo="/" score={score} title={ui.wordOrderTitle} />
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
                <span className="wo-rule-badge">{RULE_LABEL[current.rule]}</span>
              )}
            </div>
            <p className="word-order-prompt">{ui.wordOrderPrompt}</p>
            <p className="word-order-english">{displayTranslation}</p>
          </div>

          {/* Word bank */}
          <div className="wo-section">
            <span className="word-section-label">{ui.wordOrderWordsLabel}</span>
            <div className="word-chips">
              {bank.map(pos => (
                <button
                  key={pos}
                  className="word-chip"
                  onClick={() => placeToken(pos)}
                  disabled={checked}
                >
                  {tokens[pos].word}
                </button>
              ))}
              {bank.length === 0 && !checked && (
                <span className="sentence-placeholder" style={{ fontSize: '0.8rem' }}>
                  {lang === 'es' ? 'Todas las palabras colocadas' : 'All words placed'}
                </span>
              )}
            </div>
          </div>

          {/* Sentence builder */}
          <div className="wo-section">
            <span className="word-section-label">{ui.wordOrderSentenceLabel}</span>
            <div className="sentence-area-box">
              {placed.length === 0 ? (
                <span className="sentence-placeholder">{ui.wordOrderPlaceholder}</span>
              ) : (
                placed.map((pos, idx) => (
                  <button
                    key={`${pos}-${idx}`}
                    className={`word-chip placed${checked ? (isCorrect ? ' correct' : ' wrong') : ''}`}
                    onClick={() => returnToken(pos)}
                    disabled={checked}
                  >
                    {tokens[pos].word}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Action row */}
          <div className="input-row">
            {!checked && (
              <button
                className="hint-btn"
                onClick={clear}
                disabled={placed.length === 0}
              >
                {ui.wordOrderClear}
              </button>
            )}
            <button
              className="submit-btn"
              style={{ marginLeft: 'auto' }}
              onClick={checked ? next : check}
              disabled={!checked && placed.length !== tokens.length}
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
                    ? <>¡Correcto! <strong>{current.words.join(' ')}</strong></>
                    : <>Correct! <strong>{current.words.join(' ')}</strong></>
                ) : (
                  lang === 'es'
                    ? <>Incorrecto. La respuesta correcta es: <strong>{current.words.join(' ')}</strong></>
                    : <>Wrong. The correct order is: <strong>{current.words.join(' ')}</strong></>
                )}
                <br />
                <span className="result-tip">{explanation}</span>
              </p>
              <div className="wo-result-footer">
                <button
                  className={`speak-btn${speaking ? ' speaking' : ''}`}
                  onClick={handleSpeak}
                  aria-label={speaking ? ui.stop : ui.readAloud}
                  title={speaking ? ui.stop : ui.readAloud}
                >
                  {speaking ? '■' : '🔊'}
                </button>
                <button className="next-btn" onClick={next}>{ui.next}</button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
