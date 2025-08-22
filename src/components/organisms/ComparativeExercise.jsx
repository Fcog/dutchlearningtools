import React from 'react'
import WordCard from '../molecules/WordCard'
import Button from '../atoms/Button'
import Input from '../atoms/Input'
import Badge from '../atoms/Badge'

function ComparativeExercise({ 
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
        
        {/* Show base adjective and type */}
        <div className="exercise-metadata">
          <div className="base-adjective">
            <strong>Base adjective:</strong> {currentExercise.base_adjective}
          </div>
          <Badge 
            text={currentExercise.type} 
            className={`exercise-type-badge type-${currentExercise.type}`}
          />
        </div>

        {/* Input for comparative/superlative form */}
        <div className="exercise-input-container">
          <Input
            id="comparative-input"
            type="text"
            value={userAnswer}
            onChange={onAnswerChange}
            onKeyPress={onKeyPress}
            placeholder="Type the correct form (e.g., beter, het beste, even goed)..."
            className="comparative-input"
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

      {/* Show base adjective and type */}
      <div className="exercise-metadata">
        <div className="base-adjective">
          <strong>Base adjective:</strong> {currentExercise.base_adjective}
        </div>
        <Badge 
          text={currentExercise.type} 
          className={`exercise-type-badge type-${currentExercise.type}`}
        />
      </div>

      {/* Show user's answer vs correct answer */}
      <div className="exercise-answer-comparison">
        <div className="exercise-user-answer">
          <strong>Your answer:</strong> {userAnswer}
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

export default ComparativeExercise
