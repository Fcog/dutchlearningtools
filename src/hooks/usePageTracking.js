import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../utils/analytics';

// Custom hook to track page views when route changes
export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    // Track the page view whenever the location changes
    trackPageView(location.pathname + location.search);
  }, [location]);
};

export default usePageTracking;