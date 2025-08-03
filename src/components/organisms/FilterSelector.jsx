import React, { useState, useEffect } from 'react'
import { Text, Button } from '../atoms'
import FilterSection from '../molecules/FilterSection'

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

  const handleQuickAction = (type) => {
    if (type === 'beginner') {
      onLevelChange(['A1', 'A2'])
      onVerbTypeChange(['regular', 'irregular'])
      onSeparableChange(['separable', 'non-separable'])
    } else if (type === 'all') {
      onLevelChange(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'])
      onVerbTypeChange(['regular', 'irregular'])
      onSeparableChange(['separable', 'non-separable'])
    }
  }

  return (
    <div className={`filter-selector ${className}`}>
      <div className="filter-selector-header">
        <Text as="h3" size="large" weight="bold">
          Exercise Filters
        </Text>
        <Text size="medium" color="muted" className="filter-selector-description">
          Customize your practice by selecting tenses, levels, and verb types
        </Text>
      </div>
      
      <div className="filter-sections">
        <FilterSection
          title="Tenses"
          items={AVAILABLE_TENSES}
          selectedItems={selectedTenses}
          onToggle={(key) => handleToggle(AVAILABLE_TENSES, selectedTenses, onTenseChange, key)}
          isExpanded={expandedSections.tenses}
          onToggleExpanded={() => toggleSection('tenses')}
          showExamples={true}
          showMobileControls={isMobile && !isInSidebar}
        />

        <FilterSection
          title="Levels"
          items={AVAILABLE_LEVELS}
          selectedItems={selectedLevels}
          onToggle={(key) => handleToggle(AVAILABLE_LEVELS, selectedLevels, onLevelChange, key)}
          isExpanded={expandedSections.levels}
          onToggleExpanded={() => toggleSection('levels')}
          showMobileControls={isMobile && !isInSidebar}
        />

        <FilterSection
          title="Verb Types"
          items={VERB_TYPES}
          selectedItems={selectedVerbTypes}
          onToggle={(key) => handleToggle(VERB_TYPES, selectedVerbTypes, onVerbTypeChange, key)}
          isExpanded={expandedSections.verbTypes}
          onToggleExpanded={() => toggleSection('verbTypes')}
          showMobileControls={isMobile && !isInSidebar}
        />

        <FilterSection
          title="Separable Verbs"
          items={SEPARABLE_OPTIONS}
          selectedItems={selectedSeparable}
          onToggle={(key) => handleToggle(SEPARABLE_OPTIONS, selectedSeparable, onSeparableChange, key)}
          isExpanded={expandedSections.separable}
          onToggleExpanded={() => toggleSection('separable')}
          showMobileControls={isMobile && !isInSidebar}
        />
      </div>

      {/* Quick actions for mobile */}
      {isMobile && (
        <div className="filter-quick-actions">
          <Button 
            variant="secondary"
            size="small"
            className="filter-quick-action"
            onClick={() => handleQuickAction('beginner')}
          >
            Beginner Mode
          </Button>
          <Button 
            variant="secondary"
            size="small"
            className="filter-quick-action"
            onClick={() => handleQuickAction('all')}
          >
            All Levels
          </Button>
        </div>
      )}
    </div>
  )
}

export default FilterSelector