import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import dutchNounsData from '../data/dutch-nouns.json'
import rulesData from '../data/rules-articles.json'

function ArticlesPage() {
  const navigate = useNavigate()
  const [currentWord, setCurrentWord] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [score, setScore] = useState({ correct: 0, total: 0 })

  // Check if user is on mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Function to get a random word for exercise
  const getRandomWord = () => {
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
    setScore(prevScore => ({
      correct: correct ? prevScore.correct + 1 : prevScore.correct,
      total: prevScore.total + 1
    }))
  }

  // Get next word
  const handleNextWord = () => {
    const newWord = getRandomWord()
    setCurrentWord(newWord)
    setSelectedArticle(null)
    setShowResult(false)
    setIsCorrect(false)
  }

  // Social sharing functionality
  const shareData = {
    url: window.location.href,
    title: "Dutch Article Exercise - Interactive De & Het Quiz",
    description: "Practice Dutch articles with our interactive exercise! Choose between 'de' and 'het' for 200 common Dutch nouns and get instant feedback."
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
      case 'twitter':
        return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`
      case 'linkedin':
        return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
      case 'whatsapp':
        return `https://wa.me/?text=${encodedText}%20${encodedUrl}`
      case 'reddit':
        return `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`
      case 'pinterest':
        return `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedDescription}`
      default:
        return '#'
    }
  }

  const handleSocialShare = (platform) => {
    const shareUrl = getSocialShareUrl(platform)
    window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes')
  }

  useEffect(() => {
    const firstWord = getRandomWord()
    setCurrentWord(firstWord)
  }, [])

  if (!currentWord) {
    return (
      <div className="articles-container">
        <h1>Loading...</h1>
        <p>Loading your Dutch article exercise</p>
      </div>
    )
  }

  return (
    <main className="articles-container" role="main">
      <nav className="breadcrumb">
        <button onClick={() => navigate('/')}>🏠 Dutch Learning Tools</button>
        <span> {'>'} </span>
        <span>Article Exercise</span>
      </nav>
      
      <header>
        <h1>Dutch Article Exercise: Choose De or Het</h1>
        <p style={{ fontSize: '1.2em', color: '#666', marginBottom: '20px' }}>
          {isMobile 
            ? "Practice Dutch articles! Choose the correct article for each noun." 
            : "Test your knowledge of Dutch articles! Choose whether each noun uses 'de' or 'het' and get instant feedback."
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
          Choose the correct article:
        </h2>
        
        <article className="word-card" style={{
          marginTop: '20px',
          padding: '30px',
          backgroundColor: '#f8f9fa',
          borderRadius: '10px',
          border: '2px solid #e9ecef',
          textAlign: 'center'
        }}>
          {!showResult ? (
            <>
              <div style={{
                fontSize: '3em',
                color: '#333',
                marginBottom: '10px',
                fontWeight: 'bold'
              }}>
                <span lang="nl">___ {currentWord.name}</span>
              </div>
              <div style={{
                fontSize: '1.5em',
                color: '#6c757d',
                marginBottom: '30px'
              }}>
                English: the {currentWord.translation}
              </div>
              
              {/* Article Choice Buttons */}
              <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  onClick={() => handleArticleChoice('de')}
                  style={{
                    fontSize: '2em',
                    padding: '15px 30px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    minWidth: '120px',
                    transition: 'background-color 0.3s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
                >
                  de
                </button>
                
                <button
                  onClick={() => handleArticleChoice('het')}
                  style={{
                    fontSize: '2em',
                    padding: '15px 30px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    minWidth: '120px',
                    transition: 'background-color 0.3s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#1e7e34'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
                >
                  het
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Result Display */}
              <div style={{
                fontSize: '2em',
                color: isCorrect ? '#28a745' : '#dc3545',
                marginBottom: '20px',
                fontWeight: 'bold'
              }}>
                {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
              </div>
              
              <div style={{
                fontSize: '3em',
                color: '#333',
                marginBottom: '10px',
                fontWeight: 'bold'
              }}>
                <span lang="nl">{currentWord.article} {currentWord.name}</span>
              </div>
              
              <div style={{
                fontSize: '1.5em',
                color: '#6c757d',
                marginBottom: '20px'
              }}>
                English: the {currentWord.translation}
              </div>

              <div style={{
                fontSize: '1em',
                color: '#28a745',
                fontStyle: 'italic',
                textTransform: 'capitalize',
                marginBottom: '15px'
              }}>
                Category: {currentWord.category.replace('_', ' ')}
              </div>

              {/* Rule Explanation */}
              {currentWord.rule && rulesData[currentWord.rule] && (
                <div style={{
                  fontSize: '1em',
                  color: '#6c757d',
                  backgroundColor: '#f8f9fa',
                  padding: '15px',
                  borderRadius: '8px',
                  border: '1px solid #e9ecef',
                  marginBottom: '20px',
                  textAlign: 'left'
                }}>
                  <div style={{
                    fontWeight: 'bold',
                    color: '#495057',
                    marginBottom: '5px',
                    textTransform: 'capitalize'
                  }}>
                    📖 Rule: {currentWord.rule.replace('-', ' ')}
                  </div>
                  <div style={{ lineHeight: '1.4' }}>
                    {rulesData[currentWord.rule]}
                  </div>
                </div>
              )}

              {/* Next Word Button */}
              <button
                onClick={handleNextWord}
                style={{
                  fontSize: '1.2em',
                  padding: '12px 24px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
              >
                Next Word
              </button>
            </>
          )}
        </article>
      </section>
      
      <section style={{ marginTop: '40px' }}>
        <h2 style={{ fontSize: '1.4em', color: '#333', marginBottom: '15px' }}>
          How This Exercise Helps You Learn
        </h2>
        <div style={{ textAlign: 'left', color: '#666', lineHeight: '1.6' }}>
          <p>Dutch articles (lidwoorden) are essential for proper Dutch grammar. Unlike English, Dutch has two definite articles:</p>
          <ul style={{ marginLeft: '20px' }}>
            <li><strong>"de"</strong> - used with common gender nouns (about 75% of nouns)</li>
            <li><strong>"het"</strong> - used with neuter gender nouns (about 25% of nouns)</li>
          </ul>
          <p>This interactive exercise helps you learn through:</p>
          <ul style={{ marginLeft: '20px' }}>
            <li><strong>Active practice</strong> - Choose the article yourself instead of just reading</li>
            <li><strong>Instant feedback</strong> - Know immediately if you're correct or not</li>
            <li><strong>Score tracking</strong> - Monitor your progress over time</li>
            <li><strong>Repetition</strong> - Practice with random words to reinforce learning</li>
          </ul>
          <p>Practice with 200 of the most frequently used Dutch words to build your confidence!</p>
        </div>
      </section>
      
      <section className="social-sharing">
        <h2 style={{ fontSize: '1.3em', color: '#333', marginBottom: '10px', textAlign: 'center' }}>
          📢 Share This Tool
        </h2>
        <p style={{ color: '#666', textAlign: 'center', margin: '0 0 15px 0' }}>
          Help others learn Dutch! Share this free interactive exercise with your friends.
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
            href={getSocialShareUrl('twitter')}
            target="_blank"
            rel="noopener noreferrer"
            className="social-button twitter"
            aria-label="Share on Twitter"
            onClick={(e) => {
              e.preventDefault()
              handleSocialShare('twitter')
            }}
          >
            <span className="social-icon">🐦</span>
            Twitter
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
            href={getSocialShareUrl('pinterest')}
            target="_blank"
            rel="noopener noreferrer"
            className="social-button pinterest"
            aria-label="Share on Pinterest"
            onClick={(e) => {
              e.preventDefault()
              handleSocialShare('pinterest')
            }}
          >
            <span className="social-icon">📌</span>
            Pinterest
          </a>
        </div>
      </section>
      
      <footer style={{ marginTop: '30px', textAlign: 'center', color: '#6c757d', fontSize: '0.9em' }}>
        <p>🇳🇱 Master Dutch articles through interactive practice! Perfect for beginners learning Nederlandse lidwoorden.</p>
        <p>Free Dutch language exercise with 200+ common nouns and instant feedback.</p>
      </footer>
    </main>
  )
}

export default ArticlesPage