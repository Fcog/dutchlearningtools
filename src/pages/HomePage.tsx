import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { NewsletterCta } from '../components/NewsletterCta';
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
        <NewsletterCta />
        <div className="home-hero">
          <h2 className="home-title">{ui.practiceQuestion}</h2>
          <p className="home-subtitle">{ui.chooseTopic}</p>
        </div>

        <div className="module-grid">
          <Link to="/mix" className="module-card module-card-featured">
            <div className="module-icon">🎲</div>
            <div className="module-body">
              <h3 className="module-name">{ui.mixName}</h3>
              <p className="module-desc">{ui.mixDesc}</p>
            </div>
            <span className="module-arrow">→</span>
          </Link>

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

          <Link to="/directional-adverbs" className="module-card">
            <div className="module-icon">🧭</div>
            <div className="module-body">
              <h3 className="module-name">{ui.directionalAdverbsName}</h3>
              <p className="module-desc">{ui.directionalAdverbsDesc}</p>
              <StatsLine type="directional" />
            </div>
            <span className="module-arrow">→</span>
          </Link>

          <Link to="/from-to" className="module-card">
            <div className="module-icon">↔️</div>
            <div className="module-body">
              <h3 className="module-name">{ui.fromToName}</h3>
              <p className="module-desc">{ui.fromToDesc}</p>
              <StatsLine type="from-to" />
            </div>
            <span className="module-arrow">→</span>
          </Link>

          <Link to="/articles" className="module-card">
            <div className="module-icon">🏷️</div>
            <div className="module-body">
              <h3 className="module-name">{ui.articlesName}</h3>
              <p className="module-desc">{ui.articlesDesc}</p>
              <StatsLine type="article" />
            </div>
            <span className="module-arrow">→</span>
          </Link>

          <Link to="/word-order" className="module-card">
            <div className="module-icon">🔀</div>
            <div className="module-body">
              <h3 className="module-name">{ui.wordOrderName}</h3>
              <p className="module-desc">{ui.wordOrderDesc}</p>
              <StatsLine type="word-order" />
            </div>
            <span className="module-arrow">→</span>
          </Link>

          <Link to="/plurals" className="module-card">
            <div className="module-icon">📚</div>
            <div className="module-body">
              <h3 className="module-name">{ui.pluralsName}</h3>
              <p className="module-desc">{ui.pluralsDesc}</p>
              <StatsLine type="plural" />
            </div>
            <span className="module-arrow">→</span>
          </Link>

          <Link to="/voorstellen" className="module-card">
            <div className="module-icon">🙋</div>
            <div className="module-body">
              <h3 className="module-name">{ui.voorstellenName}</h3>
              <p className="module-desc">{ui.voorstellenDesc}</p>
              <StatsLine type="voorstellen" />
            </div>
            <span className="module-arrow">→</span>
          </Link>

          <Link to="/negation" className="module-card">
            <div className="module-icon">🚫</div>
            <div className="module-body">
              <h3 className="module-name">{ui.negationName}</h3>
              <p className="module-desc">{ui.negationDesc}</p>
              <StatsLine type="negation" />
            </div>
            <span className="module-arrow">→</span>
          </Link>

          <Link to="/prepositions" className="module-card">
            <div className="module-icon">🔗</div>
            <div className="module-body">
              <h3 className="module-name">{ui.prepositionsName}</h3>
              <p className="module-desc">{ui.prepositionsDesc}</p>
              <StatsLine type="preposition" />
            </div>
            <span className="module-arrow">→</span>
          </Link>

          <Link to="/time-prepositions" className="module-card">
            <div className="module-icon">🕐</div>
            <div className="module-body">
              <h3 className="module-name">{ui.timePrepName}</h3>
              <p className="module-desc">{ui.timePrepDesc}</p>
              <StatsLine type="time-prep" />
            </div>
            <span className="module-arrow">→</span>
          </Link>

          <Link to="/expressions" className="module-card">
            <div className="module-icon">💬</div>
            <div className="module-body">
              <h3 className="module-name">{ui.expressionsName}</h3>
              <p className="module-desc">{ui.expressionsDesc}</p>
              <StatsLine type="expression" />
            </div>
            <span className="module-arrow">→</span>
          </Link>

          <Link to="/adjectives" className="module-card">
            <div className="module-icon">📐</div>
            <div className="module-body">
              <h3 className="module-name">{ui.adjectivesName}</h3>
              <p className="module-desc">{ui.adjectivesDesc}</p>
              <StatsLine type="adjective" />
            </div>
            <span className="module-arrow">→</span>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
