import React from 'react'

function Card({ 
  children, 
  variant = 'default',
  padding = 'medium',
  className = '',
  style = {},
  as = 'div',
  ...props 
}) {
  const getCardClasses = () => {
    const classes = [
      'card',
      `card-${variant}`,
      `card-padding-${padding}`
    ]
    
    if (className) {
      classes.push(className)
    }
    
    return classes.join(' ')
  }

  const Component = as

  return (
    <Component 
      className={getCardClasses()}
      style={style}
      {...props}
    >
      {children}
    </Component>
  )
}

export default Card