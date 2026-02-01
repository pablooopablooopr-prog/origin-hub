-- Add missing columns to routes table
ALTER TABLE public.routes 
ADD COLUMN IF NOT EXISTS base_price_per_person numeric DEFAULT 9.90,
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- Add is_premium column to route_stops table
ALTER TABLE public.route_stops 
ADD COLUMN IF NOT EXISTS is_premium boolean DEFAULT false;

-- Create route_access table for tracking user access to purchased routes
CREATE TABLE IF NOT EXISTS public.route_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  route_id uuid NOT NULL REFERENCES public.routes(id) ON DELETE CASCADE,
  valid_from timestamp with time zone NOT NULL DEFAULT now(),
  valid_until timestamp with time zone DEFAULT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, route_id)
);

-- Enable RLS on route_access
ALTER TABLE public.route_access ENABLE ROW LEVEL SECURITY;

-- RLS Policies for route_access
-- Users can only view their own route access
CREATE POLICY "Users can view their own route access"
ON public.route_access
FOR SELECT
USING (user_id = auth.uid());

-- Users can create their own route access (after purchase)
CREATE POLICY "Users can create their own route access"
ON public.route_access
FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Users can update their own route access
CREATE POLICY "Users can update their own route access"
ON public.route_access
FOR UPDATE
USING (user_id = auth.uid());

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_route_access_user_id ON public.route_access(user_id);
CREATE INDEX IF NOT EXISTS idx_route_access_route_id ON public.route_access(route_id);
CREATE INDEX IF NOT EXISTS idx_routes_is_active ON public.routes(is_active);