import React from 'react'

function WordCard({ children, style = {} }) {
  const defaultStyles = {
    marginTop: '20px',
    padding: '30px',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    border: '2px solid #e9ecef',
    textAlign: 'center',
    ...style
  }

  return (
    <article className="word-card" style={defaultStyles}>
      {children}
    </article>
  )
}

export default WordCard