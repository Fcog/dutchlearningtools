import { useNavigate } from 'react-router-dom'
import PageLayout from '../components/templates/PageLayout'
import Button from '../components/atoms/Button'
import Icon from '../components/atoms/Icon'

function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <PageLayout
      showBreadcrumb
      breadcrumbPage="Page Not Found"
      onHomeClick={() => navigate('/')}
      footer={
        <p>
          🇳🇱 Free Dutch learning tools for everyone. Continue your learning journey!
        </p>
      }
    >
      <div className="container">
        <section className="hero" style={{ textAlign: 'center', padding: '60px 20px', background: 'white' }}>
          <Icon icon="🤔" size="xlarge" style={{ fontSize: '6em', marginBottom: '20px' }} />
          <h1 style={{ fontSize: '3em', color: '#333', marginBottom: '20px' }}>
            404 - Page Not Found
          </h1>
          <p style={{ fontSize: '1.2em', color: '#666', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
            Oops! This page doesn't exist. The URL you're looking for might have been moved, deleted, or you may have typed it incorrectly.
          </p>
          
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              onClick={() => navigate('/')}
              variant="router"
              size="medium"
              style={{ minWidth: '200px' }}
            >
              🏠 Go Home
            </Button>
            
            <Button
              onClick={() => navigate('/articles')}
              variant="router"
              size="medium"
              style={{ minWidth: '200px' }}
            >
              📚 Try Articles Tool
            </Button>
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
              <Icon icon="📚" size="large" className="tool-icon" />
              <h3>Dutch Articles & Nouns</h3>
              <p>Learn Dutch articles (de & het) with daily word practice.</p>
            </div>
            
            <div 
              className="tool-card"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/verbs')}
            >
              <Icon icon="🎯" size="large" className="tool-icon" />
              <h3>Verb Conjugation</h3>
              <p>Master Dutch verb conjugations with interactive exercises.</p>
            </div>
            
            <div className="tool-card coming-soon">
              <Icon icon="🗣️" size="large" className="tool-icon" />
              <h3>Pronunciation Guide</h3>
              <p>Learn proper Dutch pronunciation with audio guides.</p>
              <span style={{ color: '#999', fontSize: '0.9em' }}>Coming Soon</span>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  )
}

export default NotFoundPage