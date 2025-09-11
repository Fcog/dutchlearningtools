import React from 'react'
import FilterSection from '../molecules/FilterSection'
import Button from '../atoms/Button'
import Icon from '../atoms/Icon'

function AdverbsFilterSidebar({
  isOpen,
  onToggle,
  selectedDifficulties,
  selectedCategories,
  selectedFrequencies,
  onDifficultyChange,
  onCategoryChange,
  onFrequencyChange,
  filteredAdverbsCount
}) {
  // Available options
  const difficultyOptions = [
    { value: 'A1', label: 'A1 - Beginner' },
    { value: 'A2', label: 'A2 - Elementary' },
    { value: 'B1', label: 'B1 - Intermediate' },
    { value: 'B2', label: 'B2 - Upper Intermediate' }
  ]

  const categoryOptions = [
    { value: 'time', label: 'Time' },
    { value: 'degree', label: 'Degree/Intensity' },
    { value: 'frequency', label: 'Frequency' },
    { value: 'place', label: 'Place' },
    { value: 'probability', label: 'Probability' },
    { value: 'discourse', label: 'Discourse Markers' },
    { value: 'emphasis', label: 'Emphasis' },
    { value: 'contrast', label: 'Contrast' },
    { value: 'certainty', label: 'Certainty' },
    { value: 'confirmation', label: 'Confirmation' },
    { value: 'softener', label: 'Softener' },
    { value: 'inference', label: 'Inference' },
    { value: 'precision', label: 'Precision' },
    { value: 'repetition', label: 'Repetition' },
    { value: 'feeling', label: 'Feeling/State' }
  ]

  const frequencyOptions = [
    { value: 'very_high', label: 'Very High' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ]

  return (
    <>
      {/* Sidebar Toggle Button */}
      <button
        className={`sidebar-toggle ${isOpen ? 'sidebar-toggle-open' : ''}`}
        onClick={onToggle}
        aria-label={isOpen ? 'Close filters' : 'Open filters'}
        aria-expanded={isOpen}
      >
        <Icon icon={isOpen ? '✕' : '☰'} size="small" />
        <span className="sidebar-toggle-text">
          {isOpen ? 'Close' : 'Filters'}
        </span>
      </button>

      {/* Sidebar Overlay for mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={onToggle} />}

      {/* Sidebar Content */}
      <aside className={`filter-sidebar ${isOpen ? 'filter-sidebar-open' : ''}`}>
        <div className="filter-sidebar-header">
          <h2>Exercise Filters</h2>
          <button
            className="filter-sidebar-close"
            onClick={onToggle}
            aria-label="Close filters"
          >
            <Icon icon="✕" size="small" />
          </button>
        </div>

        <div className="filter-sidebar-content">
          {/* Difficulty Filter */}
          <FilterSection
            title="Difficulty"
            description="Choose your practice level"
            options={difficultyOptions}
            selectedValues={selectedDifficulties}
            onChange={onDifficultyChange}
            type="checkbox"
          />

          {/* Category Filter */}
          <FilterSection
            title="Categories"
            description="Select adverb categories to practice"
            options={categoryOptions}
            selectedValues={selectedCategories}
            onChange={onCategoryChange}
            type="checkbox"
          />

          {/* Frequency Filter */}
          <FilterSection
            title="Usage Frequency"
            description="Filter by how often adverbs are used"
            options={frequencyOptions}
            selectedValues={selectedFrequencies}
            onChange={onFrequencyChange}
            type="checkbox"
          />

          {filteredAdverbsCount > 0 && (
            <div className="sidebar-verb-count">
              <div className="sidebar-verb-count-content">
                <span className="sidebar-verb-count-number">{filteredAdverbsCount}</span>
                <span className="sidebar-verb-count-text">
                  adverb{filteredAdverbsCount !== 1 ? 's' : ''} available
                </span>
              </div>
            </div>
          )}

          {/* Quick action buttons */}
          <div className="sidebar-quick-actions">
            <Button
              variant="secondary"
              size="small"
              onClick={() => {
                onDifficultyChange(['A1', 'A2'])
                onCategoryChange(['time', 'degree', 'frequency'])
                onFrequencyChange(['very_high', 'high'])
              }}
              className="sidebar-quick-action"
            >
              🎯 Beginner Focus
            </Button>
            <Button
              variant="secondary"
              size="small"
              onClick={() => {
                onDifficultyChange(['A1', 'A2', 'B1', 'B2'])
                onCategoryChange(['time', 'degree', 'frequency', 'place', 'probability', 'discourse', 'emphasis', 'contrast', 'certainty', 'confirmation', 'softener', 'inference', 'precision', 'repetition', 'feeling'])
                onFrequencyChange(['very_high', 'high', 'medium', 'low'])
              }}
              className="sidebar-quick-action"
            >
              📚 All Adverbs
            </Button>
            <Button
              variant="secondary"
              size="small"
              onClick={() => {
                onDifficultyChange(['A1', 'A2'])
                onCategoryChange(['discourse', 'softener', 'contrast'])
                onFrequencyChange(['very_high'])
              }}
              className="sidebar-quick-action"
            >
              💬 Spoken Dutch
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}

export default AdverbsFilterSidebar
