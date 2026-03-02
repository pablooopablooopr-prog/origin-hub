import React, { forwardRef, useEffect, useRef, useImperativeHandle, useState, useCallback } from 'react';
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

interface PlaceAutocompleteInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onPlaceSelect?: (place: PlaceResult) => void;
  onChange?: (value: string) => void;
  countryRestriction?: string | string[];
  searchTypes?: string[];
}

export const PlaceAutocompleteInput = forwardRef<HTMLInputElement, PlaceAutocompleteInputProps>(
  ({ 
    onPlaceSelect, 
    onChange,
    countryRestriction = 'es', 
    searchTypes = ['establishment', 'geocode'],
    className, 
    value,
    ...props 
  }, ref) => {
    const { loaded, error, apiKeyMissing } = useGoogleMapsLoader();
    const inputRef = useRef<HTMLInputElement>(null);
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
    const [isReady, setIsReady] = useState(false);
    const [internalValue, setInternalValue] = useState(value || '');

    // Sync internal value with external value
    useEffect(() => {
      if (value !== undefined) {
        setInternalValue(value);
      }
    }, [value]);

    // Allow parent components to access the input ref
    useImperativeHandle(ref, () => inputRef.current!);

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
        fields: ['name', 'address_components', 'geometry', 'formatted_address', 'place_id'],
        types: searchTypes
      };

      autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, options);

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace();
        
        if (!place?.geometry?.location) {
          console.warn('No valid place selected');
          return;
        }

        const placeResult: PlaceResult = {
          name: place.name || '',
          address: place.formatted_address || '',
          latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng(),
          formatted_address: place.formatted_address || '',
          place_id: place.place_id || ''
        };

        setInternalValue(place.name || place.formatted_address || '');
        onChange?.(place.name || place.formatted_address || '');
        onPlaceSelect?.(placeResult);
      });

      setIsReady(true);
    }, [countryRestriction, searchTypes, onPlaceSelect, onChange]);

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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInternalValue(e.target.value);
      onChange?.(e.target.value);
    };

    if (apiKeyMissing) {
      return (
        <div className="space-y-2">
          <div className="relative">
            <Input
              {...props}
              value={internalValue}
              onChange={handleInputChange}
              className={className}
              placeholder={props.placeholder || "Nombre del lugar"}
            />
          </div>
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
            {...props}
            value={internalValue}
            onChange={handleInputChange}
            className={className}
            placeholder={props.placeholder || "Nombre del lugar"}
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
        <Input
          ref={inputRef}
          {...props}
          value={internalValue}
          onChange={handleInputChange}
          className={className}
          placeholder={props.placeholder || "Buscar lugar o empresa..."}
        />
        {isReady && (
          <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        )}
      </div>
    );
  }
);

PlaceAutocompleteInput.displayName = 'PlaceAutocompleteInput';

export default PlaceAutocompleteInput;
