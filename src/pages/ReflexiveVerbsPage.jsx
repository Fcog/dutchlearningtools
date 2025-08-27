import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../components/templates/PageLayout'
import { ScoreDisplay, CollapsibleInfoSection } from '../components/molecules'
import ReflexiveVerbExercise from '../components/organisms/ReflexiveVerbExercise'
import SocialSharing from '../components/organisms/SocialSharing'
import { Footer } from '../components/atoms'
import { createExerciseHistory, exerciseIdGenerators } from '../utils/exerciseHistory'

// Initialize exercise history manager
const exerciseHistory = createExerciseHistory('reflexive_verbs', 3)

function ReflexiveVerbsPage() {
  const navigate = useNavigate()
  const [reflexiveData, setReflexiveData] = useState(null)
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

  // Load reflexive verb data asynchronously
  const loadReflexiveVerbData = async () => {
    try {
      setIsDataLoading(true)
      const data = await import('../data/dutch-reflexive-verbs.json')
      setReflexiveData(data.default)
    } catch (error) {
      console.error('Error loading reflexive verb data:', error)
    } finally {
      setIsDataLoading(false)
    }
  }

  // Load data on component mount
  useEffect(() => {
    loadReflexiveVerbData()
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
    if (reflexiveData && !isDataLoading && !currentExercise) {
      handleNextExercise()
    }
  }, [reflexiveData, isDataLoading])

  // Function to get a smart exercise selection
  const getSmartExercise = () => {
    if (!reflexiveData?.dutch_reflexive_verbs) return null
    
    const exercises = reflexiveData.dutch_reflexive_verbs
    return exerciseHistory.selectSmartExercise(
      exercises,
      exerciseIdGenerators.questionBased
    )
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

  // Get next exercise with smart selection to avoid repetition
  const handleNextExercise = () => {
    const newExercise = getSmartExercise()
    if (!newExercise) return
    
    setCurrentExercise(newExercise)
    setUserAnswer('')
    setShowResult(false)
    setIsCorrect(false)
    
    // Track "Next Exercise" clicks and add to history (but skip the initial load)
    if (currentExercise) {
      const exerciseId = exerciseIdGenerators.questionBased(newExercise)
      exerciseHistory.addToHistory(exerciseId)
      
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
    title: "Dutch Reflexive Verb Exercise - Interactive Dutch Grammar Practice",
    description: "Master Dutch reflexive verbs with our interactive exercise! Practice placing reflexive pronouns in the correct position and get instant feedback on your Dutch grammar skills."
  }

  if (isDataLoading || !currentExercise) {
    return (
      <PageLayout>
        <h1>Loading...</h1>
        <p>Loading your Dutch reflexive verb exercise</p>
      </PageLayout>
    )
  }

  return (
    <PageLayout 
      showBreadcrumb 
      breadcrumbPage="Reflexive Verb Exercise"
      onHomeClick={() => navigate('/')}
      footer={<Footer />}
    >
      <header>
        <h1>Dutch Reflexive Verb Exercise: Complete the Sentence</h1>
        <p className="page-header-description">
          {isMobile 
            ? "Practice Dutch reflexive verbs! Add the correct reflexive pronoun in the right position." 
            : "Test your knowledge of Dutch reflexive verbs! Complete each sentence with the correct reflexive pronoun (wederkerend voornaamwoord) in the proper position and get instant feedback with English translations."
          }
        </p>
      </header>

      <ScoreDisplay score={score} />
      
      <section aria-labelledby="exercise-heading" className="exercise-container">
        <h2 id="exercise-heading" className="exercise-heading">
          Complete the sentence with the reflexive pronoun:
        </h2>
        
        <ReflexiveVerbExercise
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
        <p>Dutch reflexive verbs (wederkerige werkwoorden) use reflexive pronouns that refer back to the subject. They are essential for expressing actions that the subject performs on themselves:</p>
        <ul className="info-list">
          <li><strong>Reflexive pronouns</strong> - me (myself), je (yourself), zich (himself/herself/itself/themselves), ons (ourselves), jullie → je (yourselves)</li>
          <li><strong>Position rules</strong> - Usually directly after the conjugated verb, or after modal verbs</li>
          <li><strong>Common reflexive verbs</strong> - zich herinneren (to remember), zich voelen (to feel), zich vervelen (to be bored), zich voorbereiden (to prepare)</li>
          <li><strong>Context matters</strong> - Some verbs can be used both reflexively and non-reflexively</li>
        </ul>
        <p>This interactive exercise helps you learn through:</p>
        <ul className="info-list">
          <li><strong>Position practice</strong> - Learn where to place reflexive pronouns in sentences</li>
          <li><strong>Translation support</strong> - Understand meaning with English translations</li>
          <li><strong>Contextual learning</strong> - See reflexive verbs used in real situations</li>
          <li><strong>Active practice</strong> - Type the pronoun yourself instead of just reading</li>
          <li><strong>Instant feedback</strong> - Know immediately if you're correct or not</li>
          <li><strong>Score tracking</strong> - Monitor your progress over time</li>
          <li><strong>Pattern recognition</strong> - Learn different reflexive verb patterns and contexts</li>
        </ul>
        <p>Practice with carefully selected sentences covering common Dutch reflexive verbs in natural contexts!</p>
      </CollapsibleInfoSection>
      
      <SocialSharing
        title={shareData.title}
        description={shareData.description}
      />
    </PageLayout>
  )
}

export default ReflexiveVerbsPage
