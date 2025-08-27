import React from 'react'

function ExerciseHint({ exercise }) {
  // Don't render if no hint data is available
  if (!exercise.separable_verb && !exercise.verb_preposition) {
    return null
  }

  const getHintText = () => {
    if (exercise.is_separable && exercise.separable_verb) {
      return (
        <>
          This sentence contains the separable verb '<em>{exercise.separable_verb}</em>' - notice how the particle is in between.
        </>
      )
    } else if (exercise.verb_preposition) {
      return (
        <>
          Complete the verb+preposition construction '<em>{exercise.verb_preposition}</em>'.
        </>
      )
    }
    return null
  }

  if (exercise.is_separable && exercise.separable_verb) {
    return null
  }

    return (
        <div className="exercise-hint">
        <strong>💡 Hint:</strong>{' '}
        {getHintText()}
        </div>
    )
}

export default ExerciseHint
