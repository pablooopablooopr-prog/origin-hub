
-- =====================================================
-- ORIGEN PLATFORM - COMPLETE DATABASE SCHEMA
-- =====================================================

-- 1. ENUMS FOR TYPE SAFETY
-- =====================================================
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
CREATE TYPE public.order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
CREATE TYPE public.company_status AS ENUM ('pending', 'approved', 'rejected', 'suspended');
CREATE TYPE public.pack_status AS ENUM ('draft', 'pending_review', 'published', 'archived');
CREATE TYPE public.notification_type AS ENUM ('order', 'review', 'message', 'system', 'promotion');

-- 2. USER ROLES (Security-first approach)
-- =====================================================
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all roles"
ON public.user_roles FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- 3. REGIONS (Geographic organization)
-- =====================================================
CREATE TABLE public.regions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL UNIQUE,
    slug text NOT NULL UNIQUE,
    description text,
    coordinates jsonb, -- {lat, lng, zoom}
    image_url text,
    is_active boolean DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.regions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active regions"
ON public.regions FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage regions"
ON public.regions FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- 4. CATEGORIES (Product/Business organization)
-- =====================================================
CREATE TABLE public.categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL UNIQUE,
    slug text NOT NULL UNIQUE,
    description text,
    icon text,
    color text,
    parent_id uuid REFERENCES public.categories(id),
    sort_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active categories"
ON public.categories FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage categories"
ON public.categories FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- 5. ADD MISSING COLUMNS TO COMPANIES
-- =====================================================
ALTER TABLE public.companies 
ADD COLUMN IF NOT EXISTS region_id uuid REFERENCES public.regions(id),
ADD COLUMN IF NOT EXISTS category_id uuid REFERENCES public.categories(id),
ADD COLUMN IF NOT EXISTS logo_url text,
ADD COLUMN IF NOT EXISTS cover_image_url text,
ADD COLUMN IF NOT EXISTS website text,
ADD COLUMN IF NOT EXISTS social_media jsonb DEFAULT '{}',
ADD COLUMN IF NOT EXISTS latitude numeric,
ADD COLUMN IF NOT EXISTS longitude numeric,
ADD COLUMN IF NOT EXISTS avg_rating numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_reviews integer DEFAULT 0;

-- 6. PRODUCTS (Individual products within packs)
-- =====================================================
CREATE TABLE public.products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    category_id uuid REFERENCES public.categories(id),
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    short_description text,
    price numeric,
    weight text,
    origin text,
    attributes jsonb DEFAULT '[]', -- ["Artesano", "Ecológico", etc]
    images jsonb DEFAULT '[]',
    is_available boolean DEFAULT true,
    stock_quantity integer,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE(company_id, slug)
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view available products"
ON public.products FOR SELECT
USING (is_available = true);

CREATE POLICY "Companies can manage their products"
ON public.products FOR ALL
USING (company_id IN (
    SELECT id FROM public.companies WHERE user_id = auth.uid()
));

-- 7. PACK_PRODUCTS (Many-to-many: products in packs)
-- =====================================================
CREATE TABLE public.pack_products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    pack_id uuid NOT NULL REFERENCES public.company_packs(id) ON DELETE CASCADE,
    product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    quantity integer DEFAULT 1,
    position integer DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE(pack_id, product_id)
);

ALTER TABLE public.pack_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view pack products of published packs"
ON public.pack_products FOR SELECT
USING (pack_id IN (
    SELECT id FROM public.company_packs WHERE status = 'published'
));

CREATE POLICY "Companies can manage their pack products"
ON public.pack_products FOR ALL
USING (pack_id IN (
    SELECT cp.id FROM public.company_packs cp
    JOIN public.companies c ON c.id = cp.company_id
    WHERE c.user_id = auth.uid()
));

-- 8. COMPANY_REVIEWS (Reviews for companies, not packs)
-- =====================================================
CREATE TABLE public.company_reviews (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL,
    customer_name text NOT NULL,
    rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title text,
    comment text,
    is_verified_purchase boolean DEFAULT false,
    is_approved boolean DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.company_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved reviews"
ON public.company_reviews FOR SELECT
USING (is_approved = true);

CREATE POLICY "Customers can create reviews"
ON public.company_reviews FOR INSERT
WITH CHECK (customer_id IN (
    SELECT id FROM public.customers WHERE user_id = auth.uid()
));

CREATE POLICY "Customers can update their own reviews"
ON public.company_reviews FOR UPDATE
USING (customer_id IN (
    SELECT id FROM public.customers WHERE user_id = auth.uid()
));

-- 9. ROUTES (Gastronomic routes)
-- =====================================================
CREATE TABLE public.routes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id uuid REFERENCES auth.users(id),
    region_id uuid REFERENCES public.regions(id),
    title text NOT NULL,
    slug text NOT NULL UNIQUE,
    description text,
    narrative text,
    duration text,
    difficulty text DEFAULT 'Fácil',
    image_url text,
    is_featured boolean DEFAULT false,
    is_public boolean DEFAULT true,
    total_stops integer DEFAULT 0,
    avg_rating numeric DEFAULT 0,
    total_participants integer DEFAULT 0,
    practical_info jsonb DEFAULT '{}',
    daily_recommendations jsonb DEFAULT '[]',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view public routes"
ON public.routes FOR SELECT
USING (is_public = true);

CREATE POLICY "Users can view their own routes"
ON public.routes FOR SELECT
USING (creator_id = auth.uid());

CREATE POLICY "Authenticated users can create routes"
ON public.routes FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own routes"
ON public.routes FOR UPDATE
USING (creator_id = auth.uid());

CREATE POLICY "Users can delete their own routes"
ON public.routes FOR DELETE
USING (creator_id = auth.uid());

-- 10. ROUTE_STOPS (Stops within routes)
-- =====================================================
CREATE TABLE public.route_stops (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    route_id uuid NOT NULL REFERENCES public.routes(id) ON DELETE CASCADE,
    company_id uuid REFERENCES public.companies(id) ON DELETE SET NULL,
    name text NOT NULL,
    type text,
    type_icon text,
    description text,
    what_to_do jsonb DEFAULT '[]',
    address text,
    schedule text,
    latitude numeric,
    longitude numeric,
    images jsonb DEFAULT '[]',
    highlights jsonb DEFAULT '[]',
    external_link text,
    position integer DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.route_stops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view stops of public routes"
ON public.route_stops FOR SELECT
USING (route_id IN (
    SELECT id FROM public.routes WHERE is_public = true
));

CREATE POLICY "Users can manage stops of their routes"
ON public.route_stops FOR ALL
USING (route_id IN (
    SELECT id FROM public.routes WHERE creator_id = auth.uid()
));

-- 11. SAVED_ROUTES (User bookmarked routes)
-- =====================================================
CREATE TABLE public.saved_routes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id uuid NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    route_id uuid NOT NULL REFERENCES public.routes(id) ON DELETE CASCADE,
    notes text,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE(customer_id, route_id)
);

ALTER TABLE public.saved_routes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their saved routes"
ON public.saved_routes FOR ALL
USING (customer_id IN (
    SELECT id FROM public.customers WHERE user_id = auth.uid()
));

-- 12. SHIPPING_ADDRESSES (Multiple addresses per customer)
-- =====================================================
CREATE TABLE public.shipping_addresses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id uuid NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    label text DEFAULT 'Casa',
    full_name text NOT NULL,
    street_address text NOT NULL,
    city text NOT NULL,
    province text NOT NULL,
    postal_code text NOT NULL,
    country text DEFAULT 'España',
    phone text,
    is_default boolean DEFAULT false,
    instructions text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.shipping_addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their addresses"
ON public.shipping_addresses FOR ALL
USING (customer_id IN (
    SELECT id FROM public.customers WHERE user_id = auth.uid()
));

-- 13. CART_ITEMS (Shopping cart)
-- =====================================================
CREATE TABLE public.cart_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id uuid NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    pack_id uuid REFERENCES public.company_packs(id) ON DELETE CASCADE,
    product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
    quantity integer NOT NULL DEFAULT 1,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT cart_item_has_product CHECK (pack_id IS NOT NULL OR product_id IS NOT NULL)
);

ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their cart"
ON public.cart_items FOR ALL
USING (customer_id IN (
    SELECT id FROM public.customers WHERE user_id = auth.uid()
));

-- 14. ORDER_ITEMS (Individual items in an order)
-- =====================================================
CREATE TABLE public.order_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    pack_id uuid REFERENCES public.company_packs(id),
    product_id uuid REFERENCES public.products(id),
    quantity integer NOT NULL DEFAULT 1,
    unit_price numeric NOT NULL,
    total_price numeric NOT NULL,
    product_snapshot jsonb, -- Store product details at time of purchase
    created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their order items"
ON public.order_items FOR SELECT
USING (order_id IN (
    SELECT o.id FROM public.orders o
    JOIN public.customers c ON c.id = o.customer_id
    WHERE c.user_id = auth.uid()
));

CREATE POLICY "Companies can view order items of their products"
ON public.order_items FOR SELECT
USING (
    pack_id IN (
        SELECT cp.id FROM public.company_packs cp
        JOIN public.companies c ON c.id = cp.company_id
        WHERE c.user_id = auth.uid()
    )
);

-- 15. NOTIFICATIONS
-- =====================================================
CREATE TABLE public.notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type notification_type NOT NULL DEFAULT 'system',
    title text NOT NULL,
    message text,
    data jsonb DEFAULT '{}',
    is_read boolean DEFAULT false,
    read_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their notifications"
ON public.notifications FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can update their notifications"
ON public.notifications FOR UPDATE
USING (user_id = auth.uid());

-- 16. CONTACT_MESSAGES
-- =====================================================
CREATE TABLE public.contact_messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id),
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    subject text,
    message text NOT NULL,
    is_read boolean DEFAULT false,
    is_resolved boolean DEFAULT false,
    resolved_at timestamptz,
    resolved_by uuid REFERENCES auth.users(id),
    created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create contact messages"
ON public.contact_messages FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view all messages"
ON public.contact_messages FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own messages"
ON public.contact_messages FOR SELECT
USING (user_id = auth.uid());

-- 17. FAVORITE_COMPANIES (Customers can favorite companies)
-- =====================================================
CREATE TABLE public.favorite_companies (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id uuid NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE(customer_id, company_id)
);

ALTER TABLE public.favorite_companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their favorite companies"
ON public.favorite_companies FOR ALL
USING (customer_id IN (
    SELECT id FROM public.customers WHERE user_id = auth.uid()
));

-- 18. UPDATE ORDERS TABLE
-- =====================================================
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS shipping_address_id uuid REFERENCES public.shipping_addresses(id),
ADD COLUMN IF NOT EXISTS payment_method text,
ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS notes text,
ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id);

-- Add policy for companies to view their orders
CREATE POLICY "Companies can view orders of their products"
ON public.orders FOR SELECT
USING (company_id IN (
    SELECT id FROM public.companies WHERE user_id = auth.uid()
));

-- Add policy for customers to create orders
CREATE POLICY "Customers can create orders"
ON public.orders FOR INSERT
WITH CHECK (customer_id IN (
    SELECT id FROM public.customers WHERE user_id = auth.uid()
));

-- 19. TRIGGERS FOR UPDATED_AT
-- =====================================================
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_routes_updated_at
BEFORE UPDATE ON public.routes
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_shipping_addresses_updated_at
BEFORE UPDATE ON public.shipping_addresses
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at
BEFORE UPDATE ON public.cart_items
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 20. INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX idx_products_company ON public.products(company_id);
CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_routes_region ON public.routes(region_id);
CREATE INDEX idx_routes_creator ON public.routes(creator_id);
CREATE INDEX idx_route_stops_route ON public.route_stops(route_id);
CREATE INDEX idx_orders_customer ON public.orders(customer_id);
CREATE INDEX idx_orders_company ON public.orders(company_id);
CREATE INDEX idx_notifications_user ON public.notifications(user_id, is_read);
CREATE INDEX idx_cart_items_customer ON public.cart_items(customer_id);
CREATE INDEX idx_company_reviews_company ON public.company_reviews(company_id);

-- 21. PUBLIC VIEW POLICY FOR COMPANIES (so users can see business profiles)
-- =====================================================
CREATE POLICY "Anyone can view approved companies"
ON public.companies FOR SELECT
USING (status = 'approved');
