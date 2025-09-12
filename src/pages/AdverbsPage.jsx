import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../components/templates/PageLayout'
import { ScoreDisplay, CollapsibleInfoSection } from '../components/molecules'
import AdverbsFilterSidebar from '../components/organisms/AdverbsFilterSidebar'
import AdverbsExercise from '../components/organisms/AdverbsExercise'
import SocialSharing from '../components/organisms/SocialSharing'
import { Footer } from '../components/atoms'
import { saveFilterPreferences, loadFilterPreferences } from '../utils/filterStorage'
import { createExerciseHistory, exerciseIdGenerators } from '../utils/exerciseHistory'

// Initialize exercise history manager
const exerciseHistory = createExerciseHistory('adverbs', 10)

function AdverbsPage() {
  const navigate = useNavigate()
  const [adverbsData, setAdverbsData] = useState(null)
  const [isDataLoading, setIsDataLoading] = useState(true)
  const [currentExercise, setCurrentExercise] = useState(null)
  
  // Load filter preferences from localStorage on component mount
  const savedFilters = loadFilterPreferences('ADVERBS')
  const [selectedDifficulties, setSelectedDifficulties] = useState(savedFilters.selectedDifficulties || ['A1', 'A2', 'B1'])
  const [selectedCategories, setSelectedCategories] = useState(savedFilters.selectedCategories || ['time', 'degree', 'frequency'])
  const [selectedFrequencies, setSelectedFrequencies] = useState(savedFilters.selectedFrequencies || ['very_high', 'high'])
  
  const [userAnswer, setUserAnswer] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [isMobile, setIsMobile] = useState(false)
  const [filteredAdverbs, setFilteredAdverbs] = useState([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
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
        // Analytics tracking could go here
      }
    }
  }, [])

  // Load adverbs data asynchronously
  const loadAdverbsData = async () => {
    try {
      setIsDataLoading(true)
      const data = await import('../data/dutch-adverbs.json')
      setAdverbsData(data.default)
    } catch (error) {
      console.error('Error loading adverbs data:', error)
    } finally {
      setIsDataLoading(false)
    }
  }

  // Load data on component mount
  useEffect(() => {
    loadAdverbsData()
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

  // Filter adverbs based on selected criteria
  const filterAdverbs = () => {
    if (!adverbsData?.adverbs) return []
    
    return adverbsData.adverbs.filter(adverb => {
      // Check difficulty filter
      const difficultyMatch = selectedDifficulties.includes(adverb.difficulty)
      
      // Check category filter
      const categoryMatch = selectedCategories.includes(adverb.category)
      
      // Check frequency filter
      const frequencyMatch = selectedFrequencies.includes(adverb.frequency)
      
      return difficultyMatch && categoryMatch && frequencyMatch
    })
  }

  // Save filter preferences to localStorage whenever they change
  useEffect(() => {
    const filterPreferences = {
      selectedDifficulties,
      selectedCategories,
      selectedFrequencies
    }
    saveFilterPreferences('ADVERBS', filterPreferences)
  }, [selectedDifficulties, selectedCategories, selectedFrequencies])

  // Update filtered adverbs when filters change
  useEffect(() => {
    if (adverbsData) {
      const filtered = filterAdverbs()
      setFilteredAdverbs(filtered)
    }
  }, [adverbsData, selectedDifficulties, selectedCategories, selectedFrequencies])

  // Initialize with first exercise after data is loaded and filtered
  useEffect(() => {
    if (filteredAdverbs.length > 0 && !isDataLoading) {
      generateNewExercise()
    }
  }, [filteredAdverbs, isDataLoading])

  // Regenerate exercise when selected filters change
  useEffect(() => {
    if (currentExercise && 
        (!selectedDifficulties.includes(currentExercise.difficulty) ||
         !selectedCategories.includes(currentExercise.category) ||
         !selectedFrequencies.includes(currentExercise.frequency))) {
      generateNewExercise()
    }
  }, [selectedDifficulties, selectedCategories, selectedFrequencies])

  // Generate a new exercise with smart selection to avoid repetition
  const generateNewExercise = () => {
    if (filteredAdverbs.length === 0) return
    
    // Use smart selection to avoid recently used exercises
    const selectedAdverb = exerciseHistory.selectSmartExercise(
      filteredAdverbs,
      (exercise) => exerciseIdGenerators.adverbs(exercise.id)
    )
    
    if (!selectedAdverb) return
    
    // Select a random sentence pair from the arrays
    const sentenceIndex = Math.floor(Math.random() * selectedAdverb.english_sentences.length)
    
    // Create exercise object with singular sentence properties
    const selectedExercise = {
      ...selectedAdverb,
      english_sentence: selectedAdverb.english_sentences[sentenceIndex],
      dutch_sentence: selectedAdverb.dutch_sentences[sentenceIndex]
    }
    
    // Set the selected exercise
    setCurrentExercise(selectedExercise)
    setUserAnswer('')
    setShowResult(false)
    setIsCorrect(false)
    
    // Add to history (but skip the initial load)
    if (currentExercise) {
      const exerciseId = exerciseIdGenerators.adverbs(selectedAdverb.id)
      exerciseHistory.addToHistory(exerciseId)
      
      const newClickCount = nextExerciseClickCount + 1
      setNextExerciseClickCount(newClickCount)
    }
  }

  // Check user's answer
  const checkAnswer = () => {
    if (!userAnswer.trim()) return
    
    const correctAnswer = currentExercise.correct_answer
    // More lenient comparison - normalize case and trim whitespace
    const userAnswerNormalized = userAnswer.trim().toLowerCase()
    const correctAnswerNormalized = correctAnswer.toLowerCase()
    
    const isAnswerCorrect = userAnswerNormalized === correctAnswerNormalized
    
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
    if (e.key === 'Enter' && !showResult) {
      checkAnswer()
    } else if (e.key === 'Enter' && showResult) {
      generateNewExercise()
    }
  }

  // Handle typing engagement tracking
  const handleAnswerChange = (e) => {
    const newValue = e.target.value
    setUserAnswer(newValue)
  }

  // Get accuracy percentage
  const getAccuracy = () => {
    if (score.total === 0) return 0
    return Math.round((score.correct / score.total) * 100)
  }

  // Handle filter changes
  const handleDifficultyChange = (newSelectedDifficulties) => {
    setSelectedDifficulties(newSelectedDifficulties)
  }

  const handleCategoryChange = (newSelectedCategories) => {
    setSelectedCategories(newSelectedCategories)
  }

  const handleFrequencyChange = (newSelectedFrequencies) => {
    setSelectedFrequencies(newSelectedFrequencies)
  }

  // Handle sidebar toggle
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  // Close sidebar on mobile when window resizes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isSidebarOpen) {
        setIsSidebarOpen(false)
      }
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isSidebarOpen])

  // Social sharing data
  const shareData = {
    title: "Dutch Adverbs Exercise - Master Dutch Adverbs in Context",
    description: "Practice Dutch adverbs by filling in missing words in real sentences! Learn time, degree, frequency, and place adverbs with immediate feedback."
  }

  if (isDataLoading || !currentExercise) {
    return (
      <PageLayout>
        <h1>Loading...</h1>
        <p>Loading your Dutch adverbs exercise</p>
        {adverbsData && filteredAdverbs.length === 0 && (
          <div className="no-verbs-message">
            <p>⚠️ No adverbs match your current filters. Please adjust your selection.</p>
          </div>
        )}
      </PageLayout>
    )
  }

  return (
    <div className={`page-with-sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <AdverbsFilterSidebar
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
        selectedDifficulties={selectedDifficulties}
        selectedCategories={selectedCategories}
        selectedFrequencies={selectedFrequencies}
        onDifficultyChange={handleDifficultyChange}
        onCategoryChange={handleCategoryChange}
        onFrequencyChange={handleFrequencyChange}
        filteredAdverbsCount={filteredAdverbs.length}
      />

      <PageLayout 
        showBreadcrumb 
        breadcrumbPage="Adverbs Exercise"
        onHomeClick={() => navigate('/')}
        className={`main-content ${isSidebarOpen ? 'content-shifted' : ''}`}
        footer={<Footer />}
      >
        <header>
          <h1>Adverbs Exercise</h1>
          <h2>Fill in the Missing Dutch Adverbs</h2>
          <p className="page-header-description">
            {isMobile 
              ? "Complete Dutch sentences by filling in the missing adverbs! Use the filter menu to customize your practice." 
              : "Master Dutch adverbs by completing sentences with the correct adverb. See the English context and fill in the Dutch blank. Use the filters on the left to customize your practice by difficulty, category, and frequency."
            }
          </p>
        </header>

        <ScoreDisplay score={score} />
      
        <section aria-labelledby="exercise-heading" className="exercise-container">
          <h2 id="exercise-heading" className="exercise-heading">
            Fill in the missing adverb:
          </h2>
          
          <AdverbsExercise
            currentExercise={currentExercise}
            userAnswer={userAnswer}
            showResult={showResult}
            isCorrect={isCorrect}
            isMobile={isMobile}
            onAnswerChange={handleAnswerChange}
            onKeyPress={handleKeyPress}
            onCheckAnswer={checkAnswer}
            onNextExercise={generateNewExercise}
          />
        </section>

        <CollapsibleInfoSection title="How This Exercise Helps You Learn">
          <p>Learning Dutch adverbs in context is essential for natural-sounding speech and writing. This exercise helps you:</p>
          <ul className="info-list">
            <li><strong>Understand meaning through context</strong> - See how adverbs modify verbs, adjectives, and sentences</li>
            <li><strong>Learn word placement</strong> - Practice where adverbs naturally fit in Dutch sentences</li>
            <li><strong>Build vocabulary systematically</strong> - Focus on high-frequency adverbs that you'll use daily</li>
            <li><strong>Recognize adverb categories</strong> - Time, degree, frequency, place, and more</li>
            <li><strong>Develop fluency</strong> - Practice with real sentence structures</li>
          </ul>
          <p>Key benefits of this adverb practice:</p>
          <ul className="info-list">
            <li><strong>Contextual learning</strong> - Learn adverbs as they're actually used, not in isolation</li>
            <li><strong>Progressive difficulty</strong> - Start with basic A1 adverbs and advance to complex B2+ usage</li>
            <li><strong>Frequency-based practice</strong> - Focus on the most commonly used adverbs first</li>
            <li><strong>Immediate feedback</strong> - Know instantly if you chose the right adverb</li>
            <li><strong>Category awareness</strong> - Understand different types of adverbs and their functions</li>
          </ul>
          <p>Adverbs like "eigenlijk," "toch," and "gewoon" are extremely common in spoken Dutch and will make your conversations sound much more natural!</p>
        </CollapsibleInfoSection>
        
        <SocialSharing
          title={shareData.title}
          description={shareData.description}
        />
      </PageLayout>
    </div>
  )
}

export default AdverbsPage
