import { Link } from 'react-router-dom';
import { Header } from '../components/Header';

export default function HomePage() {
  return (
    <div className="app">
      <Header />
      <main className="main home-main">
        <div className="home-hero">
          <h2 className="home-title">What do you want to practise?</h2>
          <p className="home-subtitle">Choose a topic to start an exercise.</p>
        </div>

        <div className="module-grid">
          <Link to="/verbs" className="module-card">
            <div className="module-icon">📝</div>
            <div className="module-body">
              <h3 className="module-name">Verb Conjugation</h3>
              <p className="module-desc">
                Practice present, simple past, and present perfect tense across 112 Dutch verbs.
              </p>
            </div>
            <span className="module-arrow">→</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
