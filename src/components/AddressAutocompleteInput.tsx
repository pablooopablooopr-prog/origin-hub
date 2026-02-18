import React from 'react';
import { Input } from '@/components/ui/input';
import { useAddressAutocomplete, AddressComponents } from '@/hooks/useAddressAutocomplete';
import { AlertTriangle } from 'lucide-react';

interface AddressAutocompleteInputProps {
  onAddressSelect?: (address: AddressComponents) => void;
  countryRestriction?: string | string[];
  className?: string;
  placeholder?: string;
}

export const AddressAutocompleteInput: React.FC<AddressAutocompleteInputProps> = ({
  onAddressSelect,
  countryRestriction = 'es',
  className,
  placeholder,
}) => {
  const { containerRef, isReady, error, apiKeyMissing } = useAddressAutocomplete({
    onAddressSelect,
    countryRestriction
  });

  if (apiKeyMissing) {
    return (
      <div className="space-y-2">
        <Input
          className={className}
          placeholder={placeholder || "Dirección (autocompletado no disponible)"}
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
          className={className}
          placeholder={placeholder || "Dirección"}
        />
        <p className="text-xs text-destructive flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          Error al cargar autocompletado
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`address-autocomplete-container ${className || ''}`}
    />
  );
};

export default AddressAutocompleteInput;
export type { AddressComponents };
