import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface PackReview {
  id: string;
  customer_name: string;
  rating: number;
  comment: string | null;
  created_at: string;
  customer_id: string | null;
}

export const usePackReviews = (packId?: string) => {
  const [reviews, setReviews] = useState<PackReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const { toast } = useToast();

  const fetchReviews = async () => {
    if (!packId) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("pack_reviews")
      .select("*")
      .eq("pack_id", packId)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Error fetching pack reviews:", error);
    } else {
      setReviews(data || []);
      
      // Calculate average rating
      if (data && data.length > 0) {
        const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
        setAverageRating(Math.round(avg * 10) / 10);
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, [packId]);

  const submitReview = async (customerName: string, rating: number, comment: string) => {
    if (!packId) return false;

    const { data: { user } } = await supabase.auth.getUser();
    let customerId = null;

    if (user) {
      const { data: customer } = await supabase
        .from("customers")
        .select("id")
        .eq("user_id", user.id)
        .single();
      
      if (customer) {
        customerId = customer.id;
      }
    }

    const { error } = await supabase
      .from("pack_reviews")
      .insert({
        pack_id: packId,
        customer_id: customerId,
        customer_name: customerName,
        rating,
        comment
      });

    if (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description: "No se pudo enviar la valoración",
        variant: "destructive"
      });
      return false;
    }

    toast({
      title: "¡Valoración enviada!",
      description: "Gracias por compartir tu experiencia"
    });

    // Refresh reviews
    await fetchReviews();
    return true;
  };

  return { reviews, loading, averageRating, submitReview, refetch: fetchReviews };
};
