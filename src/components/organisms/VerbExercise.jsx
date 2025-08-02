import React from 'react'
import WordCard from '../molecules/WordCard'
import Button from '../atoms/Button'
import Input from '../atoms/Input'

const PRONOUNS = ['ik', 'jij', 'hij/zij', 'wij', 'jullie', 'zij']

function VerbExercise({ 
  currentVerb, 
  currentPronoun,
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
        <div style={{
          fontSize: '3em',
          color: '#333',
          marginBottom: '10px',
          fontWeight: 'bold'
        }}>
          <span lang="nl">{currentVerb.infinitive}</span>
        </div>
        <div style={{
          fontSize: '1.5em',
          color: '#6c757d',
          marginBottom: '30px'
        }}>
          English: {currentVerb.english}
        </div>

        {/* Exercise Prompt */}
        <div style={{
          fontSize: '1.3em',
          color: '#333',
          marginBottom: '20px'
        }}>
          Complete: <strong style={{ color: '#007bff' }}>{currentPronoun}</strong> _________
        </div>

        <div style={{ marginBottom: '20px' }}>
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
              style={{ minWidth: '200px' }}
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
      <div style={{
        padding: '20px',
        borderRadius: '10px',
        marginBottom: '25px',
        backgroundColor: isCorrect ? '#d4edda' : '#f8d7da',
        border: `2px solid ${isCorrect ? '#c3e6cb' : '#f5c6cb'}`,
        color: isCorrect ? '#155724' : '#721c24'
      }}>
        <div style={{ fontSize: '2em', marginBottom: '10px' }}>
          {isCorrect ? '✅ Correct!' : '❌ Incorrect'}
        </div>
        <div style={{ fontSize: '1.5em', fontWeight: 'bold' }}>
          {currentPronoun} {currentVerb.conjugations[currentPronoun]}
        </div>
        {!isCorrect && (
          <div style={{ fontSize: '1em', marginTop: '10px', color: '#666' }}>
            You answered: {userAnswer}
          </div>
        )}
      </div>

      {/* Complete Conjugation Table */}
      <div style={{
        backgroundColor: 'white',
        border: '2px solid #e9ecef',
        borderRadius: '10px',
        padding: '20px',
        marginBottom: '25px'
      }}>
        <div style={{ fontSize: '1em', fontWeight: 'bold', marginBottom: '15px', color: '#333' }}>
          Complete conjugation of "{currentVerb.infinitive}":
        </div>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
          gap: '10px',
          fontSize: '0.95em'
        }}>
          {PRONOUNS.map(pronoun => (
            <div key={pronoun} style={{ 
              display: 'flex',
              padding: '5px 0'
            }}>
              <span style={{ fontWeight: '600', paddingRight: '10px' }}>{pronoun}:</span>
              <span>{currentVerb.conjugations[pronoun]}</span>
            </div>
          ))}
        </div>
      </div>

      <Button
        onClick={onNextExercise}
        variant="secondary"
        size="large"
        style={{
          width: '100%',
          maxWidth: '300px'
        }}
      >
        Next Exercise
      </Button>
    </WordCard>
  )
}

export default VerbExercise