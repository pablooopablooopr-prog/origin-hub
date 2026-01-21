-- Add avatar_url column to customers table
ALTER TABLE public.customers 
ADD COLUMN IF NOT EXISTS avatar_url TEXT;