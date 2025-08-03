import React from 'react'
import PageLayout from '../components/templates/PageLayout'
import { trackLearningEvent } from '../utils/analytics'

function PrepositionsPage() {
  React.useEffect(() => {
    // Track page visit
    trackLearningEvent('page_visited', 'navigation', {
      page_name: 'prepositions',
      tool_type: 'language_learning'
    })
  }, [])

  return (
    <PageLayout>
      <div className="container">
        <section className="exercise-header">
          <h1>Dutch Prepositions Practice</h1>
          <p>
            Master Dutch prepositions with interactive exercises. Learn the correct usage 
            of prepositions in different contexts and situations.
          </p>
        </section>

        <section className="exercise-content">
          <div className="coming-soon-content">
            <div className="coming-soon-icon">📍</div>
            <h2>Coming Soon!</h2>
            <p>
              We're working hard to bring you an amazing Dutch prepositions learning tool. 
              This feature will include interactive exercises, contextual examples, and 
              comprehensive practice materials.
            </p>
            <div className="planned-features">
              <h3>Planned Features:</h3>
              <ul>
                <li>Common prepositions practice</li>
                <li>Contextual usage examples</li>
                <li>Interactive exercises</li>
                <li>Real-world scenarios</li>
                <li>Progress tracking</li>
                <li>Dutch-English comparisons</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  )
}

export default PrepositionsPage