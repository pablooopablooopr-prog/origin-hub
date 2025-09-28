-- Create companies table for business authentication
CREATE TABLE public.companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  description TEXT,
  authenticity_story TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create pack templates
CREATE TABLE public.pack_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('raiz', 'esencia', 'gourmet')),
  color TEXT NOT NULL,
  description TEXT,
  requirements JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create company packs
CREATE TABLE public.company_packs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  template_id UUID REFERENCES public.pack_templates(id),
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'rejected')),
  price DECIMAL(10,2),
  shipping_policy TEXT,
  sustainability_info TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(company_id, slug)
);

-- Create pack elements for drag & drop builder
CREATE TABLE public.pack_elements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pack_id UUID REFERENCES public.company_packs(id) ON DELETE CASCADE,
  element_type TEXT NOT NULL CHECK (element_type IN ('image', 'video', 'text', 'price', 'button', 'file', 'reviews', 'tags')),
  content JSONB NOT NULL DEFAULT '{}',
  position INTEGER NOT NULL DEFAULT 0,
  styles JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reviews table
CREATE TABLE public.pack_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pack_id UUID REFERENCES public.company_packs(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create pack analytics
CREATE TABLE public.pack_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pack_id UUID REFERENCES public.company_packs(id) ON DELETE CASCADE,
  views INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  UNIQUE(pack_id, date)
);

-- Enable RLS
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pack_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pack_elements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pack_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pack_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for companies
CREATE POLICY "Users can view their own company" ON public.companies FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create their own company" ON public.companies FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own company" ON public.companies FOR UPDATE USING (user_id = auth.uid());

-- RLS Policies for pack templates (readable by all authenticated users)
CREATE POLICY "Authenticated users can view templates" ON public.pack_templates FOR SELECT TO authenticated USING (true);

-- RLS Policies for company packs
CREATE POLICY "Companies can view their own packs" ON public.company_packs FOR SELECT USING (
  company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid())
);
CREATE POLICY "Companies can create their own packs" ON public.company_packs FOR INSERT WITH CHECK (
  company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid())
);
CREATE POLICY "Companies can update their own packs" ON public.company_packs FOR UPDATE USING (
  company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid())
);
CREATE POLICY "Public can view published packs" ON public.company_packs FOR SELECT USING (status = 'published');

-- RLS Policies for pack elements
CREATE POLICY "Companies can manage their pack elements" ON public.pack_elements FOR ALL USING (
  pack_id IN (
    SELECT cp.id FROM public.company_packs cp 
    JOIN public.companies c ON c.id = cp.company_id 
    WHERE c.user_id = auth.uid()
  )
);
CREATE POLICY "Public can view published pack elements" ON public.pack_elements FOR SELECT USING (
  pack_id IN (SELECT id FROM public.company_packs WHERE status = 'published')
);

-- RLS Policies for reviews
CREATE POLICY "Anyone can view reviews" ON public.pack_reviews FOR SELECT USING (true);
CREATE POLICY "Companies can manage reviews for their packs" ON public.pack_reviews FOR ALL USING (
  pack_id IN (
    SELECT cp.id FROM public.company_packs cp 
    JOIN public.companies c ON c.id = cp.company_id 
    WHERE c.user_id = auth.uid()
  )
);

-- RLS Policies for analytics
CREATE POLICY "Companies can view their pack analytics" ON public.pack_analytics FOR SELECT USING (
  pack_id IN (
    SELECT cp.id FROM public.company_packs cp 
    JOIN public.companies c ON c.id = cp.company_id 
    WHERE c.user_id = auth.uid()
  )
);

-- Insert default pack templates
INSERT INTO public.pack_templates (name, type, color, description, requirements) VALUES
('Pack Raíz', 'raiz', '#8B4513', 'Pack básico con productos esenciales de la región', '["Productos locales", "Historia del productor", "Certificaciones básicas"]'),
('Pack Esencia', 'esencia', '#FF8C00', 'Pack intermedio con productos premium y experiencias', '["Productos premium", "Experiencia completa", "Sostenibilidad", "Historia detallada"]'),
('Pack Gourmet', 'gourmet', '#8A2BE2', 'Pack premium con productos exclusivos y experiencias únicas', '["Productos exclusivos", "Experiencia premium", "Certificaciones avanzadas", "Trazabilidad completa"]');

-- Create storage bucket for company files
INSERT INTO storage.buckets (id, name, public) VALUES ('company-files', 'company-files', true);

-- Storage policies for company files
CREATE POLICY "Companies can upload their own files" ON storage.objects 
FOR INSERT WITH CHECK (
  bucket_id = 'company-files' AND 
  (storage.foldername(name))[1] IN (
    SELECT c.id::text FROM public.companies c WHERE c.user_id = auth.uid()
  )
);

CREATE POLICY "Companies can update their own files" ON storage.objects 
FOR UPDATE USING (
  bucket_id = 'company-files' AND 
  (storage.foldername(name))[1] IN (
    SELECT c.id::text FROM public.companies c WHERE c.user_id = auth.uid()
  )
);

CREATE POLICY "Companies can delete their own files" ON storage.objects 
FOR DELETE USING (
  bucket_id = 'company-files' AND 
  (storage.foldername(name))[1] IN (
    SELECT c.id::text FROM public.companies c WHERE c.user_id = auth.uid()
  )
);

CREATE POLICY "Public can view company files" ON storage.objects 
FOR SELECT USING (bucket_id = 'company-files');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for timestamp updates
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_company_packs_updated_at BEFORE UPDATE ON public.company_packs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_pack_elements_updated_at BEFORE UPDATE ON public.pack_elements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();