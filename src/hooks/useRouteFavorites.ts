import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useRouteFavorites = (routeSlug?: string) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [routeId, setRouteId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const initFavorites = async () => {
      if (!routeSlug) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // First, try to get the actual route UUID from slug or id
      const { data: routeData } = await supabase
        .from("routes")
        .select("id")
        .or(`slug.eq.${routeSlug},id.eq.${routeSlug}`)
        .maybeSingle();

      if (!routeData) {
        console.log("Route not found in DB for slug:", routeSlug, "- favorites disabled for static routes");
        return;
      }
      
      setRouteId(routeData.id);

      // Get or create customer
      let { data: customer } = await supabase
        .from("customers")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!customer) {
        const { data: newCustomer, error: createError } = await supabase
          .from("customers")
          .insert({
            user_id: user.id,
            email: user.email || "",
            full_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Usuario"
          })
          .select("id")
          .single();
        
        if (createError) {
          console.error("Error creating customer:", createError);
          return;
        }
        customer = newCustomer;
      }

      if (customer) {
        setCustomerId(customer.id);
        
        // Check if already favorite using the UUID
        const { data: favorite } = await supabase
          .from("saved_routes")
          .select("id")
          .eq("customer_id", customer.id)
          .eq("route_id", routeData.id)
          .single();

        setIsFavorite(!!favorite);
      }
    };

    initFavorites();
  }, [routeSlug]);

  const toggleFavorite = useCallback(async () => {
    if (!routeId) {
      toast({
        title: "Error",
        description: "Ruta no encontrada en la base de datos",
        variant: "destructive"
      });
      return;
    }
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para guardar rutas favoritas",
        variant: "destructive"
      });
      return;
    }

    if (!customerId) {
      toast({
        title: "Error",
        description: "No se pudo verificar tu cuenta",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    if (isFavorite) {
      const { error } = await supabase
        .from("saved_routes")
        .delete()
        .eq("customer_id", customerId)
        .eq("route_id", routeId);

      if (!error) {
        setIsFavorite(false);
        toast({
          title: "Eliminado de favoritos",
          description: "La ruta ha sido eliminada de tus favoritos"
        });
      }
    } else {
      const { error } = await supabase
        .from("saved_routes")
        .insert({
          customer_id: customerId,
          route_id: routeId
        });

      if (!error) {
        setIsFavorite(true);
        toast({
          title: "Añadido a favoritos",
          description: "La ruta ha sido guardada en tus favoritos"
        });
      } else {
        console.error("Error adding favorite:", error);
        toast({
          title: "Error",
          description: "No se pudo guardar la ruta en favoritos",
          variant: "destructive"
        });
      }
    }

    setLoading(false);
  }, [routeId, customerId, isFavorite, toast]);

  return { isFavorite, loading, toggleFavorite, isLoggedIn: !!customerId };
};
