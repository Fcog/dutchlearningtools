import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../components/templates/PageLayout'
import { ScoreDisplay, CollapsibleInfoSection } from '../components/molecules'
import ComparativeExercise from '../components/organisms/ComparativeExercise'
import SocialSharing from '../components/organisms/SocialSharing'
import { Footer } from '../components/atoms'
import { createExerciseHistory, exerciseIdGenerators } from '../utils/exerciseHistory'

// Initialize exercise history manager
const exerciseHistory = createExerciseHistory('comparative', 3)

function ComparativePage() {
  const navigate = useNavigate()
  const [dutchComparativesData, setDutchComparativesData] = useState(null)
  const [isDataLoading, setIsDataLoading] = useState(true)
  const [currentExercise, setCurrentExercise] = useState(null)
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
        // Could add analytics tracking here if needed
      }
    }
  }, [])

  // Load comparative data asynchronously
  const loadComparativeData = async () => {
    try {
      setIsDataLoading(true)
      const data = await import('../data/dutch-comparatives.json')
      setDutchComparativesData(data.default)
    } catch (error) {
      console.error('Error loading comparative data:', error)
    } finally {
      setIsDataLoading(false)
    }
  }

  // Load data on component mount
  useEffect(() => {
    loadComparativeData()
  }, [])

  // Initialize with first exercise after data is loaded
  useEffect(() => {
    if (dutchComparativesData?.comparative_superlative_exercises && !isDataLoading) {
      generateNewExercise()
    }
  }, [dutchComparativesData, isDataLoading])

  // Generate a new exercise with smart selection to avoid repetition
  const generateNewExercise = () => {
    if (!dutchComparativesData?.comparative_superlative_exercises) return
    
    const exercises = dutchComparativesData.comparative_superlative_exercises
    const selectedExercise = exerciseHistory.selectSmartExercise(
      exercises,
      exerciseIdGenerators.questionBased
    )
    
    if (!selectedExercise) return
    
    setCurrentExercise(selectedExercise)
    setUserAnswer('')
    setShowResult(false)
    setIsCorrect(false)
    
    // Track "Next Exercise" clicks and add to history (but skip the initial load)
    if (currentExercise) {
      const exerciseId = exerciseIdGenerators.questionBased(selectedExercise)
      exerciseHistory.addToHistory(exerciseId)
      
      const newClickCount = nextExerciseClickCount + 1
      setNextExerciseClickCount(newClickCount)
    }
  }

  // Handle answer input change
  const handleAnswerChange = (e) => {
    setUserAnswer(e.target.value)
  }

  // Check user's answer
  const checkAnswer = () => {
    if (!userAnswer.trim()) return
    
    const userAnswerTrimmed = userAnswer.trim().toLowerCase()
    const correctAnswer = currentExercise.correct_answer.toLowerCase()
    const isAnswerCorrect = userAnswerTrimmed === correctAnswer
    
    setIsCorrect(isAnswerCorrect)
    setShowResult(true)
    
    // Update score
    const newScore = {
      correct: isAnswerCorrect ? score.correct + 1 : score.correct,
      total: score.total + 1
    }
    setScore(newScore)
  }

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (showResult) {
        generateNewExercise()
      } else if (userAnswer.trim()) {
        checkAnswer()
      }
    }
  }

  // Get accuracy percentage
  const getAccuracy = () => {
    if (score.total === 0) return 0
    return Math.round((score.correct / score.total) * 100)
  }

  // Social sharing data
  const shareData = {
    title: "Dutch Comparative & Superlative Exercise - Interactive Practice",
    description: "Master Dutch comparative and superlative forms! Learn to form comparatives (-er) and superlatives (-ste) with interactive exercises and instant feedback."
  }

  if (isDataLoading || !currentExercise) {
    return (
      <PageLayout>
        <h1>Loading...</h1>
        <p>Loading your Dutch comparative exercise</p>
      </PageLayout>
    )
  }

  return (
    <PageLayout 
      showBreadcrumb 
      breadcrumbPage="Comparative & Superlative Exercise"
      onHomeClick={() => navigate('/')}
      footer={<Footer />}
    >
      <header>
        <h1>Comparative & Superlative Exercise</h1>
        <h2>Fill in the correct form</h2>
        <p className="page-header-description">
          Master Dutch comparative and superlative forms! Learn to form comparatives with '-er' (bigger, smaller) 
          and superlatives with '-ste' (biggest, smallest). Fill in the correct form based on the context and get 
          instant feedback with explanations.
        </p>
      </header>

      <ScoreDisplay score={score} />
    
      <section aria-labelledby="exercise-heading" className="exercise-container">
        <h2 id="exercise-heading" className="exercise-heading">
          Fill in the correct form:
        </h2>
        
        <ComparativeExercise
          currentExercise={currentExercise}
          userAnswer={userAnswer}
          showResult={showResult}
          isCorrect={isCorrect}
          onAnswerChange={handleAnswerChange}
          onKeyPress={handleKeyPress}
          onCheckAnswer={checkAnswer}
          onNextExercise={generateNewExercise}
        />
      </section>

      <CollapsibleInfoSection title="How This Exercise Helps You Learn">
        <p>Dutch comparative and superlative forms follow specific patterns:</p>
        <ul className="info-list">
          <li><strong>Comparative (-er)</strong> - Used when comparing two things: "groter" (bigger), "sneller" (faster)</li>
          <li><strong>Superlative (-ste)</strong> - Used for the highest degree: "grootste" (biggest), "snelste" (fastest)</li>
          <li><strong>Irregular forms</strong> - Some adjectives have irregular forms: "goed → beter → beste"</li>
          <li><strong>Consonant doubling</strong> - Short adjectives often double the final consonant: "dik → dikker → dikste"</li>
          <li><strong>Equal comparison</strong> - Use "even...als" with the base form: "even groot als" (as big as)</li>
        </ul>
        <p>This interactive exercise helps you learn through:</p>
        <ul className="info-list">
          <li><strong>Contextual practice</strong> - Learn which form to use in realistic sentences</li>
          <li><strong>Pattern recognition</strong> - Identify whether you need comparative, superlative, or base form</li>
          <li><strong>Instant feedback</strong> - Know immediately if you're correct</li>
          <li><strong>Detailed explanations</strong> - Understand the rules behind each answer</li>
          <li><strong>Score tracking</strong> - Monitor your progress over time</li>
          <li><strong>Mixed practice</strong> - Regular and irregular forms combined for comprehensive learning</li>
        </ul>
        <p>Master one of the essential aspects of Dutch grammar with focused practice!</p>
      </CollapsibleInfoSection>
      
      <SocialSharing
        title={shareData.title}
        description={shareData.description}
      />
    </PageLayout>
  )
}

export default ComparativePage
