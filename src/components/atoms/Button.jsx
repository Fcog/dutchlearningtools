import React from 'react'

function Button({ 
  children, 
  onClick, 
  disabled = false, 
  variant = 'primary',
  size = 'medium',
  className = '',
  style = {},
  onMouseOver,
  onMouseOut,
  ariaLabel,
  ...props 
}) {
  const getButtonClasses = () => {
    const classes = [
      'btn-base',
      `btn-${variant}`,
      `btn-size-${size}`
    ]
    
    if (disabled) {
      classes.push('btn-disabled')
    }
    
    if (className) {
      classes.push(className)
    }
    
    return classes.join(' ')
  }

  return (
    <button
      className={getButtonClasses()}
      style={style}
      onClick={onClick}
      disabled={disabled}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button