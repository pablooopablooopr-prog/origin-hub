-- Add company_id to cart_items to support producer-specific carts
ALTER TABLE public.cart_items 
ADD COLUMN company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE;

-- Create index for faster queries by customer and company
CREATE INDEX idx_cart_items_customer_company ON public.cart_items(customer_id, company_id);

-- Update existing cart items to have company_id from their pack or product
UPDATE public.cart_items ci
SET company_id = COALESCE(
  (SELECT company_id FROM public.company_packs WHERE id = ci.pack_id),
  (SELECT company_id FROM public.products WHERE id = ci.product_id)
)
WHERE ci.company_id IS NULL;