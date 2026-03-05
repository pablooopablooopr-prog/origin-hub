-- Fix handle_new_user: don't auto-create company rows from trigger
-- The company registration form handles company creation separately
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
declare
  v_type text;
  v_phone text;
  v_full_name text;
begin
  v_type := coalesce(new.raw_user_meta_data->>'user_type', 'customer');
  v_phone := new.raw_user_meta_data->>'phone';
  v_full_name := coalesce(new.raw_user_meta_data->>'full_name', '');

  -- Only auto-create customer rows; company rows are created by the registration form
  if v_type = 'customer' then
    insert into public.customers (user_id, email, full_name, phone, created_at)
    values (new.id, new.email, coalesce(v_full_name, ''), v_phone, now())
    on conflict (user_id) do update
      set full_name = excluded.full_name,
          phone = excluded.phone;
  end if;

  return new;
end;
$function$;