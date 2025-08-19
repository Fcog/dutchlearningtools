import ReactGA from 'react-ga4';
import { hasConsentForCookies } from './cookieConsent';

// Google Analytics 4 Measurement ID
const GA_MEASUREMENT_ID = 'G-R8R9QCZQ29';

let isGAInitialized = false;

// Initialize Google Analytics only with consent
export const initGA = () => {
  if (typeof window !== 'undefined' && hasConsentForCookies() && !isGAInitialized) {
    ReactGA.initialize(GA_MEASUREMENT_ID, {
      debug: process.env.NODE_ENV === 'development', // Enable debug mode in development
    });
    isGAInitialized = true;
  }
};

// Initialize GA when consent is granted (called by consent banner)
export const initGAWithConsent = () => {
  if (typeof window !== 'undefined' && !isGAInitialized) {
    ReactGA.initialize(GA_MEASUREMENT_ID, {
      debug: process.env.NODE_ENV === 'development',
    });
    isGAInitialized = true;
    
    // Track the current page since we're initializing late
    trackPageView(window.location.pathname);
  }
};

// Track page views (only if GA is initialized and user has consented)
export const trackPageView = (path) => {
  if (typeof window !== 'undefined' && isGAInitialized && hasConsentForCookies()) {
    ReactGA.send({ 
      hitType: 'pageview', 
      page: path,
      title: document.title 
    });
  }
};

export default {
  initGA,
  initGAWithConsent,
  trackPageView
};