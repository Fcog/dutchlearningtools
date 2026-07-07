import { useState, useCallback, useEffect, useRef } from 'react';
import { Header } from '../components/Header';
import { TheoryPanel } from '../components/TheoryPanel';
import { LoadingScreen } from '../components/LoadingScreen';
import { useAppData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { useUI } from '../i18n/ui';
import { useProgress } from '../hooks/useProgress';
import { useAdvanceOnEnter } from '../hooks/useAdvanceOnEnter';
import { useRandomStartIndex } from '../hooks/useRandomStartIndex';
import { SpeakButton } from '../components/SpeakButton';
import type { Phase } from '../types';

function randomIndex(exclude: number, total: number) {
  let i: number;
  do { i = Math.floor(Math.random() * total); } while (i === exclude && total > 1);
  return i;
}

function normalize(s: string) {
  return s.trim().toLowerCase();
}

export default function PluralsPage() {
  const { pluralNouns, loading, error } = useAppData();
  const [index, setIndex] = useRandomStartIndex(pluralNouns.length);
  const [phase, setPhase] = useState<Phase>('active');
  const [input, setInput] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [showHint, setShowHint] = useState(false);
  const { lang } = useLanguage();
  const ui = useUI();
  const { recordAnswer } = useProgress();
  const inputRef = useRef<HTMLInputElement>(null);

  if (loading || error) return <LoadingScreen error={error} />;

  const current = pluralNouns[index];

  const check = useCallback(() => {
    if (phase !== 'active' || !input.trim()) return;
    const correct = normalize(input) === normalize(current.plural);
    setIsCorrect(correct);
    setPhase('result');
    setScore(s => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
    recordAnswer(current.id, 'plural', correct);
  }, [phase, input, current.plural, current.id, recordAnswer]);

  const next = useCallback(() => {
    setIndex(i => randomIndex(i, pluralNouns.length));
    setPhase('active');
    setInput('');
    setIsCorrect(false);
    setShowHint(false);
  }, [pluralNouns.length]);

  useAdvanceOnEnter(phase === 'result', next);

  useEffect(() => {
    if (phase === 'active') inputRef.current?.focus();
  }, [phase, index]);

  const displayTranslation = lang === 'es'
    ? (current.translations?.es ?? current.english)
    : current.english;

  const tip = lang === 'es' ? (current.tipEs ?? current.tip) : current.tip;

  const RULE_LABEL: Record<string, string> = {
    en:        lang === 'es' ? 'termina en -en'         : 'ends in -en',
    s:         lang === 'es' ? 'termina en -s'          : 'ends in -s',
    eren:      lang === 'es' ? 'termina en -eren'       : 'ends in -eren',
    irregular: lang === 'es' ? 'plural irregular'       : 'irregular plural',
  };

  const theoryContent = lang === 'es' ? (
    <div className="theory-section">
      <p className="theory-intro">
        El neerlandés tiene cuatro tipos principales de plural. La mayoría de los sustantivos
        usan <strong>-en</strong>, con algunas reglas de ortografía. Un grupo más pequeño usa
        <strong> -s</strong> y un puñado usa <strong>-eren</strong> o formas irregulares.
      </p>
      <div className="theory-table">
        <div className="theory-row">
          <span className="theory-verb">-en</span>
          <span className="theory-desc">
            El más común. Reglas: <strong>vocal corta + consonante → doble consonante</strong> (bed→bedden);
            {' '}<strong>aa/oo/uu/ee → a/o/u/e</strong> en sílaba abierta (jaar→jaren, boom→bomen);
            {' '}<strong>-s → -z</strong> (huis→huizen); <strong>-f → -v</strong> (brief→brieven).
          </span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">-s</span>
          <span className="theory-desc">
            Terminaciones átonas <strong>-el, -er, -em, -en</strong> (tafel→tafels, kamer→kamers);
            {' '}todos los <strong>diminutivos</strong> en -je (meisje→meisjes);
            {' '}sustantivos terminados en vocal <strong>-o, -u, -a, -i</strong> usan <strong>-'s</strong> (auto→auto's).
          </span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">-eren</span>
          <span className="theory-desc">
            Un pequeño grupo fijo: <em>kind→kinderen, ei→eieren, lied→liederen, blad→bladeren,
            rund→runderen, kalf→kalveren, lam→lammeren.</em>
          </span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">irregular</span>
          <span className="theory-desc">
            Algunos sustantivos cambian la vocal: <em>stad→steden, schip→schepen, lid→leden.</em>
          </span>
        </div>
      </div>
    </div>
  ) : (
    <div className="theory-section">
      <p className="theory-intro">
        Dutch has four main plural patterns. Most nouns use <strong>-en</strong> with some spelling
        rules. A smaller group takes <strong>-s</strong>, and a handful use <strong>-eren</strong> or
        fully irregular forms.
      </p>
      <div className="theory-table">
        <div className="theory-row">
          <span className="theory-verb">-en</span>
          <span className="theory-desc">
            Most common. Rules: <strong>short vowel + consonant → double consonant</strong> (bed→bedden);
            {' '}<strong>aa/oo/uu/ee → a/o/u/e</strong> in open syllable (jaar→jaren, boom→bomen);
            {' '}<strong>-s → -z</strong> (huis→huizen); <strong>-f → -v</strong> (brief→brieven).
          </span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">-s</span>
          <span className="theory-desc">
            Unstressed endings <strong>-el, -er, -em, -en</strong> (tafel→tafels, kamer→kamers);
            {' '}all <strong>diminutives</strong> in -je (meisje→meisjes);
            {' '}nouns ending in a vowel <strong>-o, -u, -a, -i</strong> use <strong>-'s</strong> (auto→auto's).
          </span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">-eren</span>
          <span className="theory-desc">
            A fixed small group: <em>kind→kinderen, ei→eieren, lied→liederen, blad→bladeren,
            rund→runderen, kalf→kalveren, lam→lammeren.</em>
          </span>
        </div>
        <div className="theory-row">
          <span className="theory-verb">irregular</span>
          <span className="theory-desc">
            A few nouns change their stem vowel: <em>stad→steden, schip→schepen, lid→leden.</em>
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="app">
      <Header backTo="/" score={score} title={ui.pluralsTitle} />
      <main className="main">
        <TheoryPanel>{theoryContent}</TheoryPanel>

        <div className="exercise">
          <div className="article-card">
            <div className="article-card-top">
              <span className={`level-badge level-badge-${current.level.toLowerCase()}`}>
                {current.level}
              </span>
              <SpeakButton key={index} text={() => (phase === 'result' ? current.plural : `${current.article} ${current.singular}`)} />
            </div>
            <div className="article-prompt">
              {lang === 'es' ? '¿Cuál es el plural?' : 'What is the plural?'}
            </div>
            <div className="article-noun">
              <span className="plural-article">{current.article}</span>{' '}
              {phase === 'result' ? (
                <span className={isCorrect ? 'article-answer correct' : 'article-answer wrong'}>
                  {current.singular}
                </span>
              ) : (
                current.singular
              )}
            </div>
            <div className="article-english">{displayTranslation}</div>
            {phase === 'result' && (
              <div className="plural-result-noun">
                de {current.plural}
              </div>
            )}
          </div>

          {phase === 'active' && (
            <div className="plural-hint-row">
              <button
                className={`hint-btn${showHint ? ' active' : ''}`}
                onClick={() => setShowHint(v => !v)}
              >
                {showHint ? ui.hideHint : ui.showHint}
              </button>
              {showHint && (
                <span className="plural-hint-text">
                  {RULE_LABEL[current.plural_type]}
                </span>
              )}
            </div>
          )}

          <div className="input-row">
            <input
              ref={inputRef}
              className="conj-field"
              type="text"
              placeholder={ui.typePlural}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') check(); }}
              disabled={phase === 'result'}
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
            />
            <button
              className="submit-btn"
              onClick={phase === 'result' ? next : check}
              disabled={phase === 'active' && !input.trim()}
            >
              {phase === 'result' ? ui.next : ui.check}
            </button>
          </div>

          {phase === 'result' && (
            <div className={`result-feedback ${isCorrect ? 'success' : 'error'}`}>
              <p className="result-message">
                {isCorrect ? (
                  lang === 'es'
                    ? <>¡Correcto! El plural es <strong>de {current.plural}</strong>.</>
                    : <>Correct! The plural is <strong>de {current.plural}</strong>.</>
                ) : (
                  lang === 'es'
                    ? <>Incorrecto. El plural de <strong>{current.article} {current.singular}</strong> es <strong>de {current.plural}</strong>.</>
                    : <>Wrong. The plural of <strong>{current.article} {current.singular}</strong> is <strong>de {current.plural}</strong>.</>
                )}
                {tip && <><br /><span className="result-tip">{tip}</span></>}
              </p>
              <button className="next-btn" onClick={next}>{ui.next}</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
