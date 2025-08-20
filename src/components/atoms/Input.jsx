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
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyPress}
      placeholder={placeholder}
      style={style}
      className={`custom-input ${className}`}
      autoFocus={autoFocus}
      {...props}
    />
  )
}

export default Input