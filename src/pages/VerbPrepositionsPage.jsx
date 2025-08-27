import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../components/templates/PageLayout'
import { ScoreDisplay, CollapsibleInfoSection } from '../components/molecules'
import PhrasalVerbExercise from '../components/organisms/PhrasalVerbExercise'
import PhrasalVerbFilterSelector from '../components/organisms/PhrasalVerbFilterSelector'
import PhrasalVerbFilterSidebar from '../components/organisms/PhrasalVerbFilterSidebar'
import SocialSharing from '../components/organisms/SocialSharing'
import { Button, Icon, Footer } from '../components/atoms'
import { saveFilterPreferences, loadFilterPreferences } from '../utils/filterStorage'
import { createExerciseHistory, exerciseIdGenerators } from '../utils/exerciseHistory'

// Initialize exercise history manager
const exerciseHistory = createExerciseHistory('verb_prepositions', 3)

function VerbPrepositionsPage() {
  const navigate = useNavigate()
  const [verbsData, setVerbsData] = useState(null)
  const [isDataLoading, setIsDataLoading] = useState(true)
  const [currentExercise, setCurrentExercise] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const [filteredVerbs, setFilteredVerbs] = useState([])
  
  // Load filter preferences from localStorage on component mount
  const savedFilters = loadFilterPreferences('VERB_PREPOSITIONS')
  const [selectedLevels, setSelectedLevels] = useState(savedFilters.selectedLevels)
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





  // Load verb preposition data asynchronously
  const loadVerbPrepositionData = async () => {
    try {
      setIsDataLoading(true)
      const data = await import('../data/phrasal-verbs.json')
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

  // Save filter preferences to localStorage whenever they change
  useEffect(() => {
    const filterPreferences = {
      selectedLevels
    }
    saveFilterPreferences('VERB_PREPOSITIONS', filterPreferences)
  }, [selectedLevels])

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
    title: "Dutch Phrasal Verbs - Interactive Dutch Grammar Practice",
    description: "Master Dutch phrasal verbs! Practice with real examples and get instant feedback on your Dutch grammar skills."
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
        breadcrumbPage="Phrasal Verbs Exercise"
        onHomeClick={() => navigate('/')}
      >
        <header>
          <h1>Dutch Phrasal Verbs</h1>
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
                  <PhrasalVerbFilterSelector
                    selectedLevels={selectedLevels}
                    onLevelChange={handleLevelChange}
                    className="filter-selector-phrasal-verbs"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <PhrasalVerbFilterSidebar
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
              breadcrumbPage="Phrasal Verbs Exercise"
      onHomeClick={() => navigate('/')}
      footer={<Footer />}
    >
      <header>
        <h1>Dutch Phrasal Verbs: Complete the Combination</h1>
        <p className="page-header-description">
          {isMobile 
            ? "Practice Dutch phrasal verbs! Complete each phrasal verb combination." 
            : "Test your knowledge of Dutch phrasal verbs! Many Dutch verbs require specific prepositions to express complete meanings. Learn these essential combinations with real examples and instant feedback."
          }
        </p>
      </header>

      <ScoreDisplay score={score} />
      
      <section aria-labelledby="exercise-heading" className="exercise-container">
        <h2 id="exercise-heading" className="exercise-heading">
          Complete the verb combination:
        </h2>
        
        <PhrasalVerbExercise
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
        <p>Dutch phrasal verbs (werkwoorden met vaste voorzetsels) are essential combinations where specific verbs require specific prepositions to convey their complete meaning:</p>
        <ul className="info-list">
          <li><strong>Fixed combinations</strong> - verbs that always use the same preposition (denken aan, wachten op)</li>
          <li><strong>Meaning changes</strong> - the preposition affects the verb's meaning (kijken naar vs kijken op)</li>
          <li><strong>Common patterns</strong> - learn the most frequently used phrasal verb pairs</li>
          <li><strong>Level progression</strong> - from basic A2 combinations to advanced B2+ constructions</li>
        </ul>
        <p>This interactive exercise helps you learn through:</p>
        <ul className="info-list">
          <li><strong>Contextual learning</strong> - See phrasal verb combinations in real sentences</li>
          <li><strong>Translation support</strong> - Understand complete meanings with English translations</li>
          <li><strong>Example sentences</strong> - Learn through authentic Dutch usage patterns</li>
          <li><strong>Active practice</strong> - Type the preposition yourself to reinforce memory</li>
          <li><strong>Instant feedback</strong> - Know immediately if you've chosen correctly</li>
          <li><strong>Level awareness</strong> - Track your progress from A2 to B2+ level combinations</li>
          <li><strong>Score tracking</strong> - Monitor your improvement over time</li>
        </ul>
        <p>Practice with over 250 carefully selected phrasal verb combinations covering all CEFR levels!</p>
      </CollapsibleInfoSection>
      
      <SocialSharing
        title={shareData.title}
        description={shareData.description}
      />
      
      {/* Mobile Filter Sidebar */}
      <PhrasalVerbFilterSidebar
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
