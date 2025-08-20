import { useNavigate } from 'react-router-dom'
import PageLayout from '../components/templates/PageLayout'
import Button from '../components/atoms/Button'
import Icon from '../components/atoms/Icon'
import { Footer } from '../components/atoms'


function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <PageLayout
      showBreadcrumb
      breadcrumbPage="Page Not Found"
      onHomeClick={() => navigate('/')}
      footer={<Footer />}
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
          <ul className="notfound-exercises-list">
            <li className="notfound-exercise-item">
              <button 
                className="notfound-exercise-link"
                onClick={() => navigate('/de-het-articles')}
                aria-label="Go to Dutch Articles & Nouns"
              >
                <span className="exercise-icon">📚</span>
                <div className="exercise-content">
                  <h3 className="exercise-title">Dutch Articles & Nouns</h3>
                  <p className="exercise-description">Learn Dutch articles (de & het) with daily word practice.</p>
                </div>
                <span className="exercise-arrow">→</span>
              </button>
            </li>
            
            <li className="notfound-exercise-item">
              <button 
                className="notfound-exercise-link"
                onClick={() => navigate('/verbs-conjugations')}
                aria-label="Go to Verb Conjugation"
              >
                <span className="exercise-icon">🎯</span>
                <div className="exercise-content">
                  <h3 className="exercise-title">Verb Conjugation</h3>
                  <p className="exercise-description">Master Dutch verb conjugations with interactive exercises.</p>
                </div>
                <span className="exercise-arrow">→</span>
              </button>
            </li>
            
            <li className="notfound-exercise-item">
              <button 
                className="notfound-exercise-link"
                onClick={() => navigate('/prepositions')}
                aria-label="Go to Dutch Prepositions"
              >
                <span className="exercise-icon">📍</span>
                <div className="exercise-content">
                  <h3 className="exercise-title">Dutch Prepositions</h3>
                  <p className="exercise-description">Master Dutch prepositions with interactive exercises.</p>
                </div>
                <span className="exercise-arrow">→</span>
              </button>
            </li>
          </ul>
        </section>
      </div>
    </PageLayout>
  )
}

export default NotFoundPage