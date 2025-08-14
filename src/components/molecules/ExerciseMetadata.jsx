import React from 'react'

function ExerciseMetadata({ items }) {
  if (!items || items.length === 0) {
    return null
  }

  return (
    <div className="exercise-metadata">
      {items.map((item, index) => (
        <div key={index} className="exercise-metadata-item">
          <span className="exercise-metadata-label">{item.label}:</span>
          <span className={`exercise-metadata-badge ${item.badgeClass || ''}`}>
            {item.value}
          </span>
        </div>
      ))}
    </div>
  )
}

export default ExerciseMetadata
