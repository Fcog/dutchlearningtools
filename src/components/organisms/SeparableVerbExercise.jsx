import React, { useRef } from 'react'
import WordCard from '../molecules/WordCard'
import ExerciseMetadata from '../molecules/ExerciseMetadata'
import Button from '../atoms/Button'
import Input from '../atoms/Input'

function SeparableVerbExercise({ 
  currentExercise, 
  userAnswer,
  showResult, 
  isCorrect,
  isMobile,
  onAnswerChange,
  onKeyPress,
  onCheckAnswer,
  onNextExercise 
}) {
  const exerciseWordDisplayRef = useRef(null)

  const handleInputFocus = () => {
    if (isMobile && exerciseWordDisplayRef.current) {
      setTimeout(() => {
        exerciseWordDisplayRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        })
      }, 300) // Small delay to account for mobile keyboard animation
    }
  }

  if (!showResult) {
    return (
      <WordCard>
        {/* Incomplete sentence */}
        <div className="exercise-word-display" ref={exerciseWordDisplayRef}>
          <span lang="nl">{currentExercise.incomplete_sentence}</span>
        </div>
        <div className="exercise-translation">
          English: {currentExercise.translation}
        </div>
        
        {/* Exercise Metadata */}
        <ExerciseMetadata 
          items={[
            {
              label: "Level",
              value: currentExercise.level,
              badgeClass: `level-${currentExercise.level.toLowerCase()}`
            },
            {
              label: "Verb",
              value: currentExercise.verb,
              badgeClass: 'verb-info'
            }
          ]}
        />

        {/* Words to use hint */}
        <div className="exercise-hint">
          <strong>Words to use:</strong> {currentExercise.words_to_use.join(', ')}
        </div>

        {/* Exercise Prompt */}
        <div className="exercise-prompt">
          Fill in the missing words:
        </div>

        <div className="exercise-input-container">
          <Input
            value={userAnswer}
            onChange={onAnswerChange}
            onKeyPress={onKeyPress}
            onFocus={handleInputFocus}
            placeholder="Type the missing words..."
            autoFocus
          />
          <div>
            <Button
              onClick={onCheckAnswer}
              disabled={!userAnswer.trim()}
              variant="primary"
              size="large"
              className="min-width-button"
            >
              Check Answer
            </Button>
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
        <span lang="nl">{currentExercise.incomplete_sentence}</span>
      </div>
      
      <div className="exercise-translation">
        English: {currentExercise.translation}
      </div>

      {/* Show user's answer vs correct answer */}
      <div className="exercise-answer-comparison">
        <div className="exercise-user-answer">
          <strong>Your answer:</strong> 
          <span lang="nl">{userAnswer}</span>
        </div>
        <div className="exercise-correct-answer">
          <strong>Correct missing words:</strong> 
          <span lang="nl">{currentExercise.missing_words}</span>
        </div>
        <div className="exercise-complete-sentence">
          <strong>Complete sentence:</strong> 
          <span lang="nl">{currentExercise.complete_answer}</span>
        </div>
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

export default SeparableVerbExercise
