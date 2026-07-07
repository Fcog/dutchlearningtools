import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { useUI } from '../i18n/ui';

const KINDS = [
  { kind: 'inflection', icon: '📐' },
  { kind: 'vocab',      icon: '🔤' },
  { kind: 'degree',     icon: '📈' },
  { kind: 'opposite',   icon: '↔️' },
] as const;

export default function AdjectivesHubPage() {
  const ui = useUI();

  const meta: Record<string, { name: string; desc: string }> = {
    inflection: { name: ui.adjInflectionName, desc: ui.adjInflectionDesc },
    vocab:      { name: ui.adjVocabName,      desc: ui.adjVocabDesc },
    degree:     { name: ui.adjDegreeName,     desc: ui.adjDegreeDesc },
    opposite:   { name: ui.adjOppositeName,   desc: ui.adjOppositeDesc },
  };

  return (
    <div className="app">
      <Header backTo="/" title={ui.adjectivesTitle} />
      <main className="main home-main">
        <div className="home-hero">
          <h2 className="home-title">{ui.adjectivesTitle}</h2>
          <p className="home-subtitle">{ui.adjectivesHubSubtitle}</p>
        </div>

        <div className="module-grid">
          {KINDS.map(({ kind, icon }) => (
            <Link key={kind} to={`/adjectives/${kind}`} className="module-card">
              <div className="module-icon">{icon}</div>
              <div className="module-body">
                <h3 className="module-name">{meta[kind].name}</h3>
                <p className="module-desc">{meta[kind].desc}</p>
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
