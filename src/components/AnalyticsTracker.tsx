import { useEffect, useRef } from 'react';
import { trackEvent } from '../lib/analytics';

export default function AnalyticsTracker() {
  const activeSectionRef = useRef<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 1. Log initial visit entry event
    trackEvent('page_view', 'hero', {
      referrer: document.referrer || 'direct',
      screenResolution: `${window.innerWidth}x${window.innerHeight}`
    });

    // 2. Set up IntersectionObserver to observe sections
    const sectionsToObserve = [
      'hero',
      'portfolio',
      'services',
      'roadmap',
      'testimonials',
      'payments',
      'contact'
    ];

    const observerOptions = {
      root: null, // viewport
      rootMargin: '-20% 0px -20% 0px', // Trigger when in center-ish of viewport
      threshold: 0.2 // 20% visible
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          
          // Avoid duplicate event triggers if already tracking
          if (activeSectionRef.current === sectionId) return;

          // Clear any pending scroll-by transition logging
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }

          // Require user to stay on section for 1.2 seconds to count as an actual view
          timeoutRef.current = setTimeout(() => {
            activeSectionRef.current = sectionId;
            trackEvent('section_view', sectionId, {
              stayDurationMs: 1200
            });
          }, 1200);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sectionsToObserve.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
      }
    });

    // Clean up observer and timeouts
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      observer.disconnect();
    };
  }, []);

  return null; // Silent background component
}
