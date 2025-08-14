import React, { useState } from 'react'
import WordCard from '../molecules/WordCard'
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
        
        {/* Input for preposition */}
        <div className="exercise-input-container">
          <label htmlFor="phrasal-verb-input" className="exercise-input-label">
            Fill in the preposition:
          </label>
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

  const completeExample = currentExercise.examples[0].dutch

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

      <div className="exercise-context">
        Example: <span lang="nl">{completeExample}</span>
      </div>
      
      <div className="exercise-context-translation">
        {currentExercise.examples[0].english}
      </div>

      <div className="exercise-level">
        Level: {currentExercise.level}
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

export default PhrasalVerbExercise
