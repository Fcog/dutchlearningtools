import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { useUI } from '../i18n/ui';
import { useProgress, type ExerciseType, type ModuleStats } from '../hooks/useProgress';
import { useAuth } from '../context/AuthContext';

function StatsLine({ type }: { type: ExerciseType }) {
  const { fetchModuleStats } = useProgress();
  const { user } = useAuth();
  const [stats, setStats] = useState<ModuleStats | null>(null);

  useEffect(() => {
    if (!user) { setStats(null); return; }
    fetchModuleStats(type).then(setStats);
  }, [user, type]);

  if (!stats || stats.total === 0) return null;

  const pct = Math.round((stats.correct / stats.total) * 100);
  return (
    <p className="module-stats">{stats.total} exercises · {pct}% correct</p>
  );
}

export default function HomePage() {
  const ui = useUI();

  return (
    <div className="app">
      <Header />
      <main className="main home-main">
        <div className="home-hero">
          <h2 className="home-title">{ui.practiceQuestion}</h2>
          <p className="home-subtitle">{ui.chooseTopic}</p>
        </div>

        <div className="module-grid">
          <Link to="/verbs-conjugation" className="module-card">
            <div className="module-icon">📝</div>
            <div className="module-body">
              <h3 className="module-name">{ui.verbConjugationName}</h3>
              <p className="module-desc">{ui.verbConjugationDesc}</p>
              <StatsLine type="verb" />
            </div>
            <span className="module-arrow">→</span>
          </Link>

          <Link to="/separable-verbs" className="module-card">
            <div className="module-icon">✂️</div>
            <div className="module-body">
              <h3 className="module-name">{ui.separableVerbsName}</h3>
              <p className="module-desc">{ui.separableVerbsDesc}</p>
              <StatsLine type="separable" />
            </div>
            <span className="module-arrow">→</span>
          </Link>

          <Link to="/positional-verbs" className="module-card">
            <div className="module-icon">📍</div>
            <div className="module-body">
              <h3 className="module-name">{ui.positionVerbsName}</h3>
              <p className="module-desc">{ui.positionVerbsDesc}</p>
              <StatsLine type="positional" />
            </div>
            <span className="module-arrow">→</span>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
