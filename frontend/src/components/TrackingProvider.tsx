import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../api/tracking';

export function TrackingProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const previousPath = useRef<string | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    const currentPath = location.pathname + location.search;
    
    if (isFirstRender.current) {
      isFirstRender.current = false;
      previousPath.current = currentPath;
      trackPageView(location.pathname);
      return;
    }
    
    if (previousPath.current !== currentPath) {
      previousPath.current = currentPath;
      trackPageView(location.pathname);
    }
    
  }, [location.pathname, location.search]);

  return <>{children}</>;
}