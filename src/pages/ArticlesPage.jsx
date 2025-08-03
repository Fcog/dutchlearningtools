import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '../components/templates/PageLayout'
import ScoreDisplay from '../components/molecules/ScoreDisplay'
import ArticleExercise from '../components/organisms/ArticleExercise'
import SocialSharing from '../components/organisms/SocialSharing'
import { trackLearningEvent } from '../utils/analytics'

function ArticlesPage() {
  const navigate = useNavigate()
  const [dutchNounsData, setDutchNounsData] = useState(null)
  const [isDataLoading, setIsDataLoading] = useState(true)
  const [currentWord, setCurrentWord] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [nextWordClickCount, setNextWordClickCount] = useState(0)
  const scoreRef = useRef({ correct: 0, total: 0 })

  // Update ref when score changes
  useEffect(() => {
    scoreRef.current = score
  }, [score])

  // Track page visit
  useEffect(() => {
    trackLearningEvent('page_visited', 'navigation', {
      page_name: 'articles',
      tool_type: 'language_learning'
    })
  }, [])

  // Track session end when component unmounts
  useEffect(() => {
    return () => {
      const finalScore = scoreRef.current
      if (finalScore.total > 0) {
        trackLearningEvent('session_ended', 'article_practice', {
          session_duration_exercises: finalScore.total,
          final_score: finalScore.correct,
          final_accuracy: Math.round((finalScore.correct / finalScore.total) * 100),
          completion_reason: 'page_navigation'
        })
      }
    }
  }, [])

  // Load noun data asynchronously
  const loadNounData = async () => {
    try {
      setIsDataLoading(true)
      const data = await import('../data/dutch-nouns.json')
      setDutchNounsData(data.default)
    } catch (error) {
      console.error('Error loading noun data:', error)
    } finally {
      setIsDataLoading(false)
    }
  }

  // Load data on component mount
  useEffect(() => {
    loadNounData()
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

  // Initialize with first word after data is loaded
  useEffect(() => {
    if (dutchNounsData && !isDataLoading && !currentWord) {
      handleNextWord()
    }
  }, [dutchNounsData, isDataLoading])

  // Function to get a random word for exercise
  const getRandomWord = () => {
    if (!dutchNounsData?.dutch_nouns) return null
    
    const words = dutchNounsData.dutch_nouns
    const randomIndex = Math.floor(Math.random() * words.length)
    return words[randomIndex]
  }



  // Handle article selection
  const handleArticleChoice = (chosenArticle) => {
    setSelectedArticle(chosenArticle)
    const correct = chosenArticle === currentWord.article
    setIsCorrect(correct)
    setShowResult(true)
    
    // Update score
    const newScore = {
      correct: correct ? score.correct + 1 : score.correct,
      total: score.total + 1
    }
    setScore(newScore)
    
    // Track article selection event
    trackLearningEvent('article_selected', 'article_practice', {
      is_correct: correct,
      selected_article: chosenArticle,
      correct_article: currentWord.article,
      word_category: currentWord.category,
      word_translation: currentWord.translation,
      current_session_score: newScore.correct,
      current_session_total: newScore.total,
      accuracy: newScore.total > 0 ? Math.round((newScore.correct / newScore.total) * 100) : 0
    })
    
    // Track milestone achievements
    if (newScore.total === 5 || newScore.total === 10 || newScore.total === 25 || newScore.total === 50) {
      trackLearningEvent('milestone_reached', 'article_practice', {
        milestone_type: 'exercises_completed',
        milestone_value: newScore.total,
        accuracy_at_milestone: Math.round((newScore.correct / newScore.total) * 100),
        session_score: newScore.correct
      })
    }
    
    // Track high accuracy achievements
    const accuracy = Math.round((newScore.correct / newScore.total) * 100)
    if (newScore.total >= 10 && (accuracy === 90 || accuracy === 95 || accuracy === 100)) {
      trackLearningEvent('achievement_unlocked', 'article_practice', {
        achievement_type: 'high_accuracy',
        accuracy_percentage: accuracy,
        exercises_completed: newScore.total,
        score: newScore.correct
      })
    }
  }

  // Get next word
  const handleNextWord = () => {
    const newWord = getRandomWord()
    setCurrentWord(newWord)
    setSelectedArticle(null)
    setShowResult(false)
    setIsCorrect(false)
    
    // Track "Next Word" clicks (but skip the initial load)
    if (currentWord) {
      const newClickCount = nextWordClickCount + 1
      setNextWordClickCount(newClickCount)
      
      trackLearningEvent('next_word_clicked', 'article_practice', {
        total_next_clicks: newClickCount,
        current_session_score: score.correct,
        current_session_total: score.total,
        accuracy: score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0
      })
    }
  }

  // Social sharing data
  const shareData = {
    title: "Dutch Article Exercise - Interactive De & Het Quiz",
    description: "Practice Dutch articles with our interactive exercise! Choose between 'de' and 'het' for 200 common Dutch nouns and get instant feedback."
  }

  if (isDataLoading || !currentWord) {
    return (
      <PageLayout>
        <h1>Loading...</h1>
        <p>Loading your Dutch article exercise</p>
      </PageLayout>
    )
  }

  return (
    <PageLayout 
      showBreadcrumb 
      breadcrumbPage="Article Exercise"
      onHomeClick={() => navigate('/')}
      footer={
        <>
          <p>🇳🇱 Master Dutch articles through interactive practice! Perfect for beginners learning Nederlandse lidwoorden.</p>
          <p>Free Dutch language exercise with 200+ common nouns and instant feedback.</p>
        </>
      }
    >
      <header>
        <h1>Dutch Article Exercise: Choose De or Het</h1>
        <p className="page-header-description">
          {isMobile 
            ? "Practice Dutch articles! Choose the correct article for each noun." 
            : "Test your knowledge of Dutch articles! Choose whether each noun uses 'de' or 'het' and get instant feedback."
          }
        </p>
      </header>

      <ScoreDisplay score={score} />
      
      <section aria-labelledby="exercise-heading" className="exercise-container">
        <h2 id="exercise-heading" className="exercise-heading">
          Choose the correct article:
        </h2>
        
        <ArticleExercise
          currentWord={currentWord}
          showResult={showResult}
          isCorrect={isCorrect}
          selectedArticle={selectedArticle}
          onArticleChoice={handleArticleChoice}
          onNextWord={handleNextWord}
        />
      </section>
      
      <section className="info-section">
        <h2 className="info-section-title">
          How This Exercise Helps You Learn
        </h2>
        <div className="info-section-content">
          <p>Dutch articles (lidwoorden) are essential for proper Dutch grammar. Unlike English, Dutch has two definite articles:</p>
          <ul className="info-list">
            <li><strong>"de"</strong> - used with common gender nouns (about 75% of nouns)</li>
            <li><strong>"het"</strong> - used with neuter gender nouns (about 25% of nouns)</li>
          </ul>
          <p>This interactive exercise helps you learn through:</p>
          <ul className="info-list">
            <li><strong>Active practice</strong> - Choose the article yourself instead of just reading</li>
            <li><strong>Instant feedback</strong> - Know immediately if you're correct or not</li>
            <li><strong>Score tracking</strong> - Monitor your progress over time</li>
            <li><strong>Repetition</strong> - Practice with random words to reinforce learning</li>
          </ul>
          <p>Practice with 200 of the most frequently used Dutch words to build your confidence!</p>
        </div>
      </section>
      
      
      <SocialSharing
        title={shareData.title}
        description={shareData.description}
      />
    </PageLayout>
  )
}

export default ArticlesPage