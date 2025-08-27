/**
 * Utility functions for saving and restoring filter preferences to/from localStorage
 */

// Storage keys for different exercise types
const STORAGE_KEYS = {
  VERB_CONJUGATION: 'dutch-app-filters-verb-conjugation',
  VERBS_WITH_FIXED_PREPOSITION: 'dutch-app-filters-verbs-with-fixed-preposition',
  VERB_PREPOSITIONS: 'dutch-app-filters-verb-prepositions',
  CONJUNCTIONS: 'dutch-app-filters-conjunctions',
  PREPOSITIONS: 'dutch-app-filters-prepositions',
  ARTICLES: 'dutch-app-filters-articles'
}

// Default filter values for each exercise type
const DEFAULT_FILTERS = {
  VERB_CONJUGATION: {
    selectedTenses: ['present'],
    selectedLevels: ['A1', 'A2'],
    selectedVerbTypes: ['regular', 'irregular'],
    selectedSeparable: ['separable', 'non-separable']
  },
  VERBS_WITH_FIXED_PREPOSITION: {
    selectedLevels: ['A2', 'B1', 'B2']
  },
  VERB_PREPOSITIONS: {
    selectedLevels: ['A2', 'B1', 'B2']
  },
  CONJUNCTIONS: {
    // No filters currently, but prepared for future
  },
  PREPOSITIONS: {
    // No filters currently, but prepared for future
  },
  ARTICLES: {
    // No filters currently, but prepared for future
  }
}

/**
 * Save filter preferences to localStorage
 * @param {string} exerciseType - The type of exercise (from STORAGE_KEYS)
 * @param {object} filters - The filter values to save
 */
export const saveFilterPreferences = (exerciseType, filters) => {
  try {
    const storageKey = STORAGE_KEYS[exerciseType]
    if (!storageKey) {
      console.warn(`Unknown exercise type: ${exerciseType}`)
      return
    }

    const filterData = {
      ...filters,
      timestamp: Date.now() // Save when preferences were last updated
    }

    localStorage.setItem(storageKey, JSON.stringify(filterData))
  } catch (error) {
    console.error('Error saving filter preferences:', error)
  }
}

/**
 * Load filter preferences from localStorage
 * @param {string} exerciseType - The type of exercise (from STORAGE_KEYS)
 * @returns {object} The saved filter preferences or defaults if not found
 */
export const loadFilterPreferences = (exerciseType) => {
  try {
    const storageKey = STORAGE_KEYS[exerciseType]
    if (!storageKey) {
      console.warn(`Unknown exercise type: ${exerciseType}`)
      return DEFAULT_FILTERS[exerciseType] || {}
    }

    const saved = localStorage.getItem(storageKey)
    if (!saved) {
      return DEFAULT_FILTERS[exerciseType] || {}
    }

    const parsed = JSON.parse(saved)
    
    // Remove timestamp from the returned data
    const { timestamp, ...filterData } = parsed
    
    // Validate that saved data has the expected structure
    const defaults = DEFAULT_FILTERS[exerciseType] || {}
    const validated = {}
    
    // Only include valid filter keys from defaults
    Object.keys(defaults).forEach(key => {
      if (filterData[key] && Array.isArray(filterData[key])) {
        validated[key] = filterData[key]
      } else {
        validated[key] = defaults[key]
      }
    })

    return validated
  } catch (error) {
    console.error('Error loading filter preferences:', error)
    return DEFAULT_FILTERS[exerciseType] || {}
  }
}

/**
 * Clear filter preferences for a specific exercise type
 * @param {string} exerciseType - The type of exercise (from STORAGE_KEYS)
 */
export const clearFilterPreferences = (exerciseType) => {
  try {
    const storageKey = STORAGE_KEYS[exerciseType]
    if (!storageKey) {
      console.warn(`Unknown exercise type: ${exerciseType}`)
      return
    }

    localStorage.removeItem(storageKey)
  } catch (error) {
    console.error('Error clearing filter preferences:', error)
  }
}

/**
 * Check if filter preferences exist for a specific exercise type
 * @param {string} exerciseType - The type of exercise (from STORAGE_KEYS)
 * @returns {boolean} True if preferences exist, false otherwise
 */
export const hasFilterPreferences = (exerciseType) => {
  try {
    const storageKey = STORAGE_KEYS[exerciseType]
    if (!storageKey) {
      return false
    }

    return localStorage.getItem(storageKey) !== null
  } catch (error) {
    console.error('Error checking filter preferences:', error)
    return false
  }
}

/**
 * Get all available storage keys for reference
 * @returns {object} Object containing all storage keys
 */
export const getStorageKeys = () => STORAGE_KEYS

// Export for easier use
export { STORAGE_KEYS, DEFAULT_FILTERS }
