import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../components/templates/PageLayout'
import { ScoreDisplay, CollapsibleInfoSection } from '../components/molecules'
import AdjectiveExercise from '../components/organisms/AdjectiveExercise'
import SocialSharing from '../components/organisms/SocialSharing'
import { Footer } from '../components/atoms'

function AdjectivesPage() {
  const navigate = useNavigate()
  const [dutchAdjectivesData, setDutchAdjectivesData] = useState(null)
  const [isDataLoading, setIsDataLoading] = useState(true)
  const [currentExercise, setCurrentExercise] = useState(null)
  const [selectedOption, setSelectedOption] = useState('')
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

  // Load adjective data asynchronously
  const loadAdjectiveData = async () => {
    try {
      setIsDataLoading(true)
      const data = await import('../data/dutch-adjectives.json')
      setDutchAdjectivesData(data.default)
    } catch (error) {
      console.error('Error loading adjective data:', error)
    } finally {
      setIsDataLoading(false)
    }
  }

  // Load data on component mount
  useEffect(() => {
    loadAdjectiveData()
  }, [])

  // Initialize with first exercise after data is loaded
  useEffect(() => {
    if (dutchAdjectivesData?.dutch_adjectives && !isDataLoading) {
      generateNewExercise()
    }
  }, [dutchAdjectivesData, isDataLoading])

  // Generate a new exercise
  const generateNewExercise = () => {
    if (!dutchAdjectivesData?.dutch_adjectives) return
    
    const exercises = dutchAdjectivesData.dutch_adjectives
    const randomExercise = exercises[Math.floor(Math.random() * exercises.length)]
    
    setCurrentExercise(randomExercise)
    setSelectedOption('')
    setShowResult(false)
    setIsCorrect(false)
    
    // Track "Next Exercise" clicks (but skip the initial load)
    if (currentExercise) {
      const newClickCount = nextExerciseClickCount + 1
      setNextExerciseClickCount(newClickCount)
    }
  }

  // Handle option selection
  const handleOptionSelect = (option) => {
    setSelectedOption(option)
  }

  // Check user's answer
  const checkAnswer = () => {
    if (!selectedOption) return
    
    const isAnswerCorrect = selectedOption === currentExercise.correct_answer
    
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
    if (e.key === 'Enter' && showResult) {
      generateNewExercise()
    }
  }

  // Get accuracy percentage
  const getAccuracy = () => {
    if (score.total === 0) return 0
    return Math.round((score.correct / score.total) * 100)
  }

  // Social sharing data
  const shareData = {
    title: "Dutch Adjective Exercise - Interactive Practice",
    description: "Master Dutch adjective declension! Learn when to use the correct form of adjectives with interactive exercises and instant feedback."
  }

  if (isDataLoading || !currentExercise) {
    return (
      <PageLayout>
        <h1>Loading...</h1>
        <p>Loading your Dutch adjective exercise</p>
      </PageLayout>
    )
  }

  return (
    <PageLayout 
      showBreadcrumb 
      breadcrumbPage="Adjective Exercise"
      onHomeClick={() => navigate('/')}
      footer={<Footer />}
    >
      <header>
        <h1>Dutch Adjective Practice</h1>
        <p className="page-header-description">
          Master Dutch adjective declension! Learn when to use the correct form of adjectives in different contexts. 
          Choose between the two options and get instant feedback with explanations.
        </p>
      </header>

      <ScoreDisplay score={score} />
    
      <section aria-labelledby="exercise-heading" className="exercise-container">
        <h2 id="exercise-heading" className="exercise-heading">
          Complete the sentence:
        </h2>
        
        <AdjectiveExercise
          currentExercise={currentExercise}
          selectedOption={selectedOption}
          showResult={showResult}
          isCorrect={isCorrect}
          onOptionSelect={handleOptionSelect}
          onKeyPress={handleKeyPress}
          onCheckAnswer={checkAnswer}
          onNextExercise={generateNewExercise}
        />
      </section>

      <CollapsibleInfoSection title="How This Exercise Helps You Learn">
        <p>Dutch adjective declension follows specific rules based on the noun's gender and definiteness:</p>
        <ul className="info-list">
          <li><strong>De-words with indefinite article (een)</strong> - adjective gets -e ending</li>
          <li><strong>Het-words with indefinite article (een)</strong> - adjective stays unchanged</li>
          <li><strong>Definite articles (de/het)</strong> - adjective always gets -e ending</li>
          <li><strong>No article</strong> - follows the het-word rule (unchanged for het-words)</li>
        </ul>
        <p>This interactive exercise helps you learn through:</p>
        <ul className="info-list">
          <li><strong>Multiple choice practice</strong> - Choose between correct and incorrect forms</li>
          <li><strong>Instant feedback</strong> - Know immediately if you're correct</li>
          <li><strong>Detailed explanations</strong> - Understand why each answer is correct</li>
          <li><strong>Score tracking</strong> - Monitor your progress over time</li>
          <li><strong>Real examples</strong> - Practice with authentic Dutch sentences</li>
        </ul>
        <p>Master one of the trickiest aspects of Dutch grammar with focused practice!</p>
      </CollapsibleInfoSection>
      
      <SocialSharing
        title={shareData.title}
        description={shareData.description}
      />
    </PageLayout>
  )
}

export default AdjectivesPage
