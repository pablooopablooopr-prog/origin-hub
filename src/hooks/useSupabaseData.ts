import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

// Types
export type Company = Tables<'companies'>;
export type CompanyPack = Tables<'company_packs'>;
export type Route = Tables<'routes'>;
export type RouteStop = Tables<'route_stops'>;
export type Category = Tables<'categories'>;
export type Region = Tables<'regions'>;
export type Product = Tables<'products'>;
export type CartItem = Tables<'cart_items'>;

// Hook for fetching companies
export function useCompanies(options?: { approved?: boolean; limit?: number }) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        let query = supabase.from('companies').select('*');
        
        if (options?.approved) {
          query = query.eq('status', 'approved');
        }
        if (options?.limit) {
          query = query.limit(options.limit);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        setCompanies(data || []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [options?.approved, options?.limit]);

  return { companies, loading, error };
}

// Hook for fetching published packs
export function usePacks(options?: { 
  published?: boolean; 
  limit?: number;
  companyId?: string;
}) {
  const [packs, setPacks] = useState<(CompanyPack & { company?: Company })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPacks = async () => {
      try {
        let query = supabase
          .from('company_packs')
          .select(`
            *,
            company:companies(*)
          `);
        
        if (options?.published !== false) {
          query = query.eq('status', 'published');
        }
        if (options?.companyId) {
          query = query.eq('company_id', options.companyId);
        }
        if (options?.limit) {
          query = query.limit(options.limit);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        setPacks(data || []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchPacks();
  }, [options?.published, options?.limit, options?.companyId]);

  return { packs, loading, error, refetch: () => {} };
}

// Hook for fetching routes
export function useRoutes(options?: { 
  public?: boolean; 
  featured?: boolean;
  limit?: number;
}) {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        let query = supabase.from('routes').select('*');
        
        if (options?.public !== false) {
          query = query.eq('is_public', true);
        }
        if (options?.featured) {
          query = query.eq('is_featured', true);
        }
        if (options?.limit) {
          query = query.limit(options.limit);
        }
        
        query = query.order('created_at', { ascending: false });
        
        const { data, error } = await query;
        
        if (error) throw error;
        setRoutes(data || []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, [options?.public, options?.featured, options?.limit]);

  return { routes, loading, error };
}

// Hook for fetching a single route with stops
export function useRoute(routeId: string | undefined) {
  const [route, setRoute] = useState<Route | null>(null);
  const [stops, setStops] = useState<RouteStop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!routeId) {
      setLoading(false);
      return;
    }

    const fetchRoute = async () => {
      try {
        // Fetch route
        const { data: routeData, error: routeError } = await supabase
          .from('routes')
          .select('*')
          .eq('slug', routeId)
          .single();
        
        if (routeError) throw routeError;
        setRoute(routeData);

        // Fetch stops
        const { data: stopsData, error: stopsError } = await supabase
          .from('route_stops')
          .select('*')
          .eq('route_id', routeData.id)
          .order('position');
        
        if (stopsError) throw stopsError;
        setStops(stopsData || []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoute();
  }, [routeId]);

  return { route, stops, loading, error };
}

// Hook for categories
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('is_active', true)
          .order('sort_order');
        
        if (error) throw error;
        setCategories(data || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading };
}

// Hook for regions
export function useRegions() {
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const { data, error } = await supabase
          .from('regions')
          .select('*')
          .eq('is_active', true);
        
        if (error) throw error;
        setRegions(data || []);
      } catch (err) {
        console.error('Error fetching regions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRegions();
  }, []);

  return { regions, loading };
}

// Hook for cart management
export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [customerId, setCustomerId] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: customer } = await supabase
          .from('customers')
          .select('id')
          .eq('user_id', user.id)
          .single();
        
        if (customer) {
          setCustomerId(customer.id);
          fetchCartItems(customer.id);
        }
      }
      setLoading(false);
    };

    checkSession();
  }, []);

  const fetchCartItems = async (custId: string) => {
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        pack:company_packs(*),
        product:products(*)
      `)
      .eq('customer_id', custId);
    
    if (!error && data) {
      setItems(data);
    }
  };

  const addToCart = async (packId?: string, productId?: string, quantity = 1) => {
    if (!customerId) return { error: 'Not logged in' };
    
    const { data, error } = await supabase
      .from('cart_items')
      .insert({
        customer_id: customerId,
        pack_id: packId,
        product_id: productId,
        quantity
      })
      .select()
      .single();
    
    if (!error) {
      await fetchCartItems(customerId);
    }
    
    return { data, error };
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      return removeFromCart(itemId);
    }
    
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', itemId);
    
    if (!error && customerId) {
      await fetchCartItems(customerId);
    }
    
    return { error };
  };

  const removeFromCart = async (itemId: string) => {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId);
    
    if (!error && customerId) {
      await fetchCartItems(customerId);
    }
    
    return { error };
  };

  const clearCart = async () => {
    if (!customerId) return;
    
    await supabase
      .from('cart_items')
      .delete()
      .eq('customer_id', customerId);
    
    setItems([]);
  };

  return {
    items,
    loading,
    isLoggedIn: !!customerId,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refetch: () => customerId && fetchCartItems(customerId)
  };
}

// Function to submit contact message
export async function submitContactMessage(data: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  
  const { error } = await supabase
    .from('contact_messages')
    .insert({
      ...data,
      user_id: user?.id
    });
  
  return { error };
}

// Function to save a route
export async function saveRoute(routeId: string, notes?: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not logged in' };
  
  const { data: customer } = await supabase
    .from('customers')
    .select('id')
    .eq('user_id', user.id)
    .single();
  
  if (!customer) return { error: 'Customer not found' };
  
  const { error } = await supabase
    .from('saved_routes')
    .insert({
      customer_id: customer.id,
      route_id: routeId,
      notes
    });
  
  return { error };
}

// Function to create a route
export async function createRoute(routeData: {
  title: string;
  description?: string;
  narrative?: string;
  duration?: string;
  difficulty?: string;
  region_id?: string;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not logged in' };
  
  const slug = routeData.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  
  const { data, error } = await supabase
    .from('routes')
    .insert({
      ...routeData,
      slug,
      creator_id: user.id,
      is_public: true
    })
    .select()
    .single();
  
  return { data, error };
}

// Function to add route stops
export async function addRouteStop(stopData: {
  route_id: string;
  name: string;
  type?: string;
  description?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  position: number;
}) {
  const { data, error } = await supabase
    .from('route_stops')
    .insert(stopData)
    .select()
    .single();
  
  return { data, error };
}

// Type for order items
interface OrderItemInput {
  pack_id?: string;
  product_id?: string;
  quantity: number;
  unit_price: number;
}

// Function to create an order
export async function createOrder(orderData: {
  shipping_address: string;
  notes?: string;
  items: OrderItemInput[];
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: 'Not logged in' };

  const { data: customer } = await supabase
    .from('customers')
    .select('id, email, full_name')
    .eq('user_id', user.id)
    .single();

  if (!customer) return { data: null, error: 'Customer not found' };

  // Calculate total
  const totalAmount = orderData.items.reduce(
    (sum, item) => sum + item.unit_price * item.quantity,
    0
  );

  // Create order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      customer_id: customer.id,
      shipping_address: orderData.shipping_address,
      notes: orderData.notes,
      total_amount: totalAmount,
      status: 'pending',
      payment_status: 'pending'
    })
    .select()
    .single();

  if (orderError) return { data: null, error: orderError.message };

  // Create order items with product snapshot
  const orderItems = orderData.items.map(item => ({
    order_id: order.id,
    pack_id: item.pack_id,
    product_id: item.product_id,
    quantity: item.quantity,
    unit_price: item.unit_price,
    total_price: item.unit_price * item.quantity,
    product_snapshot: { price: item.unit_price }
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) {
    // Rollback order if items fail
    await supabase.from('orders').delete().eq('id', order.id);
    return { data: null, error: itemsError.message };
  }

  // Clear cart after successful order
  await supabase
    .from('cart_items')
    .delete()
    .eq('customer_id', customer.id);

  // Send order confirmation email via edge function
  try {
    await supabase.functions.invoke('send-order-confirmation', {
      body: {
        to: customer.email,
        customerName: customer.full_name,
        orderId: order.id,
        items: orderData.items.map(item => ({
          name: item.pack_id ? 'Pack' : 'Producto',
          quantity: item.quantity,
          price: item.unit_price
        })),
        total: totalAmount
      }
    });
  } catch (emailError) {
    console.error('Failed to send confirmation email:', emailError);
    // Don't fail the order if email fails
  }

  return { data: order, error: null };
}
