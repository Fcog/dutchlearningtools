import React from 'react'

function Hero() {
  return (
    <section className="hero">
      <img 
        src="/logo.png" 
        alt="Dutch Learning Tools Logo" 
        className="flag"
        style={{ 
          width: '64px', 
          height: '64px', 
          objectFit: 'contain',
          display: 'block',
          margin: '0 auto'
        }}
      />
      <h1>Dutch Learning Tools</h1>
      <p>
        Master Dutch with interactive exercises for articles & nouns, verb conjugations, prepositions, and conjunctions. 
        Practice with 200+ common Dutch words and improve your grammar skills with our free, engaging learning tools.
      </p>
    </section>
  )
}

export default Hero