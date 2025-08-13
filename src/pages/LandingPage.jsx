import { useNavigate } from 'react-router-dom'
import Hero from '../components/organisms/Hero'
import ToolsGrid from '../components/organisms/ToolsGrid'
import { trackLearningEvent } from '../utils/analytics'

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
      id: 'prepositions',
      icon: '📍',
      title: 'Dutch Prepositions',
      description: 'Master Dutch prepositions with interactive exercises. Learn the correct usage of prepositions in different contexts and situations.',
      features: [
        'Common prepositions practice',
        'Contextual usage examples',
        'Interactive exercises',
        'Real-world scenarios',
        'Progress tracking',
        'Dutch-English comparisons'
      ],
      route: '/prepositions',
      available: true
    },
    {
      id: 'conjunctions',
      icon: '🔗',
      title: 'Dutch Conjunctions',
      description: 'Master Dutch conjunctions with interactive exercises. Learn to connect clauses and express relationships between ideas.',
      features: [
        'Coordinating conjunctions',
        'Subordinating conjunctions',
        'Sentence completion practice',
        'Contextual learning',
        'Progress tracking',
        'Category-based learning'
      ],
      route: '/conjunctions',
      available: true
    },
    {
      id: 'verb-prepositions',
      icon: '🎲',
      title: 'Dutch Verbs with Fixed Prepositions',
      description: 'Master Dutch verbs with their fixed prepositions. Learn essential verb-preposition combinations with interactive exercises.',
      features: [
        'Fixed verb-preposition pairs',
        'Level-based progression (A2-B2)',
        'Real example sentences',
        'Contextual learning',
        'Progress tracking',
        'Instant feedback'
      ],
      route: '/verbs-fixed-preposition',
      available: true
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
      // Track tool selection
      trackLearningEvent('tool_selected', 'navigation', {
        tool_id: tool.id,
        tool_name: tool.title,
        route: tool.route,
        from_page: 'landing'
      })
      
      navigate(tool.route)
    } else {
      // Track interest in unavailable tools
      trackLearningEvent('tool_clicked', 'navigation', {
        tool_id: tool.id,
        tool_name: tool.title,
        available: false,
        from_page: 'landing'
      })
    }
  }

  return (
    <div className="container">
      <Hero />
      <ToolsGrid tools={tools} onToolClick={handleToolClick} />
      <footer className="footer">
        <p>
          🇳🇱 Free Dutch learning tools for everyone. Start your Dutch language journey today!
        </p>
      </footer>
    </div>
  )
}

export default LandingPage