import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../components/templates/PageLayout'
import ScoreDisplay from '../components/molecules/ScoreDisplay'
import ObjectPronounExercise from '../components/organisms/ObjectPronounExercise'
import SocialSharing from '../components/organisms/SocialSharing'
import { Footer } from '../components/atoms'

function ObjectPronounsPage() {
  const navigate = useNavigate()
  const [pronounsData, setPronounsData] = useState(null)
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
        // Analytics tracking could be added here
      }
    }
  }, [])

  // Load object pronoun data asynchronously
  const loadObjectPronounData = async () => {
    try {
      setIsDataLoading(true)
      const data = await import('../data/dutch-object-pronouns.json')
      setPronounsData(data.default)
    } catch (error) {
      console.error('Error loading object pronoun data:', error)
    } finally {
      setIsDataLoading(false)
    }
  }

  // Load data on component mount
  useEffect(() => {
    loadObjectPronounData()
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
    if (pronounsData && !isDataLoading && !currentExercise) {
      handleNextExercise()
    }
  }, [pronounsData, isDataLoading])

  // Function to get a random exercise
  const getRandomExercise = () => {
    if (!pronounsData?.dutch_object_pronouns) return null
    
    const exercises = pronounsData.dutch_object_pronouns
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
    title: "Dutch Object Pronoun Exercise - Interactive Dutch Grammar Practice",
    description: "Master Dutch object pronouns with our interactive exercise! Practice with real sentences and get instant feedback on your Dutch grammar skills."
  }

  if (isDataLoading || !currentExercise) {
    return (
      <PageLayout>
        <h1>Loading...</h1>
        <p>Loading your Dutch object pronoun exercise</p>
      </PageLayout>
    )
  }

  return (
    <PageLayout 
      showBreadcrumb 
      breadcrumbPage="Object Pronoun Exercise"
      onHomeClick={() => navigate('/')}
      footer={<Footer />}
    >
      <header>
        <h1>Dutch Object Pronoun Exercise: Complete the Sentence</h1>
        <p className="page-header-description">
          {isMobile 
            ? "Practice Dutch object pronouns! Complete each sentence with the correct pronoun." 
            : "Test your knowledge of Dutch object pronouns! Complete each sentence with the correct object pronoun (lijdend voorwerp voornaamwoord) and get instant feedback with the English translation."
          }
        </p>
      </header>

      <ScoreDisplay score={score} />
      
      <section aria-labelledby="exercise-heading" className="exercise-container">
        <h2 id="exercise-heading" className="exercise-heading">
          Complete the sentence:
        </h2>
        
        <ObjectPronounExercise
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
      
      <section className="info-section">
        <h2 className="info-section-title">
          How This Exercise Helps You Learn
        </h2>
        <div className="info-section-content">
          <p>Dutch object pronouns (lijdend voorwerp voornaamwoorden) replace nouns that receive the action of a verb. They are essential for natural Dutch conversation:</p>
          <ul className="info-list">
            <li><strong>Personal pronouns</strong> - mij (me), je/jou (you informal), hem (him), haar (her), het (it), ons (us), jullie (you plural), ze/hen (them)</li>
            <li><strong>Formal pronouns</strong> - u (you formal, same for subject and object)</li>
            <li><strong>Gender agreement</strong> - hem for masculine, haar for feminine, het for neuter</li>
            <li><strong>Plural forms</strong> - ze for plural people and things</li>
          </ul>
          <p>This interactive exercise helps you learn through:</p>
          <ul className="info-list">
            <li><strong>Contextual learning</strong> - See pronouns used in real conversations</li>
            <li><strong>Translation support</strong> - Understand meaning with English translations</li>
            <li><strong>Active practice</strong> - Type the pronoun yourself instead of just reading</li>
            <li><strong>Instant feedback</strong> - Know immediately if you're correct or not</li>
            <li><strong>Score tracking</strong> - Monitor your progress over time</li>
            <li><strong>Pattern recognition</strong> - Learn different pronoun types and contexts</li>
          </ul>
          <p>Practice with carefully selected sentences covering all Dutch object pronouns in natural contexts!</p>
        </div>
      </section>
      
      <SocialSharing
        title={shareData.title}
        description={shareData.description}
      />
    </PageLayout>
  )
}

export default ObjectPronounsPage
