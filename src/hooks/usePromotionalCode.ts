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
  code?: PromotionalCode;
  error?: string;
  discount?: number;
}

export function usePromotionalCode() {
  const [appliedCode, setAppliedCode] = useState<PromotionalCode | null>(null);
  const [loading, setLoading] = useState(false);
  const [discount, setDiscount] = useState(0);

  const validateCode = async (code: string, orderTotal: number): Promise<ValidateResult> => {
    if (!code.trim()) {
      return { valid: false, error: 'Introduce un código promocional' };
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('promotional_codes')
        .select('*')
        .eq('code', code.toUpperCase().trim())
        .eq('is_active', true)
        .single();

      if (error || !data) {
        setLoading(false);
        return { valid: false, error: 'Código no válido o expirado' };
      }

      const promoCode = data as PromotionalCode;

      // Check validity dates
      const now = new Date();
      if (promoCode.valid_from && new Date(promoCode.valid_from) > now) {
        setLoading(false);
        return { valid: false, error: 'Este código aún no está activo' };
      }

      if (promoCode.valid_until && new Date(promoCode.valid_until) < now) {
        setLoading(false);
        return { valid: false, error: 'Este código ha expirado' };
      }

      // Check max uses
      if (promoCode.max_uses && promoCode.current_uses >= promoCode.max_uses) {
        setLoading(false);
        return { valid: false, error: 'Este código ha alcanzado el límite de usos' };
      }

      // Check minimum order amount
      if (orderTotal < promoCode.min_order_amount) {
        setLoading(false);
        return { 
          valid: false, 
          error: `Pedido mínimo de ${promoCode.min_order_amount}€ para usar este código` 
        };
      }

      // Calculate discount
      let discountAmount = 0;
      if (promoCode.discount_type === 'percentage') {
        discountAmount = (orderTotal * promoCode.discount_value) / 100;
      } else {
        discountAmount = Math.min(promoCode.discount_value, orderTotal);
      }

      setAppliedCode(promoCode);
      setDiscount(discountAmount);
      setLoading(false);

      return { valid: true, code: promoCode, discount: discountAmount };
    } catch (err) {
      setLoading(false);
      return { valid: false, error: 'Error al validar el código' };
    }
  };

  const removeCode = () => {
    setAppliedCode(null);
    setDiscount(0);
  };

  const incrementCodeUsage = async (codeId: string) => {
    await supabase.rpc('increment_promo_code_usage', { code_id: codeId });
  };

  return {
    appliedCode,
    discount,
    loading,
    validateCode,
    removeCode,
    incrementCodeUsage
  };
}
