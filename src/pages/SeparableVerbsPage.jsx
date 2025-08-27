import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../components/templates/PageLayout'
import ScoreDisplay from '../components/molecules/ScoreDisplay'
import SeparableVerbExercise from '../components/organisms/SeparableVerbExercise'
import SocialSharing from '../components/organisms/SocialSharing'
import { Footer } from '../components/atoms'
import { createExerciseHistory, exerciseIdGenerators } from '../utils/exerciseHistory'

// Initialize exercise history manager
const exerciseHistory = createExerciseHistory('separable_verbs', 3)

function SeparableVerbsPage() {
  const navigate = useNavigate()
  const [separableVerbData, setSeparableVerbData] = useState(null)
  const [isDataLoading, setIsDataLoading] = useState(true)
  const [currentExercise, setCurrentExercise] = useState(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [nextExerciseClickCount, setNextExerciseClickCount] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const scoreRef = useRef({ correct: 0, total: 0 })

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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

  // Load separable verb data asynchronously
  const loadSeparableVerbData = async () => {
    try {
      setIsDataLoading(true)
      const data = await import('../data/dutch-separable-verbs.json')
      setSeparableVerbData(data.default)
    } catch (error) {
      console.error('Error loading separable verb data:', error)
    } finally {
      setIsDataLoading(false)
    }
  }

  // Load data on component mount
  useEffect(() => {
    loadSeparableVerbData()
  }, [])

  // Initialize with first exercise after data is loaded
  useEffect(() => {
    if (separableVerbData && !isDataLoading) {
      generateNewExercise()
    }
  }, [separableVerbData, isDataLoading])

  // Generate new exercise with smart selection to avoid repetition
  const generateNewExercise = () => {
    if (!separableVerbData || separableVerbData.length === 0) return
    
    const selectedExercise = exerciseHistory.selectSmartExercise(
      separableVerbData,
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
  const handleCheckAnswer = () => {
    if (!currentExercise || !userAnswer.trim()) return
    
    // Compare only the missing words - normalize whitespace and compare
    const normalizeText = (text) => text.replace(/\s+/g, ' ').trim().toLowerCase()
    const userAnswerNormalized = normalizeText(userAnswer)
    const correctMissingWordsNormalized = normalizeText(currentExercise.missing_words)
    
    const correct = userAnswerNormalized === correctMissingWordsNormalized
    
    setIsCorrect(correct)
    setShowResult(true)
    
    // Update score
    const newScore = {
      correct: correct ? score.correct + 1 : score.correct,
      total: score.total + 1
    }
    setScore(newScore)
  }

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !showResult && userAnswer.trim()) {
      handleCheckAnswer()
    } else if (e.key === 'Enter' && showResult) {
      generateNewExercise()
    }
  }

  // Social sharing data
  const shareData = {
    title: "Dutch Separable Verbs Exercise - Interactive Dutch Grammar Practice",
    description: "Master Dutch separable verbs with our interactive exercise! Practice constructing sentences with separable verbs and learn how they split in different contexts."
  }

  if (isDataLoading || !currentExercise) {
    return (
      <PageLayout>
        <h1>Loading...</h1>
        <p>Loading your Dutch separable verbs exercise</p>
      </PageLayout>
    )
  }

  return (
    <PageLayout 
      showBreadcrumb 
      breadcrumbPage="Verb Separable Verbs Exercise"
      onHomeClick={() => navigate('/')}
      breadcrumbItems={[
        { label: 'Home', path: '/' },
        { label: 'Separable Verbs', path: '/separable-verbs' }
      ]}
    >
      <div className="exercise-page">
        <div className="exercise-header">
          <h1>Dutch Separable Verbs</h1>
          <p className="exercise-description">
            Fill in the missing words to complete the sentences. Learn how Dutch separable verbs split 
            and change position in different sentence structures and tenses.
          </p>
        </div>

        <ScoreDisplay score={score} />

        <SeparableVerbExercise
          currentExercise={currentExercise}
          userAnswer={userAnswer}
          showResult={showResult}
          isCorrect={isCorrect}
          isMobile={isMobile}
          onAnswerChange={handleAnswerChange}
          onCheckAnswer={handleCheckAnswer}
          onNextExercise={generateNewExercise}
          onKeyPress={handleKeyPress}
        />

        <SocialSharing shareData={shareData} />
        
        <Footer />
      </div>
    </PageLayout>
  )
}

export default SeparableVerbsPage
