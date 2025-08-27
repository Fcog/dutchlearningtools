import React from 'react'
import WordCard from '../molecules/WordCard'
import { ExerciseHint } from '../molecules'
import Button from '../atoms/Button'
import Input from '../atoms/Input'

function PronominalAdverbExercise({ 
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

        <ExerciseHint exercise={currentExercise} />
        
        {/* Input for pronominal adverb */}
        <div className="exercise-input-container">
          <Input
            id="pronominal-adverb-input"
            type="text"
            value={userAnswer}
            onChange={onAnswerChange}
            onKeyPress={onKeyPress}
            placeholder="Type your answer..."
            className="pronominal-adverb-input"
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

  return (
    <WordCard>
      {/* Result Display */}
      <div className={`exercise-result-display ${isCorrect ? 'exercise-result-correct' : 'exercise-result-incorrect'}`}>
        {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
      </div>
      
      <div className="exercise-word-display">
        <span lang="nl">{currentExercise.complete_sentence}</span>
      </div>
      
      <div className="exercise-translation">
        English: {currentExercise.translation}
      </div>

      {!isCorrect && (
        <div className="exercise-correct-answer">
          <strong>Correct answer:</strong> {currentExercise.correct_answer}
        </div>
      )}

      {/* Your answer display */}
      <div className="exercise-user-answer">
        <strong>Your answer:</strong> {userAnswer}
      </div>

      {/* Explanation */}
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

export default PronominalAdverbExercise
