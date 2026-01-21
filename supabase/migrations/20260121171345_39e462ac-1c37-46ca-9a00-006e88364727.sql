-- Add notification preferences columns to customers table
ALTER TABLE public.customers 
ADD COLUMN IF NOT EXISTS notification_email BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS notification_sms BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS notification_offers BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS notification_newsletter BOOLEAN DEFAULT true;

-- Add index for notification preferences (for batch email campaigns)
CREATE INDEX IF NOT EXISTS idx_customers_notification_email ON public.customers (notification_email) WHERE notification_email = true;
CREATE INDEX IF NOT EXISTS idx_customers_notification_newsletter ON public.customers (notification_newsletter) WHERE notification_newsletter = true;