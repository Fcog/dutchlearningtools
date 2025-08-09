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
        Comprehensive collection of free, interactive Dutch language learning tools. 
        Master Dutch grammar, vocabulary, pronunciation, and conversation skills with our engaging daily practice tools.
      </p>
    </section>
  )
}

export default Hero