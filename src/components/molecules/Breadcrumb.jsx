import React from 'react'
import Button from '../atoms/Button'

function Breadcrumb({ onHomeClick, currentPage }) {
  return (
    <nav className="breadcrumb">
      <Button
        onClick={onHomeClick}
        variant="router"
        size="small"
        style={{
          backgroundColor: 'transparent',
          color: '#007bff',
          padding: '5px 10px',
          fontSize: '1em'
        }}
      >
        🏠 Dutch Learning Tools
      </Button>
      <span> {'>'} </span>
      <span>{currentPage}</span>
    </nav>
  )
}

export default Breadcrumb