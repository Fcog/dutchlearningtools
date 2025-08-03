import ReactGA from 'react-ga4';

// Google Analytics 4 Measurement ID
const GA_MEASUREMENT_ID = 'G-R8R9QCZQ29';

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window !== 'undefined') {
    ReactGA.initialize(GA_MEASUREMENT_ID, {
      debug: process.env.NODE_ENV === 'development', // Enable debug mode in development
    });
  }
};

// Track page views
export const trackPageView = (path) => {
  if (typeof window !== 'undefined') {
    ReactGA.send({ 
      hitType: 'pageview', 
      page: path,
      title: document.title 
    });
  }
};

// Track custom events
export const trackEvent = (eventName, parameters = {}) => {
  if (typeof window !== 'undefined') {
    ReactGA.event(eventName, parameters);
  }
};

// Track specific events for the Dutch learning app
export const trackLearningEvent = (action, tool, details = {}) => {
  trackEvent('learning_interaction', {
    action,
    tool,
    ...details
  });
};

export default {
  initGA,
  trackPageView,
  trackEvent,
  trackLearningEvent
};