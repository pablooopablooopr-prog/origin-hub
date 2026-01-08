-- Create storage buckets for images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('route-images', 'route-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('pack-images', 'pack-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Policies for route-images bucket
CREATE POLICY "Anyone can view route images"
ON storage.objects FOR SELECT
USING (bucket_id = 'route-images');

CREATE POLICY "Authenticated users can upload route images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'route-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own route images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'route-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own route images"
ON storage.objects FOR DELETE
USING (bucket_id = 'route-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Policies for pack-images bucket
CREATE POLICY "Anyone can view pack images"
ON storage.objects FOR SELECT
USING (bucket_id = 'pack-images');

CREATE POLICY "Companies can upload pack images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'pack-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Companies can update their pack images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'pack-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Companies can delete their pack images"
ON storage.objects FOR DELETE
USING (bucket_id = 'pack-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Policies for product-images bucket
CREATE POLICY "Anyone can view product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

CREATE POLICY "Companies can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Companies can update their product images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'product-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Companies can delete their product images"
ON storage.objects FOR DELETE
USING (bucket_id = 'product-images' AND auth.uid()::text = (storage.foldername(name))[1]);