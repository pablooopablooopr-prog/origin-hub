import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const usePackFavorites = (packSlug?: string) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [packId, setPackId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const initFavorites = async () => {
      if (!packSlug) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // First, get the actual pack UUID from slug
      const { data: packData } = await supabase
        .from("company_packs")
        .select("id")
        .eq("slug", packSlug)
        .single();

      if (!packData) {
        console.log("Pack not found for slug:", packSlug);
        return;
      }
      
      setPackId(packData.id);

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
          .from("favorites")
          .select("id")
          .eq("customer_id", customer.id)
          .eq("pack_id", packData.id)
          .single();

        setIsFavorite(!!favorite);
      }
    };

    initFavorites();
  }, [packSlug]);

  const toggleFavorite = useCallback(async () => {
    if (!packId) {
      toast({
        title: "Error",
        description: "Pack no encontrado en la base de datos",
        variant: "destructive"
      });
      return;
    }
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para guardar favoritos",
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
        .from("favorites")
        .delete()
        .eq("customer_id", customerId)
        .eq("pack_id", packId);

      if (!error) {
        setIsFavorite(false);
        toast({
          title: "Eliminado de favoritos",
          description: "El pack ha sido eliminado de tus favoritos"
        });
      }
    } else {
      const { error } = await supabase
        .from("favorites")
        .insert({
          customer_id: customerId,
          pack_id: packId
        });

      if (!error) {
        setIsFavorite(true);
        toast({
          title: "Añadido a favoritos",
          description: "El pack ha sido guardado en tus favoritos"
        });
      } else {
        console.error("Error adding favorite:", error);
        toast({
          title: "Error",
          description: "No se pudo guardar el favorito",
          variant: "destructive"
        });
      }
    }

    setLoading(false);
  }, [packId, customerId, isFavorite, toast]);

  return { isFavorite, loading, toggleFavorite, isLoggedIn: !!customerId };
};
