import { useNavigate } from 'react-router-dom'

function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <main className="container" role="main">
      <nav className="breadcrumb">
        <button onClick={() => navigate('/')}>🏠 Dutch Learning Tools</button>
      </nav>
      
      <section className="hero" style={{ textAlign: 'center', padding: '60px 20px', background: 'white' }}>
        <div style={{ fontSize: '6em', marginBottom: '20px' }}>🤔</div>
        <h1 style={{ fontSize: '3em', color: '#333', marginBottom: '20px' }}>
          404 - Page Not Found
        </h1>
        <p style={{ fontSize: '1.2em', color: '#666', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
          Oops! This page doesn't exist. The URL you're looking for might have been moved, deleted, or you may have typed it incorrectly.
        </p>
        
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button 
            className="router-link"
            onClick={() => navigate('/')}
            style={{ 
              padding: '15px 30px',
              fontSize: '1.1em',
              minWidth: '200px'
            }}
          >
            🏠 Go Home
          </button>
          
          <button 
            className="router-link"
            onClick={() => navigate('/articles')}
            style={{ 
              padding: '15px 30px',
              fontSize: '1.1em',
              minWidth: '200px'
            }}
          >
            📚 Try Articles Tool
          </button>
        </div>
      </section>

      <section style={{ marginTop: '40px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5em', color: '#333', marginBottom: '20px' }}>
          Popular Dutch Learning Tools
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '20px',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <div 
            className="tool-card"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/articles')}
          >
            <span className="tool-icon" style={{ fontSize: '2em' }}>📚</span>
            <h3>Dutch Articles & Nouns</h3>
            <p>Learn Dutch articles (de & het) with daily word practice.</p>
          </div>
          
          <div className="tool-card coming-soon">
            <span className="tool-icon" style={{ fontSize: '2em' }}>🎯</span>
            <h3>Verb Conjugation</h3>
            <p>Master Dutch verb conjugations with interactive exercises.</p>
            <span style={{ color: '#999', fontSize: '0.9em' }}>Coming Soon</span>
          </div>
          
          <div className="tool-card coming-soon">
            <span className="tool-icon" style={{ fontSize: '2em' }}>🗣️</span>
            <h3>Pronunciation Guide</h3>
            <p>Learn proper Dutch pronunciation with audio guides.</p>
            <span style={{ color: '#999', fontSize: '0.9em' }}>Coming Soon</span>
          </div>
        </div>
      </section>

      <footer className="footer" style={{ marginTop: '50px' }}>
        <p>
          🇳🇱 Free Dutch learning tools for everyone. Continue your learning journey!
        </p>
      </footer>
    </main>
  )
}

export default NotFoundPage