import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Company = Tables<'companies_public'>;
export type CompanyPack = Tables<'company_packs'>;
export type Product = Tables<'products'>;

export interface CartItemWithDetails {
  id: string;
  pack_id: string | null;
  product_id: string | null;
  company_id: string | null;
  quantity: number;
  created_at: string;
  pack?: CompanyPack | null;
  product?: Product | null;
}

export interface ProducerCart {
  company: Company;
  items: CartItemWithDetails[];
  total: number;
}

export interface AddToCartResult {
  success: boolean;
  error?: string;
  conflict?: {
    currentCompany: Company;
    newCompany: Company;
    packId: string;
  };
}

export const useProducerCarts = () => {
  const [carts, setCarts] = useState<ProducerCart[]>([]);
  const [loading, setLoading] = useState(true);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [totalItemCount, setTotalItemCount] = useState(0);

  const fetchCarts = useCallback(async (custId: string) => {
    // Fetch all cart items with their pack/product and company details
    const { data: cartItems, error } = await supabase
      .from("cart_items")
      .select(`
        *,
        pack:company_packs(*),
        product:products(*)
      `)
      .eq("customer_id", custId);

    if (error || !cartItems) {
      setCarts([]);
      setTotalItemCount(0);
      return;
    }

    // Get unique company IDs
    const companyIds = [...new Set(cartItems.map(item => item.company_id).filter(Boolean))];
    
    if (companyIds.length === 0) {
      setCarts([]);
      setTotalItemCount(0);
      return;
    }

    // Fetch company details from public view (customers can't read companies table directly)
    const { data: companies } = await supabase
      .from("companies_public")
      .select("*")
      .in("id", companyIds);

    if (!companies) {
      setCarts([]);
      setTotalItemCount(0);
      return;
    }

    // Group items by company
    const cartsByCompany: ProducerCart[] = companies.map(company => {
      const companyItems = cartItems.filter(item => item.company_id === company.id);
      const total = companyItems.reduce((sum, item) => {
        const price = Number((item as any).pack?.price || (item as any).product?.price || 0);
        return sum + (price * item.quantity);
      }, 0);

      return {
        company,
        items: companyItems as CartItemWithDetails[],
        total
      };
    }).filter(cart => cart.items.length > 0);

    setCarts(cartsByCompany);
    setTotalItemCount(cartItems.reduce((sum, item) => sum + item.quantity, 0));
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Get or create customer
        let { data: customer } = await supabase
          .from("customers")
          .select("id")
          .eq("user_id", session.user.id)
          .single();

        if (!customer) {
          const { data: newCustomer } = await supabase
            .from("customers")
            .insert({
              user_id: session.user.id,
              email: session.user.email || "",
              full_name: session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "Usuario"
            })
            .select("id")
            .single();
          customer = newCustomer;
        }

        if (customer) {
          setCustomerId(customer.id);
          await fetchCarts(customer.id);
        }
      }
      setLoading(false);
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkSession();
    });

    return () => subscription.unsubscribe();
  }, [fetchCarts]);

  // Check if adding a pack would cause a conflict with existing cart
  const checkConflict = async (packId: string): Promise<AddToCartResult['conflict'] | null> => {
    if (!customerId || carts.length === 0) return null;

    // Get the pack's company
    const { data: pack } = await supabase
      .from("company_packs")
      .select("company_id")
      .eq("id", packId)
      .single();

    if (!pack?.company_id) return null;

    // Check if there's a cart with a different company
    const existingCart = carts[0]; // We only allow one active cart at a time
    if (existingCart && existingCart.company.id !== pack.company_id) {
      // Get the new company details
      const { data: newCompany } = await supabase
        .from("companies")
        .select("*")
        .eq("id", pack.company_id)
        .single();

      if (newCompany) {
        return {
          currentCompany: existingCart.company,
          newCompany,
          packId
        };
      }
    }

    return null;
  };

  const addToCart = useCallback(async (
    packId?: string, 
    productId?: string, 
    quantity = 1,
    forceNewCart = false
  ): Promise<AddToCartResult> => {
    if (!customerId) return { success: false, error: "No has iniciado sesión" };

    // Check if user is admin or company — they cannot add to cart
    try {
      const { data: isAdmin } = await supabase.rpc("is_admin");
      if (isAdmin === true) {
        return { success: false, error: "Los administradores no pueden añadir productos al carrito" };
      }
      const { data: companyStatus } = await supabase.rpc("get_my_company_status");
      if (companyStatus && String(companyStatus).trim() !== "") {
        return { success: false, error: "Las cuentas de empresa no pueden añadir productos al carrito" };
      }
    } catch { /* continue as customer */ }

    // Get company_id from pack or product
    let companyId: string | null = null;
    
    if (packId) {
      const { data: pack } = await supabase
        .from("company_packs")
        .select("company_id")
        .eq("id", packId)
        .single();
      companyId = pack?.company_id || null;
    } else if (productId) {
      const { data: product } = await supabase
        .from("products")
        .select("company_id")
        .eq("id", productId)
        .single();
      companyId = product?.company_id || null;
    }

    if (!companyId) {
      return { success: false, error: "Producto no encontrado" };
    }

    // If not forcing new cart, check for conflicts
    if (!forceNewCart && carts.length > 0) {
      const existingCart = carts[0];
      if (existingCart.company.id !== companyId) {
        // Get the new company for the conflict
        const { data: newCompany } = await supabase
          .from("companies")
          .select("*")
          .eq("id", companyId)
          .single();

        if (newCompany) {
          return {
            success: false,
            conflict: {
              currentCompany: existingCart.company,
              newCompany,
              packId: packId || productId || ""
            }
          };
        }
      }
    }

    // If forcing new cart for different producer, clear existing items first
    if (forceNewCart && carts.length > 0) {
      const existingCart = carts[0];
      if (existingCart.company.id !== companyId) {
        await supabase
          .from("cart_items")
          .delete()
          .eq("customer_id", customerId)
          .eq("company_id", existingCart.company.id);
      }
    }

    // Add the item
    const { error } = await supabase
      .from("cart_items")
      .insert({
        customer_id: customerId,
        pack_id: packId || null,
        product_id: productId || null,
        company_id: companyId,
        quantity
      });

    if (error) {
      return { success: false, error: "Error al añadir al carrito" };
    }

    await fetchCarts(customerId);
    return { success: true };
  }, [customerId, carts, fetchCarts]);

  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    if (!customerId) return { error: "No has iniciado sesión" };

    if (quantity <= 0) {
      return removeFromCart(itemId);
    }

    const { error } = await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("id", itemId);

    if (!error) {
      await fetchCarts(customerId);
    }

    return { error };
  }, [customerId, fetchCarts]);

  const removeFromCart = useCallback(async (itemId: string) => {
    if (!customerId) return { error: "No has iniciado sesión" };

    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", itemId);

    if (!error) {
      await fetchCarts(customerId);
    }

    return { error };
  }, [customerId, fetchCarts]);

  const clearCartForCompany = useCallback(async (companyId: string) => {
    if (!customerId) return { error: "No has iniciado sesión" };

    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("customer_id", customerId)
      .eq("company_id", companyId);

    if (!error) {
      await fetchCarts(customerId);
    }

    return { error };
  }, [customerId, fetchCarts]);

  const clearAllCarts = useCallback(async () => {
    if (!customerId) return;

    await supabase
      .from("cart_items")
      .delete()
      .eq("customer_id", customerId);

    setCarts([]);
    setTotalItemCount(0);
  }, [customerId]);

  const getCartForCompany = useCallback((companyId: string) => {
    return carts.find(cart => cart.company.id === companyId) || null;
  }, [carts]);

  return {
    carts,
    totalItemCount,
    loading,
    isLoggedIn: !!customerId,
    customerId,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCartForCompany,
    clearAllCarts,
    getCartForCompany,
    checkConflict,
    refetch: () => customerId && fetchCarts(customerId)
  };
};
