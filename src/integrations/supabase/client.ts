import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? "https://xivonturgevryfycspdl.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhpdm9udHVyZ2V2cnlmeWNzcGRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwODAwMzQsImV4cCI6MjA3NDY1NjAzNH0.FvjDxjWzKO95N2uA6Hn0LizPlHwTNd-IkOCHFODGFSI";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
