import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const usePackFavorites = (packId?: string) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkFavorite = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !packId) return;

      // Get customer ID
      const { data: customer } = await supabase
        .from("customers")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (customer) {
        setCustomerId(customer.id);
        
        // Check if already favorite
        const { data: favorite } = await supabase
          .from("favorites")
          .select("id")
          .eq("customer_id", customer.id)
          .eq("pack_id", packId)
          .single();

        setIsFavorite(!!favorite);
      }
    };

    checkFavorite();
  }, [packId]);

  const toggleFavorite = useCallback(async () => {
    if (!packId) return;
    
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
      // Remove from favorites
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
      // Add to favorites
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
