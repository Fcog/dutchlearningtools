import React, { useRef } from 'react'
import WordCard from '../molecules/WordCard'
import ExerciseMetadata from '../molecules/ExerciseMetadata'
import Button from '../atoms/Button'
import Input from '../atoms/Input'

const SINGULAR_PRONOUNS = ['ik', 'jij', 'hij/zij']
const PLURAL_PRONOUNS = ['wij', 'jullie', 'zij']

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
        {/* Verb Info */}
        <div className="exercise-word-display" ref={exerciseWordDisplayRef}>
          <span lang="nl">{currentVerb.infinitive}</span>
        </div>
        <div className="exercise-translation">
          English: {currentVerb.english}
        </div>
        
        {/* Verb Metadata */}
        <ExerciseMetadata 
          items={[
            {
              label: "Level",
              value: currentVerb.level,
              badgeClass: `level-${currentVerb.level.toLowerCase()}`
            },
            {
              label: "Type",
              value: currentVerb.is_irregular ? 'Irregular' : 'Regular',
              badgeClass: currentVerb.is_irregular ? 'irregular' : 'regular'
            },
            {
              label: "Separable",
              value: currentVerb.is_separable ? 'Yes' : 'No',
              badgeClass: currentVerb.is_separable ? 'separable' : 'non-separable'
            }
          ]}
        />
        
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
            onFocus={handleInputFocus}
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
        <div className="conjugation-columns">
          <div className="conjugation-column">
            <div className="conjugation-column-header">Singular</div>
            {SINGULAR_PRONOUNS.map(pronoun => (
              <div key={pronoun} className="conjugation-item">
                <span className="conjugation-pronoun">{pronoun}:</span>
                <span className="conjugation-verb">{currentVerb.tenses[currentTense].conjugations[pronoun]}</span>
              </div>
            ))}
          </div>
          <div className="conjugation-column">
            <div className="conjugation-column-header">Plural</div>
            {PLURAL_PRONOUNS.map(pronoun => (
              <div key={pronoun} className="conjugation-item">
                <span className="conjugation-pronoun">{pronoun}:</span>
                <span className="conjugation-verb">{currentVerb.tenses[currentTense].conjugations[pronoun]}</span>
              </div>
            ))}
          </div>
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