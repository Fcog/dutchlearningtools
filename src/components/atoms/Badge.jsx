import React from 'react'

function Badge({ 
  children, 
  variant = 'default',
  style = {},
  className = '',
  ...props 
}) {
  const getVariantStyles = () => {
    const variants = {
      default: {
        backgroundColor: '#f8f9fa',
        color: '#333',
        border: '1px solid #e9ecef'
      },
      success: {
        backgroundColor: '#d4edda',
        color: '#155724',
        border: '2px solid #c3e6cb'
      },
      error: {
        backgroundColor: '#f8d7da',
        color: '#721c24',
        border: '2px solid #f5c6cb'
      }
    }
    return variants[variant] || variants.default
  }

  const badgeStyles = {
    textAlign: 'center',
    padding: '15px',
    borderRadius: '8px',
    fontSize: '1.1em',
    ...getVariantStyles(),
    ...style
  }

  return (
    <div 
      className={className}
      style={badgeStyles}
      {...props}
    >
      {children}
    </div>
  )
}

export default Badge