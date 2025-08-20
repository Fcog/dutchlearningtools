import React, { useState } from 'react'
import WordCard from '../molecules/WordCard'
import ExerciseMetadata from '../molecules/ExerciseMetadata'
import Button from '../atoms/Button'
import Input from '../atoms/Input'

function PhrasalVerbExercise({ 
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
          <span lang="nl">
            {currentExercise.verb} ___
          </span>
        </div>
        <div className="exercise-translation">
          English: {currentExercise.translation.english}
        </div>

        <ExerciseMetadata 
          items={[
            {
              label: "Level",
              value: currentExercise.level,
              badgeClass: `level-${currentExercise.level.toLowerCase()}`
            }
          ]}
        />
        
        {/* Input for preposition */}
        <div className="exercise-input-container">
          <Input
            id="phrasal-verb-input"
            type="text"
            value={userAnswer}
            onChange={onAnswerChange}
            onKeyPress={onKeyPress}
            placeholder="Type the preposition..."
            className="preposition-input"
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
        <span lang="nl">{currentExercise.verb} {currentExercise.preposition}</span>
      </div>
      
      <div className="exercise-translation">
        English: {currentExercise.translation.english}
      </div>

      {!isCorrect && (
        <div className="exercise-correct-answer">
          <strong>Correct answer:</strong> {currentExercise.preposition}
        </div>
      )}

      {/* Your answer display */}
      <div className="exercise-user-answer">
        <strong>Your answer:</strong> {userAnswer}
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

      <div className="exercise-example-header">
        Examples:
      </div>

      <div className="exercise-example-list">
      {currentExercise.examples.map((example, index) => (
        <ul key={index}>
          <li>
            <div className="exercise-example-sentence" lang="nl">
              {example.dutch} <span className="exercise-example-translation">({example.english})</span>
            </div>
          </li>
        </ul>
      ))}
      </div>
    </WordCard>
  )
}

export default PhrasalVerbExercise
