import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../components/templates/PageLayout'
import { ScoreDisplay, CollapsibleInfoSection } from '../components/molecules'
import PrepositionExercise from '../components/organisms/PrepositionExercise'
import SocialSharing from '../components/organisms/SocialSharing'
import { Footer } from '../components/atoms'


function PrepositionsPage() {
  const navigate = useNavigate()
  const [prepositionsData, setPrepositionsData] = useState(null)
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

      }
    }
  }, [])

  // Load preposition data asynchronously
  const loadPrepositionData = async () => {
    try {
      setIsDataLoading(true)
      const data = await import('../data/dutch-prepositions.json')
      setPrepositionsData(data.default)
    } catch (error) {
      console.error('Error loading preposition data:', error)
    } finally {
      setIsDataLoading(false)
    }
  }

  // Load data on component mount
  useEffect(() => {
    loadPrepositionData()
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
    if (prepositionsData && !isDataLoading && !currentExercise) {
      handleNextExercise()
      

    }
  }, [prepositionsData, isDataLoading])

  // Function to get a random exercise
  const getRandomExercise = () => {
    if (!prepositionsData?.dutch_prepositions) return null
    
    const exercises = prepositionsData.dutch_prepositions
    const randomIndex = Math.floor(Math.random() * exercises.length)
    return exercises[randomIndex]
  }

  // Check user's answer
  const handleCheckAnswer = () => {
    if (!userAnswer.trim()) return
    
    const correct = userAnswer.trim().toLowerCase() === currentExercise.preposition.toLowerCase()
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
      console.log('Enter pressed with showResult=true, calling handleNextExercise')
      handleNextExercise()
    } else if (e.key === 'Enter') {
      console.log('Enter pressed but no condition met. showResult:', showResult)
    }
  }

  // Handle first keystroke to track engagement
  const handleAnswerChange = (e) => {
    const newValue = e.target.value
    

    
    setUserAnswer(newValue)
  }

  // Social sharing data
  const shareData = {
    title: "Dutch Preposition Exercise - Interactive Dutch Grammar Practice",
    description: "Master Dutch prepositions with our interactive exercise! Practice with real sentences and get instant feedback on your Dutch grammar skills."
  }

  if (isDataLoading || !currentExercise) {
    return (
      <PageLayout>
        <h1>Loading...</h1>
        <p>Loading your Dutch preposition exercise</p>
      </PageLayout>
    )
  }

  return (
    <PageLayout 
      showBreadcrumb 
      breadcrumbPage="Preposition Exercise"
      onHomeClick={() => navigate('/')}
      footer={<Footer />}
    >
      <header>
        <h1>Preposition Exercise</h1>
        <h2>Complete the sentence</h2>
        <p className="page-header-description">
          {isMobile 
            ? "Practice Dutch prepositions! Complete each sentence with the correct preposition." 
            : "Test your knowledge of Dutch prepositions! Complete each sentence with the correct preposition (voorzetsel) and get instant feedback with the English translation."
          }
        </p>
      </header>

      <ScoreDisplay score={score} />
      
      <section aria-labelledby="exercise-heading" className="exercise-container">
        <h2 id="exercise-heading" className="exercise-heading">
          Complete the sentence:
        </h2>
        
        <PrepositionExercise
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
        <p>Dutch prepositions (voorzetsels) are essential for expressing relationships between words and concepts. They indicate location, direction, time, and abstract relationships:</p>
        <ul className="info-list">
          <li><strong>Place prepositions</strong> - indicate location (in, op, onder, naast)</li>
          <li><strong>Direction prepositions</strong> - indicate movement (naar, uit, door, langs)</li>
          <li><strong>Time prepositions</strong> - indicate when something happens (tijdens, sinds, tot)</li>
          <li><strong>Relation prepositions</strong> - indicate abstract relationships (van, met, volgens)</li>
        </ul>
        <p>This interactive exercise helps you learn through:</p>
        <ul className="info-list">
          <li><strong>Contextual learning</strong> - See prepositions used in real sentences</li>
          <li><strong>Translation support</strong> - Understand meaning with English translations</li>
          <li><strong>Active practice</strong> - Type the preposition yourself instead of just reading</li>
          <li><strong>Instant feedback</strong> - Know immediately if you're correct or not</li>
          <li><strong>Score tracking</strong> - Monitor your progress over time</li>
          <li><strong>Category awareness</strong> - Learn different types of preposition usage</li>
        </ul>
        <p>Practice with over 100 carefully selected sentences covering the most important Dutch prepositions!</p>
      </CollapsibleInfoSection>
      
      <SocialSharing
        title={shareData.title}
        description={shareData.description}
      />
    </PageLayout>
  )
}

export default PrepositionsPage