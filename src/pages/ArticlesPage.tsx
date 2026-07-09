import { useState, useCallback } from 'react';
import { Header } from '../components/Header';
import { TheoryPanel } from '../components/TheoryPanel';
import { LoadingScreen } from '../components/LoadingScreen';
import { SpeakButton } from '../components/SpeakButton';
import { useAppData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { useUI } from '../i18n/ui';
import { useProgress } from '../hooks/useProgress';
import { useAdvanceOnEnter } from '../hooks/useAdvanceOnEnter';
import { useExerciseDeck } from '../hooks/useExerciseDeck';
import { ShareScore } from '../components/ShareScore';
import type { Article } from '../data/articleNouns';
import type { Phase } from '../types';

const ARTICLES: Article[] = ['de', 'het'];

export default function ArticlesPage() {
  const { articleNouns, loading, error } = useAppData();
  const [index, advance] = useExerciseDeck(articleNouns.length);
  const [phase, setPhase] = useState<Phase>('active');
  const [selected, setSelected] = useState<Article | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const { lang } = useLanguage();
  const ui = useUI();
  const { recordAnswer } = useProgress();

  const current = articleNouns[index];
  const isCorrect = selected !== null && !!current && selected === current.article;

  const pick = useCallback((article: Article) => {
    if (phase !== 'active' || !current) return;
    const correct = article === current.article;
    setSelected(article);
    setPhase('result');
    setScore(s => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
    recordAnswer(current.id, 'article', correct);
  }, [phase, current, recordAnswer]);

  const next = useCallback(() => {
    advance();
    setPhase('active');
    setSelected(null);
  }, [advance]);

  useAdvanceOnEnter(phase === 'result', next);

  // Early returns after all hooks (keeps hook order stable on direct load).
  if (loading || error) return <LoadingScreen error={error} />;
  if (!current) return <LoadingScreen error="No article nouns found." />;

  const displayTranslation = lang === 'es'
    ? (current.translations?.es ?? current.english)
    : current.english;

  const tip = lang === 'es' ? (current.tipEs ?? current.tip) : current.tip;

  const theoryContent = lang === 'es' ? (
    <div className="theory-section">
      <p className="theory-intro">
        El neerlandés tiene dos artículos determinados: <strong>de</strong> (género común)
        y <strong>het</strong> (género neutro). Aproximadamente el 75 % de los sustantivos
        son <em>de</em>. Algunas terminaciones lo indican claramente.
      </p>
      <div className="theory-table">
        <div className="theory-row">
          <span className="theory-verb de-label">de</span>
          <span className="theory-desc">
            Terminaciones fiables: <strong>-ing</strong> (mening), <strong>-heid</strong> (vrijheid),
            {' '}<strong>-teit</strong> (kwaliteit), <strong>-ie / -atie</strong> (politie, situatie),
            {' '}<strong>-schap</strong> (vriendschap), <strong>-aar / -er</strong> (leraar, bakker).
            <br />Personas con género natural (man, vrouw, leraar).
          </span>
        </div>
        <div className="theory-row">
          <span className="theory-verb het-label">het</span>
          <span className="theory-desc">
            Terminaciones fiables: todos los <strong>diminutivos</strong> (-je), prefijo <strong>ge-</strong> (gebouw, geluid),
            {' '}<strong>-um</strong> (museum), <strong>-ment</strong> (document).
            <br />Infinitivos usados como sustantivos (het lopen, het eten).
          </span>
        </div>
      </div>
    </div>
  ) : (
    <div className="theory-section">
      <p className="theory-intro">
        Dutch has two definite articles: <strong>de</strong> (common gender) and{' '}
        <strong>het</strong> (neuter gender). About 75 % of nouns are <em>de</em>.
        Some endings are reliable clues.
      </p>
      <div className="theory-table">
        <div className="theory-row">
          <span className="theory-verb de-label">de</span>
          <span className="theory-desc">
            Reliable endings: <strong>-ing</strong> (mening), <strong>-heid</strong> (vrijheid),
            {' '}<strong>-teit</strong> (kwaliteit), <strong>-ie / -atie</strong> (politie, situatie),
            {' '}<strong>-schap</strong> (vriendschap), <strong>-aar / -er</strong> (leraar, bakker).
            <br />Nouns for people with natural gender (man, vrouw, leraar).
          </span>
        </div>
        <div className="theory-row">
          <span className="theory-verb het-label">het</span>
          <span className="theory-desc">
            Reliable endings: all <strong>diminutives</strong> (-je), <strong>ge-</strong> prefix (gebouw, geluid),
            {' '}<strong>-um</strong> (museum), <strong>-ment</strong> (document).
            <br />Infinitives used as nouns (het lopen, het eten).
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="app">
      <Header backTo="/" score={score} title={ui.articlesTitle} />
      <main className="main">
        <TheoryPanel>{theoryContent}</TheoryPanel>

        <div className="exercise">
          <div className="article-card">
            <div className="article-card-top">
              <span className={`level-badge level-badge-${current.level.toLowerCase()}`}>
                {current.level}
              </span>
              <SpeakButton key={index} text={() => (phase === 'result' ? `${current.article} ${current.noun}` : current.noun)} />
            </div>
            <div className="article-prompt">
              {lang === 'es' ? '¿Cuál es el artículo?' : 'Which article?'}
            </div>
            <div className="article-noun">
              {phase === 'result' ? (
                <><span className={`article-answer ${isCorrect ? 'correct' : 'wrong'}`}>{current.article}</span> {current.noun}</>
              ) : (
                <><span className="article-blank">___</span> {current.noun}</>
              )}
            </div>
            <div className="article-english">{displayTranslation}</div>
          </div>

          <div className="article-btn-grid">
            {ARTICLES.map(article => {
              let cls = 'article-btn';
              if (phase === 'result') {
                if (article === current.article) cls += ' correct';
                else if (article === selected)   cls += ' wrong';
                else                             cls += ' dim';
              }
              return (
                <button
                  key={article}
                  className={cls}
                  onClick={() => pick(article)}
                  disabled={phase === 'result'}
                >
                  {article}
                </button>
              );
            })}
          </div>

          {phase === 'result' && (
            <div className={`result-feedback ${isCorrect ? 'success' : 'error'}`}>
              <p className="result-message">
                {isCorrect ? (
                  lang === 'es'
                    ? <>¡Correcto! Es <strong>{current.article} {current.noun}</strong>.</>
                    : <>Correct! It's <strong>{current.article} {current.noun}</strong>.</>
                ) : (
                  lang === 'es'
                    ? <>Incorrecto. Es <strong>{current.article} {current.noun}</strong>, no <strong>{selected} {current.noun}</strong>.</>
                    : <>Wrong. It's <strong>{current.article} {current.noun}</strong>, not <strong>{selected} {current.noun}</strong>.</>
                )}
                {tip && <><br /><span className="result-tip">{tip}</span></>}
              </p>
              <ShareScore score={score} title={ui.articlesTitle} onNext={next} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
