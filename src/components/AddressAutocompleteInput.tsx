import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import { Input } from '@/components/ui/input';
import { useAddressAutocomplete, AddressComponents } from '@/hooks/useAddressAutocomplete';
import { AlertTriangle } from 'lucide-react';

interface AddressAutocompleteInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onAddressSelect?: (address: AddressComponents) => void;
  countryRestriction?: string | string[];
}

export const AddressAutocompleteInput = forwardRef<HTMLInputElement, AddressAutocompleteInputProps>(
  ({ onAddressSelect, countryRestriction = 'es', className, ...props }, ref) => {
    const { inputRef, isReady, error, apiKeyMissing } = useAddressAutocomplete({
      onAddressSelect,
      countryRestriction
    });

    // Allow parent components to access the input ref
    useImperativeHandle(ref, () => inputRef.current!);

    if (apiKeyMissing) {
      return (
        <div className="space-y-2">
          <Input
            {...props}
            className={className}
            placeholder={props.placeholder || "Dirección (autocompletado no disponible)"}
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
            {...props}
            className={className}
            placeholder={props.placeholder || "Dirección"}
          />
          <p className="text-xs text-destructive flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Error al cargar autocompletado
          </p>
        </div>
      );
    }

    return (
      <Input
        ref={inputRef}
        {...props}
        className={className}
        placeholder={props.placeholder || "Empieza a escribir tu dirección..."}
      />
    );
  }
);

AddressAutocompleteInput.displayName = 'AddressAutocompleteInput';

export default AddressAutocompleteInput;
export type { AddressComponents };
