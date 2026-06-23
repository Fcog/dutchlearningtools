import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { useUI } from '../i18n/ui';

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
            </div>
            <span className="module-arrow">→</span>
          </Link>

          <Link to="/separable-verbs" className="module-card">
            <div className="module-icon">✂️</div>
            <div className="module-body">
              <h3 className="module-name">{ui.separableVerbsName}</h3>
              <p className="module-desc">{ui.separableVerbsDesc}</p>
            </div>
            <span className="module-arrow">→</span>
          </Link>

          <Link to="/positional-verbs" className="module-card">
            <div className="module-icon">📍</div>
            <div className="module-body">
              <h3 className="module-name">{ui.positionVerbsName}</h3>
              <p className="module-desc">{ui.positionVerbsDesc}</p>
            </div>
            <span className="module-arrow">→</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
