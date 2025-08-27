import { useNavigate } from 'react-router-dom'
import Hero from '../components/organisms/Hero'
import ExerciseList from '../components/organisms/ExerciseList'
import { Footer } from '../components/atoms'

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
      route: '/de-het-articles',
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
      route: '/verbs-conjugations',
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
      id: 'adjectives',
      icon: '🎨',
      title: 'Dutch Adjectives',
      description: 'Master Dutch adjective declension with interactive exercises. Learn when to use the correct form of adjectives in different contexts.',
      features: [
        'Adjective declension practice',
        'Multiple choice exercises',
        'Instant feedback',
        'Detailed explanations',
        'De/het word recognition',
        'Contextual learning'
      ],
      route: '/adjectives',
      available: true
    },
    {
      id: 'verbs-with-fixed-preposition',
      icon: '🎲',
      title: 'Dutch Verbs with Fixed Preposition',
      description: 'Master Dutch verbs with fixed prepositions. Learn essential verb-preposition combinations with interactive exercises.',
      features: [
        'Fixed verb-preposition pairs',
        'Level-based progression (A2-B2)',
        'Real example sentences',
        'Contextual learning',
        'Progress tracking',
        'Instant feedback'
      ],
      route: '/verbs-with-fixed-preposition',
      available: true
    },
    {
      id: 'comparatives',
      icon: '📊',
      title: 'Dutch Comparatives & Superlatives',
      description: 'Master Dutch comparative and superlative forms. Learn to form comparatives (-er) and superlatives (-ste) with interactive exercises.',
      features: [
        'Comparative forms practice',
        'Superlative forms practice',
        'Irregular comparisons',
        'Contextual exercises',
        'Pattern recognition',
        'Real-world examples'
      ],
      route: '/comparatives-superlatives',
      available: true
    },
    {
      id: 'object-pronouns',
      icon: '👤',
      title: 'Dutch Object Pronouns',
      description: 'Master Dutch object pronouns with interactive exercises. Learn to use the correct pronouns (mij, je, hem, haar, het, ons, jullie, ze) in context.',
      features: [
        'Object pronoun practice',
        'Personal and formal pronouns',
        'Gender agreement practice',
        'Contextual exercises',
        'Real conversation examples',
        'Instant feedback'
      ],
      route: '/object-pronouns',
      available: true
    },
    {
      id: 'reflexive-verbs',
      icon: '🪞',
      title: 'Dutch Reflexive Verbs',
      description: 'Master Dutch reflexive verbs with interactive exercises. Learn to place reflexive pronouns (me, je, zich, ons) in the correct position within sentences.',
      features: [
        'Reflexive pronoun practice',
        'Position placement rules',
        'Common reflexive verbs',
        'Contextual exercises',
        'Real sentence examples',
        'Instant feedback'
      ],
      route: '/reflexive-verbs',
      available: true
    },
    {
      id: 'negation',
      icon: '🚫',
      title: 'Dutch Negation',
      description: 'Master Dutch negation patterns with interactive exercises. Learn when to use "niet", "geen", and modal verbs for correct negative sentences.',
      features: [
        'Niet vs Geen practice',
        'Modal verb negation',
        'Word order rules',
        'Comparative learning',
        'Detailed explanations',
        'Real conversation examples'
      ],
      route: '/negation',
      available: true
    },
    {
      id: 'separable-verbs',
      icon: '🔀',
      title: 'Dutch Separable Verbs',
      description: 'Master Dutch separable verbs with interactive sentence completion exercises. Learn how separable verbs split and change position in different contexts.',
      features: [
        'Sentence completion practice',
        'Multiple tenses and contexts',
        'Real-world examples',
        'Detailed explanations',
        'Progressive difficulty',
        'Verb separation rules'
      ],
      route: '/separable-verbs',
      available: true
    },
    {
      id: 'pronominal-adverbs',
      icon: '🔄',
      title: 'Dutch Pronominal Adverbs',
      description: 'Master Dutch pronominal adverbs with interactive exercises. Learn waar-, wat-, and er- constructions for things and concepts.',
      features: [
        'Waar + preposition practice',
        'Er + preposition constructions',
        'Question forms with wat',
        'Contextual learning',
        'Detailed explanations',
        'Grammar pattern recognition'
      ],
      route: '/pronominal-adverbs',
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
      navigate(tool.route)
    }
  }

  return (
    <div>
      <Hero />
      <div className="container">  
        <ExerciseList tools={tools} onToolClick={handleToolClick} />
        <footer className="footer">
          <Footer />
        </footer>
      </div>
    </div>
  )
}

export default LandingPage