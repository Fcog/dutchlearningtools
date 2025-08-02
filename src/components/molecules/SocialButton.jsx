import React from 'react'
import SocialLink from '../atoms/SocialLink'

function SocialButton({ platform, url, title, description, onShare }) {
  const getSocialShareUrl = () => {
    const encodedUrl = encodeURIComponent(url)
    const encodedTitle = encodeURIComponent(title)
    const encodedDescription = encodeURIComponent(description)
    const encodedText = encodeURIComponent(`${title} - ${description}`)

    switch (platform) {
      case 'facebook':
        return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
      case 'tiktok':
        return `https://www.tiktok.com/share?url=${encodedUrl}&text=${encodedText}`
      case 'linkedin':
        return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
      case 'whatsapp':
        return `https://wa.me/?text=${encodedText}%20${encodedUrl}`
      case 'reddit':
        return `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`
      case 'threads':
        return `https://threads.net/intent/post?text=${encodedText}%20${encodedUrl}`
      default:
        return '#'
    }
  }

  const getPlatformConfig = () => {
    const configs = {
      facebook: { icon: '📘', label: 'Facebook' },
      tiktok: { icon: '🎵', label: 'TikTok' },
      linkedin: { icon: '💼', label: 'LinkedIn' },
      whatsapp: { icon: '💬', label: 'WhatsApp' },
      reddit: { icon: '🔶', label: 'Reddit' },
      threads: { icon: '🧵', label: 'Threads' }
    }
    return configs[platform] || { icon: '🔗', label: platform }
  }

  const handleClick = (e) => {
    e.preventDefault()
    onShare(platform)
  }

  const config = getPlatformConfig()

  return (
    <SocialLink
      href={getSocialShareUrl()}
      onClick={handleClick}
      icon={config.icon}
      platform={platform}
      ariaLabel={`Share on ${config.label}`}
    >
      {config.label}
    </SocialLink>
  )
}

export default SocialButton