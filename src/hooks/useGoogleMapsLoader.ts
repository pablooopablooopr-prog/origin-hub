import { useState, useEffect } from 'react';

declare global {
  interface Window {
    google: typeof google;
    __gmapsLoaded?: boolean;
    __gmapsCallbacks?: Array<() => void>;
  }
}

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

let isLoading = false;
let isLoaded = false;
let loadError: Error | null = null;
const callbacks: Array<() => void> = [];

const loadScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (isLoaded) { resolve(); return; }
    if (loadError) { reject(loadError); return; }

    callbacks.push(() => resolve());

    if (isLoading) return;
    isLoading = true;

    const script = document.createElement('script');
    // Use the inline bootstrap loader recommended by Google for new API
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,marker&loading=async&callback=__gmapsInit`;
    script.async = true;
    script.defer = true;

    (window as any).__gmapsInit = () => {
      isLoaded = true;
      isLoading = false;
      callbacks.forEach(cb => cb());
      callbacks.length = 0;
    };

    script.onerror = () => {
      loadError = new Error('Failed to load Google Maps API');
      isLoading = false;
      callbacks.forEach(() => {}); // drain
      callbacks.length = 0;
    };

    document.head.appendChild(script);
  });
};

export const useGoogleMapsLoader = () => {
  const [loaded, setLoaded] = useState(isLoaded);
  const [error, setError] = useState<Error | null>(loadError);
  const [apiKeyMissing] = useState(!GOOGLE_MAPS_API_KEY);

  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY) return;
    if (isLoaded) { setLoaded(true); return; }
    if (loadError) { setError(loadError); return; }

    loadScript()
      .then(() => setLoaded(true))
      .catch((err) => setError(err));
  }, []);

  return { loaded, error, apiKeyMissing };
};

export default useGoogleMapsLoader;
