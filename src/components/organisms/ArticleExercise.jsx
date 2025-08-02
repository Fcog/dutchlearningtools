import React from 'react'
import WordCard from '../molecules/WordCard'
import Button from '../atoms/Button'
import rulesData from '../../data/rules-articles.json'

function ArticleExercise({ 
  currentWord, 
  showResult, 
  isCorrect, 
  selectedArticle,
  onArticleChoice, 
  onNextWord 
}) {
  if (!showResult) {
    return (
      <WordCard>
        <div style={{
          fontSize: '3em',
          color: '#333',
          marginBottom: '10px',
          fontWeight: 'bold'
        }}>
          <span lang="nl">___ {currentWord.name}</span>
        </div>
        <div style={{
          fontSize: '1.5em',
          color: '#6c757d',
          marginBottom: '30px'
        }}>
          English: the {currentWord.translation}
        </div>
        
        {/* Article Choice Buttons */}
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            onClick={() => onArticleChoice('de')}
            variant="primary"
            size="xlarge"
          >
            de
          </Button>
          
          <Button
            onClick={() => onArticleChoice('het')}
            variant="secondary"
            size="xlarge"
          >
            het
          </Button>
        </div>
      </WordCard>
    )
  }

  return (
    <WordCard>
      {/* Result Display */}
      <div style={{
        fontSize: '2em',
        color: isCorrect ? '#28a745' : '#dc3545',
        marginBottom: '20px',
        fontWeight: 'bold'
      }}>
        {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
      </div>
      
      <div style={{
        fontSize: '3em',
        color: '#333',
        marginBottom: '10px',
        fontWeight: 'bold'
      }}>
        <span lang="nl">{currentWord.article} {currentWord.name}</span>
      </div>
      
      <div style={{
        fontSize: '1.5em',
        color: '#6c757d',
        marginBottom: '20px'
      }}>
        English: the {currentWord.translation}
      </div>

      <div style={{
        fontSize: '1em',
        color: '#28a745',
        fontStyle: 'italic',
        textTransform: 'capitalize',
        marginBottom: '15px'
      }}>
        Category: {currentWord.category.replace('_', ' ')}
      </div>

      {/* Rule Explanation */}
      {currentWord.rule && rulesData[currentWord.rule] && (
        <div style={{
          fontSize: '1em',
          color: '#6c757d',
          backgroundColor: '#f8f9fa',
          padding: '15px',
          borderRadius: '8px',
          border: '1px solid #e9ecef',
          marginBottom: '20px',
          textAlign: 'left'
        }}>
          <div style={{
            fontWeight: 'bold',
            color: '#495057',
            marginBottom: '5px',
            textTransform: 'capitalize'
          }}>
            📖 Rule: {currentWord.rule.replace('-', ' ')}
          </div>
          <div style={{ lineHeight: '1.4' }}>
            {rulesData[currentWord.rule]}
          </div>
        </div>
      )}

      {/* Next Word Button */}
      <Button
        onClick={onNextWord}
        variant="primary"
        size="medium"
      >
        Next Word
      </Button>
    </WordCard>
  )
}

export default ArticleExercise