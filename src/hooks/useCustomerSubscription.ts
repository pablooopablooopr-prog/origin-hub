import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type ConsumerPlan = "trimestral" | "anual";
export type SubscriptionStatus = "active" | "cancelled" | "expired" | "past_due";

export interface ConsumerSubscription {
  id: string;
  user_id: string;
  plan: ConsumerPlan;
  status: SubscriptionStatus;
  starts_at: string;
  expires_at: string;
  stripe_subscription_id: string | null;
  stripe_customer_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface UseCustomerSubscriptionResult {
  subscription: ConsumerSubscription | null;
  isLoading: boolean;
  /** ¿Tiene una suscripción activa y no expirada? */
  isActive: boolean;
  /** Acceso premium = trimestral o anual activa */
  hasPremiumAccess: boolean;
  refresh: () => Promise<void>;
}

/**
 * Hook para suscripciones de consumidor (trimestral 29€ / anual 89€).
 *
 * Una suscripción se considera activa si:
 *   - status === "active"
 *   - expires_at > ahora
 */
export function useCustomerSubscription(): UseCustomerSubscriptionResult {
  const [subscription, setSubscription] = useState<ConsumerSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSubscription = async () => {
    setIsLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setSubscription(null);
        return;
      }

      const { data, error } = await supabase
        .from("consumer_subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.warn("useCustomerSubscription error:", error.message);
        setSubscription(null);
        return;
      }

      setSubscription(data as ConsumerSubscription | null);
    } catch (err) {
      console.warn("useCustomerSubscription unexpected error:", err);
      setSubscription(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let alive = true;
    void (async () => {
      await fetchSubscription();
      if (!alive) return;
    })();

    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange(() => {
      if (alive) void fetchSubscription();
    });

    return () => {
      alive = false;
      authSub.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const now = new Date();
  const isActive =
    subscription !== null &&
    subscription.status === "active" &&
    new Date(subscription.expires_at) > now;

  return {
    subscription,
    isLoading,
    isActive,
    hasPremiumAccess: isActive,
    refresh: fetchSubscription,
  };
}
