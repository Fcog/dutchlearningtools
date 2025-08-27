import React from 'react'
import WordCard from '../molecules/WordCard'
import Button from '../atoms/Button'
import Input from '../atoms/Input'
import Badge from '../atoms/Badge'

function ObjectPronounExercise({ 
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
        
        {/* Show pronoun type and context */}
        <div className="exercise-metadata">
          <div className="pronoun-context">
            <strong>Context:</strong> {currentExercise.context.replace(/_/g, ' ')}
          </div>
          <Badge 
            text={currentExercise.pronoun_type.replace(/_/g, ' ')} 
            className={`exercise-type-badge type-${currentExercise.pronoun_type}`}
          />
        </div>

        {/* Input for object pronoun */}
        <div className="exercise-input-container">
          <Input
            id="object-pronoun-input"
            type="text"
            value={userAnswer}
            onChange={onAnswerChange}
            onKeyPress={onKeyPress}
            placeholder="Type the object pronoun (e.g., hem, haar, het, ze)..."
            className="object-pronoun-input"
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

      {/* Show pronoun type and context */}
      <div className="exercise-metadata">
        <div className="pronoun-context">
          <strong>Context:</strong> {currentExercise.context.replace(/_/g, ' ')}
        </div>
        <Badge 
          text={currentExercise.pronoun_type.replace(/_/g, ' ')} 
          className={`exercise-type-badge type-${currentExercise.pronoun_type}`}
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

export default ObjectPronounExercise
