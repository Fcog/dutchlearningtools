import React from 'react'
import ToolCard from '../molecules/ToolCard'

function ToolsGrid({ tools, onToolClick }) {
  return (
    <section className="tools-section">
      <div className="section-header">
        <h2>Learning Tools</h2>
        <p>
          Choose from our collection of interactive Dutch learning tools. 
          Each tool is designed to help you master specific aspects of the Dutch language.
        </p>
      </div>

      <div className="tools-grid">
        {tools.map(tool => (
          <ToolCard 
            key={tool.id} 
            tool={tool} 
            onToolClick={onToolClick}
          />
        ))}
      </div>
    </section>
  )
}

export default ToolsGrid