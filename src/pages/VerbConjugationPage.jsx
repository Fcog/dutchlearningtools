import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import dutchVerbsData from '../data/dutch-verbs-present.json'

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
    url: window.location.href,
    title: "Dutch Verb Conjugation Exercise - Interactive Present Tense Practice",
    description: "Master Dutch verb conjugations with our interactive exercise! Practice present tense conjugations with common Dutch verbs and get instant feedback."
  }

  const getSocialShareUrl = (platform) => {
    const { url, title, description } = shareData
    const encodedUrl = encodeURIComponent(url)
    const encodedTitle = encodeURIComponent(title)
    const encodedDescription = encodeURIComponent(description)
    const encodedText = encodeURIComponent(`${title} - ${description}`)

    switch (platform) {
      case 'facebook':
        return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
      case 'tiktok':
        return `https://www.tiktok.com/share?url=${encodedUrl}&text=${encodedText}`
      case 'linkedin':
        return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
      case 'whatsapp':
        return `https://wa.me/?text=${encodedText}%20${encodedUrl}`
      case 'reddit':
        return `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`
      case 'threads':
        return `https://threads.net/intent/post?text=${encodedText}%20${encodedUrl}`
      default:
        return '#'
    }
  }

  const handleSocialShare = (platform) => {
    const shareUrl = getSocialShareUrl(platform)
    window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes')
  }

  if (!currentVerb || !currentPronoun) {
    return (
      <div className="articles-container">
        <h1>Loading...</h1>
        <p>Loading your Dutch verb conjugation exercise</p>
      </div>
    )
  }

  return (
    <main className="articles-container" role="main">
      <nav className="breadcrumb">
        <button onClick={() => navigate('/')}>🏠 Dutch Learning Tools</button>
        <span> {'>'} </span>
        <span>Verb Conjugation Exercise</span>
      </nav>
      
      <header>
        <h1>Dutch Verb Conjugation: Present Tense Practice</h1>
        <p style={{ fontSize: '1.2em', color: '#666', marginBottom: '20px' }}>
          {isMobile 
            ? "Practice Dutch verb conjugations! Complete each sentence with the correct verb form." 
            : "Master Dutch verb conjugations in present tense! Type the correct conjugated form for each pronoun and get instant feedback."
          }
        </p>
      </header>

      {/* Score Display */}
      {score.total > 0 && (
        <div style={{
          textAlign: 'center',
          marginBottom: '20px',
          padding: '15px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <div style={{ fontSize: '1.1em', color: '#333' }}>
            Score: <strong>{score.correct}/{score.total}</strong> 
            {score.total > 0 && (
              <span style={{ color: '#666', marginLeft: '10px' }}>
                ({Math.round((score.correct / score.total) * 100)}%)
              </span>
            )}
          </div>
        </div>
      )}
      
      <section aria-labelledby="exercise-heading" className="exercise-container">
        <h2 id="exercise-heading" style={{ fontSize: '1.5em', color: '#333', marginBottom: '20px', textAlign: 'center' }}>
          Conjugate the verb:
        </h2>
        
        <article className="word-card" style={{
          marginTop: '20px',
          padding: '30px',
          backgroundColor: '#f8f9fa',
          borderRadius: '10px',
          border: '2px solid #e9ecef',
          textAlign: 'center'
        }}>
          {/* Verb Info */}
          <div style={{
            fontSize: '3em',
            color: '#333',
            marginBottom: '10px',
            fontWeight: 'bold'
          }}>
            <span lang="nl">{currentVerb.infinitive}</span>
          </div>
          <div style={{
            fontSize: '1.5em',
            color: '#6c757d',
            marginBottom: '30px'
          }}>
            English: {currentVerb.english}
          </div>

          {/* Exercise Prompt */}
          <div style={{
            fontSize: '1.3em',
            color: '#333',
            marginBottom: '20px'
          }}>
            Complete: <strong style={{ color: '#007bff' }}>{currentPronoun}</strong> _________
          </div>

          {!showResult ? (
            <div style={{ marginBottom: '20px' }}>
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type the conjugated verb..."
                style={{
                  width: '100%',
                  maxWidth: '300px',
                  padding: '15px',
                  fontSize: '1.3em',
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                  textAlign: 'center',
                  marginBottom: '20px'
                }}
                autoFocus
              />
              <div>
                <button
                  onClick={checkAnswer}
                  disabled={!userAnswer.trim()}
                  style={{
                    fontSize: '1.5em',
                    padding: '15px 30px',
                    backgroundColor: userAnswer.trim() ? '#007bff' : '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: userAnswer.trim() ? 'pointer' : 'not-allowed',
                    minWidth: '200px',
                    transition: 'background-color 0.3s'
                  }}
                  onMouseOver={(e) => {
                    if (userAnswer.trim()) {
                      e.target.style.backgroundColor = '#0056b3'
                    }
                  }}
                  onMouseOut={(e) => {
                    if (userAnswer.trim()) {
                      e.target.style.backgroundColor = '#007bff'
                    }
                  }}
                >
                  Check Answer
                </button>
              </div>
            </div>
          ) : (
            <div>
              {/* Result Display */}
              <div style={{
                padding: '20px',
                borderRadius: '10px',
                marginBottom: '25px',
                backgroundColor: isCorrect ? '#d4edda' : '#f8d7da',
                border: `2px solid ${isCorrect ? '#c3e6cb' : '#f5c6cb'}`,
                color: isCorrect ? '#155724' : '#721c24'
              }}>
                <div style={{ fontSize: '2em', marginBottom: '10px' }}>
                  {isCorrect ? '✅ Correct!' : '❌ Incorrect'}
                </div>
                <div style={{ fontSize: '1.5em', fontWeight: 'bold' }}>
                  {currentPronoun} {currentVerb.conjugations[currentPronoun]}
                </div>
                {!isCorrect && (
                  <div style={{ fontSize: '1em', marginTop: '10px', color: '#666' }}>
                    You answered: {userAnswer}
                  </div>
                )}
              </div>

              {/* Complete Conjugation Table */}
              <div style={{
                backgroundColor: 'white',
                border: '2px solid #e9ecef',
                borderRadius: '10px',
                padding: '20px',
                marginBottom: '25px'
              }}>
                <div style={{ fontSize: '1em', fontWeight: 'bold', marginBottom: '15px', color: '#333' }}>
                  Complete conjugation of "{currentVerb.infinitive}":
                </div>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
                  gap: '10px',
                  fontSize: '0.95em'
                }}>
                  {PRONOUNS.map(pronoun => (
                    <div key={pronoun} style={{ 
                      display: 'flex',
                      padding: '5px 0'
                    }}>
                      <span style={{ fontWeight: '600', paddingRight: '10px' }}>{pronoun}:</span>
                      <span>{currentVerb.conjugations[pronoun]}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={generateNewExercise}
                style={{
                  fontSize: '1.3em',
                  padding: '15px 30px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  minWidth: '200px',
                  transition: 'background-color 0.3s',
                  width: '100%',
                  maxWidth: '300px'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#218838'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
              >
                Next Exercise
              </button>
            </div>
          )}
        </article>
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
      
      <section className="social-sharing">
        <h2 style={{ fontSize: '1.3em', color: '#333', marginBottom: '10px', textAlign: 'center' }}>
          📢 Share This Tool
        </h2>
        <p style={{ color: '#666', textAlign: 'center', margin: '0 0 15px 0' }}>
          Help others learn Dutch! Share this free interactive verb conjugation exercise with your friends.
        </p>
        
        <div className="social-buttons">
          <a 
            href={getSocialShareUrl('facebook')}
            target="_blank"
            rel="noopener noreferrer"
            className="social-button facebook"
            aria-label="Share on Facebook"
            onClick={(e) => {
              e.preventDefault()
              handleSocialShare('facebook')
            }}
          >
            <span className="social-icon">📘</span>
            Facebook
          </a>
          
          <a 
            href={getSocialShareUrl('tiktok')}
            target="_blank"
            rel="noopener noreferrer"
            className="social-button tiktok"
            aria-label="Share on TikTok"
            onClick={(e) => {
              e.preventDefault()
              handleSocialShare('tiktok')
            }}
          >
            <span className="social-icon">🎵</span>
            TikTok
          </a>
          
          <a 
            href={getSocialShareUrl('linkedin')}
            target="_blank"
            rel="noopener noreferrer"
            className="social-button linkedin"
            aria-label="Share on LinkedIn"
            onClick={(e) => {
              e.preventDefault()
              handleSocialShare('linkedin')
            }}
          >
            <span className="social-icon">💼</span>
            LinkedIn
          </a>
          
          <a 
            href={getSocialShareUrl('whatsapp')}
            target="_blank"
            rel="noopener noreferrer"
            className="social-button whatsapp"
            aria-label="Share on WhatsApp"
            onClick={(e) => {
              e.preventDefault()
              handleSocialShare('whatsapp')
            }}
          >
            <span className="social-icon">💬</span>
            WhatsApp
          </a>
          
          <a 
            href={getSocialShareUrl('reddit')}
            target="_blank"
            rel="noopener noreferrer"
            className="social-button reddit"
            aria-label="Share on Reddit"
            onClick={(e) => {
              e.preventDefault()
              handleSocialShare('reddit')
            }}
          >
            <span className="social-icon">🔶</span>
            Reddit
          </a>
          
          <a 
            href={getSocialShareUrl('threads')}
            target="_blank"
            rel="noopener noreferrer"
            className="social-button threads"
            aria-label="Share on Threads"
            onClick={(e) => {
              e.preventDefault()
              handleSocialShare('threads')
            }}
          >
            <span className="social-icon">🧵</span>
            Threads
          </a>
        </div>
      </section>
      
      <footer style={{ marginTop: '30px', textAlign: 'center', color: '#6c757d', fontSize: '0.9em' }}>
        <p>🇳🇱 Master Dutch verb conjugations through interactive practice! Perfect for beginners learning Nederlandse werkwoorden.</p>
        <p>Free Dutch language exercise with common verbs and instant feedback.</p>
      </footer>
    </main>
  )
}

export default VerbConjugationPage