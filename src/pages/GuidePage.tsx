import { useParams, Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { guideBySlug } from '../data/guides';

export default function GuidePage() {
  const { slug } = useParams();
  const guide = guideBySlug(slug);

  if (!guide) {
    return (
      <div className="app">
        <Header backTo="/guides" />
        <main className="main policy-main">
          <p className="account-note">Guide not found.</p>
          <Link to="/guides" className="next-btn" style={{ display: 'inline-block', textDecoration: 'none' }}>Guides →</Link>
        </main>
        <Footer />
      </div>
    );
  }

  // FAQPage structured data → eligible for rich results in Google.
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: guide.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <div className="app">
      <Header backTo="/guides" />
      <main className="main policy-main">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

        <article className="guide">
          <h1 className="guide-title">{guide.title}</h1>
          <p className="guide-intro">{guide.intro}</p>

          <Link to={guide.cta.to} className="guide-cta">{guide.cta.label}</Link>

          {guide.sections.map((s, i) => (
            <section key={i} className="guide-section">
              <h2>{s.heading}</h2>
              {s.paragraphs.map((p, j) => <p key={j}>{p}</p>)}
              {s.examples && (
                <ul className="guide-examples">
                  {s.examples.map((ex, k) => <li key={k}>{ex}</li>)}
                </ul>
              )}
            </section>
          ))}

          <section className="guide-section">
            <h2>Frequently asked questions</h2>
            {guide.faq.map((f, i) => (
              <div key={i} className="guide-faq">
                <h3>{f.q}</h3>
                <p>{f.a}</p>
              </div>
            ))}
          </section>

          <Link to={guide.cta.to} className="guide-cta">{guide.cta.label}</Link>
        </article>
      </main>
      <Footer />
    </div>
  );
}
