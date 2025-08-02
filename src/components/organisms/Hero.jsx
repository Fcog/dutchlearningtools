import React from 'react'
import Icon from '../atoms/Icon'

function Hero() {
  return (
    <section className="hero">
      <Icon icon="🇳🇱" size="large" className="flag" />
      <h1>Dutch Learning Tools</h1>
      <p>
        Comprehensive collection of free, interactive Dutch language learning tools. 
        Master Dutch grammar, vocabulary, pronunciation, and conversation skills with our engaging daily practice tools.
      </p>
    </section>
  )
}

export default Hero