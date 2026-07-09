import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { useUI } from '../i18n/ui';
import { GUIDES } from '../data/guides';

export default function GuidesIndexPage() {
  const ui = useUI();
  return (
    <div className="app">
      <Header backTo="/" title={ui.guidesTitle} />
      <main className="main home-main">
        <div className="home-hero">
          <h2 className="home-title">{ui.guidesTitle}</h2>
          <p className="home-subtitle">{ui.guidesSubtitle}</p>
        </div>
        <div className="module-grid">
          {GUIDES.map((g) => (
            <Link key={g.slug} to={`/guide/${g.slug}`} className="module-card">
              <div className="module-icon">📖</div>
              <div className="module-body">
                <h3 className="module-name">{g.title}</h3>
                <p className="module-desc">{g.description}</p>
              </div>
              <span className="module-arrow">→</span>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
