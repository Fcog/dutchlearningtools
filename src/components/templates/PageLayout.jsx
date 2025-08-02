import React from 'react'
import Breadcrumb from '../molecules/Breadcrumb'

function PageLayout({ 
  children, 
  showBreadcrumb = false, 
  breadcrumbPage,
  onHomeClick,
  footer 
}) {
  return (
    <main className="articles-container" role="main">
      {showBreadcrumb && (
        <Breadcrumb 
          onHomeClick={onHomeClick}
          currentPage={breadcrumbPage}
        />
      )}
      
      {children}
      
      {footer && (
        <footer style={{ marginTop: '30px', textAlign: 'center', color: '#6c757d', fontSize: '0.9em' }}>
          {footer}
        </footer>
      )}
    </main>
  )
}

export default PageLayout