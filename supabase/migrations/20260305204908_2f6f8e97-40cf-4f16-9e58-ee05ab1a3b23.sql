CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
declare
  v_type text;
  v_phone text;
  v_full_name text;
  v_company_name text;
begin
  v_type := coalesce(new.raw_user_meta_data->>'user_type', 'customer');
  v_phone := new.raw_user_meta_data->>'phone';
  v_full_name := coalesce(new.raw_user_meta_data->>'full_name', '');
  v_company_name := coalesce(new.raw_user_meta_data->>'company_name', new.raw_user_meta_data->>'business_name', '');

  -- Customer
  if v_type = 'customer' then
    insert into public.customers (user_id, email, full_name, phone, created_at)
    values (new.id, new.email, coalesce(v_full_name, ''), v_phone, now())
    on conflict (user_id) do update
      set full_name = excluded.full_name,
          phone = excluded.phone;
  end if;

  -- Company
  if v_type = 'company' then
    insert into public.companies (user_id, email, business_name, contact_person, phone, status, created_at)
    values (new.id, new.email, v_company_name, coalesce(v_full_name, v_company_name, ''), v_phone, 'PENDING', now())
    on conflict (user_id) do update
      set business_name = excluded.business_name,
          contact_person = excluded.contact_person,
          phone = excluded.phone;
  end if;

  return new;
end;
$$;