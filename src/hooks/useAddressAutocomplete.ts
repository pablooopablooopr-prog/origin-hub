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
  const containerRef = useRef<HTMLDivElement>(null);
  const autocompleteRef = useRef<google.maps.places.PlaceAutocompleteElement | null>(null);
  const [isReady, setIsReady] = useState(false);
  const onAddressSelectRef = useRef(onAddressSelect);
  onAddressSelectRef.current = onAddressSelect;

  useEffect(() => {
    if (!loaded || !containerRef.current || autocompleteRef.current) return;

    const init = async () => {
      await google.maps.importLibrary('places');

      const countries = Array.isArray(countryRestriction) ? countryRestriction : [countryRestriction];

      const el = new google.maps.places.PlaceAutocompleteElement({
        componentRestrictions: { country: countries },
        types: ['address'],
      } as any);

      // Style the inner input to match our design
      el.style.width = '100%';
      el.style.display = 'block';

      el.addEventListener('gmp-select', async (event: any) => {
        const placePrediction = event.placePrediction;
        if (!placePrediction) return;

        try {
          const place = placePrediction.toPlace();
          await place.fetchFields({ fields: ['addressComponents', 'location', 'formattedAddress'] });

          const addressComponents: AddressComponents = {
            address_line1: '',
            city: '',
            province: '',
            postal_code: '',
            country: '',
            latitude: place.location?.lat() ?? 0,
            longitude: place.location?.lng() ?? 0,
            formatted_address: place.formattedAddress || ''
          };

          let streetNumber = '';
          let streetName = '';

          if (place.addressComponents) {
            for (const component of place.addressComponents) {
              const types = component.types;
              if (types.includes('street_number')) {
                streetNumber = component.longText || '';
              }
              if (types.includes('route')) {
                streetName = component.longText || '';
              }
              if (types.includes('locality')) {
                addressComponents.city = component.longText || '';
              }
              if (types.includes('administrative_area_level_2')) {
                if (!addressComponents.province) {
                  addressComponents.province = component.longText || '';
                }
              }
              if (types.includes('administrative_area_level_1')) {
                if (!addressComponents.province) {
                  addressComponents.province = component.longText || '';
                }
              }
              if (types.includes('postal_code')) {
                addressComponents.postal_code = component.longText || '';
              }
              if (types.includes('country')) {
                addressComponents.country = component.longText || '';
              }
            }
          }

          addressComponents.address_line1 = streetNumber
            ? `${streetName}, ${streetNumber}`
            : streetName;

          onAddressSelectRef.current?.(addressComponents);
        } catch (err) {
          console.error('Error fetching place details:', err);
        }
      });

      containerRef.current!.innerHTML = '';
      containerRef.current!.appendChild(el);
      autocompleteRef.current = el;
      setIsReady(true);
    };

    init();

    return () => {
      if (autocompleteRef.current && containerRef.current) {
        try { containerRef.current.removeChild(autocompleteRef.current); } catch {}
      }
      autocompleteRef.current = null;
    };
  }, [loaded, countryRestriction]);

  return {
    containerRef,
    isReady: isReady && loaded,
    error,
    apiKeyMissing
  };
};

export default useAddressAutocomplete;
