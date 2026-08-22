import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../api/tracking';

export function usePageTracking() {
  const location = useLocation();
  const previousPath = useRef<string | null>(null);

  useEffect(() => {
    const currentPath = location.pathname + location.search;
    
    if (previousPath.current !== currentPath) {
      previousPath.current = currentPath;
      trackPageView(location.pathname);
    }
  }, [location.pathname, location.search]);
}