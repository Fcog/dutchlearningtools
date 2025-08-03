import React from 'react'

function Text({ 
  as = 'p',
  size = 'medium',
  weight = 'normal',
  color = 'default',
  className = '',
  children,
  style = {},
  ...props 
}) {
  const Component = as
  
  const getTextClasses = () => {
    const classes = [
      'text',
      `text-size-${size}`,
      `text-weight-${weight}`,
      `text-color-${color}`
    ]
    
    if (className) {
      classes.push(className)
    }
    
    return classes.join(' ')
  }

  return (
    <Component 
      className={getTextClasses()} 
      style={style}
      {...props}
    >
      {children}
    </Component>
  )
}

export default Text