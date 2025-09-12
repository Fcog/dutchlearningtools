import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { initGA } from './utils/analytics.js'
import { register as registerSW, requestNotificationPermission } from './utils/serviceWorker.js'

// Initialize Google Analytics
initGA()

// Register Service Worker for PWA functionality
if (import.meta.env.PROD) {
  registerSW({
    onSuccess: () => {
      console.log('PWA is ready for offline use!')
    },
    onUpdate: () => {
      console.log('New content is available; please refresh.')
    }
  })
  
  // Request notification permission for update notifications
  requestNotificationPermission()
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)