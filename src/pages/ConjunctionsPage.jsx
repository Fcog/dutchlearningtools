import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../components/templates/PageLayout'
import { ScoreDisplay, CollapsibleInfoSection } from '../components/molecules'
import ConjunctionExercise from '../components/organisms/ConjunctionExercise'
import SocialSharing from '../components/organisms/SocialSharing'
import { Footer } from '../components/atoms'
import { createExerciseHistory, exerciseIdGenerators } from '../utils/exerciseHistory'

// Initialize exercise history manager
const exerciseHistory = createExerciseHistory('conjunctions', 3)

function ConjunctionsPage() {
  const navigate = useNavigate()
  const [conjunctionsData, setConjunctionsData] = useState(null)
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

  // Load conjunction data asynchronously
  const loadConjunctionData = async () => {
    try {
      setIsDataLoading(true)
      const data = await import('../data/dutch-conjunctions.json')
      setConjunctionsData(data.default)
    } catch (error) {
      console.error('Error loading conjunction data:', error)
    } finally {
      setIsDataLoading(false)
    }
  }

  // Load data on component mount
  useEffect(() => {
    loadConjunctionData()
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
    if (conjunctionsData && !isDataLoading && !currentExercise) {
      handleNextExercise()
      

    }
  }, [conjunctionsData, isDataLoading])

  // Function to get total number of exercises
  const getTotalExercises = () => {
    if (!conjunctionsData) return 0
    return conjunctionsData.reduce((total, conjunction) => total + conjunction.examples.length, 0)
  }

  // Function to get a smart exercise selection to avoid repetition
  const getSmartExercise = () => {
    if (!conjunctionsData || conjunctionsData.length === 0) return null
    
    // Create all possible exercise combinations (conjunction + sentence pairs)
    const allExercises = []
    conjunctionsData.forEach(conjunction => {
      conjunction.examples.forEach((sentence, index) => {
        allExercises.push({
          conjunction: conjunction.conjunction,
          category: conjunction.category,
          sentence: sentence,
          translation: conjunction.examples_translation[index]
        })
      })
    })
    
    return exerciseHistory.selectSmartExercise(
      allExercises,
      exerciseIdGenerators.complex
    )
  }

  // Check user's answer
  const handleCheckAnswer = () => {
    if (!userAnswer.trim()) return
    
    // Handle correlative conjunctions
    const isCorrect = () => {
      const userInput = userAnswer.trim().toLowerCase()
      const correctConjunction = currentExercise.conjunction.toLowerCase()
      
      // Check if it's a correlative conjunction (contains "...")
      if (correctConjunction.includes('...')) {
        // For correlative conjunctions, accept just the main word
        // e.g., "noch" for "noch ... noch ..." or "of" for "of ... of ..."
        const mainWord = correctConjunction.split('...')[0].trim()
        return userInput === mainWord
      } else {
        // For single conjunctions, exact match
        return userInput === correctConjunction
      }
    }
    
    const correct = isCorrect()
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
      const exerciseId = exerciseIdGenerators.complex(newExercise)
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
    title: "Dutch Conjunction Exercise - Interactive Dutch Grammar Practice",
    description: "Master Dutch conjunctions with our interactive exercise! Practice with real sentences and get instant feedback on your Dutch grammar skills."
  }

  if (isDataLoading || !currentExercise) {
    return (
      <PageLayout>
        <h1>Loading...</h1>
        <p>Loading your Dutch conjunction exercise</p>
      </PageLayout>
    )
  }

  return (
    <PageLayout 
      showBreadcrumb 
      breadcrumbPage="Conjunction Exercise"
      onHomeClick={() => navigate('/')}
      footer={<Footer />}
    >
      <header>
        <h1>Conjunction Exercise</h1>
        <h2>Complete the sentence</h2>
        <p className="page-header-description">
          {isMobile 
            ? "Practice Dutch conjunctions! Complete each sentence with the correct conjunction." 
            : "Test your knowledge of Dutch conjunctions! Complete each sentence with the correct conjunction (voegwoord) and get instant feedback with the English translation."
          }
        </p>
      </header>

      <ScoreDisplay score={score} />
      
      <section aria-labelledby="exercise-heading" className="exercise-container">
        <h2 id="exercise-heading" className="exercise-heading">
          Complete the sentence:
        </h2>
        
        <ConjunctionExercise
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
        <p>Dutch conjunctions (voegwoorden) are essential words that connect clauses, sentences, and ideas. They help express relationships between different parts of speech:</p>
        <ul className="info-list">
          <li><strong>Coordinating conjunctions</strong> - connect equal elements (en, maar, of, want, dus)</li>
          <li><strong>Subordinating conjunctions</strong> - connect dependent clauses (omdat, als, dat, hoewel)</li>
          <li><strong>Correlative conjunctions</strong> - work in pairs (noch...noch, of...of)</li>
        </ul>
        <p>This interactive exercise helps you learn through:</p>
        <ul className="info-list">
          <li><strong>Contextual learning</strong> - See conjunctions used in real sentences</li>
          <li><strong>Translation support</strong> - Understand meaning with English translations</li>
          <li><strong>Active practice</strong> - Type the conjunction yourself instead of just reading</li>
          <li><strong>Instant feedback</strong> - Know immediately if you're correct or not</li>
          <li><strong>Score tracking</strong> - Monitor your progress over time</li>
          <li><strong>Category awareness</strong> - Learn different types of conjunction usage</li>
        </ul>
        <p>Practice with carefully selected sentences covering the most important Dutch conjunctions across different categories!</p>
      </CollapsibleInfoSection>
      
      <SocialSharing
        title={shareData.title}
        description={shareData.description}
      />
    </PageLayout>
  )
}

export default ConjunctionsPage
