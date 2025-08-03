import React from 'react'
import Card from '../atoms/Card'

function WordCard({ children, style = {} }) {
  return (
    <Card 
      as="article" 
      className="word-card custom-wordcard" 
      style={style}
    >
      {children}
    </Card>
  )
}

export default WordCard