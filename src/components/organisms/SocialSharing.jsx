import React from 'react'
import SocialButton from '../molecules/SocialButton'

function SocialSharing({ title, description, onShare }) {
  const platforms = ['facebook', 'tiktok', 'linkedin', 'whatsapp', 'reddit', 'threads']

  return (
    <section className="social-sharing">
      <h2 style={{ fontSize: '1.3em', color: '#333', marginBottom: '10px', textAlign: 'center' }}>
        📢 Share This Tool
      </h2>
      <p style={{ color: '#666', textAlign: 'center', margin: '0 0 15px 0' }}>
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