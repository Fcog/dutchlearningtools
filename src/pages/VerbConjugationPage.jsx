import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../components/templates/PageLayout'
import ScoreDisplay from '../components/molecules/ScoreDisplay'
import FilterSidebar from '../components/organisms/FilterSidebar'
import VerbExercise from '../components/organisms/VerbExercise'
import SocialSharing from '../components/organisms/SocialSharing'
import { Footer } from '../components/atoms'
import { saveFilterPreferences, loadFilterPreferences } from '../utils/filterStorage'
import { VERB_FIELDS, getVerbField, getVerbConjugation } from '../utils/verbFields'


const PRONOUNS = ['ik', 'jij', 'hij/zij', 'wij', 'jullie', 'zij']

function VerbConjugationPage() {
  const navigate = useNavigate()
  const [dutchVerbsData, setDutchVerbsData] = useState(null)
  const [isDataLoading, setIsDataLoading] = useState(true)
  const [currentVerb, setCurrentVerb] = useState(null)
  const [currentPronoun, setCurrentPronoun] = useState(null)
  const [currentTense, setCurrentTense] = useState(null)
  
  // Load filter preferences from localStorage on component mount
  const savedFilters = loadFilterPreferences('VERB_CONJUGATION')
  const [selectedTenses, setSelectedTenses] = useState(savedFilters.selectedTenses)
  const [selectedLevels, setSelectedLevels] = useState(savedFilters.selectedLevels)
  const [selectedVerbTypes, setSelectedVerbTypes] = useState(savedFilters.selectedVerbTypes)
  const [selectedSeparable, setSelectedSeparable] = useState(savedFilters.selectedSeparable)
  const [userAnswer, setUserAnswer] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [isMobile, setIsMobile] = useState(false)
  const [filteredVerbs, setFilteredVerbs] = useState([])
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

      }
    }
  }, [])

  // Load verb data asynchronously
  const loadVerbData = async () => {
    try {
      setIsDataLoading(true)
      const data = await import('../data/dutch-verbs.json')
      setDutchVerbsData(data.default)
    } catch (error) {
      console.error('Error loading verb data:', error)
    } finally {
      setIsDataLoading(false)
    }
  }

  // Load data on component mount
  useEffect(() => {
    loadVerbData()
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

  // Filter verbs based on selected criteria
  const filterVerbs = () => {
    if (!dutchVerbsData?.[VERB_FIELDS.dutch_verbs]) return []
    
    return dutchVerbsData[VERB_FIELDS.dutch_verbs].filter(verb => {
      // Check level filter
      const levelMatch = selectedLevels.includes(getVerbField(verb, 'level'))
      
      // Check verb type filter (regular vs irregular)
      const verbTypeMatch = selectedVerbTypes.includes(
        getVerbField(verb, 'is_irregular') ? 'irregular' : 'regular'
      )
      
      // Check separable filter
      const separableMatch = selectedSeparable.includes(
        getVerbField(verb, 'is_separable') ? 'separable' : 'non-separable'
      )
      
      return levelMatch && verbTypeMatch && separableMatch
    })
  }

  // Save filter preferences to localStorage whenever they change
  useEffect(() => {
    const filterPreferences = {
      selectedTenses,
      selectedLevels,
      selectedVerbTypes,
      selectedSeparable
    }
    saveFilterPreferences('VERB_CONJUGATION', filterPreferences)
  }, [selectedTenses, selectedLevels, selectedVerbTypes, selectedSeparable])

  // Update filtered verbs when filters change
  useEffect(() => {
    if (dutchVerbsData) {
      const filtered = filterVerbs()
      setFilteredVerbs(filtered)
    }
  }, [dutchVerbsData, selectedLevels, selectedVerbTypes, selectedSeparable])

  // Initialize with first exercise after data is loaded and filtered
  useEffect(() => {
    if (filteredVerbs.length > 0 && !isDataLoading) {
      generateNewExercise()
    }
  }, [filteredVerbs, isDataLoading])

  // Regenerate exercise when selected tenses change
  useEffect(() => {
    if (currentVerb && currentTense && !selectedTenses.includes(currentTense)) {
      generateNewExercise()
    }
  }, [selectedTenses])

  // Generate a new exercise
  const generateNewExercise = () => {
    if (filteredVerbs.length === 0) return
    
    const randomVerb = filteredVerbs[Math.floor(Math.random() * filteredVerbs.length)]
    const randomPronoun = PRONOUNS[Math.floor(Math.random() * PRONOUNS.length)]
    const randomTense = selectedTenses[Math.floor(Math.random() * selectedTenses.length)]
    
    setCurrentVerb(randomVerb)
    setCurrentPronoun(randomPronoun)
    setCurrentTense(randomTense)
    setUserAnswer('')
    setShowResult(false)
    setIsCorrect(false)
    
    // Track "Next Exercise" clicks (but skip the initial load)
    if (currentVerb) {
      const newClickCount = nextExerciseClickCount + 1
      setNextExerciseClickCount(newClickCount)
      

    }
  }

  // Check user's answer
  const checkAnswer = () => {
    if (!userAnswer.trim()) return
    
    const correctAnswer = getVerbConjugation(currentVerb, currentTense, currentPronoun)
    const isAnswerCorrect = userAnswer.trim().toLowerCase() === correctAnswer.toLowerCase()
    
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
  const handleTenseChange = (newSelectedTenses) => {
    setSelectedTenses(newSelectedTenses)
    

  }

  const handleLevelChange = (newSelectedLevels) => {
    setSelectedLevels(newSelectedLevels)
    

  }

  const handleVerbTypeChange = (newSelectedVerbTypes) => {
    setSelectedVerbTypes(newSelectedVerbTypes)
    

  }

  const handleSeparableChange = (newSelectedSeparable) => {
    setSelectedSeparable(newSelectedSeparable)
    

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
    title: "Dutch Verb Conjugation Exercise - Interactive Multi-Tense Practice",
    description: "Master Dutch verb conjugations across multiple tenses! Choose from present, past, perfect, and future tenses. Interactive practice with common Dutch verbs and instant feedback."
  }

  if (isDataLoading || !currentVerb || !currentPronoun || !currentTense) {
    return (
      <PageLayout>
        <h1>Loading...</h1>
        <p>Loading your Dutch verb conjugation exercise</p>
        {dutchVerbsData && filteredVerbs.length === 0 && (
          <div className="no-verbs-message">
            <p>⚠️ No verbs match your current filters. Please adjust your selection.</p>
          </div>
        )}
      </PageLayout>
    )
  }

  return (
    <div className={`page-with-sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <FilterSidebar
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
        selectedTenses={selectedTenses}
        selectedLevels={selectedLevels}
        selectedVerbTypes={selectedVerbTypes}
        selectedSeparable={selectedSeparable}
        onTenseChange={handleTenseChange}
        onLevelChange={handleLevelChange}
        onVerbTypeChange={handleVerbTypeChange}
        onSeparableChange={handleSeparableChange}
        filteredVerbsCount={filteredVerbs.length}
      />

      <PageLayout 
        showBreadcrumb 
        breadcrumbPage="Verb Conjugation Exercise"
        onHomeClick={() => navigate('/')}
        className={`main-content ${isSidebarOpen ? 'content-shifted' : ''}`}
        footer={<Footer />}
      >
        <header>
          <h1>Dutch Verb Conjugation: Multi-Tense Practice</h1>
          <p className="page-header-description">
            {isMobile 
              ? "Practice Dutch verb conjugations across different tenses! Use the filter menu to customize your practice." 
              : "Master Dutch verb conjugations across multiple tenses! Use the filters on the left to customize your practice, then type the correct conjugated form for each pronoun and get instant feedback."
            }
          </p>
        </header>

        <ScoreDisplay score={score} />
      
      <section aria-labelledby="exercise-heading" className="exercise-container">
        <h2 id="exercise-heading" className="exercise-heading">
          Conjugate the verb:
        </h2>
        
        <VerbExercise
          currentVerb={currentVerb}
          currentPronoun={currentPronoun}
          currentTense={currentTense}
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

      <section className="info-section">
        <h2 className="info-section-title">
          How This Exercise Helps You Learn
        </h2>
        <div className="info-section-content">
          <p>Dutch verb conjugation is fundamental for expressing actions and communicating effectively. Present tense conjugations follow predictable patterns:</p>
          <ul className="info-list">
            <li><strong>"ik"</strong> - uses the verb stem (infinitive without -en)</li>
            <li><strong>"jij/hij/zij"</strong> - adds -t to the stem</li>
            <li><strong>"wij/jullie/zij"</strong> - uses the full infinitive form</li>
          </ul>
          <p>This interactive exercise helps you learn through:</p>
          <ul className="info-list">
            <li><strong>Active practice</strong> - Type conjugations yourself instead of just reading</li>
            <li><strong>Instant feedback</strong> - Know immediately if you're correct or not</li>
            <li><strong>Score tracking</strong> - Monitor your progress over time</li>
            <li><strong>Pattern recognition</strong> - Practice with common verbs to reinforce rules</li>
          </ul>
          <p>Master the foundations of Dutch grammar with interactive conjugation practice!</p>
        </div>
      </section>
      
      
        <SocialSharing
          title={shareData.title}
          description={shareData.description}
        />
      </PageLayout>
    </div>
  )
}

export default VerbConjugationPage