import React from 'react'
import SocialButton from '../molecules/SocialButton'

function SocialSharing({ title, description, onShare }) {
  const platforms = ['facebook', 'tiktok', 'linkedin', 'whatsapp', 'reddit', 'threads']

  return (
    <section className="social-sharing">
      <h2 className="social-sharing-title">
        📢 Share This Tool
      </h2>
      <p className="social-sharing-description">
        Help others learn Dutch! Share this free interactive exercise with your friends.
      </p>
      
      <div className="social-buttons">
        {platforms.map(platform => (
          <SocialButton
            key={platform}
            platform={platform}
            url={window.location.href}
            title={title}
            description={description}
            onShare={onShare}
          />
        ))}
      </div>
    </section>
  )
}

export default SocialSharing