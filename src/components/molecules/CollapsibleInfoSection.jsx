import React, { useState, useEffect } from 'react'

function CollapsibleInfoSection({ title, children, defaultExpanded = false }) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
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

  // Always show expanded on desktop, only collapsible on mobile
  const shouldShowContent = isMobile ? isExpanded : true
  const shouldShowToggle = isMobile

  const toggleExpanded = () => {
    if (isMobile) {
      setIsExpanded(!isExpanded)
    }
  }

  return (
    <section className="info-section">
      <div 
        className={`info-section-header ${shouldShowToggle ? 'info-section-header-clickable' : ''}`}
        onClick={shouldShowToggle ? toggleExpanded : undefined}
      >
        <h2 className="info-section-title">
          {title}
        </h2>
        
        {shouldShowToggle && (
          <span className={`info-section-arrow ${isExpanded ? 'info-section-arrow-up' : ''}`}>
            ▼
          </span>
        )}
      </div>
      
      {shouldShowContent && (
        <div className="info-section-content">
          {children}
        </div>
      )}
    </section>
  )
}

export default CollapsibleInfoSection
