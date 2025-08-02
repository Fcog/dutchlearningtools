import React from 'react'
import Icon from '../atoms/Icon'
import Button from '../atoms/Button'

function ToolCard({ tool, onToolClick }) {
  return (
    <div 
      className={`tool-card ${!tool.available ? 'coming-soon' : ''}`}
    >
      <Icon icon={tool.icon} size="large" className="tool-icon" />
      <h3>{tool.title}</h3>
      <p>{tool.description}</p>
      
      <ul className="tool-features">
        {tool.features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>
      
      {tool.available ? (
        <Button 
          className="router-link"
          onClick={() => onToolClick(tool)}
          ariaLabel={`Go to ${tool.title}`}
        >
          Launch Tool
        </Button>
      ) : (
        <Button 
          className="tool-link"
          disabled
          ariaLabel={`${tool.title} - Coming Soon`}
        >
          Coming Soon
        </Button>
      )}
    </div>
  )
}

export default ToolCard