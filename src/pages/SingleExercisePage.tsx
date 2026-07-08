import { useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { LoadingScreen } from '../components/LoadingScreen';
import { useAppData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { useUI } from '../i18n/ui';
import { useProgress } from '../hooks/useProgress';
import { buildMixPool, MixCardRenderer } from '../components/mix/MixCards';
import { TOPIC_LABEL } from './MixPage';

/**
 * Opens one specific exercise, addressed as /exercise/:type/:id — the target of
 * the daily-newsletter "answer on the website" button. Reuses the mix cards so
 * the on-site exercise matches the email. After answering, it hands off to the
 * mixed-practice flow.
 */
export default function SingleExercisePage() {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const ui = useUI();
  const { recordAnswer } = useProgress();

  const {
    verbs, separableVerbSets, positionalExercises, directionalExercises,
    fromToExercises, prepositionExercises, timeExercises, expressionExercises,
    diminutiveExercises, articleNouns, pluralNouns, wordOrderSentences,
    voorstellenExercises, negationExercises, loading, error,
  } = useAppData();

  const pool = useMemo(
    () => buildMixPool({
      verbs, separableVerbSets, positionalExercises, directionalExercises,
      fromToExercises, prepositionExercises, timeExercises, expressionExercises,
      diminutiveExercises, articleNouns, pluralNouns, wordOrderSentences, voorstellenExercises, negationExercises,
    }),
    [verbs, separableVerbSets, positionalExercises, directionalExercises,
     fromToExercises, prepositionExercises, timeExercises, expressionExercises,
     diminutiveExercises, articleNouns, pluralNouns, wordOrderSentences, voorstellenExercises, negationExercises],
  );

  const entry = useMemo(
    () => pool.find((e) => e.progressType === type && e.exerciseId === id),
    [pool, type, id],
  );

  if (loading || error) return <LoadingScreen error={error} />;

  if (!entry) {
    return (
      <div className="app">
        <Header backTo="/" title={ui.mixTitle} />
        <main className="main">
          <div className="exercise">
            <p className="account-note">{ui.exerciseNotFound}</p>
            <Link to="/mix" className="next-btn" style={{ display: 'inline-block', textDecoration: 'none' }}>
              {ui.mixName} →
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const topicLabel = TOPIC_LABEL[entry.topic]?.[lang] ?? entry.topic;
  const handleResult = (correct: boolean) => recordAnswer(entry.exerciseId, entry.progressType, correct);

  return (
    <div className="app">
      <Header backTo="/" title={topicLabel} />
      <main className="main">
        <div className="exercise">
          <div className="mix-topic-badge">{topicLabel}</div>
          <MixCardRenderer entry={entry} onResult={handleResult} onNext={() => navigate('/mix')} />
        </div>
      </main>
    </div>
  );
}
