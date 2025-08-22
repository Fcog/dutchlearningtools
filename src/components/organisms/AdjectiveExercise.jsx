import React from 'react'
import WordCard from '../molecules/WordCard'
import Button from '../atoms/Button'

function AdjectiveExercise({ 
  currentExercise, 
  showResult, 
  isCorrect, 
  selectedOption,
  onOptionSelect,
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
        
        {/* Multiple choice options */}
        <div className="exercise-options-container">
          <h3 className="exercise-options-title">Choose the correct adjective:</h3>
          <div className="exercise-options">
            {currentExercise.options.map((option, index) => (
              <button
                key={index}
                className={`exercise-option ${selectedOption === option ? 'selected' : ''}`}
                onClick={() => onOptionSelect(option)}
                disabled={!option}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        
        {/* Check Answer Button */}
        <div className="exercise-buttons-container">
          <Button
            onClick={onCheckAnswer}
            variant="primary"
            size="medium"
            disabled={!selectedOption}
          >
            Check Answer
          </Button>
        </div>
      </WordCard>
    )
  }

  const completeSentence = currentExercise.sentence.replace('___', currentExercise.correct_answer)

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
        autoFocus
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

export default AdjectiveExercise
