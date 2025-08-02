import React from 'react'

function Icon({ 
  icon, 
  size = 'medium',
  style = {},
  className = '',
  ...props 
}) {
  const getSizeStyles = () => {
    const sizes = {
      small: { fontSize: '1em' },
      medium: { fontSize: '1.5em' },
      large: { fontSize: '2em' },
      xlarge: { fontSize: '3em' }
    }
    return sizes[size] || sizes.medium
  }

  const iconStyles = {
    ...getSizeStyles(),
    ...style
  }

  return (
    <span 
      className={className}
      style={iconStyles}
      {...props}
    >
      {icon}
    </span>
  )
}

export default Icon