import React from 'react'
import Button from '../atoms/Button'

function Breadcrumb({ onHomeClick, currentPage }) {
  return (
    <nav className="breadcrumb">
      <Button
        onClick={onHomeClick}
        variant="router"
        size="small"
        className="breadcrumb-button"
      >
        🏠 Dutch Learning Tools
      </Button>
      <span className="breadcrumb-separator"> {'>'} </span>
      <span className="breadcrumb-page-title">{currentPage}</span>
    </nav>
  )
}

export default Breadcrumb