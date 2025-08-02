import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import dutchVerbsData from '../data/dutch-verbs-present.json'
import PageLayout from '../components/templates/PageLayout'
import ScoreDisplay from '../components/molecules/ScoreDisplay'
import VerbExercise from '../components/organisms/VerbExercise'
import SocialSharing from '../components/organisms/SocialSharing'

const PRONOUNS = ['ik', 'jij', 'hij/zij', 'wij', 'jullie', 'zij']

function VerbConjugationPage() {
  const navigate = useNavigate()
  const [currentVerb, setCurrentVerb] = useState(null)
  const [currentPronoun, setCurrentPronoun] = useState(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [isMobile, setIsMobile] = useState(false)

  // Check if user is on mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Initialize with first exercise
  useEffect(() => {
    generateNewExercise()
  }, [])

  // Generate a new exercise
  const generateNewExercise = () => {
    const verbs = dutchVerbsData.dutch_verbs
    const randomVerb = verbs[Math.floor(Math.random() * verbs.length)]
    const randomPronoun = PRONOUNS[Math.floor(Math.random() * PRONOUNS.length)]
    
    setCurrentVerb(randomVerb)
    setCurrentPronoun(randomPronoun)
    setUserAnswer('')
    setShowResult(false)
    setIsCorrect(false)
  }

  // Check user's answer
  const checkAnswer = () => {
    if (!userAnswer.trim()) return
    
    const correctAnswer = currentVerb.conjugations[currentPronoun]
    const isAnswerCorrect = userAnswer.trim().toLowerCase() === correctAnswer.toLowerCase()
    
    setIsCorrect(isAnswerCorrect)
    setShowResult(true)
    
    // Update score
    setScore(prevScore => ({
      correct: isAnswerCorrect ? prevScore.correct + 1 : prevScore.correct,
      total: prevScore.total + 1
    }))
  }

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !showResult) {
      checkAnswer()
    } else if (e.key === 'Enter' && showResult) {
      generateNewExercise()
    }
  }

  // Get accuracy percentage
  const getAccuracy = () => {
    if (score.total === 0) return 0
    return Math.round((score.correct / score.total) * 100)
  }

  // Social sharing functionality
  const shareData = {
    title: "Dutch Verb Conjugation Exercise - Interactive Present Tense Practice",
    description: "Master Dutch verb conjugations with our interactive exercise! Practice present tense conjugations with common Dutch verbs and get instant feedback."
  }

  const handleSocialShare = (platform) => {
    const url = window.location.href
    const encodedUrl = encodeURIComponent(url)
    const encodedTitle = encodeURIComponent(shareData.title)
    const encodedDescription = encodeURIComponent(shareData.description)
    const encodedText = encodeURIComponent(`${shareData.title} - ${shareData.description}`)

    let shareUrl = '#'
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
        break
      case 'tiktok':
        shareUrl = `https://www.tiktok.com/share?url=${encodedUrl}&text=${encodedText}`
        break
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
        break
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedText}%20${encodedUrl}`
        break
      case 'reddit':
        shareUrl = `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`
        break
      case 'threads':
        shareUrl = `https://threads.net/intent/post?text=${encodedText}%20${encodedUrl}`
        break
    }
    window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes')
  }

  if (!currentVerb || !currentPronoun) {
    return (
      <PageLayout>
        <h1>Loading...</h1>
        <p>Loading your Dutch verb conjugation exercise</p>
      </PageLayout>
    )
  }

  return (
    <PageLayout 
      showBreadcrumb 
      breadcrumbPage="Verb Conjugation Exercise"
      onHomeClick={() => navigate('/')}
      footer={
        <>
          <p>🇳🇱 Master Dutch verb conjugations through interactive practice! Perfect for beginners learning Nederlandse werkwoorden.</p>
          <p>Free Dutch language exercise with common verbs and instant feedback.</p>
        </>
      }
    >
      <header>
        <h1>Dutch Verb Conjugation: Present Tense Practice</h1>
        <p style={{ fontSize: '1.2em', color: '#666', marginBottom: '20px' }}>
          {isMobile 
            ? "Practice Dutch verb conjugations! Complete each sentence with the correct verb form." 
            : "Master Dutch verb conjugations in present tense! Type the correct conjugated form for each pronoun and get instant feedback."
          }
        </p>
      </header>

      <ScoreDisplay score={score} />
      
      <section aria-labelledby="exercise-heading" className="exercise-container">
        <h2 id="exercise-heading" style={{ fontSize: '1.5em', color: '#333', marginBottom: '20px', textAlign: 'center' }}>
          Conjugate the verb:
        </h2>
        
        <VerbExercise
          currentVerb={currentVerb}
          currentPronoun={currentPronoun}
          userAnswer={userAnswer}
          showResult={showResult}
          isCorrect={isCorrect}
          onAnswerChange={(e) => setUserAnswer(e.target.value)}
          onKeyPress={handleKeyPress}
          onCheckAnswer={checkAnswer}
          onNextExercise={generateNewExercise}
        />
      </section>

      <section style={{ marginTop: '40px' }}>
        <h2 style={{ fontSize: '1.4em', color: '#333', marginBottom: '15px' }}>
          How This Exercise Helps You Learn
        </h2>
        <div style={{ textAlign: 'left', color: '#666', lineHeight: '1.6' }}>
          <p>Dutch verb conjugation is fundamental for expressing actions and communicating effectively. Present tense conjugations follow predictable patterns:</p>
          <ul style={{ marginLeft: '20px' }}>
            <li><strong>"ik"</strong> - uses the verb stem (infinitive without -en)</li>
            <li><strong>"jij/hij/zij"</strong> - adds -t to the stem</li>
            <li><strong>"wij/jullie/zij"</strong> - uses the full infinitive form</li>
          </ul>
          <p>This interactive exercise helps you learn through:</p>
          <ul style={{ marginLeft: '20px' }}>
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
        onShare={handleSocialShare}
      />
    </PageLayout>
  )
}

export default VerbConjugationPage