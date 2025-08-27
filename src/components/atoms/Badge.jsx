import React from 'react'

function Badge({ 
  children, 
  variant = 'default',
  style = {},
  className = '',
  ...props 
}) {
  const getVariantClass = () => {
    const variants = {
      default: 'badge-default',
      success: 'badge-success',
      error: 'badge-error'
    }
    return variants[variant] || variants.default
  }

  return (
    <div 
      className={`custom-badge ${getVariantClass()} ${className}`}
      style={style}
      {...props}
    >
      {children}
    </div>
  )
}

export default Badge