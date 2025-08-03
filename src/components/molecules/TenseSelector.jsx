import React, { useState, useRef, useEffect } from 'react'

const AVAILABLE_TENSES = [
  {
    key: 'present',
    name: 'Present',
    description: 'Tegenwoordige tijd',
    example: 'ik loop'
  },
  {
    key: 'past',
    name: 'Past',
    description: 'Verleden tijd',
    example: 'ik liep'
  },
  {
    key: 'perfect',
    name: 'Perfect',
    description: 'Voltooid tegenwoordige tijd',
    example: 'ik heb gelopen'
  },
  {
    key: 'future',
    name: 'Future',
    description: 'Toekomende tijd',
    example: 'ik zal lopen'
  }
]

function TenseSelector({ selectedTenses, onTenseChange, className = '' }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const handleTenseToggle = (tenseKey) => {
    if (selectedTenses.includes(tenseKey)) {
      // Remove tense if it's already selected (but keep at least one)
      if (selectedTenses.length > 1) {
        onTenseChange(selectedTenses.filter(t => t !== tenseKey))
      }
    } else {
      // Add tense if it's not selected
      onTenseChange([...selectedTenses, tenseKey])
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Get selected tenses names for display
  const getSelectedTensesText = () => {
    if (selectedTenses.length === AVAILABLE_TENSES.length) {
      return 'All tenses'
    }
    return AVAILABLE_TENSES
      .filter(tense => selectedTenses.includes(tense.key))
      .map(tense => tense.name)
      .join(', ')
  }

  return (
    <div className={`tense-selector-dropdown ${className}`} ref={dropdownRef}>
      <div className="tense-selector-header">
        <h3>Tenses to practice:</h3>
      </div>
      
      <div className="tense-dropdown-container">
        <button
          className="tense-dropdown-trigger"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <span className="tense-dropdown-text">{getSelectedTensesText()}</span>
          <span className="tense-dropdown-count">({selectedTenses.length}/{AVAILABLE_TENSES.length})</span>
          <span className={`tense-dropdown-arrow ${isOpen ? 'tense-dropdown-arrow-up' : ''}`}>▼</span>
        </button>
        
        {isOpen && (
          <div className="tense-dropdown-menu">
            {AVAILABLE_TENSES.map(tense => (
              <label 
                key={tense.key} 
                className={`tense-dropdown-option ${selectedTenses.includes(tense.key) ? 'tense-dropdown-option-selected' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={selectedTenses.includes(tense.key)}
                  onChange={() => handleTenseToggle(tense.key)}
                  disabled={selectedTenses.length === 1 && selectedTenses.includes(tense.key)}
                  className="tense-dropdown-checkbox"
                />
                <div className="tense-dropdown-content">
                  <div className="tense-dropdown-header">
                    <span className="tense-dropdown-name">{tense.name}</span>
                    <span className="tense-dropdown-description">{tense.description}</span>
                  </div>
                  <div className="tense-dropdown-example">
                    Example: <code>{tense.example}</code>
                  </div>
                </div>
              </label>
            ))}
            
            {selectedTenses.length === 1 && (
              <div className="tense-dropdown-warning">
                💡 Select at least one tense
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default TenseSelector