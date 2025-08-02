import React from 'react'
import Badge from '../atoms/Badge'

function ScoreDisplay({ score, style = {} }) {
  if (score.total === 0) return null

  const percentage = Math.round((score.correct / score.total) * 100)

  const defaultStyle = {
    textAlign: 'center',
    marginBottom: '20px',
    ...style
  }

  return (
    <div style={defaultStyle}>
      <Badge>
        <div style={{ fontSize: '1.1em', color: '#333' }}>
          Score: <strong>{score.correct}/{score.total}</strong> 
          {score.total > 0 && (
            <span style={{ color: '#666', marginLeft: '10px' }}>
              ({percentage}%)
            </span>
          )}
        </div>
      </Badge>
    </div>
  )
}

export default ScoreDisplay