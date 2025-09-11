import React, { useRef } from 'react'
import WordCard from '../molecules/WordCard'
import ExerciseMetadata from '../molecules/ExerciseMetadata'
import Button from '../atoms/Button'
import Input from '../atoms/Input'

// Mapping of category keys to their display names
const getCategoryName = (categoryKey) => {
  const categoryNames = {
    probability: 'Probability',
    discourse: 'Discourse Marker',
    confirmation: 'Confirmation',
    feeling: 'Feeling/State',
    time: 'Time',
    degree: 'Degree/Intensity',
    inference: 'Inference',
    emphasis: 'Emphasis',
    contrast: 'Contrast',
    softener: 'Softener',
    repetition: 'Repetition',
    frequency: 'Frequency',
    certainty: 'Certainty',
    precision: 'Precision',
    place: 'Place'
  }
  return categoryNames[categoryKey] || categoryKey
}

// Mapping of frequency keys to their display names
const getFrequencyName = (frequencyKey) => {
  const frequencyNames = {
    very_high: 'Very High',
    high: 'High',
    medium: 'Medium',
    low: 'Low'
  }
  return frequencyNames[frequencyKey] || frequencyKey
}

function AdverbsExercise({ 
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
        {/* English sentence for context */}
        <div className="exercise-word-display" ref={exerciseWordDisplayRef}>
          <span>{currentExercise.english_sentence}</span>
        </div>
        <div className="exercise-instruction">
          Fill in the missing Dutch adverb:
        </div>
        
        {/* Dutch sentence with blank */}
        <div className="dutch-sentence-display">
          <span lang="nl">{currentExercise.dutch_sentence}</span>
        </div>
        
        {/* Exercise Metadata */}
        <ExerciseMetadata 
          items={[
            {
              label: "Difficulty",
              value: currentExercise.difficulty,
              badgeClass: `level-${currentExercise.difficulty.toLowerCase()}`
            },
            {
              label: "Category",
              value: getCategoryName(currentExercise.category),
              badgeClass: 'category-info'
            },
            {
              label: "Frequency",
              value: getFrequencyName(currentExercise.frequency),
              badgeClass: 'frequency-info'
            }
          ]}
        />

        <div className="exercise-input-container">
          <Input
            value={userAnswer}
            onChange={onAnswerChange}
            onKeyPress={onKeyPress}
            onFocus={handleInputFocus}
            placeholder="Type the Dutch adverb..."
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
      <div className={`sentence-result-container ${isCorrect ? 'sentence-result-correct' : 'sentence-result-incorrect'}`}>
        <div className="sentence-result-icon">
          {isCorrect ? '✅ Correct!' : '❌ Incorrect'}
        </div>
        <div className="sentence-result-answer">
          <strong>Correct Dutch adverb:</strong><br />
          <span lang="nl">{currentExercise.correct_answer}</span>
        </div>
        {!isCorrect && (
          <div className="sentence-result-user-answer">
            <strong>Your answer:</strong><br />
            <span>{userAnswer}</span>
          </div>
        )}
      </div>

      {/* Complete sentence with correct answer */}
      <div className="sentence-original">
        <div className="sentence-original-title">
          <strong>Complete Dutch sentence:</strong>
        </div>
        <div className="sentence-original-text" lang="nl">
          {currentExercise.dutch_sentence.replace('__', currentExercise.correct_answer)}
        </div>
      </div>

      {/* Original English sentence */}
      <div className="sentence-original">
        <div className="sentence-original-title">
          <strong>English context:</strong>
        </div>
        <div className="sentence-original-text">
          {currentExercise.english_sentence}
        </div>
      </div>

      {/* Exercise Info */}
      <div className="sentence-exercise-info">
        <div className="sentence-info-item">
          <strong>Adverb:</strong> {currentExercise.adverb} ({currentExercise.english_meaning})
        </div>
        <div className="sentence-info-item">
          <strong>Category:</strong> {getCategoryName(currentExercise.category)}
        </div>
        <div className="sentence-info-item">
          <strong>Usage frequency:</strong> {getFrequencyName(currentExercise.frequency)}
        </div>
        <div className="sentence-info-item">
          <strong>Difficulty:</strong> {currentExercise.difficulty}
        </div>
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

      <Button
        onClick={onNextExercise}
        variant="primary"
        size="large"
        className="full-width-button"
      >
        Next Exercise
      </Button>
    </WordCard>
  )
}

export default AdverbsExercise
