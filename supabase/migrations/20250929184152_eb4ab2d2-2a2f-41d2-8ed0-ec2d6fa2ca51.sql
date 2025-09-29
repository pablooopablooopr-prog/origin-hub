-- Create customers table
CREATE TABLE public.customers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  address text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Policies for customers
CREATE POLICY "Users can view their own customer data"
ON public.customers
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can create their own customer data"
ON public.customers
FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own customer data"
ON public.customers
FOR UPDATE
USING (user_id = auth.uid());

-- Create orders table
CREATE TABLE public.orders (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id uuid REFERENCES public.customers(id) ON DELETE CASCADE NOT NULL,
  pack_id uuid REFERENCES public.company_packs(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'pending',
  total_amount numeric NOT NULL,
  shipping_address text NOT NULL,
  tracking_number text,
  order_date timestamp with time zone NOT NULL DEFAULT now(),
  estimated_delivery date,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Policies for orders
CREATE POLICY "Users can view their own orders"
ON public.orders
FOR SELECT
USING (customer_id IN (
  SELECT id FROM public.customers WHERE user_id = auth.uid()
));

-- Create favorites table
CREATE TABLE public.favorites (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id uuid REFERENCES public.customers(id) ON DELETE CASCADE NOT NULL,
  pack_id uuid REFERENCES public.company_packs(id) ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(customer_id, pack_id)
);

-- Enable RLS
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Policies for favorites
CREATE POLICY "Users can view their own favorites"
ON public.favorites
FOR SELECT
USING (customer_id IN (
  SELECT id FROM public.customers WHERE user_id = auth.uid()
));

CREATE POLICY "Users can create their own favorites"
ON public.favorites
FOR INSERT
WITH CHECK (customer_id IN (
  SELECT id FROM public.customers WHERE user_id = auth.uid()
));

CREATE POLICY "Users can delete their own favorites"
ON public.favorites
FOR DELETE
USING (customer_id IN (
  SELECT id FROM public.customers WHERE user_id = auth.uid()
));

-- Create triggers for updated_at
CREATE TRIGGER update_customers_updated_at
BEFORE UPDATE ON public.customers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();