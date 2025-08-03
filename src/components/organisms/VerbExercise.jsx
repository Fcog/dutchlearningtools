import React from 'react'
import WordCard from '../molecules/WordCard'
import Button from '../atoms/Button'
import Input from '../atoms/Input'

const PRONOUNS = ['ik', 'jij', 'hij/zij', 'wij', 'jullie', 'zij']

// Mapping of tense keys to their display names
const getTenseName = (tenseKey) => {
  const tenseNames = {
    present: 'Tegenwoordige tijd (Present)',
    past: 'Verleden tijd (Past)',
    perfect: 'Voltooid tegenwoordige tijd (Perfect)',
    future: 'Toekomende tijd (Future)'
  }
  return tenseNames[tenseKey] || tenseKey
}

function VerbExercise({ 
  currentVerb, 
  currentPronoun,
  currentTense,
  userAnswer,
  showResult, 
  isCorrect,
  onAnswerChange,
  onKeyPress,
  onCheckAnswer,
  onNextExercise 
}) {
  if (!showResult) {
    return (
      <WordCard>
        {/* Verb Info */}
        <div className="exercise-word-display">
          <span lang="nl">{currentVerb.infinitive}</span>
        </div>
        <div className="exercise-translation">
          English: {currentVerb.english}
        </div>
        
        {/* Verb Metadata */}
        <div className="exercise-metadata">
          <div className="exercise-metadata-item">
            <span className="exercise-metadata-label">Level:</span>
            <span className={`exercise-metadata-badge level-${currentVerb.level.toLowerCase()}`}>
              {currentVerb.level}
            </span>
          </div>
          <div className="exercise-metadata-item">
            <span className="exercise-metadata-label">Type:</span>
            <span className={`exercise-metadata-badge ${currentVerb.is_irregular === 'irregular' ? 'irregular' : 'regular'}`}>
              {currentVerb.is_irregular === 'irregular' ? 'Irregular' : 'Regular'}
            </span>
          </div>
          <div className="exercise-metadata-item">
            <span className="exercise-metadata-label">Separable:</span>
            <span className={`exercise-metadata-badge ${currentVerb.is_separable ? 'separable' : 'non-separable'}`}>
              {currentVerb.is_separable ? 'Yes' : 'No'}
            </span>
          </div>
        </div>
        
        {/* Tense Info */}
        <div className="exercise-tense">
          <strong>Tense:</strong> {getTenseName(currentTense)}
        </div>

        {/* Exercise Prompt */}
        <div className="exercise-prompt">
          Complete: <strong className="exercise-prompt-highlight">{currentPronoun}</strong> _________
        </div>

        <div className="exercise-input-container">
          <Input
            value={userAnswer}
            onChange={onAnswerChange}
            onKeyPress={onKeyPress}
            placeholder="Type the conjugated verb..."
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
      <div className={`verb-result-container ${isCorrect ? 'verb-result-correct' : 'verb-result-incorrect'}`}>
        <div className="verb-result-icon">
          {isCorrect ? '✅ Correct!' : '❌ Incorrect'}
        </div>
        <div className="verb-result-answer">
          {currentPronoun} {currentVerb.tenses[currentTense].conjugations[currentPronoun]}
        </div>
        {!isCorrect && (
          <div className="verb-result-user-answer">
            You answered: {userAnswer}
          </div>
        )}
      </div>

      {/* Complete Conjugation Table */}
      <div className="conjugation-table">
        <div className="conjugation-table-title">
          Complete conjugation of "{currentVerb.infinitive}" ({getTenseName(currentTense)}):
        </div>
        <div className="conjugation-grid">
          {PRONOUNS.map(pronoun => (
            <div key={pronoun} className="conjugation-item">
              <span className="conjugation-pronoun">{pronoun}:</span>
              <span>{currentVerb.tenses[currentTense].conjugations[pronoun]}</span>
            </div>
          ))}
        </div>
      </div>

      <Button
        onClick={onNextExercise}
        variant="secondary"
        size="large"
        className="full-width-button"
      >
        Next Exercise
      </Button>
    </WordCard>
  )
}

export default VerbExercise