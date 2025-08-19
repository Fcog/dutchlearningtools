import { useState, useEffect } from 'react'
import { Button } from '../atoms'

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has already made a choice
    const consentChoice = localStorage.getItem('cookie-consent')
    if (!consentChoice) {
      // Small delay to ensure smooth animation
      setTimeout(() => {
        setShowBanner(true)
        setTimeout(() => setIsVisible(true), 100)
      }, 1000)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    localStorage.setItem('cookie-consent-timestamp', Date.now().toString())
    setIsVisible(false)
    setTimeout(() => setShowBanner(false), 300)
    
    // Initialize Google Analytics after consent
    if (window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted'
      })
    }
    
    // Dispatch custom event to notify analytics module
    window.dispatchEvent(new CustomEvent('cookieConsentGranted'))
  }

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined')
    localStorage.setItem('cookie-consent-timestamp', Date.now().toString())
    setIsVisible(false)
    setTimeout(() => setShowBanner(false), 300)
    
    // Ensure analytics storage remains denied
    if (window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied'
      })
    }
  }

  if (!showBanner) return null

  return (
    <div 
      className={`cookie-consent-overlay ${isVisible ? 'visible' : ''}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out'
      }}
    >
      <div 
        className="cookie-consent-banner"
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '32px',
          maxWidth: '500px',
          width: '100%',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.3s ease-in-out'
        }}
      >
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ 
            margin: '0 0 16px 0', 
            fontSize: '20px', 
            fontWeight: '600',
            color: '#1f2937'
          }}>
            🍪 Cookie Consent
          </h3>
          <p style={{ 
            margin: 0, 
            fontSize: '14px', 
            lineHeight: '1.5',
            color: '#6b7280'
          }}>
            We use Google Analytics to understand how you interact with our Dutch learning tools. 
            This helps us improve the app for everyone. You can choose whether to allow these cookies.
          </p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <details style={{ fontSize: '14px', color: '#6b7280' }}>
            <summary style={{ 
              cursor: 'pointer', 
              fontWeight: '500',
              marginBottom: '8px',
              color: '#374151'
            }}>
              What cookies do we use?
            </summary>
            <div style={{ paddingLeft: '16px', fontSize: '13px' }}>
              <p style={{ margin: '8px 0' }}>
                <strong>Google Analytics:</strong> _ga, _gid, _ga_* cookies to track page views and user interactions.
              </p>
              <p style={{ margin: '8px 0' }}>
                <strong>Local Storage:</strong> We also use browser local storage (not cookies) to save your exercise preferences.
              </p>
            </div>
          </details>
        </div>

        <div style={{ 
          display: 'flex', 
          gap: '12px',
          flexDirection: window.innerWidth < 480 ? 'column' : 'row'
        }}>
          <Button
            onClick={handleDecline}
            variant="secondary"
            style={{
              flex: 1,
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '500',
              border: '2px solid #e5e7eb',
              backgroundColor: 'white',
              color: '#374151'
            }}
          >
            Decline Cookies
          </Button>
          <Button
            onClick={handleAccept}
            variant="primary"
            style={{
              flex: 1,
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '500',
              backgroundColor: '#21468b',
              color: 'white',
              border: '2px solid #21468b'
            }}
          >
            Accept Cookies
          </Button>
        </div>

        <p style={{ 
          margin: '16px 0 0 0', 
          fontSize: '12px', 
          color: '#9ca3af',
          textAlign: 'center'
        }}>
          You can change your preference anytime in your browser settings.
        </p>
      </div>
    </div>
  )
}

export default CookieConsent
