/**
 * Payment Provider
 * 
 * Unified interface for route purchases.
 * In MOCK mode: writes directly to Supabase
 * In STRIPE mode: calls edge functions for checkout
 */

import { supabase } from "@/integrations/supabase/client";
import { getPaymentsMode, isStripeConfigured, getCheckoutUrls } from "./config";

export interface RoutePurchaseParams {
  routeId: string;
  routeSlug: string;
  routeTitle: string;
  customerId: string;
  numPeople: number;
  basePrice: number;
  discountPercent: number;
  totalPrice: number;
}

export interface PurchaseResult {
  success: boolean;
  purchaseId?: string;
  error?: string;
  redirectUrl?: string;
}

/**
 * Process a route purchase
 * Automatically uses mock or stripe based on PAYMENTS_MODE
 */
export const processRoutePurchase = async (
  params: RoutePurchaseParams
): Promise<PurchaseResult> => {
  const mode = getPaymentsMode();
  
  if (mode === "mock") {
    return processMockPurchase(params);
  } else if (mode === "stripe" && isStripeConfigured()) {
    return processStripePurchase(params);
  } else {
    // Stripe mode but not configured - fallback to mock with warning
    console.warn("Stripe mode enabled but not configured. Using mock mode.");
    return processMockPurchase(params);
  }
};

/**
 * Mock purchase - writes directly to database
 * Used for testing and when Stripe is not configured
 */
const processMockPurchase = async (
  params: RoutePurchaseParams
): Promise<PurchaseResult> => {
  const { 
    routeId, 
    customerId, 
    numPeople, 
    basePrice, 
    discountPercent, 
    totalPrice 
  } = params;

  try {
    // Get the user_id from customer
    const { data: customer } = await supabase
      .from("customers")
      .select("user_id")
      .eq("id", customerId)
      .single();

    if (!customer?.user_id) {
      return { success: false, error: "No se pudo identificar el usuario" };
    }

    // Check if purchase already exists
    const { data: existingPurchase } = await supabase
      .from("route_purchases")
      .select("id, payment_status")
      .eq("customer_id", customerId)
      .eq("route_id", routeId)
      .single();

    let purchaseId: string;
    const now = new Date().toISOString();

    if (existingPurchase) {
      // Update existing purchase to paid
      const { data, error } = await supabase
        .from("route_purchases")
        .update({
          num_people: numPeople,
          base_price: basePrice,
          discount_percent: discountPercent,
          final_price: totalPrice,
          payment_status: "completed",
          purchased_at: now,
        })
        .eq("id", existingPurchase.id)
        .select("id")
        .single();

      if (error) throw error;
      purchaseId = data.id;
    } else {
      // Create new purchase as paid
      const { data, error } = await supabase
        .from("route_purchases")
        .insert({
          customer_id: customerId,
          route_id: routeId,
          num_people: numPeople,
          base_price: basePrice,
          discount_percent: discountPercent,
          final_price: totalPrice,
          payment_status: "completed",
          purchased_at: now,
        })
        .select("id")
        .single();

      if (error) throw error;
      purchaseId = data.id;
    }

    // Create route access via security definer function (bypasses RLS)
    const { error: accessError } = await supabase
      .rpc("grant_route_access_after_purchase", {
        p_user_id: customer.user_id,
        p_route_id: routeId,
      });

    if (accessError) {
      console.error("Error creating route access:", accessError);
      // Don't fail the purchase, access can be fixed later
    }

    return { 
      success: true, 
      purchaseId,
    };
  } catch (error) {
    console.error("Mock purchase error:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Error procesando la compra" 
    };
  }
};

/**
 * Stripe purchase - calls edge function to create checkout session
 * Only used when Stripe is properly configured
 */
const processStripePurchase = async (
  params: RoutePurchaseParams
): Promise<PurchaseResult> => {
  const { routeSlug } = params;
  const urls = getCheckoutUrls(routeSlug);

  try {
    const { data, error } = await supabase.functions.invoke("create-route-checkout", {
      body: {
        ...params,
        successUrl: urls.successUrl,
        cancelUrl: urls.cancelUrl,
      },
    });

    if (error) throw error;

    if (data?.url) {
      return { 
        success: true, 
        redirectUrl: data.url 
      };
    }

    return { 
      success: false, 
      error: "No se recibió URL de checkout" 
    };
  } catch (error) {
    console.error("Stripe purchase error:", error);
    return { 
      success: false, 
      error: "Stripe no está configurado. Contacta al administrador." 
    };
  }
};

/**
 * Check if user has access to a route
 */
export const checkRouteAccess = async (
  userId: string,
  routeId: string
): Promise<boolean> => {
  const { data } = await supabase
    .from("route_access")
    .select("id, valid_from, valid_until")
    .eq("user_id", userId)
    .eq("route_id", routeId)
    .single();

  if (!data) return false;

  const now = new Date();
  const validFrom = new Date(data.valid_from);
  const validUntil = data.valid_until ? new Date(data.valid_until) : null;

  // Check if currently valid
  if (now < validFrom) return false;
  if (validUntil && now > validUntil) return false;

  return true;
};

/**
 * Get user's purchased routes
 */
export const getUserPurchasedRoutes = async (customerId: string) => {
  const { data, error } = await supabase
    .from("route_purchases")
    .select(`
      id,
      route_id,
      num_people,
      final_price,
      payment_status,
      purchased_at,
      routes (
        id,
        title,
        slug,
        description,
        image_url,
        duration,
        difficulty
      )
    `)
    .eq("customer_id", customerId)
    .eq("payment_status", "completed")
    .order("purchased_at", { ascending: false });

  if (error) {
    console.error("Error fetching purchased routes:", error);
    return [];
  }

  return data || [];
};
