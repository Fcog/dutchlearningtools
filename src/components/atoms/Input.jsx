import React from 'react'

function Input({ 
  value, 
  onChange, 
  onKeyPress,
  placeholder = '',
  type = 'text',
  autoFocus = false,
  style = {},
  className = '',
  ...props 
}) {
  const defaultStyles = {
    width: '100%',
    maxWidth: '300px',
    padding: '15px',
    fontSize: '1.3em',
    border: '2px solid #ddd',
    borderRadius: '8px',
    textAlign: 'center',
    marginBottom: '20px',
    ...style
  }

  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      onKeyPress={onKeyPress}
      placeholder={placeholder}
      style={defaultStyles}
      className={className}
      autoFocus={autoFocus}
      {...props}
    />
  )
}

export default Input