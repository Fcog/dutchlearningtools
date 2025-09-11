import React from 'react'
import { Checkbox, Text } from '../atoms'

function FilterSection({
  title,
  description,
  items,
  selectedItems,
  onToggle,
  options,
  selectedValues,
  onChange,
  type,
  isExpanded = true,
  onToggleExpanded,
  showExamples = false,
  showMobileControls = false,
  className = ''
}) {
  // Support both old interface (items/selectedItems) and new interface (options/selectedValues)
  const actualItems = items || (options ? options.map(opt => ({ key: opt.value, name: opt.label })) : [])
  const actualSelectedItems = selectedItems || selectedValues || []
  const actualOnToggle = onToggle || ((key) => {
    if (onChange) {
      const newSelected = actualSelectedItems.includes(key)
        ? actualSelectedItems.filter(item => item !== key)
        : [...actualSelectedItems, key]
      onChange(newSelected)
    }
  })
  
  const selectedText = getSelectedText(actualItems, actualSelectedItems)
  
  function getSelectedText(items, selectedItems) {
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

  return (
    <div className={`filter-section ${className}`}>
      <div 
        className={`filter-section-header ${showMobileControls ? 'filter-section-header-clickable' : ''}`}
        onClick={showMobileControls ? onToggleExpanded : undefined}
      >
        <Text as="h4" size="medium" weight="medium" className="filter-section-title">
          {title}
        </Text>
        
        {showMobileControls && (
          <div className="filter-section-summary">
            <Text size="small" className="filter-section-selected">
              {selectedText}
            </Text>
            <Text size="small" className="filter-section-count">
              ({actualSelectedItems.length}/{actualItems.length})
            </Text>
            <span className={`filter-section-arrow ${isExpanded ? 'filter-section-arrow-up' : ''}`}>
              ▼
            </span>
          </div>
        )}
        
        {!showMobileControls && (
          <Text size="small" className="filter-section-count">
            ({actualSelectedItems.length}/{actualItems.length})
          </Text>
        )}
      </div>
      
      {isExpanded && (
        <div className="filter-options">
          {actualItems.map(item => (
            <FilterOption
              key={item.key}
              item={item}
              isSelected={actualSelectedItems.includes(item.key)}
              isDisabled={actualSelectedItems.length === 1 && actualSelectedItems.includes(item.key)}
              onToggle={() => actualOnToggle(item.key)}
              showExample={showExamples}
            />
          ))}
          
          {actualSelectedItems.length === 1 && title.toLowerCase().includes('tense') && (
            <div className="filter-warning">
              💡 Select at least one tense
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function FilterOption({ item, isSelected, isDisabled, onToggle, showExample }) {
  return (
    <label className={`filter-option filter-option-compact ${isSelected ? 'filter-option-selected' : ''}`}>
      <Checkbox
        checked={isSelected}
        onChange={onToggle}
        disabled={isDisabled}
        className="filter-checkbox"
      />
      <div className="filter-option-content">
        <div className="filter-option-header-compact">
          <Text size="small" weight="medium" className="filter-option-name">
            {item.name}
          </Text>
          <Text size="small" color="muted" className="filter-option-description">
            • {item.description}
          </Text>
          {showExample && item.example && (
            <Text size="small" color="muted" className="filter-option-example-inline">
              (<code>{item.example}</code>)
            </Text>
          )}
        </div>
      </div>
    </label>
  )
}

export default FilterSection