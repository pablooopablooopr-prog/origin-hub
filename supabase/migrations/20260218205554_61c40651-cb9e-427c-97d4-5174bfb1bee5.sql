
-- Add moderation_status to routes
ALTER TABLE public.routes ADD COLUMN moderation_status text NOT NULL DEFAULT 'pending_review';

-- Add moderation_status to company_packs
ALTER TABLE public.company_packs ADD COLUMN moderation_status text NOT NULL DEFAULT 'pending_review';

-- Set existing records to approved so they don't disappear
UPDATE public.routes SET moderation_status = 'approved';
UPDATE public.company_packs SET moderation_status = 'approved';
