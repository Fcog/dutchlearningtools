import React from 'react'

function SocialLink({ 
  href,
  onClick,
  children,
  icon,
  platform,
  ariaLabel,
  className = '',
  ...props 
}) {
  const socialLinkStyles = {
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`social-button ${platform} ${className}`}
      aria-label={ariaLabel}
      onClick={onClick}
      style={socialLinkStyles}
      {...props}
    >
      {icon && <span className="social-icon">{icon}</span>}
      {children}
    </a>
  )
}

export default SocialLink