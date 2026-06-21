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
          <Link to="/verbs-conjugation" className="module-card">
            <div className="module-icon">📝</div>
            <div className="module-body">
              <h3 className="module-name">Verb Conjugation</h3>
              <p className="module-desc">
                Practice present, simple past, and present perfect tense across 269 Dutch verbs.
              </p>
            </div>
            <span className="module-arrow">→</span>
          </Link>

          <Link to="/separable-verbs" className="module-card">
            <div className="module-icon">✂️</div>
            <div className="module-body">
              <h3 className="module-name">Separable Verbs</h3>
              <p className="module-desc">
                Master when to split or combine the prefix across main clauses, perfect, subordinate and modal constructions.
              </p>
            </div>
            <span className="module-arrow">→</span>
          </Link>

          <Link to="/positional-verbs" className="module-card">
            <div className="module-icon">📍</div>
            <div className="module-body">
              <h3 className="module-name">Position Verbs</h3>
              <p className="module-desc">
                Learn when to use staan, liggen, zitten and zijn to describe where things are.
              </p>
            </div>
            <span className="module-arrow">→</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
