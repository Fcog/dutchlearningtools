import React from 'react'
import WordCard from '../molecules/WordCard'
import Button from '../atoms/Button'

function NegationExercise({ 
  currentExercise, 
  showResult, 
  isCorrect, 
  selectedOption,
  onOptionSelect,
  onNextExercise,
  onKeyPress
}) {
  if (!showResult) {
    return (
      <WordCard>
        <div className="exercise-word-display">
          <span lang="nl">{currentExercise.question}</span>
        </div>
        <div className="exercise-translation">
          English: {currentExercise.question_translation}
        </div>
        
        {/* Multiple choice options */}
        <div className="exercise-options-container">
          <h3 className="exercise-options-title">Choose the correct negative response:</h3>
          <div className="exercise-options">
            <button
              className={`btn-primary exercise-option ${selectedOption === currentExercise.correct_answer ? 'selected' : ''}`}
              onClick={() => onOptionSelect(currentExercise.correct_answer)}
            >
              {currentExercise.correct_answer}
            </button>
            <button
              className={`btn-primary exercise-option ${selectedOption === currentExercise.incorrect_answer ? 'selected' : ''}`}
              onClick={() => onOptionSelect(currentExercise.incorrect_answer)}
            >
              {currentExercise.incorrect_answer}
            </button>
          </div>
        </div>

      </WordCard>
    )
  }

  return (
    <WordCard>
      {/* Result Display */}
      <div className={`exercise-result-display ${isCorrect ? 'exercise-result-correct' : 'exercise-result-incorrect'}`}>
        {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
      </div>
      
      <div className="exercise-word-display">
        <span lang="nl">{currentExercise.question}</span>
      </div>
      
      <div className="exercise-translation">
        English: {currentExercise.question_translation}
      </div>

      {/* Show selected vs correct answer */}
      <div className="exercise-answer-comparison">
        <div className="exercise-user-answer">
          <strong>Your answer:</strong> {selectedOption}
        </div>
        {!isCorrect && (
          <div className="exercise-correct-answer">
            <strong>Correct answer:</strong> {currentExercise.correct_answer}
          </div>
        )}
      </div>

      {/* Show correct translation */}
      <div className="exercise-correct-translation">
        <strong>Translation:</strong> {currentExercise.correct_translation}
      </div>

      {/* Show explanation */}
      <div className="exercise-explanation">
        <strong>Explanation:</strong> {currentExercise.explanation}
      </div>

      {/* Hidden input to capture keyboard events when result is shown */}
      <input
        type="text"
        style={{ 
          position: 'absolute', 
          left: '-9999px', 
          opacity: 0, 
          pointerEvents: 'none' 
        }}
        onKeyDown={onKeyPress}
        aria-hidden="true"
      />

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

export default NegationExercise
