import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../components/templates/PageLayout'
import { ScoreDisplay, CollapsibleInfoSection } from '../components/molecules'
import PronominalAdverbExercise from '../components/organisms/PronominalAdverbExercise'
import SocialSharing from '../components/organisms/SocialSharing'
import { Footer } from '../components/atoms'

function PronominalAdverbsPage() {
  const navigate = useNavigate()
  const [pronominalAdverbsData, setPronominalAdverbsData] = useState(null)
  const [isDataLoading, setIsDataLoading] = useState(true)
  const [currentExercise, setCurrentExercise] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const [userAnswer, setUserAnswer] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [nextExerciseClickCount, setNextExerciseClickCount] = useState(0)
  const scoreRef = useRef({ correct: 0, total: 0 })

  // Update ref when score changes
  useEffect(() => {
    scoreRef.current = score
  }, [score])

  // Track session end when component unmounts
  useEffect(() => {
    return () => {
      const finalScore = scoreRef.current
      if (finalScore.total > 0) {
        // Analytics tracking can be added here
      }
    }
  }, [])

  // Load pronominal adverb data asynchronously
  const loadPronominalAdverbData = async () => {
    try {
      setIsDataLoading(true)
      const data = await import('../data/dutch-pronominal-adverbs.json')
      setPronominalAdverbsData(data.default)
    } catch (error) {
      console.error('Error loading pronominal adverb data:', error)
    } finally {
      setIsDataLoading(false)
    }
  }

  // Load data on component mount
  useEffect(() => {
    loadPronominalAdverbData()
  }, [])

  // Check if user is on mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Initialize with first exercise after data is loaded
  useEffect(() => {
    if (pronominalAdverbsData && !isDataLoading && !currentExercise) {
      handleNextExercise()
    }
  }, [pronominalAdverbsData, isDataLoading])

  // Function to get a random exercise
  const getRandomExercise = () => {
    if (!pronominalAdverbsData?.dutch_pronominal_adverbs) return null
    
    const exercises = pronominalAdverbsData.dutch_pronominal_adverbs
    const randomIndex = Math.floor(Math.random() * exercises.length)
    return exercises[randomIndex]
  }

  // Check user's answer
  const handleCheckAnswer = () => {
    if (!userAnswer.trim()) return
    
    const correct = userAnswer.trim().toLowerCase() === currentExercise.correct_answer.toLowerCase()
    setIsCorrect(correct)
    setShowResult(true)
    
    // Update score
    const newScore = {
      correct: correct ? score.correct + 1 : score.correct,
      total: score.total + 1
    }
    setScore(newScore)
  }

  // Get next exercise
  const handleNextExercise = () => {
    const newExercise = getRandomExercise()
    setCurrentExercise(newExercise)
    setUserAnswer('')
    setShowResult(false)
    setIsCorrect(false)
    
    // Track "Next Exercise" clicks (but skip the initial load)
    if (currentExercise) {
      const newClickCount = nextExerciseClickCount + 1
      setNextExerciseClickCount(newClickCount)
    }
  }

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !showResult) {
      handleCheckAnswer()
    } else if (e.key === 'Enter' && showResult) {
      handleNextExercise()
    }
  }

  // Handle first keystroke to track engagement
  const handleAnswerChange = (e) => {
    const newValue = e.target.value
    setUserAnswer(newValue)
  }

  // Social sharing data
  const shareData = {
    title: "Dutch Pronominal Adverb Exercise - Interactive Dutch Grammar Practice",
    description: "Master Dutch pronominal adverbs with our interactive exercise! Practice waar-, wat-, and er- constructions with real sentences and get instant feedback on your Dutch grammar skills."
  }

  if (isDataLoading || !currentExercise) {
    return (
      <PageLayout>
        <h1>Loading...</h1>
        <p>Loading your Dutch pronominal adverb exercise</p>
      </PageLayout>
    )
  }

  return (
    <PageLayout 
      showBreadcrumb 
      breadcrumbPage="Pronominal Adverb Exercise"
      onHomeClick={() => navigate('/')}
      footer={<Footer />}
    >
      <header>
        <h1>Dutch Pronominal Adverb Exercise: Complete the Sentence</h1>
        <p className="page-header-description">
          {isMobile 
            ? "Practice Dutch pronominal adverbs! Complete each sentence with the correct adverb construction." 
            : "Test your knowledge of Dutch pronominal adverbs! Master waar-, wat-, and er- constructions (bijwoordelijke voornaamwoorden) and get instant feedback with English translations and explanations."
          }
        </p>
      </header>

      <ScoreDisplay score={score} />
      
      <section aria-labelledby="exercise-heading" className="exercise-container">
        <h2 id="exercise-heading" className="exercise-heading">
          Complete the sentence:
        </h2>
        
        <PronominalAdverbExercise
          currentExercise={currentExercise}
          showResult={showResult}
          isCorrect={isCorrect}
          userAnswer={userAnswer}
          onAnswerChange={handleAnswerChange}
          onKeyPress={handleKeyPress}
          onCheckAnswer={handleCheckAnswer}
          onNextExercise={handleNextExercise}
        />
      </section>
      
      <CollapsibleInfoSection title="How This Exercise Helps You Learn">
        <p>Dutch pronominal adverbs (bijwoordelijke voornaamwoorden) are essential constructions that replace preposition + pronoun combinations when referring to things, not people:</p>
        <ul className="info-list">
          <li><strong>Waar + preposition</strong> - for relative clauses and questions (waarover, waaraan, waarmee)</li>
          <li><strong>Er + preposition</strong> - when referring back to things (erover, eraan, ermee)</li>
          <li><strong>Wat constructions</strong> - in questions about things (wat voor, aan wat)</li>
          <li><strong>Separable verbs</strong> - special positioning rules with pronominal adverbs</li>
        </ul>
        <p>This interactive exercise helps you learn through:</p>
        <ul className="info-list">
          <li><strong>Contextual learning</strong> - See pronominal adverbs used in real sentences</li>
          <li><strong>Pattern recognition</strong> - Learn when to use waar-, er-, or wat- constructions</li>
          <li><strong>Translation support</strong> - Understand meaning with English translations</li>
          <li><strong>Detailed explanations</strong> - Learn the grammar rules behind each construction</li>
          <li><strong>Active practice</strong> - Type the correct form yourself instead of just reading</li>
          <li><strong>Instant feedback</strong> - Know immediately if you're correct or not</li>
          <li><strong>Score tracking</strong> - Monitor your progress over time</li>
        </ul>
        <p>Master these essential Dutch constructions with 20 carefully crafted exercises covering all major patterns!</p>
      </CollapsibleInfoSection>
      
      <SocialSharing
        title={shareData.title}
        description={shareData.description}
      />
    </PageLayout>
  )
}

export default PronominalAdverbsPage
