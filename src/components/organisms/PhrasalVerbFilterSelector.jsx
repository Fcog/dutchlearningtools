import React, { useState, useEffect } from 'react'
import { Text, Button } from '../atoms'
import FilterSection from '../molecules/FilterSection'

const AVAILABLE_LEVELS = [
  { key: 'A2', name: 'A2', description: 'Elementary' },
  { key: 'B1', name: 'B1', description: 'Intermediate' },
  { key: 'B2', name: 'B2', description: 'Upper Intermediate' }
]

function PhrasalVerbFilterSelector({ 
  selectedLevels, 
  onLevelChange, 
  className = '' 
}) {
  const [isMobile, setIsMobile] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    levels: true // Default to expanded since it's the only section
  })

  const isInSidebar = className.includes('filter-selector-sidebar')

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
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const handleToggle = (items, selectedItems, onChange, key) => {
    const isSelected = selectedItems.includes(key)
    
    if (isSelected) {
      // Don't allow deselecting the last item
      if (selectedItems.length > 1) {
        onChange(selectedItems.filter(item => item !== key))
      }
    } else {
      onChange([...selectedItems, key])
    }
  }

  const resetFilters = () => {
    onLevelChange(['A2', 'B1', 'B2'])
  }

  return (
    <div className={`filter-selector ${className}`}>
      <div className="filter-selector-header">
        <Text as="h3" size="large" weight="bold">
          Exercise Filters
        </Text>
        <Text size="medium" color="muted" className="filter-selector-description">
          Select difficulty levels for phrasal verb combinations
        </Text>
      </div>
      
      <div className="filter-sections">
        <FilterSection
          title="Levels"
          items={AVAILABLE_LEVELS}
          selectedItems={selectedLevels}
          onToggle={(key) => handleToggle(AVAILABLE_LEVELS, selectedLevels, onLevelChange, key)}
          isExpanded={expandedSections.levels}
          onToggleExpanded={() => toggleSection('levels')}
          showMobileControls={isMobile && !isInSidebar}
        />
      </div>

      {!isInSidebar && (
        <div className="filter-actions">
          <Button
            onClick={resetFilters}
            variant="secondary"
            size="small"
            className="filter-reset-button"
          >
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  )
}

export default PhrasalVerbFilterSelector
