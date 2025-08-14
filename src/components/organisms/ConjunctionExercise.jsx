import React from 'react'
import WordCard from '../molecules/WordCard'
import Button from '../atoms/Button'
import Input from '../atoms/Input'

function ConjunctionExercise({ 
  currentExercise, 
  showResult, 
  isCorrect, 
  userAnswer,
  onAnswerChange,
  onCheckAnswer,
  onNextExercise,
  onKeyPress
}) {
  if (!showResult) {
    return (
      <WordCard>
        <div className="exercise-word-display">
          <span lang="nl">{currentExercise.sentence}</span>
        </div>
        <div className="exercise-translation">
          English: {currentExercise.translation}
        </div>
        
        {/* Input for conjunction */}
        <div className="exercise-input-container">
          {/* Show hint for correlative conjunctions */}
          {currentExercise.category === 'Correlative' && (
            <div className="exercise-hint">
              <small><em>Hint: This is a correlative conjunction. Type just the main word (e.g., "noch" or "of").</em></small>
            </div>
          )}
          <Input
            id="conjunction-input"
            type="text"
            value={userAnswer}
            onChange={onAnswerChange}
            onKeyPress={onKeyPress}
            placeholder={currentExercise.category === 'Correlative' ? "Type the main word..." : "Type the conjunction..."}
            className="conjunction-input"
            autoFocus
          />
        </div>
        
        {/* Check Answer Button */}
        <div className="exercise-buttons-container">
          <Button
            onClick={onCheckAnswer}
            variant="primary"
            size="medium"
            disabled={!userAnswer.trim()}
          >
            Check Answer
          </Button>
        </div>
      </WordCard>
    )
  }

  // Handle correlative conjunctions with multiple parts
  const getCompleteSentence = () => {
    let sentence = currentExercise.sentence
    const conjunction = currentExercise.conjunction
    
    // Check if it's a correlative conjunction (contains "...")
    if (conjunction.includes('...')) {
      // Split the conjunction by "..." and trim spaces
      const parts = conjunction.split('...').map(part => part.trim())
      
      // Replace each __ with the corresponding part
      parts.forEach(part => {
        if (part) { // Only replace if part is not empty
          sentence = sentence.replace('__', part)
        }
      })
    } else {
      // For single conjunctions, replace all occurrences
      sentence = sentence.replace(/__/g, conjunction)
    }
    
    return sentence
  }
  
  const completeSentence = getCompleteSentence()

  return (
    <WordCard>
      {/* Result Display */}
      <div className={`exercise-result-display ${isCorrect ? 'exercise-result-correct' : 'exercise-result-incorrect'}`}>
        {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
      </div>
      
      <div className="exercise-word-display">
        <span lang="nl">{completeSentence}</span>
      </div>
      
      <div className="exercise-translation">
        English: {currentExercise.translation}
      </div>



      {!isCorrect && (
        <div className="exercise-correct-answer">
          <strong>Correct answer:</strong> {currentExercise.conjunction}
        </div>
      )}

      {/* Your answer display */}
      <div className="exercise-user-answer">
        <strong>Your answer:</strong> {userAnswer}
      </div>

      {/* Next Exercise Button */}
      <Button
        onClick={onNextExercise}
        variant="primary"
        size="medium"
      >
        Next Exercise
      </Button>
    </WordCard>
  )
}

export default ConjunctionExercise
