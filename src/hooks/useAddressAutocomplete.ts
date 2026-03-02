import { useEffect, useRef, useState, useCallback } from 'react';
import { useGoogleMapsLoader } from './useGoogleMapsLoader';

export interface AddressComponents {
  address_line1: string;
  city: string;
  province: string;
  postal_code: string;
  country: string;
  latitude: number;
  longitude: number;
  formatted_address: string;
}

interface UseAddressAutocompleteProps {
  onAddressSelect?: (address: AddressComponents) => void;
  countryRestriction?: string | string[];
}

export const useAddressAutocomplete = ({
  onAddressSelect,
  countryRestriction = 'es'
}: UseAddressAutocompleteProps = {}) => {
  const { loaded, error, apiKeyMissing } = useGoogleMapsLoader();
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isReady, setIsReady] = useState(false);

  const initAutocomplete = useCallback(() => {
    if (!inputRef.current || !window.google?.maps?.places) return;

    // Clean up previous instance
    if (autocompleteRef.current) {
      google.maps.event.clearInstanceListeners(autocompleteRef.current);
    }

    const options: google.maps.places.AutocompleteOptions = {
      componentRestrictions: { 
        country: Array.isArray(countryRestriction) ? countryRestriction : [countryRestriction] 
      },
      fields: ['address_components', 'geometry', 'formatted_address'],
      types: ['address']
    };

    autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, options);

    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current?.getPlace();
      
      if (!place?.address_components || !place?.geometry?.location) {
        console.warn('No valid place selected');
        return;
      }

      const addressComponents: AddressComponents = {
        address_line1: '',
        city: '',
        province: '',
        postal_code: '',
        country: '',
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng(),
        formatted_address: place.formatted_address || ''
      };

      // Parse address components
      let streetNumber = '';
      let streetName = '';

      place.address_components.forEach((component) => {
        const types = component.types;

        if (types.includes('street_number')) {
          streetNumber = component.long_name;
        }
        if (types.includes('route')) {
          streetName = component.long_name;
        }
        if (types.includes('locality')) {
          addressComponents.city = component.long_name;
        }
        if (types.includes('administrative_area_level_2')) {
          // Province in Spain
          if (!addressComponents.province) {
            addressComponents.province = component.long_name;
          }
        }
        if (types.includes('administrative_area_level_1')) {
          // Region/Autonomous Community
          if (!addressComponents.province) {
            addressComponents.province = component.long_name;
          }
        }
        if (types.includes('postal_code')) {
          addressComponents.postal_code = component.long_name;
        }
        if (types.includes('country')) {
          addressComponents.country = component.long_name;
        }
      });

      // Combine street name and number
      addressComponents.address_line1 = streetNumber 
        ? `${streetName}, ${streetNumber}` 
        : streetName;

      onAddressSelect?.(addressComponents);
    });

    setIsReady(true);
  }, [countryRestriction, onAddressSelect]);

  useEffect(() => {
    if (loaded && inputRef.current) {
      initAutocomplete();
    }
  }, [loaded, initAutocomplete]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, []);

  return {
    inputRef,
    isReady: isReady && loaded,
    error,
    apiKeyMissing
  };
};

export default useAddressAutocomplete;
