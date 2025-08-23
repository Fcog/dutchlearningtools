import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../components/templates/PageLayout'
import ScoreDisplay from '../components/molecules/ScoreDisplay'
import NegationExercise from '../components/organisms/NegationExercise'
import SocialSharing from '../components/organisms/SocialSharing'
import { Footer } from '../components/atoms'

function NegationPage() {
  const navigate = useNavigate()
  const [negationData, setNegationData] = useState(null)
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

  // Load negation data asynchronously
  const loadNegationData = async () => {
    try {
      setIsDataLoading(true)
      const data = await import('../data/dutch-negation.json')
      setNegationData(data.default)
    } catch (error) {
      console.error('Error loading negation data:', error)
    } finally {
      setIsDataLoading(false)
    }
  }

  // Load data on component mount
  useEffect(() => {
    loadNegationData()
  }, [])

  // Initialize with first exercise after data is loaded
  useEffect(() => {
    if (negationData && !isDataLoading) {
      generateNewExercise()
    }
  }, [negationData, isDataLoading])

  // Function to get a random exercise
  const getRandomExercise = () => {
    if (!negationData || negationData.length === 0) return null
    
    const randomIndex = Math.floor(Math.random() * negationData.length)
    return negationData[randomIndex]
  }

  // Generate new exercise
  const generateNewExercise = () => {
    const newExercise = getRandomExercise()
    setCurrentExercise(newExercise)
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
  const handleCheckAnswer = () => {
    if (!selectedOption) return
    
    const correct = selectedOption === currentExercise.correct_answer
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
    if (e.key === 'Enter' && !showResult && selectedOption) {
      handleCheckAnswer()
    } else if (e.key === 'Enter' && showResult) {
      generateNewExercise()
    }
  }

  // Social sharing data
  const shareData = {
    title: "Dutch Negation Exercise - Interactive Dutch Grammar Practice",
    description: "Master Dutch negation with our interactive exercise! Practice choosing between correct and incorrect negative sentences and learn the rules of Dutch negation."
  }

  if (isDataLoading || !currentExercise) {
    return (
      <PageLayout>
        <h1>Loading...</h1>
        <p>Loading your Dutch negation exercise</p>
      </PageLayout>
    )
  }

  return (
    <PageLayout 
      showBreadcrumb 
      breadcrumbPage="Negation Exercise"
      onHomeClick={() => navigate('/')}
      footer={<Footer />}
    >
      <header>
        <h1>Dutch Negation Exercise: Choose the Correct Response</h1>
        <p className="page-header-description">
          Practice Dutch negation patterns! Choose the correct negative response from two options and learn the rules of Dutch negation with 'niet', 'geen', and modal verbs.
        </p>
      </header>

      <ScoreDisplay score={score} />
      
      <section aria-labelledby="exercise-heading" className="exercise-container">
        <h2 id="exercise-heading" className="exercise-heading">
          Choose the correct negative response:
        </h2>
        
        <NegationExercise
          currentExercise={currentExercise}
          showResult={showResult}
          isCorrect={isCorrect}
          selectedOption={selectedOption}
          onOptionSelect={handleOptionSelect}
          onKeyPress={handleKeyPress}
          onCheckAnswer={handleCheckAnswer}
          onNextExercise={generateNewExercise}
        />
      </section>
      
      <section className="info-section">
        <h2 className="info-section-title">
          How This Exercise Helps You Learn Dutch Negation
        </h2>
        <div className="info-section-content">
          <p>Dutch negation follows specific rules that differ from English. This exercise helps you master the key patterns:</p>
          <ul className="info-list">
            <li><strong>Niet vs Geen</strong> - 'Niet' negates verbs and adjectives, 'geen' negates nouns</li>
            <li><strong>Word Order</strong> - 'Niet' usually comes after the direct object</li>
            <li><strong>Modal Verbs</strong> - 'Hoeven niet' (don't have to) vs 'moet niet' (must not)</li>
            <li><strong>Prepositional Phrases</strong> - 'Niet' comes before prepositional phrases</li>
            <li><strong>Proper Nouns</strong> - Use 'niet' with proper nouns, not 'geen'</li>
          </ul>
          <p>This interactive exercise helps you learn through:</p>
          <ul className="info-list">
            <li><strong>Comparative Learning</strong> - See correct vs incorrect examples side by side</li>
            <li><strong>Contextual Practice</strong> - Learn negation in realistic conversation contexts</li>
            <li><strong>Detailed Explanations</strong> - Understand the grammar rules behind each answer</li>
            <li><strong>Translation Support</strong> - See both Dutch and English meanings</li>
            <li><strong>Instant Feedback</strong> - Know immediately if you're applying the rules correctly</li>
            <li><strong>Score Tracking</strong> - Monitor your progress with Dutch negation patterns</li>
          </ul>
          <p>Master the subtle but important differences in Dutch negation through focused practice!</p>
        </div>
      </section>
      
      <SocialSharing
        title={shareData.title}
        description={shareData.description}
      />
    </PageLayout>
  )
}

export default NegationPage
