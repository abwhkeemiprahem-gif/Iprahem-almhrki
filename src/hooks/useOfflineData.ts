import { useState, useEffect } from 'react';

/**
 * Custom hook to manage offline data and fetch fallbacks.
 * Leverages localStorage or the browser Cache API to ensure
 * data is always accessible, even in absolute offline mode.
 */
export function useOfflineData<T>(
  cacheKey: string,
  fetchFn: () => Promise<T>,
  fallbackData: T
): { data: T; loading: boolean; isOffline: boolean; refresh: () => void } {
  const [data, setData] = useState<T>(() => {
    try {
      const cached = localStorage.getItem(cacheKey);
      return cached ? JSON.parse(cached) : fallbackData;
    } catch {
      return fallbackData;
    }
  });
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  const loadData = async () => {
    setLoading(true);
    setIsOffline(!navigator.onLine);
    try {
      // 1. Try to fetch from network
      const freshData = await fetchFn();
      
      // 2. Cache successful response in localStorage
      localStorage.setItem(cacheKey, JSON.stringify(freshData));
      setData(freshData);
    } catch (error) {
      console.warn('Network fetch failed in useOfflineData. Loading from local/offline cache instead.', error);
      
      // 3. Try to read from local backup
      try {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          setData(JSON.parse(cached));
        }
      } catch (e) {
        console.error('Offline storage load failed:', e);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    const handleOnline = () => {
      setIsOffline(false);
      loadData();
    };
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [cacheKey]);

  return { data, loading, isOffline, refresh: loadData };
}
