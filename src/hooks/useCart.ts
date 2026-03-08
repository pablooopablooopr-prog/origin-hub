import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface CartItem {
  id: string;
  pack_id: string | null;
  product_id: string | null;
  quantity: number;
}

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [customerId, setCustomerId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCart = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      // Get customer ID - create if doesn't exist
      let { data: customer } = await supabase
        .from("customers")
        .select("id")
        .eq("user_id", user.id)
        .single();

      // If customer doesn't exist, create one with conflict handling
      if (!customer) {
        const { data: newCustomer, error: createError } = await supabase
          .from("customers")
          .upsert({
            user_id: user.id,
            email: user.email || "",
            full_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Usuario"
          }, { onConflict: "user_id" })
          .select("id")
          .single();
        
        if (!createError && newCustomer) {
          customer = newCustomer;
        }
      }

      if (customer) {
        setCustomerId(customer.id);
        
        // Fetch cart items
        const { data: cartItems } = await supabase
          .from("cart_items")
          .select("*")
          .eq("customer_id", customer.id);

        setItems(cartItems || []);
      }

      setLoading(false);
    };

    fetchCart();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchCart();
    });

    return () => subscription.unsubscribe();
  }, []);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = useCallback(async (packId?: string, productId?: string, quantity = 1) => {
    if (!customerId) return false;

    // Block admin and company accounts
    try {
      const { data: isAdmin } = await supabase.rpc("is_admin");
      if (isAdmin === true) return false;
      const { data: companyStatus } = await supabase.rpc("get_my_company_status");
      if (companyStatus && String(companyStatus).trim() !== "") return false;
    } catch { /* continue */ }

    const { error } = await supabase
      .from("cart_items")
      .insert({
        customer_id: customerId,
        pack_id: packId || null,
        product_id: productId || null,
        quantity
      });

    if (!error) {
      // Refetch cart
      const { data: cartItems } = await supabase
        .from("cart_items")
        .select("*")
        .eq("customer_id", customerId);
      
      setItems(cartItems || []);
      return true;
    }
    return false;
  }, [customerId]);

  const removeFromCart = useCallback(async (itemId: string) => {
    if (!customerId) return false;

    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", itemId)
      .eq("customer_id", customerId);

    if (!error) {
      setItems(prev => prev.filter(item => item.id !== itemId));
      return true;
    }
    return false;
  }, [customerId]);

  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    if (!customerId || quantity < 1) return false;

    const { error } = await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("id", itemId)
      .eq("customer_id", customerId);

    if (!error) {
      setItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      ));
      return true;
    }
    return false;
  }, [customerId]);

  const clearCart = useCallback(async () => {
    if (!customerId) return false;

    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("customer_id", customerId);

    if (!error) {
      setItems([]);
      return true;
    }
    return false;
  }, [customerId]);

  return {
    items,
    itemCount,
    loading,
    isLoggedIn: !!customerId,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };
};
