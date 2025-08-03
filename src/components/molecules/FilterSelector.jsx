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

const AVAILABLE_LEVELS = [
  { key: 'A1', name: 'A1', description: 'Beginner' },
  { key: 'A2', name: 'A2', description: 'Elementary' },
  { key: 'B1', name: 'B1', description: 'Intermediate' },
  { key: 'B2', name: 'B2', description: 'Upper Intermediate' },
  { key: 'C1', name: 'C1', description: 'Advanced' },
  { key: 'C2', name: 'C2', description: 'Proficient' }
]

const VERB_TYPES = [
  { key: 'regular', name: 'Regular', description: 'Regelmatige werkwoorden' },
  { key: 'irregular', name: 'Irregular', description: 'Onregelmatige werkwoorden' }
]

const SEPARABLE_OPTIONS = [
  { key: 'separable', name: 'Separable', description: 'Scheidbare werkwoorden' },
  { key: 'non-separable', name: 'Non-separable', description: 'Niet-scheidbare werkwoorden' }
]

function FilterSelector({ 
  selectedTenses, 
  selectedLevels, 
  selectedVerbTypes, 
  selectedSeparable, 
  onTenseChange, 
  onLevelChange, 
  onVerbTypeChange, 
  onSeparableChange,
  className = '' 
}) {
  const isInSidebar = className.includes('filter-selector-sidebar')
  const [expandedSections, setExpandedSections] = useState({
    tenses: true,
    levels: isInSidebar,
    verbTypes: isInSidebar,
    separable: isInSidebar
  })
  const [isMobile, setIsMobile] = useState(false)

  // Check if user is on mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const toggleSection = (section) => {
    if (isMobile && !isInSidebar) {
      setExpandedSections(prev => ({
        ...prev,
        [section]: !prev[section]
      }))
    }
  }

  const handleToggle = (items, selectedItems, onChangeCallback, itemKey) => {
    if (selectedItems.includes(itemKey)) {
      // Remove item if it's already selected (but keep at least one)
      if (selectedItems.length > 1) {
        onChangeCallback(selectedItems.filter(t => t !== itemKey))
      }
    } else {
      // Add item if it's not selected
      onChangeCallback([...selectedItems, itemKey])
    }
  }

  const getSelectedText = (items, selectedItems) => {
    if (selectedItems.length === items.length) {
      return 'All'
    }
    if (selectedItems.length === 0) {
      return 'None'
    }
    return items
      .filter(item => selectedItems.includes(item.key))
      .map(item => item.name)
      .join(', ')
  }

  const renderFilterSection = (
    title, 
    items, 
    selectedItems, 
    onToggle, 
    sectionKey,
    showExamples = false
  ) => {
    const isExpanded = (isMobile && !isInSidebar) ? expandedSections[sectionKey] : true
    const selectedText = getSelectedText(items, selectedItems)
    
    return (
      <div className="filter-section">
        <div 
          className={`filter-section-header ${(isMobile && !isInSidebar) ? 'filter-section-header-clickable' : ''}`}
          onClick={() => toggleSection(sectionKey)}
        >
          <h4 className="filter-section-title">{title}</h4>
          {isMobile && !isInSidebar && (
            <div className="filter-section-summary">
              <span className="filter-section-selected">{selectedText}</span>
              <span className="filter-section-count">({selectedItems.length}/{items.length})</span>
              <span className={`filter-section-arrow ${isExpanded ? 'filter-section-arrow-up' : ''}`}>▼</span>
            </div>
          )}
          {(!isMobile || isInSidebar) && (
            <span className="filter-section-count">({selectedItems.length}/{items.length})</span>
          )}
        </div>
        
        {(isExpanded || !isMobile) && (
          <div className="filter-options">
            {items.map(item => (
              <label 
                key={item.key} 
                className={`filter-option ${selectedItems.includes(item.key) ? 'filter-option-selected' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.key)}
                  onChange={() => onToggle(item.key)}
                  disabled={selectedItems.length === 1 && selectedItems.includes(item.key)}
                  className="filter-checkbox"
                />
                <div className="filter-option-content">
                  <div className="filter-option-header">
                    <span className="filter-option-name">{item.name}</span>
                    <span className="filter-option-description">{item.description}</span>
                  </div>
                  {showExamples && item.example && (
                    <div className="filter-option-example">
                      Example: <code>{item.example}</code>
                    </div>
                  )}
                </div>
              </label>
            ))}
            
            {selectedItems.length === 1 && sectionKey === 'tenses' && (
              <div className="filter-warning">
                💡 Select at least one tense
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`filter-selector ${className}`}>
      <div className="filter-selector-header">
        <h3>Exercise Filters</h3>
        <p className="filter-selector-description">
          Customize your practice by selecting tenses, levels, and verb types
        </p>
      </div>
      
      <div className="filter-sections">
        {renderFilterSection(
          'Tenses',
          AVAILABLE_TENSES,
          selectedTenses,
          (key) => handleToggle(AVAILABLE_TENSES, selectedTenses, onTenseChange, key),
          'tenses',
          true
        )}

        {renderFilterSection(
          'Levels',
          AVAILABLE_LEVELS,
          selectedLevels,
          (key) => handleToggle(AVAILABLE_LEVELS, selectedLevels, onLevelChange, key),
          'levels'
        )}

        {renderFilterSection(
          'Verb Types',
          VERB_TYPES,
          selectedVerbTypes,
          (key) => handleToggle(VERB_TYPES, selectedVerbTypes, onVerbTypeChange, key),
          'verbTypes'
        )}

        {renderFilterSection(
          'Separable Verbs',
          SEPARABLE_OPTIONS,
          selectedSeparable,
          (key) => handleToggle(SEPARABLE_OPTIONS, selectedSeparable, onSeparableChange, key),
          'separable'
        )}
      </div>

      {/* Quick actions for mobile */}
      {isMobile && (
        <div className="filter-quick-actions">
          <button 
            className="filter-quick-action"
            onClick={() => {
              onLevelChange(['A1', 'A2'])
              onVerbTypeChange(['regular', 'irregular'])
              onSeparableChange(['separable', 'non-separable'])
            }}
          >
            Beginner Mode
          </button>
          <button 
            className="filter-quick-action"
            onClick={() => {
              onLevelChange(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'])
              onVerbTypeChange(['regular', 'irregular'])
              onSeparableChange(['separable', 'non-separable'])
            }}
          >
            All Levels
          </button>
        </div>
      )}
    </div>
  )
}

export default FilterSelector