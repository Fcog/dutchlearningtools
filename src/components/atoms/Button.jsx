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
  const getButtonStyles = () => {
    const baseStyles = {
      border: 'none',
      borderRadius: '8px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'background-color 0.3s',
      fontWeight: 'normal',
      ...style
    }

    // Size styles
    const sizeStyles = {
      small: { fontSize: '1em', padding: '8px 16px' },
      medium: { fontSize: '1.2em', padding: '12px 24px' },
      large: { fontSize: '1.5em', padding: '15px 30px' },
      xlarge: { fontSize: '2em', padding: '15px 30px', minWidth: '120px' }
    }

    // Variant styles
    const variantStyles = {
      primary: {
        backgroundColor: disabled ? '#6c757d' : '#007bff',
        color: 'white'
      },
      secondary: {
        backgroundColor: disabled ? '#6c757d' : '#28a745',
        color: 'white'
      },
      router: {
        backgroundColor: '#007bff',
        color: 'white'
      },
      disabled: {
        backgroundColor: '#6c757d',
        color: 'white',
        cursor: 'not-allowed'
      }
    }

    return {
      ...baseStyles,
      ...sizeStyles[size],
      ...variantStyles[variant]
    }
  }

  const handleMouseOver = (e) => {
    if (!disabled && onMouseOver) {
      onMouseOver(e)
    } else if (!disabled) {
      // Default hover behavior
      if (variant === 'primary') {
        e.target.style.backgroundColor = '#0056b3'
      } else if (variant === 'secondary') {
        e.target.style.backgroundColor = '#218838'
      } else if (variant === 'router') {
        e.target.style.backgroundColor = '#0056b3'
      }
    }
  }

  const handleMouseOut = (e) => {
    if (!disabled && onMouseOut) {
      onMouseOut(e)
    } else if (!disabled) {
      // Default mouse out behavior
      if (variant === 'primary') {
        e.target.style.backgroundColor = '#007bff'
      } else if (variant === 'secondary') {
        e.target.style.backgroundColor = '#28a745'
      } else if (variant === 'router') {
        e.target.style.backgroundColor = '#007bff'
      }
    }
  }

  return (
    <button
      className={className}
      style={getButtonStyles()}
      onClick={onClick}
      disabled={disabled}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button