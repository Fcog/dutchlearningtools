import React from 'react'

function ExerciseList({ tools, onToolClick }) {
  return (
    <section className="exercises-section">
      <div className="section-header">
        <h2>Learning Exercises</h2>
        <p>
          Choose from our collection of interactive Dutch learning exercises. 
          Each exercise is designed to help you master specific aspects of the Dutch language.
        </p>
      </div>

      <ul className="exercises-list">
        {tools
          .filter(tool => tool.available)
          .map(tool => (
            <li key={tool.id} className="exercise-item">
              <button 
                className="exercise-link"
                onClick={() => onToolClick(tool)}
                aria-label={`Go to ${tool.title}`}
              >
                <span className="exercise-icon">{tool.icon}</span>
                <div className="exercise-content">
                  <h3 className="exercise-title">{tool.title}</h3>
                  <p className="exercise-description">{tool.description}</p>
                </div>
                <span className="exercise-arrow">→</span>
              </button>
            </li>
          ))}
      </ul>

      {tools.some(tool => !tool.available) && (
        <div className="coming-soon-section">
          <h3>Coming Soon</h3>
          <ul className="coming-soon-list">
            {tools
              .filter(tool => !tool.available)
              .map(tool => (
                <li key={tool.id} className="coming-soon-item">
                  <span className="exercise-icon">{tool.icon}</span>
                  <div className="exercise-content">
                    <h4 className="exercise-title">{tool.title}</h4>
                    <p className="exercise-description">{tool.description}</p>
                  </div>
                  <span className="coming-soon-badge">Coming Soon</span>
                </li>
              ))}
          </ul>
        </div>
      )}
    </section>
  )
}

export default ExerciseList
