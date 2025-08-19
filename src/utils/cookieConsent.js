/**
 * Utility functions for managing cookie consent preferences
 */

// Storage key for consent preference
const CONSENT_STORAGE_KEY = 'cookie-consent'
const CONSENT_TIMESTAMP_KEY = 'cookie-consent-timestamp'

// Consent values
export const CONSENT_VALUES = {
  ACCEPTED: 'accepted',
  DECLINED: 'declined'
}

/**
 * Check if user has given consent for cookies
 * @returns {boolean} True if consent given, false otherwise
 */
export const hasConsentForCookies = () => {
  try {
    const consent = localStorage.getItem(CONSENT_STORAGE_KEY)
    return consent === CONSENT_VALUES.ACCEPTED
  } catch (error) {
    console.error('Error checking cookie consent:', error)
    return false
  }
}

/**
 * Check if user has made any consent choice
 * @returns {boolean} True if user has made a choice, false if no choice made
 */
export const hasConsentChoice = () => {
  try {
    const consent = localStorage.getItem(CONSENT_STORAGE_KEY)
    return consent === CONSENT_VALUES.ACCEPTED || consent === CONSENT_VALUES.DECLINED
  } catch (error) {
    console.error('Error checking consent choice:', error)
    return false
  }
}

/**
 * Get the user's consent choice
 * @returns {string|null} The consent value or null if no choice made
 */
export const getConsentChoice = () => {
  try {
    return localStorage.getItem(CONSENT_STORAGE_KEY)
  } catch (error) {
    console.error('Error getting consent choice:', error)
    return null
  }
}

/**
 * Get when the consent choice was made
 * @returns {Date|null} Date when consent was given, or null if not available
 */
export const getConsentTimestamp = () => {
  try {
    const timestamp = localStorage.getItem(CONSENT_TIMESTAMP_KEY)
    return timestamp ? new Date(parseInt(timestamp)) : null
  } catch (error) {
    console.error('Error getting consent timestamp:', error)
    return null
  }
}

/**
 * Clear all consent data (useful for testing or reset functionality)
 */
export const clearConsentData = () => {
  try {
    localStorage.removeItem(CONSENT_STORAGE_KEY)
    localStorage.removeItem(CONSENT_TIMESTAMP_KEY)
  } catch (error) {
    console.error('Error clearing consent data:', error)
  }
}

/**
 * Set consent choice programmatically
 * @param {string} choice - Either 'accepted' or 'declined'
 */
export const setConsentChoice = (choice) => {
  try {
    if (!Object.values(CONSENT_VALUES).includes(choice)) {
      throw new Error(`Invalid consent choice: ${choice}`)
    }
    
    localStorage.setItem(CONSENT_STORAGE_KEY, choice)
    localStorage.setItem(CONSENT_TIMESTAMP_KEY, Date.now().toString())
    
    // Update Google Analytics consent
    if (window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: choice === CONSENT_VALUES.ACCEPTED ? 'granted' : 'denied'
      })
    }
    
    // Dispatch event for analytics module
    if (choice === CONSENT_VALUES.ACCEPTED) {
      window.dispatchEvent(new CustomEvent('cookieConsentGranted'))
    }
  } catch (error) {
    console.error('Error setting consent choice:', error)
  }
}
