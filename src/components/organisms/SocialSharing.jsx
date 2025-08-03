import React from 'react'
import SocialButton from '../molecules/SocialButton'

function SocialSharing({ title, description }) {
  const platforms = ['facebook', 'tiktok', 'linkedin', 'whatsapp', 'reddit', 'threads']

  const handleSocialShare = (platform) => {
    const url = window.location.href
    const encodedUrl = encodeURIComponent(url)
    const encodedTitle = encodeURIComponent(title)
    const encodedDescription = encodeURIComponent(description)
    const encodedText = encodeURIComponent(`${title} - ${description}`)

    let shareUrl = '#'
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
        break
      case 'tiktok':
        shareUrl = `https://www.tiktok.com/share?url=${encodedUrl}&text=${encodedText}`
        break
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
        break
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedText}%20${encodedUrl}`
        break
      case 'reddit':
        shareUrl = `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`
        break
      case 'threads':
        shareUrl = `https://threads.net/intent/post?text=${encodedText}%20${encodedUrl}`
        break
    }
    window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes')
  }

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
            onShare={handleSocialShare}
          />
        ))}
      </div>
    </section>
  )
}

export default SocialSharing