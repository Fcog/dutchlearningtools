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
        <footer className="page-footer">
          {footer}
        </footer>
      )}
    </main>
  )
}

export default PageLayout