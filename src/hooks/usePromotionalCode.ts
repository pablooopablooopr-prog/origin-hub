import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PromotionalCode {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_amount: number;
  max_uses: number | null;
  current_uses: number;
  valid_from: string | null;
  valid_until: string | null;
  is_active: boolean;
}

interface ValidateResult {
  valid: boolean;
  codeId?: string;
  discountType?: string;
  error?: string;
  discount?: number;
}

export function usePromotionalCode() {
  const [appliedCodeId, setAppliedCodeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState<string | null>(null);
  const [discountValue, setDiscountValue] = useState<number>(0);

  const validateCode = async (code: string, orderTotal: number): Promise<ValidateResult> => {
    if (!code.trim()) {
      return { valid: false, error: 'Introduce un código promocional' };
    }

    setLoading(true);

    try {
      // Use RPC function instead of direct table access to prevent enumeration
      const { data, error } = await supabase.rpc('validate_promo_code', {
        code_value: code,
        order_total: orderTotal
      });

      if (error) {
        setLoading(false);
        return { valid: false, error: 'Error al validar el código' };
      }

      const result = data?.[0];
      
      if (!result?.valid) {
        setLoading(false);
        return { valid: false, error: result?.error_message || 'Código no válido o expirado' };
      }

      // Calculate discount
      let discountAmount = 0;
      if (result.discount_type === 'percentage') {
        discountAmount = (orderTotal * result.discount_value) / 100;
      } else {
        discountAmount = Math.min(result.discount_value, orderTotal);
      }

      setAppliedCodeId(result.code_id);
      setDiscountType(result.discount_type);
      setDiscountValue(result.discount_value);
      setDiscount(discountAmount);
      setLoading(false);

      return { 
        valid: true, 
        codeId: result.code_id,
        discountType: result.discount_type,
        discount: discountAmount 
      };
    } catch (err) {
      setLoading(false);
      return { valid: false, error: 'Error al validar el código' };
    }
  };

  const removeCode = () => {
    setAppliedCodeId(null);
    setDiscount(0);
    setDiscountType(null);
    setDiscountValue(0);
  };

  // Use atomic RPC function for safe increment
  const incrementCodeUsage = async (codeId: string): Promise<boolean> => {
    const { data, error } = await supabase.rpc('increment_promo_code_safe', {
      code_id: codeId
    });
    
    if (error) {
      return false;
    }
    
    return data === true;
  };

  return {
    appliedCodeId,
    discount,
    discountType,
    discountValue,
    loading,
    validateCode,
    removeCode,
    incrementCodeUsage
  };
}
