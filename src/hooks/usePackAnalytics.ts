import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const usePackAnalytics = (packId?: string) => {
  useEffect(() => {
    if (!packId) return;

    const trackView = async () => {
      const today = new Date().toISOString().split('T')[0];

      // Try to update existing record for today
      const { data: existing } = await supabase
        .from("pack_analytics")
        .select("id, views")
        .eq("pack_id", packId)
        .eq("date", today)
        .single();

      if (existing) {
        // Update views count
        await supabase
          .from("pack_analytics")
          .update({ views: (existing.views || 0) + 1 })
          .eq("id", existing.id);
      } else {
        // Create new record for today
        await supabase
          .from("pack_analytics")
          .insert({
            pack_id: packId,
            date: today,
            views: 1,
            clicks: 0
          });
      }
    };

    trackView();
  }, [packId]);

  const trackClick = async () => {
    if (!packId) return;
    
    const today = new Date().toISOString().split('T')[0];

    const { data: existing } = await supabase
      .from("pack_analytics")
      .select("id, clicks")
      .eq("pack_id", packId)
      .eq("date", today)
      .single();

    if (existing) {
      await supabase
        .from("pack_analytics")
        .update({ clicks: (existing.clicks || 0) + 1 })
        .eq("id", existing.id);
    } else {
      await supabase
        .from("pack_analytics")
        .insert({
          pack_id: packId,
          date: today,
          views: 0,
          clicks: 1
        });
    }
  };

  return { trackClick };
};
