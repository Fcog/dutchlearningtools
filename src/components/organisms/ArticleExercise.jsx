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
        <div className="exercise-word-display">
          <span lang="nl">___ {currentWord.name}</span>
        </div>
        <div className="exercise-translation">
          English: the {currentWord.translation}
        </div>
        
        {/* Article Choice Buttons */}
        <div className="exercise-buttons-container">
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
      <div className={`exercise-result-display ${isCorrect ? 'exercise-result-correct' : 'exercise-result-incorrect'}`}>
        {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
      </div>
      
      <div className="exercise-word-display">
        <span lang="nl">{currentWord.article} {currentWord.name}</span>
      </div>
      
      <div className="exercise-translation">
        English: the {currentWord.translation}
      </div>



      {/* Rule Explanation */}
      {currentWord.rule && rulesData[currentWord.rule] && (
        <div className="exercise-rule-explanation">
          <div className="exercise-rule-title">
            📖 Rule: {currentWord.rule.replace('-', ' ')}
          </div>
          <div className="exercise-rule-content">
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