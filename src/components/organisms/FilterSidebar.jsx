import React from 'react'
import FilterSelector from './FilterSelector'
import Button from '../atoms/Button'
import Icon from '../atoms/Icon'

function FilterSidebar({
  isOpen,
  onToggle,
  selectedTenses,
  selectedLevels,
  selectedVerbTypes,
  selectedSeparable,
  onTenseChange,
  onLevelChange,
  onVerbTypeChange,
  onSeparableChange,
  filteredVerbsCount
}) {
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
          <FilterSelector
            selectedTenses={selectedTenses}
            selectedLevels={selectedLevels}
            selectedVerbTypes={selectedVerbTypes}
            selectedSeparable={selectedSeparable}
            onTenseChange={onTenseChange}
            onLevelChange={onLevelChange}
            onVerbTypeChange={onVerbTypeChange}
            onSeparableChange={onSeparableChange}
            className="filter-selector-sidebar"
          />

          {filteredVerbsCount > 0 && (
            <div className="sidebar-verb-count">
              <div className="sidebar-verb-count-content">
                <span className="sidebar-verb-count-number">{filteredVerbsCount}</span>
                <span className="sidebar-verb-count-text">
                  verb{filteredVerbsCount !== 1 ? 's' : ''} available
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
                onLevelChange(['A1', 'A2'])
                onVerbTypeChange(['regular'])
                onSeparableChange(['non-separable'])
              }}
              className="sidebar-quick-action"
            >
              🎯 Beginner Focus
            </Button>
            <Button
              variant="secondary"
              size="small"
              onClick={() => {
                onLevelChange(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'])
                onVerbTypeChange(['regular', 'irregular'])
                onSeparableChange(['separable', 'non-separable'])
              }}
              className="sidebar-quick-action"
            >
              📚 All Verbs
            </Button>
            <Button
              variant="secondary"
              size="small"
              onClick={() => {
                onTenseChange(['past', 'perfect'])
                onVerbTypeChange(['irregular'])
                onSeparableChange(['separable'])
              }}
              className="sidebar-quick-action"
            >
              🧩 Challenge Mode
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}

export default FilterSidebar