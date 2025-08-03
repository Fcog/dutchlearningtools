import React from 'react'

function Checkbox({ 
  checked = false,
  onChange,
  disabled = false,
  label,
  className = '',
  id,
  name,
  ...props 
}) {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className={`checkbox-container ${className}`}>
      <input
        type="checkbox"
        id={checkboxId}
        name={name}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="checkbox-input"
        {...props}
      />
      {label && (
        <label 
          htmlFor={checkboxId} 
          className={`checkbox-label ${disabled ? 'checkbox-label-disabled' : ''}`}
        >
          {label}
        </label>
      )}
    </div>
  )
}

export default Checkbox