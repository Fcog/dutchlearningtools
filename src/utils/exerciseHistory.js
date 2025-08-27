/**
 * Exercise History Management Utility
 * 
 * This utility manages exercise history to prevent repetition of the same exercise
 * for at least a specified number of subsequent exercises.
 */

/**
 * Creates an exercise history manager for a specific exercise type
 * @param {string} storageKey - Unique key for localStorage storage
 * @param {number} historySize - Number of recent exercises to remember (default: 3)
 * @returns {Object} Exercise history manager with methods
 */
export function createExerciseHistory(storageKey, historySize = 3) {
  const STORAGE_KEY = `exercise_history_${storageKey}`
  
  /**
   * Get the current exercise history from localStorage
   * @returns {Array} Array of recent exercise IDs
   */
  function getHistory() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.warn('Error reading exercise history:', error)
      return []
    }
  }
  
  /**
   * Save the exercise history to localStorage
   * @param {Array} history - Array of exercise IDs to save
   */
  function saveHistory(history) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
    } catch (error) {
      console.warn('Error saving exercise history:', error)
    }
  }
  
  /**
   * Add an exercise to the history
   * @param {string|number} exerciseId - Unique identifier for the exercise
   */
  function addToHistory(exerciseId) {
    const history = getHistory()
    history.unshift(exerciseId) // Add to beginning
    
    // Keep only the most recent entries
    if (history.length > historySize) {
      history.splice(historySize)
    }
    
    saveHistory(history)
  }
  
  /**
   * Check if an exercise was recently used
   * @param {string|number} exerciseId - Exercise ID to check
   * @returns {boolean} True if the exercise was recently used
   */
  function wasRecentlyUsed(exerciseId) {
    const history = getHistory()
    return history.includes(exerciseId)
  }
  
  /**
   * Clear the exercise history
   */
  function clearHistory() {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.warn('Error clearing exercise history:', error)
    }
  }
  
  /**
   * Select a smart exercise from an array, avoiding recently used ones
   * @param {Array} exercises - Array of available exercises
   * @param {Function} getExerciseId - Function that extracts unique ID from exercise object
   * @returns {Object|null} Selected exercise or null if no exercises available
   */
  function selectSmartExercise(exercises, getExerciseId) {
    if (!exercises || exercises.length === 0) {
      return null
    }
    
    // If only one exercise available, return it (edge case)
    if (exercises.length === 1) {
      return exercises[0]
    }
    
    const history = getHistory()
    
    // Filter out recently used exercises
    const availableExercises = exercises.filter(exercise => {
      const exerciseId = getExerciseId(exercise)
      return !history.includes(exerciseId)
    })
    
    // If no exercises are available (all recently used), use the least recently used
    if (availableExercises.length === 0) {
      // Find exercises not in the most recent positions
      const lessRecentExercises = exercises.filter(exercise => {
        const exerciseId = getExerciseId(exercise)
        // Avoid only the most recent exercise (index 0)
        return exerciseId !== history[0]
      })
      
      if (lessRecentExercises.length > 0) {
        const randomIndex = Math.floor(Math.random() * lessRecentExercises.length)
        return lessRecentExercises[randomIndex]
      }
      
      // Fallback: return a random exercise (all have been used recently)
      const randomIndex = Math.floor(Math.random() * exercises.length)
      return exercises[randomIndex]
    }
    
    // Select random exercise from available (non-recent) exercises
    const randomIndex = Math.floor(Math.random() * availableExercises.length)
    return availableExercises[randomIndex]
  }
  
  return {
    addToHistory,
    wasRecentlyUsed,
    clearHistory,
    selectSmartExercise,
    getHistory
  }
}

/**
 * Generate a unique ID for different types of exercises
 */
export const exerciseIdGenerators = {
  // For simple objects with a unique property
  byProperty: (property) => (exercise) => exercise[property],
  
  // For Dutch verbs with pronoun/tense combination
  verbConjugation: (verb, pronoun, tense) => `${verb.infinitive}_${pronoun}_${tense}`,
  
  // For Dutch nouns/articles
  noun: (noun) => noun.word || noun.dutch_word || noun.infinitive,
  
  // For exercises with question/answer pairs
  questionBased: (exercise) => exercise.question || exercise.sentence || exercise.dutch_sentence,
  
  // For complex objects, create hash from key properties
  complex: (exercise) => {
    const key = JSON.stringify({
      question: exercise.question || exercise.sentence || exercise.dutch_sentence,
      word: exercise.word || exercise.dutch_word || exercise.infinitive,
      type: exercise.type || exercise.category
    })
    // Simple hash function
    let hash = 0
    for (let i = 0; i < key.length; i++) {
      const char = key.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return hash.toString()
  }
}
