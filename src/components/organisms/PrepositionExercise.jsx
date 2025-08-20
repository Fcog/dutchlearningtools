import React, { useState } from 'react'
import WordCard from '../molecules/WordCard'
import Button from '../atoms/Button'
import Input from '../atoms/Input'

function PrepositionExercise({ 
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
        
        {/* Input for preposition */}
        <div className="exercise-input-container">
          <Input
            id="preposition-input"
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

  const completeSentence = currentExercise.sentence.replace('___', currentExercise.preposition)

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
    </WordCard>
  )
}

export default PrepositionExercise