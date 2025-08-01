import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import dutchNounsData from '../data/dutch-nouns.json'

function ArticlesPage() {
  const navigate = useNavigate()
  const [currentWord, setCurrentWord] = useState(null)
  const [randomWord, setRandomWord] = useState(null)
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

  // Function to get word of the day based on current date
  const getWordOfTheDay = (words) => {
    const today = new Date()
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24)
    const wordIndex = dayOfYear % words.length
    return words[wordIndex]
  }

  // Function to get a random word
  const getRandomWord = () => {
    const words = dutchNounsData.dutch_nouns
    const randomIndex = Math.floor(Math.random() * words.length)
    return words[randomIndex]
  }

  // Function to handle getting a new random word
  const handleGetRandomWord = () => {
    const newRandomWord = getRandomWord()
    setRandomWord(newRandomWord)
  }

  // Social sharing functionality
  const shareData = {
    url: window.location.href,
    title: "Learn Dutch Articles - Daily Dutch Nouns with De & Het",
    description: "Learn Dutch articles (de & het) with 200 most common Dutch nouns. Free daily Dutch word tool with English translations and categories."
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
    const wordOfTheDay = getWordOfTheDay(dutchNounsData.dutch_nouns)
    setCurrentWord(wordOfTheDay)
  }, [])

  if (!currentWord) {
    return (
      <div className="articles-container">
        <h1>Loading...</h1>
        <p>Loading your daily Dutch word</p>
      </div>
    )
  }

  return (
    <main className="articles-container" role="main">
      <nav className="breadcrumb">
        <button onClick={() => navigate('/')}>🏠 Dutch Learning Tools</button>
        <span> {'>'} </span>
        <span>Articles & Nouns</span>
      </nav>
      
      <header>
        <h1>Learn Dutch Articles: Daily Dutch Nouns with De & Het</h1>
        <p style={{ fontSize: '1.2em', color: '#666', marginBottom: '20px' }}>
          {isMobile 
            ? "Learn Dutch articles (de & het) with 200 common nouns. New word daily!" 
            : "Master Dutch grammar by learning the correct articles (de & het) for 200 common Dutch nouns. Each day features a new word with pronunciation guide, English translation, and category."
          }
        </p>
      </header>
      
      <section aria-labelledby="daily-word-heading" className="daily-word-container">
        <h2 id="daily-word-heading" style={{ fontSize: '1.5em', color: '#333', marginBottom: '20px' }}>
          Today's Dutch Word
        </h2>
        <article className="word-card" style={{
          marginTop: '20px',
          padding: '30px',
          backgroundColor: '#f8f9fa',
          borderRadius: '10px',
          border: '2px solid #e9ecef'
        }}>
          <div style={{
            fontSize: '3em',
            color: '#007bff',
            marginBottom: '10px',
            fontWeight: 'bold'
          }} itemProp="name" itemScope itemType="https://schema.org/DefinedTerm">
            <span lang="nl">{currentWord.article} {currentWord.name}</span>
          </div>
          <div style={{
            fontSize: '1.5em',
            color: '#6c757d',
            marginBottom: '15px'
          }} itemProp="description">
            English: the {currentWord.translation}
          </div>
          <div style={{
            fontSize: '1.1em',
            color: '#28a745',
            fontStyle: 'italic',
            textTransform: 'capitalize'
          }}>
            Category: {currentWord.category.replace('_', ' ')}
          </div>
        </article>
      </section>
      
      <section aria-labelledby="random-word-heading" style={{ marginTop: '40px' }}>
        <h2 id="random-word-heading" style={{ fontSize: '1.5em', color: '#333', marginBottom: '20px' }}>
          Practice More Words
        </h2>
        <p style={{ color: '#666', marginBottom: '20px', textAlign: 'center' }}>
          Want to practice more? Click the button below to get a random Dutch word with its article!
        </p>
        
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <button 
            onClick={handleGetRandomWord}
            className="random-word-button"
            aria-label="Get a random Dutch word to practice"
          >
            {randomWord ? 'Get Another Random Word' : 'Get Random Word'}
          </button>
        </div>
        
        {randomWord && (
          <article className="word-card random-word-card" style={{
            padding: '25px',
            borderRadius: '10px',
            marginTop: '20px'
          }}>
            <div style={{
              fontSize: '2.5em',
              color: '#28a745',
              marginBottom: '10px',
              fontWeight: 'bold'
            }} itemProp="name" itemScope itemType="https://schema.org/DefinedTerm">
              <span lang="nl">{randomWord.article} {randomWord.name}</span>
            </div>
            <div style={{
              fontSize: '1.3em',
              color: '#155724',
              marginBottom: '10px'
            }} itemProp="description">
              English: the {randomWord.translation}
            </div>
            <div style={{
              fontSize: '1em',
              color: '#155724',
              fontStyle: 'italic',
              textTransform: 'capitalize'
            }}>
              Category: {randomWord.category.replace('_', ' ')}
            </div>
          </article>
        )}
      </section>
      
      <section style={{ marginTop: '40px' }}>
        <h2 style={{ fontSize: '1.4em', color: '#333', marginBottom: '15px' }}>
          Why Learn Dutch Articles?
        </h2>
        <div style={{ textAlign: 'left', color: '#666', lineHeight: '1.6' }}>
          <p>Dutch articles (lidwoorden) are essential for proper Dutch grammar. Unlike English, Dutch has two definite articles:</p>
          <ul style={{ marginLeft: '20px' }}>
            <li><strong>"de"</strong> - used with common gender nouns (most nouns)</li>
            <li><strong>"het"</strong> - used with neuter gender nouns (about 25% of nouns)</li>
          </ul>
          <p>Our tool helps you memorize the correct article for each noun through daily practice with the 200 most frequently used Dutch words.</p>
        </div>
      </section>
      
      <section className="social-sharing">
        <h2 style={{ fontSize: '1.3em', color: '#333', marginBottom: '10px', textAlign: 'center' }}>
          📢 Share This Tool
        </h2>
        <p style={{ color: '#666', textAlign: 'center', margin: '0 0 15px 0' }}>
          Help others learn Dutch! Share this free learning tool with your friends.
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
        <p>🇳🇱 Learn a new Dutch word every day! Perfect for beginners learning Nederlandse lidwoorden.</p>
        <p>Free Dutch language learning tool with 200+ common nouns, articles, and English translations.</p>
      </footer>
    </main>
  )
}

export default ArticlesPage