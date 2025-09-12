import { useState, useEffect } from 'react'
import { setInstallPrompt, getInstallPrompt, clearInstallPrompt, isStandalone } from '../../utils/serviceWorker'

const InstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isIOS, setIsIOS] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Check if running on iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    setIsIOS(iOS)

    // Check if already installed or dismissed
    const isDismissed = localStorage.getItem('pwa-install-dismissed') === 'true'
    const isInstalled = isStandalone()
    
    if (isDismissed || isInstalled) {
      setDismissed(true)
      return
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault()
      setInstallPrompt(event)
      setDeferredPrompt(event)
      
      // Show prompt after a delay (better UX)
      setTimeout(() => {
        if (!dismissed) {
          setShowPrompt(true)
        }
      }, 3000)
    }

    // Listen for app installed event
    const handleAppInstalled = () => {
      console.log('PWA was installed')
      setShowPrompt(false)
      clearInstallPrompt()
      
      // Track installation
      if (window.gtag) {
        window.gtag('event', 'pwa_install', {
          event_category: 'engagement',
          event_label: 'pwa_installed'
        })
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    // Show iOS prompt after delay if on iOS and not installed
    if (iOS && !isInstalled && !isDismissed) {
      setTimeout(() => {
        setShowPrompt(true)
      }, 5000)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [dismissed])

  const handleInstallClick = async () => {
    if (isIOS) {
      // For iOS, show instructions
      return
    }

    const prompt = getInstallPrompt()
    if (!prompt) return

    // Show the install prompt
    const result = await prompt.prompt()
    console.log('Install prompt result:', result)

    // Track user choice
    if (window.gtag) {
      window.gtag('event', 'pwa_install_prompt', {
        event_category: 'engagement',
        event_label: result.outcome
      })
    }

    if (result.outcome === 'accepted') {
      console.log('User accepted the install prompt')
    } else {
      console.log('User dismissed the install prompt')
    }

    setShowPrompt(false)
    clearInstallPrompt()
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    setDismissed(true)
    localStorage.setItem('pwa-install-dismissed', 'true')
    
    // Track dismissal
    if (window.gtag) {
      window.gtag('event', 'pwa_install_dismissed', {
        event_category: 'engagement',
        event_label: 'install_prompt_dismissed'
      })
    }
  }

  if (!showPrompt || dismissed) {
    return null
  }

  return (
    <div className="install-prompt-overlay">
      <div className="install-prompt">
        <div className="install-prompt-content">
          <div className="install-prompt-icon">
            🇳🇱
          </div>
          <h3>Install Dutch Learning Tools</h3>
          <p>
            {isIOS 
              ? "Add this app to your home screen for quick access and offline learning!"
              : "Install our app for faster access, offline learning, and a better experience!"
            }
          </p>
          
          {isIOS ? (
            <div className="ios-instructions">
              <p>To install this app:</p>
              <ol>
                <li>Tap the share button <span className="share-icon">⬆️</span></li>
                <li>Select "Add to Home Screen"</li>
                <li>Tap "Add" to confirm</li>
              </ol>
            </div>
          ) : (
            <div className="install-prompt-actions">
              <button 
                className="install-btn install-btn-primary"
                onClick={handleInstallClick}
              >
                Install App
              </button>
              <button 
                className="install-btn install-btn-secondary"
                onClick={handleDismiss}
              >
                Maybe Later
              </button>
            </div>
          )}
          
          {isIOS && (
            <div className="install-prompt-actions">
              <button 
                className="install-btn install-btn-secondary"
                onClick={handleDismiss}
              >
                Got it
              </button>
            </div>
          )}
        </div>
      </div>
      
      <style jsx>{`
        .install-prompt-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          padding: 20px;
        }
        
        .install-prompt {
          background: white;
          border-radius: 16px;
          max-width: 400px;
          width: 100%;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
          animation: slideUp 0.3s ease;
        }
        
        @keyframes slideUp {
          from {
            transform: translateY(50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .install-prompt-content {
          padding: 30px;
          text-align: center;
        }
        
        .install-prompt-icon {
          font-size: 48px;
          margin-bottom: 20px;
        }
        
        .install-prompt h3 {
          margin: 0 0 15px 0;
          font-size: 1.5rem;
          color: #333;
          font-weight: 600;
        }
        
        .install-prompt p {
          margin: 0 0 25px 0;
          color: #666;
          line-height: 1.5;
          font-size: 1rem;
        }
        
        .ios-instructions {
          text-align: left;
          background: #f8f9fa;
          padding: 20px;
          border-radius: 12px;
          margin: 20px 0;
        }
        
        .ios-instructions p {
          margin: 0 0 10px 0;
          font-weight: 600;
          color: #333;
        }
        
        .ios-instructions ol {
          margin: 0;
          padding-left: 20px;
          color: #666;
        }
        
        .ios-instructions li {
          margin: 8px 0;
          line-height: 1.4;
        }
        
        .share-icon {
          display: inline-block;
          background: #007AFF;
          color: white;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.8em;
          margin: 0 4px;
        }
        
        .install-prompt-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }
        
        .install-btn {
          padding: 12px 24px;
          border: none;
          border-radius: 25px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          min-width: 120px;
        }
        
        .install-btn-primary {
          background: #21468b;
          color: white;
        }
        
        .install-btn-primary:hover {
          background: #1a3a73;
          transform: translateY(-1px);
        }
        
        .install-btn-secondary {
          background: #f1f3f4;
          color: #5f6368;
        }
        
        .install-btn-secondary:hover {
          background: #e8eaed;
        }
        
        @media (max-width: 480px) {
          .install-prompt-overlay {
            padding: 10px;
          }
          
          .install-prompt-content {
            padding: 25px 20px;
          }
          
          .install-prompt-actions {
            flex-direction: column;
          }
          
          .install-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}

export default InstallPrompt
