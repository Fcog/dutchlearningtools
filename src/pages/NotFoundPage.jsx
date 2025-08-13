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
        <section className="hero notfound-hero">
          <Icon icon="🤔" size="xlarge" className="notfound-icon" />
          <h1 className="notfound-title">
            404 - Page Not Found
          </h1>
          <p className="notfound-description">
            Oops! This page doesn't exist. The URL you're looking for might have been moved, deleted, or you may have typed it incorrectly.
          </p>
          
          <div className="notfound-buttons">
            <Button
              onClick={() => navigate('/')}
              variant="router"
              size="medium"
              className="notfound-button"
            >
              🏠 Go Home
            </Button>
            
            <Button
              onClick={() => navigate('/articles')}
              variant="router"
              size="medium"
              className="notfound-button"
            >
              📚 Try Articles Tool
            </Button>
          </div>
        </section>

        <section className="notfound-tools-section">
          <h2 className="notfound-tools-title">
            Popular Dutch Learning Tools
          </h2>
          <div className="notfound-tools-grid">
            <div 
              className="tool-card notfound-tool-card"
              onClick={() => navigate('/articles')}
            >
              <Icon icon="📚" size="large" className="tool-icon" />
              <h3>Dutch Articles & Nouns</h3>
              <p>Learn Dutch articles (de & het) with daily word practice.</p>
            </div>
            
            <div 
              className="tool-card notfound-tool-card"
              onClick={() => navigate('/verbs')}
            >
              <Icon icon="🎯" size="large" className="tool-icon" />
              <h3>Verb Conjugation</h3>
              <p>Master Dutch verb conjugations with interactive exercises.</p>
            </div>
            
            <div className="tool-card coming-soon">
              <Icon icon="📍" size="large" className="tool-icon" />
              <h3>Dutch Prepositions</h3>
              <p>Master Dutch prepositions with interactive exercises.</p>
              <span className="coming-soon-text">Coming Soon</span>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  )
}

export default NotFoundPage