-- Create table for route purchases
CREATE TABLE public.route_purchases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  route_id UUID NOT NULL REFERENCES public.routes(id) ON DELETE CASCADE,
  num_people INTEGER NOT NULL DEFAULT 1,
  base_price NUMERIC(10,2) NOT NULL,
  discount_percent NUMERIC(5,2) DEFAULT 0,
  final_price NUMERIC(10,2) NOT NULL,
  stripe_payment_intent_id TEXT,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  purchased_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(customer_id, route_id)
);

-- Enable RLS
ALTER TABLE public.route_purchases ENABLE ROW LEVEL SECURITY;

-- Users can view their own purchases
CREATE POLICY "Users can view their own route purchases"
ON public.route_purchases
FOR SELECT
USING (customer_id IN (SELECT id FROM public.customers WHERE user_id = auth.uid()));

-- Users can create their own purchases
CREATE POLICY "Users can create their own route purchases"
ON public.route_purchases
FOR INSERT
WITH CHECK (customer_id IN (SELECT id FROM public.customers WHERE user_id = auth.uid()));

-- Users can update their own pending purchases
CREATE POLICY "Users can update their own route purchases"
ON public.route_purchases
FOR UPDATE
USING (customer_id IN (SELECT id FROM public.customers WHERE user_id = auth.uid()));

-- Create index for faster lookups
CREATE INDEX idx_route_purchases_customer ON public.route_purchases(customer_id);
CREATE INDEX idx_route_purchases_route ON public.route_purchases(route_id);
CREATE INDEX idx_route_purchases_status ON public.route_purchases(payment_status);