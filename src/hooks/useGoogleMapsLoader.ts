import { useState, useEffect, useCallback } from 'react';

declare global {
  interface Window {
    google: typeof google;
    initGoogleMaps: () => void;
  }
}

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

let isLoading = false;
let isLoaded = false;
let loadError: Error | null = null;
const callbacks: Array<() => void> = [];

export const useGoogleMapsLoader = () => {
  const [loaded, setLoaded] = useState(isLoaded);
  const [error, setError] = useState<Error | null>(loadError);
  const [apiKeyMissing, setApiKeyMissing] = useState(!GOOGLE_MAPS_API_KEY);

  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY) {
      setApiKeyMissing(true);
      return;
    }

    if (isLoaded) {
      setLoaded(true);
      return;
    }

    if (loadError) {
      setError(loadError);
      return;
    }

    const onLoadComplete = () => {
      setLoaded(true);
    };

    callbacks.push(onLoadComplete);

    if (isLoading) {
      return () => {
        const index = callbacks.indexOf(onLoadComplete);
        if (index > -1) callbacks.splice(index, 1);
      };
    }

    isLoading = true;

    // Create callback function
    window.initGoogleMaps = () => {
      isLoaded = true;
      isLoading = false;
      callbacks.forEach(cb => cb());
      callbacks.length = 0;
    };

    // Load the script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initGoogleMaps`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      loadError = new Error('Failed to load Google Maps API');
      isLoading = false;
      setError(loadError);
    };

    document.head.appendChild(script);

    return () => {
      const index = callbacks.indexOf(onLoadComplete);
      if (index > -1) callbacks.splice(index, 1);
    };
  }, []);

  return { loaded, error, apiKeyMissing };
};

export default useGoogleMapsLoader;
