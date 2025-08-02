import { useNavigate } from 'react-router-dom'

function LandingPage() {
  const navigate = useNavigate()
  
  const tools = [
    {
      id: 'articles',
      icon: '📚',
      title: 'Dutch Articles & Nouns',
      description: 'Learn Dutch articles (de & het) with 200 most common Dutch nouns. Daily word practice with pronunciation, translations, and categories.',
      features: [
        'Daily Dutch word rotation',
        'Random word practice',
        'English translations',
        'Word categories',
        'Mobile-optimized',
        'Social sharing'
      ],
      route: '/articles',
      available: true
    },
    {
      id: 'verbs',
      icon: '🎯',
      title: 'Dutch Verb Conjugation',
      description: 'Master Dutch verb conjugations with interactive exercises. Practice present tense with common Dutch verbs.',
      features: [
        'Verb conjugation practice',
        'Present tense focus',
        'Interactive exercises',
        'Progress tracking',
        'Common verbs focus',
        'Conjugation patterns'
      ],
      route: '/verbs',
      available: true
    },
    {
      id: 'pronunciation',
      icon: '🗣️',
      title: 'Dutch Pronunciation',
      description: 'Learn proper Dutch pronunciation with audio guides and phonetic exercises. Master difficult Dutch sounds and letter combinations.',
      features: [
        'Audio pronunciation',
        'Phonetic guides',
        'Sound comparisons',
        'Practice exercises',
        'Native speaker audio',
        'Progress tracking'
      ],
      route: '/pronunciation',
      available: false
    },
    {
      id: 'phrases',
      icon: '💬',
      title: 'Common Dutch Phrases',
      description: 'Essential Dutch phrases for everyday conversations. Learn greetings, shopping, dining, and travel phrases with cultural context.',
      features: [
        'Essential conversations',
        'Cultural context',
        'Audio pronunciation',
        'Situation-based learning',
        'Practice dialogues',
        'Difficulty levels'
      ],
      route: '/phrases',
      available: false
    },
    {
      id: 'grammar',
      icon: '📖',
      title: 'Dutch Grammar Guide',
      description: 'Comprehensive Dutch grammar lessons with interactive examples. Learn sentence structure, word order, and Dutch grammar rules.',
      features: [
        'Interactive lessons',
        'Grammar exercises',
        'Rule explanations',
        'Example sentences',
        'Progressive difficulty',
        'Quick reference'
      ],
      route: '/grammar',
      available: false
    },
    {
      id: 'vocabulary',
      icon: '🧠',
      title: 'Vocabulary Builder',
      description: 'Expand your Dutch vocabulary with themed word lists and spaced repetition. Learn words for specific topics and situations.',
      features: [
        'Themed word lists',
        'Spaced repetition',
        'Memory games',
        'Progress tracking',
        'Audio pronunciation',
        'Visual associations'
      ],
      route: '/vocabulary',
      available: false
    }
  ]

  const handleToolClick = (tool) => {
    if (tool.available) {
      navigate(tool.route)
    }
  }

  return (
    <div className="container">
      <section className="hero">
        <span className="flag">🇳🇱</span>
        <h1>Dutch Learning Tools</h1>
        <p>
          Comprehensive collection of free, interactive Dutch language learning tools. 
          Master Dutch grammar, vocabulary, pronunciation, and conversation skills with our engaging daily practice tools.
        </p>
      </section>

      <section className="tools-section">
        <div className="section-header">
          <h2>Learning Tools</h2>
          <p>
            Choose from our collection of interactive Dutch learning tools. 
            Each tool is designed to help you master specific aspects of the Dutch language.
          </p>
        </div>

        <div className="tools-grid">
          {tools.map(tool => (
            <div 
              key={tool.id} 
              className={`tool-card ${!tool.available ? 'coming-soon' : ''}`}
            >
              <span className="tool-icon">{tool.icon}</span>
              <h3>{tool.title}</h3>
              <p>{tool.description}</p>
              
              <ul className="tool-features">
                {tool.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              
              {tool.available ? (
                <button 
                  className="router-link"
                  onClick={() => handleToolClick(tool)}
                  aria-label={`Go to ${tool.title}`}
                >
                  Launch Tool
                </button>
              ) : (
                <button 
                  className="tool-link"
                  disabled
                  aria-label={`${tool.title} - Coming Soon`}
                >
                  Coming Soon
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      <footer className="footer">
        <p>
          🇳🇱 Free Dutch learning tools for everyone. Start your Dutch language journey today!
        </p>
      </footer>
    </div>
  )
}

export default LandingPage