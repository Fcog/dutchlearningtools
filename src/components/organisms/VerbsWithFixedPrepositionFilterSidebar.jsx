import React from 'react'
import { Icon } from '../atoms'
import VerbsWithFixedPrepositionFilterSelector from './VerbsWithFixedPrepositionFilterSelector'

function VerbsWithFixedPrepositionFilterSidebar({
  isOpen,
  onToggle,
  selectedLevels,
  onLevelChange,
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
          <VerbsWithFixedPrepositionFilterSelector
            selectedLevels={selectedLevels}
            onLevelChange={onLevelChange}
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
        </div>
      </aside>
    </>
  )
}

export default VerbsWithFixedPrepositionFilterSidebar
