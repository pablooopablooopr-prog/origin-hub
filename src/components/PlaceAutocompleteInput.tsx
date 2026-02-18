import React, { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { useGoogleMapsLoader } from '@/hooks/useGoogleMapsLoader';
import { AlertTriangle, MapPin } from 'lucide-react';

export interface PlaceResult {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  formatted_address: string;
  place_id: string;
}

interface PlaceAutocompleteInputProps {
  onPlaceSelect?: (place: PlaceResult) => void;
  onChange?: (value: string) => void;
  countryRestriction?: string | string[];
  searchTypes?: string[];
  className?: string;
  placeholder?: string;
  value?: string;
}

export const PlaceAutocompleteInput: React.FC<PlaceAutocompleteInputProps> = ({
  onPlaceSelect,
  onChange,
  countryRestriction = 'es',
  searchTypes = ['establishment', 'geocode'],
  className,
  placeholder,
  value,
}) => {
  const { loaded, error, apiKeyMissing } = useGoogleMapsLoader();
  const containerRef = useRef<HTMLDivElement>(null);
  const autocompleteRef = useRef<google.maps.places.PlaceAutocompleteElement | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [internalValue, setInternalValue] = useState(value || '');
  const onPlaceSelectRef = useRef(onPlaceSelect);
  const onChangeRef = useRef(onChange);
  onPlaceSelectRef.current = onPlaceSelect;
  onChangeRef.current = onChange;

  useEffect(() => {
    if (value !== undefined) setInternalValue(value);
  }, [value]);

  useEffect(() => {
    if (!loaded || !containerRef.current || autocompleteRef.current) return;

    const init = async () => {
      await google.maps.importLibrary('places');

      const countries = Array.isArray(countryRestriction) ? countryRestriction : [countryRestriction];

      const el = new google.maps.places.PlaceAutocompleteElement({
        componentRestrictions: { country: countries },
        types: searchTypes,
      } as any);

      el.style.width = '100%';
      el.style.display = 'block';

      el.addEventListener('gmp-select', async (event: any) => {
        const placePrediction = event.placePrediction;
        if (!placePrediction) return;

        try {
          const place = placePrediction.toPlace();
          await place.fetchFields({ fields: ['displayName', 'location', 'formattedAddress', 'id'] });

          const placeResult: PlaceResult = {
            name: place.displayName || '',
            address: place.formattedAddress || '',
            latitude: place.location?.lat() ?? 0,
            longitude: place.location?.lng() ?? 0,
            formatted_address: place.formattedAddress || '',
            place_id: place.id || ''
          };

          const displayValue = place.displayName || place.formattedAddress || '';
          setInternalValue(displayValue);
          onChangeRef.current?.(displayValue);
          onPlaceSelectRef.current?.(placeResult);
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
  }, [loaded, countryRestriction, searchTypes]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalValue(e.target.value);
    onChange?.(e.target.value);
  };

  if (apiKeyMissing) {
    return (
      <div className="space-y-2">
        <Input
          value={internalValue}
          onChange={handleInputChange}
          className={className}
          placeholder={placeholder || "Nombre del lugar"}
        />
        <p className="text-xs text-amber-600 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          Autocompletado no disponible
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-2">
        <Input
          value={internalValue}
          onChange={handleInputChange}
          className={className}
          placeholder={placeholder || "Nombre del lugar"}
        />
        <p className="text-xs text-destructive flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          Error al cargar autocompletado
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className={`place-autocomplete-container ${className || ''}`}
      />
      {isReady && (
        <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
      )}
    </div>
  );
};

PlaceAutocompleteInput.displayName = 'PlaceAutocompleteInput';

export default PlaceAutocompleteInput;
