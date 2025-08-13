import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../components/templates/PageLayout'
import ScoreDisplay from '../components/molecules/ScoreDisplay'
import VerbWithPrepositionExercise from '../components/organisms/VerbWithPrepositionExercise'
import VerbPrepositionFilterSelector from '../components/organisms/VerbPrepositionFilterSelector'
import VerbPrepositionFilterSidebar from '../components/organisms/VerbPrepositionFilterSidebar'
import SocialSharing from '../components/organisms/SocialSharing'
import { Button, Icon } from '../components/atoms'
import { trackLearningEvent } from '../utils/analytics'

function VerbPrepositionsPage() {
  const navigate = useNavigate()
  const [verbsData, setVerbsData] = useState(null)
  const [isDataLoading, setIsDataLoading] = useState(true)
  const [currentExercise, setCurrentExercise] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const [filteredVerbs, setFilteredVerbs] = useState([])
  const [selectedLevels, setSelectedLevels] = useState(['A2', 'B1', 'B2']) // Default to all available levels
  const [showFilters, setShowFilters] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
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

  // Track page visit
  useEffect(() => {
    trackLearningEvent('page_visited', 'navigation', {
      page_name: 'verb_prepositions',
      tool_type: 'language_learning'
    })
  }, [])

  // Track session end when component unmounts
  useEffect(() => {
    return () => {
      const finalScore = scoreRef.current
      if (finalScore.total > 0) {
        trackLearningEvent('session_ended', 'verb_preposition_practice', {
          session_duration_exercises: finalScore.total,
          final_score: finalScore.correct,
          final_accuracy: Math.round((finalScore.correct / finalScore.total) * 100),
          completion_reason: 'page_navigation'
        })
      }
    }
  }, [])

  // Load verb preposition data asynchronously
  const loadVerbPrepositionData = async () => {
    try {
      setIsDataLoading(true)
      const data = await import('../data/verbs-fixed-prepositions.json')
      setVerbsData(data.default)
    } catch (error) {
      console.error('Error loading verb preposition data:', error)
    } finally {
      setIsDataLoading(false)
    }
  }

  // Load data on component mount
  useEffect(() => {
    loadVerbPrepositionData()
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

  // Filter verbs based on selected levels (prepared for future filtering)
  const filterVerbs = () => {
    if (!verbsData || verbsData.length === 0) return []
    
    return verbsData.filter(verb => {
      // For now, just filter by level - additional filters can be added later
      return selectedLevels.includes(verb.level)
    })
  }

  // Update filtered verbs when filters change
  useEffect(() => {
    if (verbsData) {
      const filtered = filterVerbs()
      setFilteredVerbs(filtered)
    }
  }, [verbsData, selectedLevels])

  // Initialize with first exercise after data is loaded and filtered
  useEffect(() => {
    if (filteredVerbs.length > 0 && !isDataLoading && !currentExercise) {
      handleNextExercise()
      
      // Track exercise initialization
      trackLearningEvent('exercise_started', 'verb_preposition_practice', {
        total_exercises_available: filteredVerbs.length,
        exercise_type: 'verb_preposition_completion',
        selected_levels: selectedLevels
      })
    }
  }, [filteredVerbs, isDataLoading])

  // Function to get a random exercise from filtered verbs
  const getRandomExercise = () => {
    if (!filteredVerbs || filteredVerbs.length === 0) return null
    
    const randomIndex = Math.floor(Math.random() * filteredVerbs.length)
    return filteredVerbs[randomIndex]
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
    
    // Track answer checking event
    trackLearningEvent('answer_checked', 'verb_preposition_practice', {
      is_correct: correct,
      user_answer: userAnswer.trim().toLowerCase(),
      correct_answer: currentExercise.preposition.toLowerCase(),
      verb: currentExercise.verb,
      level: currentExercise.level,
      current_session_score: newScore.correct,
      current_session_total: newScore.total,
      accuracy: newScore.total > 0 ? Math.round((newScore.correct / newScore.total) * 100) : 0
    })
    
    // Track milestone achievements
    if (newScore.total === 5 || newScore.total === 10 || newScore.total === 25 || newScore.total === 50) {
      trackLearningEvent('milestone_reached', 'verb_preposition_practice', {
        milestone_type: 'exercises_completed',
        milestone_value: newScore.total,
        accuracy_at_milestone: Math.round((newScore.correct / newScore.total) * 100),
        session_score: newScore.correct
      })
    }
    
    // Track high accuracy achievements
    const accuracy = Math.round((newScore.correct / newScore.total) * 100)
    if (newScore.total >= 10 && (accuracy === 90 || accuracy === 95 || accuracy === 100)) {
      trackLearningEvent('achievement_unlocked', 'verb_preposition_practice', {
        achievement_type: 'high_accuracy',
        accuracy_percentage: accuracy,
        exercises_completed: newScore.total,
        score: newScore.correct
      })
    }
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
      
      trackLearningEvent('next_exercise_clicked', 'verb_preposition_practice', {
        total_next_clicks: newClickCount,
        current_session_score: score.correct,
        current_session_total: score.total,
        accuracy: score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0
      })
    }
  }

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !showResult) {
      // Track keyboard shortcut usage
      trackLearningEvent('keyboard_shortcut_used', 'verb_preposition_practice', {
        shortcut_type: 'enter_to_check',
        user_answer_length: userAnswer.trim().length,
        has_answer: !!userAnswer.trim()
      })
      handleCheckAnswer()
    } else if (e.key === 'Enter' && showResult) {
      // Track keyboard shortcut usage
      trackLearningEvent('keyboard_shortcut_used', 'verb_preposition_practice', {
        shortcut_type: 'enter_to_continue',
        was_correct: isCorrect,
        current_session_score: score.correct,
        current_session_total: score.total
      })
      handleNextExercise()
    }
  }

  // Handle first keystroke to track engagement
  const handleAnswerChange = (e) => {
    const newValue = e.target.value
    
    // Track first keystroke for engagement
    if (userAnswer === '' && newValue.length === 1) {
      trackLearningEvent('typing_started', 'verb_preposition_practice', {
        verb: currentExercise?.verb,
        level: currentExercise?.level,
        exercise_number: score.total + 1
      })
    }
    
    setUserAnswer(newValue)
  }

  // Filter handlers
  const handleLevelChange = (levels) => {
    setSelectedLevels(levels)
    // Reset exercise when filters change
    setCurrentExercise(null)
    setUserAnswer('')
    setShowResult(false)
    setIsCorrect(false)
  }

  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  // Social sharing data
  const shareData = {
    title: "Dutch Verbs with Fixed Prepositions - Interactive Dutch Grammar Practice",
    description: "Master Dutch verbs with fixed prepositions! Practice with real examples and get instant feedback on your Dutch grammar skills."
  }

  if (isDataLoading) {
    return (
      <PageLayout>
        <h1>Loading...</h1>
        <p>Loading your Dutch verb preposition exercise</p>
      </PageLayout>
    )
  }

  if (filteredVerbs.length === 0) {
    return (
      <PageLayout 
        showBreadcrumb 
        breadcrumbPage="Verb Fixed Prepositions Exercise"
        onHomeClick={() => navigate('/')}
      >
        <header>
          <h1>Dutch Verbs with Fixed Prepositions</h1>
          <p className="page-header-description">
            No verbs available with your current filter selection. Please adjust your level filters.
          </p>
        </header>

        {/* Filter Controls */}
        <div className="filter-controls">
          {!isMobile && (
            <div className="desktop-filter-container">
              <Button
                onClick={toggleFilters}
                variant="secondary"
                size="medium"
                className={`filter-toggle-button ${showFilters ? 'filter-toggle-active' : ''}`}
              >
                <Icon icon="🎚️" size="small" />
                Level Filters ({selectedLevels.length})
              </Button>
              
              {showFilters && (
                <div className="filter-selector-container">
                  <VerbPrepositionFilterSelector
                    selectedLevels={selectedLevels}
                    onLevelChange={handleLevelChange}
                    className="filter-selector-verb-prepositions"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <VerbPrepositionFilterSidebar
          isOpen={isSidebarOpen}
          onToggle={toggleSidebar}
          selectedLevels={selectedLevels}
          onLevelChange={handleLevelChange}
          filteredVerbsCount={filteredVerbs.length}
        />
      </PageLayout>
    )
  }

  if (!currentExercise) {
    return (
      <PageLayout>
        <h1>Loading...</h1>
        <p>Preparing your exercise...</p>
      </PageLayout>
    )
  }

  return (
    <PageLayout 
      showBreadcrumb 
      breadcrumbPage="Verb Fixed Prepositions Exercise"
      onHomeClick={() => navigate('/')}
      footer={
        <>
          <p>🇳🇱 Master Dutch verbs with fixed prepositions through interactive practice! Perfect for learning Nederlandse werkwoorden met vaste voorzetsels.</p>
          <p>Free Dutch language exercise with real-world examples and instant feedback.</p>
        </>
      }
    >
      <header>
        <h1>Dutch Verbs with Fixed Prepositions: Complete the Combination</h1>
        <p className="page-header-description">
          {isMobile 
            ? "Practice Dutch verbs with their fixed prepositions! Complete each verb-preposition combination." 
            : "Test your knowledge of Dutch verbs with fixed prepositions! Many Dutch verbs require specific prepositions to express complete meanings. Learn these essential combinations with real examples and instant feedback."
          }
        </p>
      </header>

      <ScoreDisplay score={score} />
      
      <section aria-labelledby="exercise-heading" className="exercise-container">
        <h2 id="exercise-heading" className="exercise-heading">
          Complete the verb combination:
        </h2>
        
        <VerbWithPrepositionExercise
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
          <p>Dutch verbs with fixed prepositions (werkwoorden met vaste voorzetsels) are essential combinations where specific verbs require specific prepositions to convey their complete meaning:</p>
          <ul className="info-list">
            <li><strong>Fixed combinations</strong> - verbs that always use the same preposition (denken aan, wachten op)</li>
            <li><strong>Meaning changes</strong> - the preposition affects the verb's meaning (kijken naar vs kijken op)</li>
            <li><strong>Common patterns</strong> - learn the most frequently used verb-preposition pairs</li>
            <li><strong>Level progression</strong> - from basic A2 combinations to advanced B2+ constructions</li>
          </ul>
          <p>This interactive exercise helps you learn through:</p>
          <ul className="info-list">
            <li><strong>Contextual learning</strong> - See verb-preposition combinations in real sentences</li>
            <li><strong>Translation support</strong> - Understand complete meanings with English translations</li>
            <li><strong>Example sentences</strong> - Learn through authentic Dutch usage patterns</li>
            <li><strong>Active practice</strong> - Type the preposition yourself to reinforce memory</li>
            <li><strong>Instant feedback</strong> - Know immediately if you've chosen correctly</li>
            <li><strong>Level awareness</strong> - Track your progress from A2 to B2+ level combinations</li>
            <li><strong>Score tracking</strong> - Monitor your improvement over time</li>
          </ul>
          <p>Practice with over 250 carefully selected verb-preposition combinations covering all CEFR levels!</p>
        </div>
      </section>
      
      <SocialSharing
        title={shareData.title}
        description={shareData.description}
      />
      
      {/* Mobile Filter Sidebar */}
      <VerbPrepositionFilterSidebar
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
        selectedLevels={selectedLevels}
        onLevelChange={handleLevelChange}
        filteredVerbsCount={filteredVerbs.length}
      />
    </PageLayout>
  )
}

export default VerbPrepositionsPage
