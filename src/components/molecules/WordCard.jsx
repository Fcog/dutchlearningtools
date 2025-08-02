import React from 'react'

function WordCard({ children, style = {} }) {
  return (
    <article className="word-card custom-wordcard" style={style}>
      {children}
    </article>
  )
}

export default WordCard