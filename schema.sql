


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE TYPE "public"."app_role" AS ENUM (
    'admin',
    'moderator',
    'user'
);


ALTER TYPE "public"."app_role" OWNER TO "postgres";


CREATE TYPE "public"."company_status" AS ENUM (
    'pending',
    'approved',
    'rejected',
    'suspended'
);


ALTER TYPE "public"."company_status" OWNER TO "postgres";


CREATE TYPE "public"."notification_type" AS ENUM (
    'order',
    'review',
    'message',
    'system',
    'promotion'
);


ALTER TYPE "public"."notification_type" OWNER TO "postgres";


CREATE TYPE "public"."order_status" AS ENUM (
    'pending',
    'confirmed',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
    'refunded'
);


ALTER TYPE "public"."order_status" OWNER TO "postgres";


CREATE TYPE "public"."pack_status" AS ENUM (
    'draft',
    'pending_review',
    'published',
    'archived'
);


ALTER TYPE "public"."pack_status" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."block_stripe_account_id_update"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
  -- Permite a service_role (normalmente auth.role() = 'service_role' no aplica en SQL directo,
  -- pero en Supabase, el JWT del service role bypass suele entrar como role postgres/service).
  -- Como estamos en DB, el control fiable es: si NO es admin() y stripe cambia -> bloquear.
  if (not is_admin()) and (new.stripe_account_id is distinct from old.stripe_account_id) then
    raise exception 'stripe_account_id cannot be modified by non-admin';
  end if;

  return new;
end;
$$;


ALTER FUNCTION "public"."block_stripe_account_id_update"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."fill_created_by"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
  if new.created_by is null then
    new.created_by := auth.uid();
  end if;
  return new;
end;
$$;


ALTER FUNCTION "public"."fill_created_by"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."has_role"("_user_id" "uuid", "_role" "public"."app_role") RETURNS boolean
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;


ALTER FUNCTION "public"."has_role"("_user_id" "uuid", "_role" "public"."app_role") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."increment_promo_code_safe"("code_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  v_success boolean := false;
BEGIN
  UPDATE promotional_codes
  SET current_uses = current_uses + 1
  WHERE id = code_id
    AND is_active = true
    AND (max_uses IS NULL OR current_uses < max_uses)
  RETURNING true INTO v_success;
  
  RETURN COALESCE(v_success, false);
END;
$$;


ALTER FUNCTION "public"."increment_promo_code_safe"("code_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_admin"() RETURNS boolean
    LANGUAGE "sql" STABLE
    AS $$
  select exists (
    select 1
    from public.user_roles ur
    where ur.user_id = auth.uid()
      and ur.role = 'admin'
  );
$$;


ALTER FUNCTION "public"."is_admin"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_company_owner"("p_company_id" "uuid") RETURNS boolean
    LANGUAGE "sql" STABLE
    AS $$
  select exists (
    select 1
    from public.companies c
    where c.id = p_company_id
      and c.user_id = auth.uid()
  );
$$;


ALTER FUNCTION "public"."is_company_owner"("p_company_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_pack_owner"("p_pack_id" "uuid") RETURNS boolean
    LANGUAGE "sql" STABLE
    AS $$
  select exists (
    select 1
    from public.company_packs cp
    join public.companies c on c.id = cp.company_id
    where cp.id = p_pack_id
      and c.user_id = auth.uid()
  );
$$;


ALTER FUNCTION "public"."is_pack_owner"("p_pack_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."log_webhook_context"("p_source" "text" DEFAULT 'webhook'::"text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
  insert into public.webhook_context_log(source, db_user, jwt_role, jwt_sub, auth_uid)
  values (
    coalesce(p_source,'webhook'),
    current_user,
    current_setting('request.jwt.claim.role', true),
    current_setting('request.jwt.claim.sub', true),
    auth.uid()
  );
end;
$$;


ALTER FUNCTION "public"."log_webhook_context"("p_source" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."log_webhook_whoami"() RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
  insert into public.webhook_whoami_log (db_role, auth_uid, auth_role, jwt_claims)
  values (
    current_setting('role', true),
    auth.uid(),
    auth.role(),
    coalesce(current_setting('request.jwt.claims', true)::jsonb, '{}'::jsonb)
  );
end;
$$;


ALTER FUNCTION "public"."log_webhook_whoami"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."my_company_id"() RETURNS "uuid"
    LANGUAGE "sql" STABLE
    AS $$
  select p.company_id from public.profiles p
  where p.id = auth.uid()
$$;


ALTER FUNCTION "public"."my_company_id"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."owns_route"("p_route_id" "uuid") RETURNS boolean
    LANGUAGE "sql" STABLE
    AS $$
  select exists (
    select 1
    from public.routes r
    where r.id = p_route_id
      and r.created_by = auth.uid()
  );
$$;


ALTER FUNCTION "public"."owns_route"("p_route_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."owns_stop"("p_stop_id" "uuid") RETURNS boolean
    LANGUAGE "sql" STABLE
    AS $$
  select exists (
    select 1
    from public.route_stops rs
    join public.routes r on r.id = rs.route_id
    where rs.id = p_stop_id
      and r.created_by = auth.uid()
  );
$$;


ALTER FUNCTION "public"."owns_stop"("p_stop_id" "uuid") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."routes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "creator_id" "uuid",
    "region_id" "uuid",
    "title" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "description" "text",
    "narrative" "text",
    "duration" "text",
    "difficulty" "text" DEFAULT 'Fácil'::"text",
    "image_url" "text",
    "is_featured" boolean DEFAULT false,
    "is_public" boolean DEFAULT true,
    "total_stops" integer DEFAULT 0,
    "avg_rating" numeric DEFAULT 0,
    "total_participants" integer DEFAULT 0,
    "practical_info" "jsonb" DEFAULT '{}'::"jsonb",
    "daily_recommendations" "jsonb" DEFAULT '[]'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "base_price_per_person" numeric DEFAULT 9.90,
    "is_active" boolean DEFAULT true,
    "created_by" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "is_demo" boolean DEFAULT false
);

ALTER TABLE ONLY "public"."routes" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."routes" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."route_owner_id"("r" "public"."routes") RETURNS "uuid"
    LANGUAGE "sql" STABLE
    AS $$
  select coalesce(r.created_by, r.creator_id)
$$;


ALTER FUNCTION "public"."route_owner_id"("r" "public"."routes") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_company_stripe_account"("p_company_id" "uuid", "p_stripe_account_id" "text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
  -- Permitir si es service_role
  if current_role = 'service_role' then
    update public.companies
      set stripe_account_id = p_stripe_account_id
    where id = p_company_id;
    return;
  end if;

  -- Permitir si es admin (tu función is_admin())
  if is_admin() then
    update public.companies
      set stripe_account_id = p_stripe_account_id
    where id = p_company_id;
    return;
  end if;

  raise exception 'not allowed';
end;
$$;


ALTER FUNCTION "public"."set_company_stripe_account"("p_company_id" "uuid", "p_stripe_account_id" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."validate_checkout_ref"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
  if new.kind = 'pack' then
    if not exists (
      select 1 from public.company_packs p
      where p.id = new.ref_id
        and coalesce(p.is_published,false)=true
        and coalesce(p.is_active,false)=true
        and coalesce(p.is_demo,false)=false
    ) then
      raise exception 'Invalid pack ref_id or not public-ready';
    end if;
  elsif new.kind = 'route' then
    if not exists (
      select 1 from public.routes r
      where r.id = new.ref_id
        and coalesce(r.is_public,false)=true
        and coalesce(r.is_active,false)=true
        and coalesce(r.is_demo,false)=false
    ) then
      raise exception 'Invalid route ref_id or not public-ready';
    end if;
  else
    raise exception 'Invalid kind';
  end if;

  return new;
end;
$$;


ALTER FUNCTION "public"."validate_checkout_ref"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."validate_promo_code"("code_value" "text", "order_total" numeric) RETURNS TABLE("valid" boolean, "code_id" "uuid", "discount_type" "text", "discount_value" numeric, "error_message" "text")
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  v_code promotional_codes%ROWTYPE;
BEGIN
  SELECT * INTO v_code
  FROM promotional_codes
  WHERE code = upper(trim(code_value))
    AND is_active = true
    AND (valid_from IS NULL OR valid_from <= now())
    AND (valid_until IS NULL OR valid_until >= now())
    AND (max_uses IS NULL OR current_uses < max_uses)
    AND (min_order_amount <= order_total)
  LIMIT 1;
  
  IF FOUND THEN
    RETURN QUERY SELECT true, v_code.id, v_code.discount_type::text, v_code.discount_value, NULL::text;
  ELSE
    RETURN QUERY SELECT false, NULL::uuid, NULL::text, NULL::numeric, 'Código no válido o expirado'::text;
  END IF;
END;
$$;


ALTER FUNCTION "public"."validate_promo_code"("code_value" "text", "order_total" numeric) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."webhook_whoami"("note" "text" DEFAULT NULL::"text") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
declare
  v_uid uuid;
  v_role text;
  v_sub text;
  v_email text;
begin
  v_uid := auth.uid();
  v_role := current_setting('request.jwt.claim.role', true);
  v_sub := current_setting('request.jwt.claim.sub', true);
  v_email := current_setting('request.jwt.claim.email', true);

  insert into public.webhook_whoami_log(auth_uid, jwt_role, jwt_sub, jwt_email, note)
  values (v_uid, v_role, v_sub, v_email, note);

  return jsonb_build_object(
    'current_user', current_user,
    'auth_uid', v_uid,
    'jwt_role', v_role,
    'jwt_sub', v_sub,
    'jwt_email', v_email
  );
end;
$$;


ALTER FUNCTION "public"."webhook_whoami"("note" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."whoami_probe"() RETURNS "jsonb"
    LANGUAGE "sql" STABLE
    AS $$
  select jsonb_build_object(
    'current_user', current_user,
    'auth_uid', auth.uid(),
    'auth_role', auth.role(),
    'jwt_claims', coalesce(current_setting('request.jwt.claims', true)::jsonb, '{}'::jsonb)
  );
$$;


ALTER FUNCTION "public"."whoami_probe"() OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."_service_role_canary" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "note" "text"
);


ALTER TABLE "public"."_service_role_canary" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."_service_role_canary_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."_service_role_canary_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."_service_role_canary_id_seq" OWNED BY "public"."_service_role_canary"."id";



CREATE TABLE IF NOT EXISTS "public"."cart_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "customer_id" "uuid" NOT NULL,
    "pack_id" "uuid",
    "product_id" "uuid",
    "quantity" integer DEFAULT 1 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "company_id" "uuid",
    CONSTRAINT "cart_item_has_product" CHECK ((("pack_id" IS NOT NULL) OR ("product_id" IS NOT NULL)))
);

ALTER TABLE ONLY "public"."cart_items" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."cart_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."categories" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "description" "text",
    "icon" "text",
    "color" "text",
    "parent_id" "uuid",
    "sort_order" integer DEFAULT 0,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE ONLY "public"."categories" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."categories" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."checkout_requests" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "kind" "text" NOT NULL,
    "ref_id" "uuid" NOT NULL,
    "status" "text" DEFAULT 'created'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "stripe_session_id" "text",
    "stripe_payment_intent_id" "text",
    "amount_cents" integer,
    "currency" "text" DEFAULT 'eur'::"text",
    "paid_at" timestamp with time zone,
    "amount_total" integer,
    "payload" "jsonb" DEFAULT '{}'::"jsonb",
    "error" "text",
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "checkout_requests_kind_check" CHECK (("kind" = ANY (ARRAY['route'::"text", 'pack'::"text"]))),
    CONSTRAINT "checkout_requests_status_check" CHECK (("status" = ANY (ARRAY['created'::"text", 'processing'::"text", 'paid'::"text", 'canceled'::"text", 'failed'::"text"])))
);

ALTER TABLE ONLY "public"."checkout_requests" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."checkout_requests" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."companies" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "business_name" "text" NOT NULL,
    "contact_person" "text" NOT NULL,
    "email" "text" NOT NULL,
    "phone" "text",
    "address" "text",
    "description" "text",
    "authenticity_story" "text",
    "status" "text" DEFAULT 'pending'::"text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "region_id" "uuid",
    "category_id" "uuid",
    "logo_url" "text",
    "cover_image_url" "text",
    "website" "text",
    "social_media" "jsonb" DEFAULT '{}'::"jsonb",
    "latitude" numeric,
    "longitude" numeric,
    "avg_rating" numeric DEFAULT 0,
    "total_reviews" integer DEFAULT 0,
    "stripe_account_id" "text",
    "stripe_onboarding_status" "text" DEFAULT 'not_started'::"text",
    "stripe_charges_enabled" boolean DEFAULT false,
    "stripe_payouts_enabled" boolean DEFAULT false,
    "stripe_details_submitted" boolean DEFAULT false,
    "stripe_connected_at" timestamp with time zone,
    "stripe_onboarded_at" timestamp with time zone,
    "slug" "text",
    CONSTRAINT "companies_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'approved'::"text", 'rejected'::"text"]))),
    CONSTRAINT "companies_stripe_account_id_format" CHECK ((("stripe_account_id" IS NULL) OR ("stripe_account_id" ~ '^acct_[A-Za-z0-9]+$'::"text")))
);

ALTER TABLE ONLY "public"."companies" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."companies" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."companies_public" AS
 SELECT "id",
    "business_name",
    "slug",
    "description",
    "authenticity_story",
    "logo_url",
    "cover_image_url",
    "website",
    "social_media",
    "latitude",
    "longitude",
    "avg_rating",
    "total_reviews",
    "region_id",
    "category_id"
   FROM "public"."companies" "c"
  WHERE ("upper"(COALESCE("status", ''::"text")) = ANY (ARRAY['APPROVED'::"text", 'APROVVED'::"text"]));


ALTER VIEW "public"."companies_public" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."company_packs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "company_id" "uuid",
    "template_id" "uuid",
    "title" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "status" "text" DEFAULT 'draft'::"text",
    "price" numeric(10,2),
    "shipping_policy" "text",
    "sustainability_info" "text",
    "tags" "text"[] DEFAULT '{}'::"text"[],
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text",
    "is_active" boolean DEFAULT true NOT NULL,
    "is_published" boolean DEFAULT false NOT NULL,
    "published_at" timestamp with time zone,
    "is_demo" boolean DEFAULT false,
    CONSTRAINT "company_packs_status_check" CHECK (("status" = ANY (ARRAY['draft'::"text", 'published'::"text", 'rejected'::"text"])))
);

ALTER TABLE ONLY "public"."company_packs" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."company_packs" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."company_packs_public" AS
 SELECT "id",
    "company_id",
    "template_id",
    "title",
    "slug",
    "status",
    "price",
    "shipping_policy",
    "sustainability_info",
    "tags",
    "name",
    "is_active",
    "is_published",
    "published_at",
    "created_at",
    "updated_at"
   FROM "public"."company_packs" "p"
  WHERE ((COALESCE("is_published", false) = true) AND (COALESCE("is_active", false) = true) AND (COALESCE("is_demo", false) = false));


ALTER VIEW "public"."company_packs_public" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."company_reviews" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "company_id" "uuid" NOT NULL,
    "customer_id" "uuid",
    "customer_name" "text" NOT NULL,
    "rating" integer NOT NULL,
    "title" "text",
    "comment" "text",
    "is_verified_purchase" boolean DEFAULT false,
    "is_approved" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "company_reviews_rating_check" CHECK ((("rating" >= 1) AND ("rating" <= 5)))
);

ALTER TABLE ONLY "public"."company_reviews" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."company_reviews" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."contact_messages" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "name" "text" NOT NULL,
    "email" "text" NOT NULL,
    "phone" "text",
    "subject" "text",
    "message" "text" NOT NULL,
    "is_read" boolean DEFAULT false,
    "is_resolved" boolean DEFAULT false,
    "resolved_at" timestamp with time zone,
    "resolved_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE ONLY "public"."contact_messages" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."contact_messages" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."customers" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "full_name" "text" NOT NULL,
    "email" "text" NOT NULL,
    "phone" "text",
    "address" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "avatar_url" "text",
    "notification_email" boolean DEFAULT true,
    "notification_sms" boolean DEFAULT false,
    "notification_offers" boolean DEFAULT true,
    "notification_newsletter" boolean DEFAULT true
);

ALTER TABLE ONLY "public"."customers" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."customers" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."customers_safe" WITH ("security_invoker"='on') AS
 SELECT "id",
    "user_id",
    "full_name",
    "created_at",
    "updated_at"
   FROM "public"."customers"
  WHERE ("user_id" = "auth"."uid"());


ALTER VIEW "public"."customers_safe" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."favorite_companies" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "customer_id" "uuid" NOT NULL,
    "company_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE ONLY "public"."favorite_companies" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."favorite_companies" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."favorites" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "customer_id" "uuid" NOT NULL,
    "pack_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE ONLY "public"."favorites" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."favorites" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."notifications" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "type" "public"."notification_type" DEFAULT 'system'::"public"."notification_type" NOT NULL,
    "title" "text" NOT NULL,
    "message" "text",
    "data" "jsonb" DEFAULT '{}'::"jsonb",
    "is_read" boolean DEFAULT false,
    "read_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE ONLY "public"."notifications" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."notifications" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."order_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "order_id" "uuid" NOT NULL,
    "pack_id" "uuid",
    "product_id" "uuid",
    "quantity" integer DEFAULT 1 NOT NULL,
    "unit_price" numeric NOT NULL,
    "total_price" numeric NOT NULL,
    "product_snapshot" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE ONLY "public"."order_items" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."order_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."orders" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "customer_id" "uuid" NOT NULL,
    "pack_id" "uuid",
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "total_amount" numeric NOT NULL,
    "shipping_address" "text" NOT NULL,
    "tracking_number" "text",
    "order_date" timestamp with time zone DEFAULT "now"() NOT NULL,
    "estimated_delivery" "date",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "shipping_address_id" "uuid",
    "payment_method" "text",
    "payment_status" "text" DEFAULT 'pending'::"text",
    "notes" "text",
    "company_id" "uuid",
    "stripe_payment_intent_id" "text",
    "stripe_checkout_session_id" "text"
);

ALTER TABLE ONLY "public"."orders" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."orders" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."pack_analytics" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "pack_id" "uuid",
    "views" integer DEFAULT 0,
    "clicks" integer DEFAULT 0,
    "date" "date" DEFAULT CURRENT_DATE NOT NULL
);

ALTER TABLE ONLY "public"."pack_analytics" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."pack_analytics" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."pack_elements" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "pack_id" "uuid",
    "element_type" "text" NOT NULL,
    "content" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "position" integer DEFAULT 0 NOT NULL,
    "styles" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "pack_elements_element_type_check" CHECK (("element_type" = ANY (ARRAY['image'::"text", 'video'::"text", 'text'::"text", 'price'::"text", 'button'::"text", 'file'::"text", 'reviews'::"text", 'tags'::"text"])))
);

ALTER TABLE ONLY "public"."pack_elements" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."pack_elements" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."pack_payments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "order_id" "uuid" NOT NULL,
    "company_id" "uuid" NOT NULL,
    "stripe_checkout_session_id" "text",
    "stripe_payment_intent_id" "text",
    "stripe_account_id" "text",
    "amount" numeric DEFAULT 0 NOT NULL,
    "currency" "text" DEFAULT 'eur'::"text" NOT NULL,
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "pack_payments_acct_format" CHECK ((("stripe_account_id" IS NULL) OR ("stripe_account_id" ~ '^acct_[A-Za-z0-9]+$'::"text"))),
    CONSTRAINT "pack_payments_cs_format" CHECK ((("stripe_checkout_session_id" IS NULL) OR ("stripe_checkout_session_id" ~ '^cs_[A-Za-z0-9]+$'::"text"))),
    CONSTRAINT "pack_payments_pi_format" CHECK ((("stripe_payment_intent_id" IS NULL) OR ("stripe_payment_intent_id" ~ '^pi_[A-Za-z0-9]+$'::"text")))
);

ALTER TABLE ONLY "public"."pack_payments" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."pack_payments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."pack_products" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "pack_id" "uuid" NOT NULL,
    "product_id" "uuid" NOT NULL,
    "quantity" integer DEFAULT 1,
    "position" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE ONLY "public"."pack_products" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."pack_products" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."pack_reviews" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "pack_id" "uuid",
    "customer_name" "text" NOT NULL,
    "rating" integer NOT NULL,
    "comment" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "customer_id" "uuid",
    CONSTRAINT "pack_reviews_rating_check" CHECK ((("rating" >= 1) AND ("rating" <= 5)))
);

ALTER TABLE ONLY "public"."pack_reviews" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."pack_reviews" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."pack_templates" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "type" "text" NOT NULL,
    "color" "text" NOT NULL,
    "description" "text",
    "requirements" "jsonb" DEFAULT '[]'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "pack_templates_type_check" CHECK (("type" = ANY (ARRAY['raiz'::"text", 'esencia'::"text", 'gourmet'::"text"])))
);

ALTER TABLE ONLY "public"."pack_templates" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."pack_templates" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."products" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "company_id" "uuid" NOT NULL,
    "category_id" "uuid",
    "name" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "description" "text",
    "short_description" "text",
    "price" numeric,
    "weight" "text",
    "origin" "text",
    "attributes" "jsonb" DEFAULT '[]'::"jsonb",
    "images" "jsonb" DEFAULT '[]'::"jsonb",
    "is_available" boolean DEFAULT true,
    "stock_quantity" integer,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE ONLY "public"."products" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."products" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    "role" "text" DEFAULT 'consumer'::"text" NOT NULL,
    "company_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE ONLY "public"."profiles" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."promotional_codes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "code" character varying(50) NOT NULL,
    "discount_type" character varying(20) NOT NULL,
    "discount_value" numeric(10,2) NOT NULL,
    "min_order_amount" numeric(10,2) DEFAULT 0,
    "max_uses" integer,
    "current_uses" integer DEFAULT 0,
    "valid_from" timestamp with time zone DEFAULT "now"(),
    "valid_until" timestamp with time zone,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_by" "uuid",
    CONSTRAINT "check_max_uses" CHECK ((("max_uses" IS NULL) OR ("current_uses" <= "max_uses"))),
    CONSTRAINT "promotional_codes_discount_type_check" CHECK ((("discount_type")::"text" = ANY ((ARRAY['percentage'::character varying, 'fixed'::character varying])::"text"[])))
);

ALTER TABLE ONLY "public"."promotional_codes" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."promotional_codes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."regions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "description" "text",
    "coordinates" "jsonb",
    "image_url" "text",
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE ONLY "public"."regions" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."regions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."route_access" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "route_id" "uuid" NOT NULL,
    "valid_from" timestamp with time zone DEFAULT "now"() NOT NULL,
    "valid_until" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE ONLY "public"."route_access" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."route_access" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."route_company_packs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "route_id" "uuid" NOT NULL,
    "company_pack_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE ONLY "public"."route_company_packs" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."route_company_packs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."route_purchases" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "customer_id" "uuid" NOT NULL,
    "route_id" "uuid" NOT NULL,
    "num_people" integer DEFAULT 1 NOT NULL,
    "base_price" numeric(10,2) NOT NULL,
    "discount_percent" numeric(5,2) DEFAULT 0,
    "final_price" numeric(10,2) NOT NULL,
    "stripe_payment_intent_id" "text",
    "payment_status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "purchased_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "route_purchases_pi_format" CHECK ((("stripe_payment_intent_id" IS NULL) OR ("stripe_payment_intent_id" ~ '^pi_[A-Za-z0-9]+$'::"text"))),
    CONSTRAINT "route_purchases_stripe_payment_intent_id_chk" CHECK ((("stripe_payment_intent_id" IS NULL) OR ("length"("stripe_payment_intent_id") >= 10)))
);

ALTER TABLE ONLY "public"."route_purchases" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."route_purchases" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."route_stops" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "route_id" "uuid" NOT NULL,
    "company_id" "uuid",
    "name" "text" NOT NULL,
    "type" "text",
    "type_icon" "text",
    "description" "text",
    "what_to_do" "jsonb" DEFAULT '[]'::"jsonb",
    "address" "text",
    "schedule" "text",
    "latitude" numeric,
    "longitude" numeric,
    "images" "jsonb" DEFAULT '[]'::"jsonb",
    "highlights" "jsonb" DEFAULT '[]'::"jsonb",
    "external_link" "text",
    "position" integer DEFAULT 1 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "is_premium" boolean DEFAULT false,
    "created_by" "uuid" DEFAULT "auth"."uid"() NOT NULL,
    CONSTRAINT "route_stops_position_check" CHECK (("position" >= 1)),
    CONSTRAINT "route_stops_position_positive" CHECK (("position" > 0))
);

ALTER TABLE ONLY "public"."route_stops" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."route_stops" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."routes_public" AS
 SELECT "id",
    "region_id",
    "title",
    "slug",
    "description",
    "narrative",
    "duration",
    "difficulty",
    "image_url",
    "is_featured",
    "total_stops",
    "avg_rating",
    "total_participants",
    "practical_info",
    "daily_recommendations",
    "base_price_per_person",
    "created_at",
    "updated_at"
   FROM "public"."routes" "r"
  WHERE ((COALESCE("is_public", false) = true) AND (COALESCE("is_active", false) = true) AND (COALESCE("is_demo", false) = false));


ALTER VIEW "public"."routes_public" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."saved_routes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "customer_id" "uuid" NOT NULL,
    "route_id" "uuid" NOT NULL,
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE ONLY "public"."saved_routes" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."saved_routes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."shipping_addresses" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "customer_id" "uuid" NOT NULL,
    "label" "text" DEFAULT 'Casa'::"text",
    "full_name" "text" NOT NULL,
    "street_address" "text" NOT NULL,
    "city" "text" NOT NULL,
    "province" "text" NOT NULL,
    "postal_code" "text" NOT NULL,
    "country" "text" DEFAULT 'España'::"text",
    "phone" "text",
    "is_default" boolean DEFAULT false,
    "instructions" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE ONLY "public"."shipping_addresses" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."shipping_addresses" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."stop_company_packs" (
    "stop_id" "uuid" NOT NULL,
    "company_pack_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE ONLY "public"."stop_company_packs" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."stop_company_packs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_roles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "role" "public"."app_role" DEFAULT 'user'::"public"."app_role" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE ONLY "public"."user_roles" FORCE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_roles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."webhook_context_log" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "source" "text" DEFAULT 'unknown'::"text" NOT NULL,
    "db_user" "text",
    "jwt_role" "text",
    "jwt_sub" "text",
    "auth_uid" "uuid"
);


ALTER TABLE "public"."webhook_context_log" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."webhook_context_log_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."webhook_context_log_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."webhook_context_log_id_seq" OWNED BY "public"."webhook_context_log"."id";



CREATE TABLE IF NOT EXISTS "public"."webhook_whoami_log" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "current_user_name" "text" DEFAULT CURRENT_USER NOT NULL,
    "auth_uid" "uuid",
    "jwt_role" "text",
    "jwt_sub" "text",
    "jwt_email" "text",
    "note" "text"
);


ALTER TABLE "public"."webhook_whoami_log" OWNER TO "postgres";


ALTER TABLE "public"."webhook_whoami_log" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."webhook_whoami_log_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE ONLY "public"."_service_role_canary" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."_service_role_canary_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."webhook_context_log" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."webhook_context_log_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."_service_role_canary"
    ADD CONSTRAINT "_service_role_canary_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."cart_items"
    ADD CONSTRAINT "cart_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."checkout_requests"
    ADD CONSTRAINT "checkout_requests_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."companies"
    ADD CONSTRAINT "companies_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."company_packs"
    ADD CONSTRAINT "company_packs_company_id_slug_key" UNIQUE ("company_id", "slug");



ALTER TABLE ONLY "public"."company_packs"
    ADD CONSTRAINT "company_packs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."company_packs"
    ADD CONSTRAINT "company_packs_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."company_reviews"
    ADD CONSTRAINT "company_reviews_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."contact_messages"
    ADD CONSTRAINT "contact_messages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."customers"
    ADD CONSTRAINT "customers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."customers"
    ADD CONSTRAINT "customers_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."favorite_companies"
    ADD CONSTRAINT "favorite_companies_customer_id_company_id_key" UNIQUE ("customer_id", "company_id");



ALTER TABLE ONLY "public"."favorite_companies"
    ADD CONSTRAINT "favorite_companies_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."favorites"
    ADD CONSTRAINT "favorites_customer_id_pack_id_key" UNIQUE ("customer_id", "pack_id");



ALTER TABLE ONLY "public"."favorites"
    ADD CONSTRAINT "favorites_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."pack_analytics"
    ADD CONSTRAINT "pack_analytics_pack_id_date_key" UNIQUE ("pack_id", "date");



ALTER TABLE ONLY "public"."pack_analytics"
    ADD CONSTRAINT "pack_analytics_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."pack_elements"
    ADD CONSTRAINT "pack_elements_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."pack_payments"
    ADD CONSTRAINT "pack_payments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."pack_products"
    ADD CONSTRAINT "pack_products_pack_id_product_id_key" UNIQUE ("pack_id", "product_id");



ALTER TABLE ONLY "public"."pack_products"
    ADD CONSTRAINT "pack_products_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."pack_reviews"
    ADD CONSTRAINT "pack_reviews_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."pack_templates"
    ADD CONSTRAINT "pack_templates_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_company_id_slug_key" UNIQUE ("company_id", "slug");



ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."promotional_codes"
    ADD CONSTRAINT "promotional_codes_code_key" UNIQUE ("code");



ALTER TABLE ONLY "public"."promotional_codes"
    ADD CONSTRAINT "promotional_codes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."regions"
    ADD CONSTRAINT "regions_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."regions"
    ADD CONSTRAINT "regions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."regions"
    ADD CONSTRAINT "regions_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."route_access"
    ADD CONSTRAINT "route_access_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."route_access"
    ADD CONSTRAINT "route_access_user_id_route_id_key" UNIQUE ("user_id", "route_id");



ALTER TABLE ONLY "public"."route_company_packs"
    ADD CONSTRAINT "route_company_packs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."route_company_packs"
    ADD CONSTRAINT "route_company_packs_route_id_company_pack_id_key" UNIQUE ("route_id", "company_pack_id");



ALTER TABLE ONLY "public"."route_company_packs"
    ADD CONSTRAINT "route_company_packs_route_pack_key" UNIQUE ("route_id", "company_pack_id");



ALTER TABLE ONLY "public"."route_purchases"
    ADD CONSTRAINT "route_purchases_customer_id_route_id_key" UNIQUE ("customer_id", "route_id");



ALTER TABLE ONLY "public"."route_purchases"
    ADD CONSTRAINT "route_purchases_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."route_stops"
    ADD CONSTRAINT "route_stops_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."route_stops"
    ADD CONSTRAINT "route_stops_route_name_key" UNIQUE ("route_id", "name");



ALTER TABLE ONLY "public"."route_stops"
    ADD CONSTRAINT "route_stops_route_position_key" UNIQUE ("route_id", "position");



ALTER TABLE ONLY "public"."routes"
    ADD CONSTRAINT "routes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."routes"
    ADD CONSTRAINT "routes_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."saved_routes"
    ADD CONSTRAINT "saved_routes_customer_id_route_id_key" UNIQUE ("customer_id", "route_id");



ALTER TABLE ONLY "public"."saved_routes"
    ADD CONSTRAINT "saved_routes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."shipping_addresses"
    ADD CONSTRAINT "shipping_addresses_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."stop_company_packs"
    ADD CONSTRAINT "stop_company_packs_pkey" PRIMARY KEY ("stop_id", "company_pack_id");



ALTER TABLE ONLY "public"."stop_company_packs"
    ADD CONSTRAINT "stop_company_packs_stop_pack_key" UNIQUE ("stop_id", "company_pack_id");



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_user_id_role_key" UNIQUE ("user_id", "role");



ALTER TABLE ONLY "public"."webhook_context_log"
    ADD CONSTRAINT "webhook_context_log_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."webhook_whoami_log"
    ADD CONSTRAINT "webhook_whoami_log_pkey" PRIMARY KEY ("id");



CREATE UNIQUE INDEX "checkout_requests_one_open_per_item" ON "public"."checkout_requests" USING "btree" ("user_id", "kind", "ref_id") WHERE ("status" = ANY (ARRAY['created'::"text", 'processing'::"text"]));



CREATE UNIQUE INDEX "checkout_requests_stripe_session_id_uq" ON "public"."checkout_requests" USING "btree" ("stripe_session_id");



CREATE UNIQUE INDEX "checkout_requests_stripe_session_uidx" ON "public"."checkout_requests" USING "btree" ("stripe_session_id") WHERE ("stripe_session_id" IS NOT NULL);



CREATE INDEX "checkout_requests_user_created_idx" ON "public"."checkout_requests" USING "btree" ("user_id", "created_at" DESC);



CREATE UNIQUE INDEX "companies_slug_unique" ON "public"."companies" USING "btree" ("slug") WHERE ("slug" IS NOT NULL);



CREATE INDEX "companies_stripe_account_id_idx" ON "public"."companies" USING "btree" ("stripe_account_id");



CREATE UNIQUE INDEX "company_packs_name_uq" ON "public"."company_packs" USING "btree" ("name") WHERE ("name" IS NOT NULL);



CREATE INDEX "idx_cart_items_customer" ON "public"."cart_items" USING "btree" ("customer_id");



CREATE INDEX "idx_cart_items_customer_company" ON "public"."cart_items" USING "btree" ("customer_id", "company_id");



CREATE INDEX "idx_company_packs_active" ON "public"."company_packs" USING "btree" ("is_active");



CREATE INDEX "idx_company_packs_company_id" ON "public"."company_packs" USING "btree" ("company_id");



CREATE INDEX "idx_company_reviews_company" ON "public"."company_reviews" USING "btree" ("company_id");



CREATE INDEX "idx_customers_notification_email" ON "public"."customers" USING "btree" ("notification_email") WHERE ("notification_email" = true);



CREATE INDEX "idx_customers_notification_newsletter" ON "public"."customers" USING "btree" ("notification_newsletter") WHERE ("notification_newsletter" = true);



CREATE INDEX "idx_notifications_user" ON "public"."notifications" USING "btree" ("user_id", "is_read");



CREATE INDEX "idx_orders_company" ON "public"."orders" USING "btree" ("company_id");



CREATE INDEX "idx_orders_customer" ON "public"."orders" USING "btree" ("customer_id");



CREATE INDEX "idx_products_category" ON "public"."products" USING "btree" ("category_id");



CREATE INDEX "idx_products_company" ON "public"."products" USING "btree" ("company_id");



CREATE INDEX "idx_promo_codes_code" ON "public"."promotional_codes" USING "btree" ("code");



CREATE INDEX "idx_route_access_route_id" ON "public"."route_access" USING "btree" ("route_id");



CREATE INDEX "idx_route_access_user_id" ON "public"."route_access" USING "btree" ("user_id");



CREATE INDEX "idx_route_company_packs_company_pack_id" ON "public"."route_company_packs" USING "btree" ("company_pack_id");



CREATE INDEX "idx_route_company_packs_pack_id" ON "public"."route_company_packs" USING "btree" ("company_pack_id");



CREATE INDEX "idx_route_company_packs_route_id" ON "public"."route_company_packs" USING "btree" ("route_id");



CREATE INDEX "idx_route_purchases_customer" ON "public"."route_purchases" USING "btree" ("customer_id");



CREATE INDEX "idx_route_purchases_route" ON "public"."route_purchases" USING "btree" ("route_id");



CREATE INDEX "idx_route_purchases_status" ON "public"."route_purchases" USING "btree" ("payment_status");



CREATE INDEX "idx_route_stops_created_by" ON "public"."route_stops" USING "btree" ("created_by");



CREATE INDEX "idx_route_stops_position" ON "public"."route_stops" USING "btree" ("route_id", "position");



CREATE INDEX "idx_route_stops_route" ON "public"."route_stops" USING "btree" ("route_id");



CREATE INDEX "idx_route_stops_route_id" ON "public"."route_stops" USING "btree" ("route_id");



CREATE INDEX "idx_route_stops_route_id_position" ON "public"."route_stops" USING "btree" ("route_id", "position");



CREATE INDEX "idx_routes_created_by" ON "public"."routes" USING "btree" ("created_by");



CREATE INDEX "idx_routes_creator" ON "public"."routes" USING "btree" ("creator_id");



CREATE INDEX "idx_routes_is_active" ON "public"."routes" USING "btree" ("is_active");



CREATE INDEX "idx_routes_region" ON "public"."routes" USING "btree" ("region_id");



CREATE INDEX "idx_stop_company_packs_company_pack_id" ON "public"."stop_company_packs" USING "btree" ("company_pack_id");



CREATE INDEX "idx_stop_company_packs_pack_id" ON "public"."stop_company_packs" USING "btree" ("company_pack_id");



CREATE INDEX "idx_stop_company_packs_stop_id" ON "public"."stop_company_packs" USING "btree" ("stop_id");



CREATE INDEX "ix_companies_stripe_account" ON "public"."companies" USING "btree" ("stripe_account_id");



CREATE INDEX "pack_payments_company_id_idx" ON "public"."pack_payments" USING "btree" ("company_id");



CREATE INDEX "pack_payments_order_id_idx" ON "public"."pack_payments" USING "btree" ("order_id");



CREATE INDEX "pack_payments_stripe_pi_idx" ON "public"."pack_payments" USING "btree" ("stripe_payment_intent_id");



CREATE INDEX "pack_payments_stripe_session_idx" ON "public"."pack_payments" USING "btree" ("stripe_checkout_session_id");



CREATE INDEX "profiles_company_id_idx" ON "public"."profiles" USING "btree" ("company_id");



CREATE UNIQUE INDEX "route_access_unique_user_route" ON "public"."route_access" USING "btree" ("user_id", "route_id");



CREATE INDEX "route_company_packs_company_pack_id_idx" ON "public"."route_company_packs" USING "btree" ("company_pack_id");



CREATE INDEX "route_company_packs_route_id_idx" ON "public"."route_company_packs" USING "btree" ("route_id");



CREATE UNIQUE INDEX "route_purchases_unique_user_route" ON "public"."route_purchases" USING "btree" ("customer_id", "route_id");



CREATE INDEX "route_stops_route_id_idx" ON "public"."route_stops" USING "btree" ("route_id");



CREATE INDEX "route_stops_route_id_position_idx" ON "public"."route_stops" USING "btree" ("route_id", "position");



CREATE INDEX "stop_company_packs_company_pack_id_idx" ON "public"."stop_company_packs" USING "btree" ("company_pack_id");



CREATE INDEX "stop_company_packs_stop_id_idx" ON "public"."stop_company_packs" USING "btree" ("stop_id");



CREATE UNIQUE INDEX "ux_pack_payments_cs" ON "public"."pack_payments" USING "btree" ("stripe_checkout_session_id") WHERE ("stripe_checkout_session_id" IS NOT NULL);



CREATE UNIQUE INDEX "ux_pack_payments_pi" ON "public"."pack_payments" USING "btree" ("stripe_payment_intent_id") WHERE ("stripe_payment_intent_id" IS NOT NULL);



CREATE UNIQUE INDEX "ux_route_purchases_pi" ON "public"."route_purchases" USING "btree" ("stripe_payment_intent_id") WHERE ("stripe_payment_intent_id" IS NOT NULL);



CREATE OR REPLACE TRIGGER "trg_block_stripe_account_id_update" BEFORE UPDATE ON "public"."companies" FOR EACH ROW EXECUTE FUNCTION "public"."block_stripe_account_id_update"();



CREATE OR REPLACE TRIGGER "trg_fill_created_by_routes" BEFORE INSERT ON "public"."routes" FOR EACH ROW EXECUTE FUNCTION "public"."fill_created_by"();



CREATE OR REPLACE TRIGGER "trg_validate_checkout_ref" BEFORE INSERT OR UPDATE OF "kind", "ref_id" ON "public"."checkout_requests" FOR EACH ROW EXECUTE FUNCTION "public"."validate_checkout_ref"();



CREATE OR REPLACE TRIGGER "update_cart_items_updated_at" BEFORE UPDATE ON "public"."cart_items" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_companies_updated_at" BEFORE UPDATE ON "public"."companies" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_company_packs_updated_at" BEFORE UPDATE ON "public"."company_packs" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_customers_updated_at" BEFORE UPDATE ON "public"."customers" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_orders_updated_at" BEFORE UPDATE ON "public"."orders" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_pack_elements_updated_at" BEFORE UPDATE ON "public"."pack_elements" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_products_updated_at" BEFORE UPDATE ON "public"."products" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_routes_updated_at" BEFORE UPDATE ON "public"."routes" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_shipping_addresses_updated_at" BEFORE UPDATE ON "public"."shipping_addresses" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "public"."cart_items"
    ADD CONSTRAINT "cart_items_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."cart_items"
    ADD CONSTRAINT "cart_items_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."cart_items"
    ADD CONSTRAINT "cart_items_pack_id_fkey" FOREIGN KEY ("pack_id") REFERENCES "public"."company_packs"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."cart_items"
    ADD CONSTRAINT "cart_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id");



ALTER TABLE ONLY "public"."companies"
    ADD CONSTRAINT "companies_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id");



ALTER TABLE ONLY "public"."companies"
    ADD CONSTRAINT "companies_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id");



ALTER TABLE ONLY "public"."companies"
    ADD CONSTRAINT "companies_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."company_packs"
    ADD CONSTRAINT "company_packs_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."company_packs"
    ADD CONSTRAINT "company_packs_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "public"."pack_templates"("id");



ALTER TABLE ONLY "public"."company_reviews"
    ADD CONSTRAINT "company_reviews_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."company_reviews"
    ADD CONSTRAINT "company_reviews_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."contact_messages"
    ADD CONSTRAINT "contact_messages_resolved_by_fkey" FOREIGN KEY ("resolved_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."contact_messages"
    ADD CONSTRAINT "contact_messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."customers"
    ADD CONSTRAINT "customers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."favorite_companies"
    ADD CONSTRAINT "favorite_companies_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."favorite_companies"
    ADD CONSTRAINT "favorite_companies_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."favorites"
    ADD CONSTRAINT "favorites_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."favorites"
    ADD CONSTRAINT "favorites_pack_id_fkey" FOREIGN KEY ("pack_id") REFERENCES "public"."company_packs"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_pack_id_fkey" FOREIGN KEY ("pack_id") REFERENCES "public"."company_packs"("id");



ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id");



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id");



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_pack_id_fkey" FOREIGN KEY ("pack_id") REFERENCES "public"."company_packs"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_shipping_address_id_fkey" FOREIGN KEY ("shipping_address_id") REFERENCES "public"."shipping_addresses"("id");



ALTER TABLE ONLY "public"."pack_analytics"
    ADD CONSTRAINT "pack_analytics_pack_id_fkey" FOREIGN KEY ("pack_id") REFERENCES "public"."company_packs"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."pack_elements"
    ADD CONSTRAINT "pack_elements_pack_id_fkey" FOREIGN KEY ("pack_id") REFERENCES "public"."company_packs"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."pack_payments"
    ADD CONSTRAINT "pack_payments_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."pack_payments"
    ADD CONSTRAINT "pack_payments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."pack_products"
    ADD CONSTRAINT "pack_products_pack_id_fkey" FOREIGN KEY ("pack_id") REFERENCES "public"."company_packs"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."pack_products"
    ADD CONSTRAINT "pack_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."pack_reviews"
    ADD CONSTRAINT "pack_reviews_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id");



ALTER TABLE ONLY "public"."pack_reviews"
    ADD CONSTRAINT "pack_reviews_pack_id_fkey" FOREIGN KEY ("pack_id") REFERENCES "public"."company_packs"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id");



ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."promotional_codes"
    ADD CONSTRAINT "promotional_codes_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."route_access"
    ADD CONSTRAINT "route_access_route_id_fkey" FOREIGN KEY ("route_id") REFERENCES "public"."routes"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."route_company_packs"
    ADD CONSTRAINT "route_company_packs_company_pack_id_fkey" FOREIGN KEY ("company_pack_id") REFERENCES "public"."company_packs"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."route_company_packs"
    ADD CONSTRAINT "route_company_packs_route_id_fkey" FOREIGN KEY ("route_id") REFERENCES "public"."routes"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."route_purchases"
    ADD CONSTRAINT "route_purchases_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."route_purchases"
    ADD CONSTRAINT "route_purchases_route_id_fkey" FOREIGN KEY ("route_id") REFERENCES "public"."routes"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."route_stops"
    ADD CONSTRAINT "route_stops_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."route_stops"
    ADD CONSTRAINT "route_stops_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."route_stops"
    ADD CONSTRAINT "route_stops_route_id_fkey" FOREIGN KEY ("route_id") REFERENCES "public"."routes"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."routes"
    ADD CONSTRAINT "routes_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."routes"
    ADD CONSTRAINT "routes_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."routes"
    ADD CONSTRAINT "routes_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id");



ALTER TABLE ONLY "public"."saved_routes"
    ADD CONSTRAINT "saved_routes_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."saved_routes"
    ADD CONSTRAINT "saved_routes_route_id_fkey" FOREIGN KEY ("route_id") REFERENCES "public"."routes"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."shipping_addresses"
    ADD CONSTRAINT "shipping_addresses_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."stop_company_packs"
    ADD CONSTRAINT "stop_company_packs_company_pack_id_fkey" FOREIGN KEY ("company_pack_id") REFERENCES "public"."company_packs"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."stop_company_packs"
    ADD CONSTRAINT "stop_company_packs_stop_id_fkey" FOREIGN KEY ("stop_id") REFERENCES "public"."route_stops"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_roles"
    ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Admins can manage all roles" ON "public"."user_roles" USING ("public"."has_role"("auth"."uid"(), 'admin'::"public"."app_role"));



CREATE POLICY "Admins can manage categories" ON "public"."categories" USING ("public"."has_role"("auth"."uid"(), 'admin'::"public"."app_role"));



CREATE POLICY "Admins can manage promo codes" ON "public"."promotional_codes" USING ("public"."has_role"("auth"."uid"(), 'admin'::"public"."app_role")) WITH CHECK ("public"."has_role"("auth"."uid"(), 'admin'::"public"."app_role"));



CREATE POLICY "Admins can manage regions" ON "public"."regions" USING ("public"."has_role"("auth"."uid"(), 'admin'::"public"."app_role"));



CREATE POLICY "Admins can view all messages" ON "public"."contact_messages" FOR SELECT USING ("public"."has_role"("auth"."uid"(), 'admin'::"public"."app_role"));



CREATE POLICY "Anyone can create contact messages with valid data" ON "public"."contact_messages" FOR INSERT WITH CHECK ((("name" IS NOT NULL) AND ("email" IS NOT NULL) AND ("message" IS NOT NULL) AND ("length"("name") > 0) AND ("length"("email") > 0) AND ("length"("message") > 0)));



CREATE POLICY "Anyone can view active categories" ON "public"."categories" FOR SELECT USING (("is_active" = true));



CREATE POLICY "Anyone can view active regions" ON "public"."regions" FOR SELECT USING (("is_active" = true));



CREATE POLICY "Anyone can view approved reviews" ON "public"."company_reviews" FOR SELECT USING (("is_approved" = true));



CREATE POLICY "Anyone can view available products" ON "public"."products" FOR SELECT USING (("is_available" = true));



CREATE POLICY "Anyone can view pack products of published packs" ON "public"."pack_products" FOR SELECT USING (("pack_id" IN ( SELECT "company_packs"."id"
   FROM "public"."company_packs"
  WHERE ("company_packs"."status" = 'published'::"text"))));



CREATE POLICY "Anyone can view reviews" ON "public"."pack_reviews" FOR SELECT USING (true);



CREATE POLICY "Authenticated users can view templates" ON "public"."pack_templates" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Companies can manage reviews for their packs" ON "public"."pack_reviews" USING (("pack_id" IN ( SELECT "cp"."id"
   FROM ("public"."company_packs" "cp"
     JOIN "public"."companies" "c" ON (("c"."id" = "cp"."company_id")))
  WHERE ("c"."user_id" = "auth"."uid"()))));



CREATE POLICY "Companies can manage their pack elements" ON "public"."pack_elements" USING (("pack_id" IN ( SELECT "cp"."id"
   FROM ("public"."company_packs" "cp"
     JOIN "public"."companies" "c" ON (("c"."id" = "cp"."company_id")))
  WHERE ("c"."user_id" = "auth"."uid"()))));



CREATE POLICY "Companies can manage their pack products" ON "public"."pack_products" USING (("pack_id" IN ( SELECT "cp"."id"
   FROM ("public"."company_packs" "cp"
     JOIN "public"."companies" "c" ON (("c"."id" = "cp"."company_id")))
  WHERE ("c"."user_id" = "auth"."uid"()))));



CREATE POLICY "Companies can manage their products" ON "public"."products" USING (("company_id" IN ( SELECT "companies"."id"
   FROM "public"."companies"
  WHERE ("companies"."user_id" = "auth"."uid"()))));



CREATE POLICY "Companies can view order items of their products" ON "public"."order_items" FOR SELECT USING (("pack_id" IN ( SELECT "cp"."id"
   FROM ("public"."company_packs" "cp"
     JOIN "public"."companies" "c" ON (("c"."id" = "cp"."company_id")))
  WHERE ("c"."user_id" = "auth"."uid"()))));



CREATE POLICY "Companies can view orders of their products" ON "public"."orders" FOR SELECT USING (("company_id" IN ( SELECT "companies"."id"
   FROM "public"."companies"
  WHERE ("companies"."user_id" = "auth"."uid"()))));



CREATE POLICY "Companies can view their pack analytics" ON "public"."pack_analytics" FOR SELECT USING (("pack_id" IN ( SELECT "cp"."id"
   FROM ("public"."company_packs" "cp"
     JOIN "public"."companies" "c" ON (("c"."id" = "cp"."company_id")))
  WHERE ("c"."user_id" = "auth"."uid"()))));



CREATE POLICY "Customers can create orders" ON "public"."orders" FOR INSERT WITH CHECK (("customer_id" IN ( SELECT "customers"."id"
   FROM "public"."customers"
  WHERE ("customers"."user_id" = "auth"."uid"()))));



CREATE POLICY "Customers can create reviews" ON "public"."company_reviews" FOR INSERT WITH CHECK (("customer_id" IN ( SELECT "customers"."id"
   FROM "public"."customers"
  WHERE ("customers"."user_id" = "auth"."uid"()))));



CREATE POLICY "Customers can create reviews" ON "public"."pack_reviews" FOR INSERT WITH CHECK (("customer_id" IN ( SELECT "customers"."id"
   FROM "public"."customers"
  WHERE ("customers"."user_id" = "auth"."uid"()))));



CREATE POLICY "Customers can delete their reviews" ON "public"."pack_reviews" FOR DELETE USING (("customer_id" IN ( SELECT "customers"."id"
   FROM "public"."customers"
  WHERE ("customers"."user_id" = "auth"."uid"()))));



CREATE POLICY "Customers can manage their reviews" ON "public"."pack_reviews" FOR UPDATE USING (("customer_id" IN ( SELECT "customers"."id"
   FROM "public"."customers"
  WHERE ("customers"."user_id" = "auth"."uid"()))));



CREATE POLICY "Customers can update their own reviews" ON "public"."company_reviews" FOR UPDATE USING (("customer_id" IN ( SELECT "customers"."id"
   FROM "public"."customers"
  WHERE ("customers"."user_id" = "auth"."uid"()))));



CREATE POLICY "Public can view published pack elements" ON "public"."pack_elements" FOR SELECT USING (("pack_id" IN ( SELECT "company_packs"."id"
   FROM "public"."company_packs"
  WHERE ("company_packs"."status" = 'published'::"text"))));



CREATE POLICY "Users can create their own customer data" ON "public"."customers" FOR INSERT WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can create their own favorites" ON "public"."favorites" FOR INSERT WITH CHECK (("customer_id" IN ( SELECT "customers"."id"
   FROM "public"."customers"
  WHERE ("customers"."user_id" = "auth"."uid"()))));



CREATE POLICY "Users can delete their notifications" ON "public"."notifications" FOR DELETE USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can delete their own favorites" ON "public"."favorites" FOR DELETE USING (("customer_id" IN ( SELECT "customers"."id"
   FROM "public"."customers"
  WHERE ("customers"."user_id" = "auth"."uid"()))));



CREATE POLICY "Users can manage stops of their routes" ON "public"."route_stops" USING (("route_id" IN ( SELECT "routes"."id"
   FROM "public"."routes"
  WHERE ("routes"."creator_id" = "auth"."uid"()))));



CREATE POLICY "Users can manage their addresses" ON "public"."shipping_addresses" USING (("customer_id" IN ( SELECT "customers"."id"
   FROM "public"."customers"
  WHERE ("customers"."user_id" = "auth"."uid"()))));



CREATE POLICY "Users can manage their cart" ON "public"."cart_items" USING (("customer_id" IN ( SELECT "customers"."id"
   FROM "public"."customers"
  WHERE ("customers"."user_id" = "auth"."uid"()))));



CREATE POLICY "Users can manage their favorite companies" ON "public"."favorite_companies" USING (("customer_id" IN ( SELECT "customers"."id"
   FROM "public"."customers"
  WHERE ("customers"."user_id" = "auth"."uid"()))));



CREATE POLICY "Users can manage their saved routes" ON "public"."saved_routes" USING (("customer_id" IN ( SELECT "customers"."id"
   FROM "public"."customers"
  WHERE ("customers"."user_id" = "auth"."uid"()))));



CREATE POLICY "Users can update their notifications" ON "public"."notifications" FOR UPDATE USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can update their own customer data" ON "public"."customers" FOR UPDATE USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can view their notifications" ON "public"."notifications" FOR SELECT USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can view their order items" ON "public"."order_items" FOR SELECT USING (("order_id" IN ( SELECT "o"."id"
   FROM ("public"."orders" "o"
     JOIN "public"."customers" "c" ON (("c"."id" = "o"."customer_id")))
  WHERE ("c"."user_id" = "auth"."uid"()))));



CREATE POLICY "Users can view their own customer data" ON "public"."customers" FOR SELECT USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can view their own favorites" ON "public"."favorites" FOR SELECT USING (("customer_id" IN ( SELECT "customers"."id"
   FROM "public"."customers"
  WHERE ("customers"."user_id" = "auth"."uid"()))));



CREATE POLICY "Users can view their own messages" ON "public"."contact_messages" FOR SELECT USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can view their own orders" ON "public"."orders" FOR SELECT USING (("customer_id" IN ( SELECT "customers"."id"
   FROM "public"."customers"
  WHERE ("customers"."user_id" = "auth"."uid"()))));



CREATE POLICY "Users can view their own roles" ON "public"."user_roles" FOR SELECT USING (("user_id" = "auth"."uid"()));



ALTER TABLE "public"."_service_role_canary" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "canary_service_only" ON "public"."_service_role_canary" TO "service_role" USING (true) WITH CHECK (true);



ALTER TABLE "public"."cart_items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."categories" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."checkout_requests" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "checkout_requests_insert_own" ON "public"."checkout_requests" FOR INSERT TO "authenticated" WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "checkout_requests_select_own" ON "public"."checkout_requests" FOR SELECT TO "authenticated" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "checkout_requests_update_own" ON "public"."checkout_requests" FOR UPDATE TO "authenticated" USING (("user_id" = "auth"."uid"())) WITH CHECK (("user_id" = "auth"."uid"()));



ALTER TABLE "public"."companies" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "companies_admin_delete" ON "public"."companies" FOR DELETE TO "authenticated" USING ("public"."is_admin"());



CREATE POLICY "companies_auth_insert_own" ON "public"."companies" FOR INSERT TO "authenticated" WITH CHECK (("public"."is_admin"() OR ("user_id" = "auth"."uid"())));



CREATE POLICY "companies_auth_select_own" ON "public"."companies" FOR SELECT TO "authenticated" USING (("public"."is_admin"() OR ("user_id" = "auth"."uid"())));



CREATE POLICY "companies_auth_update_own" ON "public"."companies" FOR UPDATE TO "authenticated" USING (("public"."is_admin"() OR ("user_id" = "auth"."uid"()))) WITH CHECK (("public"."is_admin"() OR ("user_id" = "auth"."uid"())));



ALTER TABLE "public"."company_packs" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "company_packs_anon_read" ON "public"."company_packs" FOR SELECT TO "anon" USING ((("status" = 'published'::"text") AND ("is_active" = true)));



CREATE POLICY "company_packs_auth_delete" ON "public"."company_packs" FOR DELETE TO "authenticated" USING (("public"."is_admin"() OR "public"."is_company_owner"("company_id")));



CREATE POLICY "company_packs_auth_insert" ON "public"."company_packs" FOR INSERT TO "authenticated" WITH CHECK (("public"."is_admin"() OR "public"."is_company_owner"("company_id")));



CREATE POLICY "company_packs_auth_read" ON "public"."company_packs" FOR SELECT TO "authenticated" USING (((("status" = 'published'::"text") AND ("is_active" = true)) OR "public"."is_admin"() OR "public"."is_company_owner"("company_id")));



CREATE POLICY "company_packs_auth_update" ON "public"."company_packs" FOR UPDATE TO "authenticated" USING (("public"."is_admin"() OR "public"."is_company_owner"("company_id"))) WITH CHECK (("public"."is_admin"() OR "public"."is_company_owner"("company_id")));



CREATE POLICY "company_packs_delete_owner" ON "public"."company_packs" FOR DELETE TO "authenticated" USING (("public"."is_admin"() OR "public"."is_company_owner"("company_id")));



CREATE POLICY "company_packs_insert_owner" ON "public"."company_packs" FOR INSERT TO "authenticated" WITH CHECK (("public"."is_admin"() OR "public"."is_company_owner"("company_id")));



CREATE POLICY "company_packs_owner_read" ON "public"."company_packs" FOR SELECT TO "authenticated" USING (("public"."is_admin"() OR "public"."is_company_owner"("company_id") OR (("status" = 'published'::"text") AND ("is_active" = true))));



CREATE POLICY "company_packs_public_read" ON "public"."company_packs" FOR SELECT TO "authenticated", "anon" USING ((("status" = 'published'::"text") AND ("is_active" = true)));



CREATE POLICY "company_packs_update_owner" ON "public"."company_packs" FOR UPDATE TO "authenticated" USING (("public"."is_admin"() OR "public"."is_company_owner"("company_id"))) WITH CHECK (("public"."is_admin"() OR "public"."is_company_owner"("company_id")));



ALTER TABLE "public"."company_reviews" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."contact_messages" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."customers" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."favorite_companies" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."favorites" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."notifications" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."order_items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."orders" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "orders_insert_own_customer" ON "public"."orders" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."customers" "c"
  WHERE (("c"."id" = "orders"."customer_id") AND ("c"."user_id" = "auth"."uid"())))));



CREATE POLICY "orders_select_own_company" ON "public"."orders" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."companies" "co"
  WHERE (("co"."id" = "orders"."company_id") AND ("co"."user_id" = "auth"."uid"())))));



CREATE POLICY "orders_select_own_customer" ON "public"."orders" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."customers" "c"
  WHERE (("c"."id" = "orders"."customer_id") AND ("c"."user_id" = "auth"."uid"())))));



CREATE POLICY "orders_service_update" ON "public"."orders" FOR UPDATE TO "service_role" USING (true) WITH CHECK (true);



ALTER TABLE "public"."pack_analytics" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."pack_elements" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."pack_payments" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "pack_payments_read_own_company" ON "public"."pack_payments" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."companies" "co"
  WHERE (("co"."id" = "pack_payments"."company_id") AND ("co"."user_id" = "auth"."uid"())))));



CREATE POLICY "pack_payments_read_own_customer" ON "public"."pack_payments" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM ("public"."orders" "o"
     JOIN "public"."customers" "c" ON (("c"."id" = "o"."customer_id")))
  WHERE (("o"."id" = "pack_payments"."order_id") AND ("c"."user_id" = "auth"."uid"())))));



CREATE POLICY "pack_payments_select_company" ON "public"."pack_payments" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."companies" "co"
  WHERE (("co"."id" = "pack_payments"."company_id") AND ("co"."user_id" = "auth"."uid"())))));



CREATE POLICY "pack_payments_select_customer" ON "public"."pack_payments" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM ("public"."orders" "o"
     JOIN "public"."customers" "c" ON (("c"."id" = "o"."customer_id")))
  WHERE (("o"."id" = "pack_payments"."order_id") AND ("c"."user_id" = "auth"."uid"())))));



CREATE POLICY "pack_payments_service_write" ON "public"."pack_payments" TO "service_role" USING (true) WITH CHECK (true);



ALTER TABLE "public"."pack_products" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."pack_reviews" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."pack_templates" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."products" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "profiles_admin_all" ON "public"."profiles" TO "authenticated" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "profiles_insert_own" ON "public"."profiles" FOR INSERT TO "authenticated" WITH CHECK (("id" = "auth"."uid"()));



CREATE POLICY "profiles_select_own" ON "public"."profiles" FOR SELECT TO "authenticated" USING (("id" = "auth"."uid"()));



CREATE POLICY "profiles_update_own" ON "public"."profiles" FOR UPDATE TO "authenticated" USING (("id" = "auth"."uid"())) WITH CHECK (("id" = "auth"."uid"()));



ALTER TABLE "public"."promotional_codes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."regions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."route_access" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "route_access_insert_admin" ON "public"."route_access" FOR INSERT WITH CHECK ("public"."is_admin"());



CREATE POLICY "route_access_read" ON "public"."route_access" FOR SELECT USING (("public"."is_admin"() OR ("user_id" = "auth"."uid"())));



CREATE POLICY "route_access_update_admin" ON "public"."route_access" FOR UPDATE USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



ALTER TABLE "public"."route_company_packs" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "route_company_packs_owner_write" ON "public"."route_company_packs" TO "authenticated" USING ("public"."is_pack_owner"("company_pack_id")) WITH CHECK ("public"."is_pack_owner"("company_pack_id"));



CREATE POLICY "route_company_packs_public_read" ON "public"."route_company_packs" FOR SELECT TO "authenticated", "anon" USING ((EXISTS ( SELECT 1
   FROM "public"."company_packs" "cp"
  WHERE (("cp"."id" = "route_company_packs"."company_pack_id") AND ("cp"."status" = 'published'::"text") AND ("cp"."is_active" = true)))));



ALTER TABLE "public"."route_purchases" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "route_purchases update admin only" ON "public"."route_purchases" FOR UPDATE USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "route_purchases_admin_all" ON "public"."route_purchases" TO "authenticated" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "route_purchases_insert_own" ON "public"."route_purchases" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."customers" "c"
  WHERE (("c"."id" = "route_purchases"."customer_id") AND ("c"."user_id" = "auth"."uid"())))));



CREATE POLICY "route_purchases_select_own" ON "public"."route_purchases" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."customers" "c"
  WHERE (("c"."id" = "route_purchases"."customer_id") AND ("c"."user_id" = "auth"."uid"())))));



CREATE POLICY "route_purchases_update_own_only_if_unpaid" ON "public"."route_purchases" FOR UPDATE TO "authenticated" USING (((EXISTS ( SELECT 1
   FROM "public"."customers" "c"
  WHERE (("c"."id" = "route_purchases"."customer_id") AND ("c"."user_id" = "auth"."uid"())))) AND ("stripe_payment_intent_id" IS NULL))) WITH CHECK (((EXISTS ( SELECT 1
   FROM "public"."customers" "c"
  WHERE (("c"."id" = "route_purchases"."customer_id") AND ("c"."user_id" = "auth"."uid"())))) AND ("stripe_payment_intent_id" IS NULL)));



ALTER TABLE "public"."route_stops" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "route_stops_delete" ON "public"."route_stops" FOR DELETE TO "authenticated" USING (("public"."is_admin"() OR "public"."owns_route"("route_id")));



CREATE POLICY "route_stops_delete_owner" ON "public"."route_stops" FOR DELETE TO "authenticated" USING (("public"."owns_route"("route_id") OR "public"."is_admin"()));



CREATE POLICY "route_stops_insert" ON "public"."route_stops" FOR INSERT TO "authenticated" WITH CHECK (("public"."is_admin"() OR "public"."owns_route"("route_id")));



CREATE POLICY "route_stops_insert_owner" ON "public"."route_stops" FOR INSERT TO "authenticated" WITH CHECK (("public"."owns_route"("route_id") OR "public"."is_admin"()));



CREATE POLICY "route_stops_public_read" ON "public"."route_stops" FOR SELECT TO "authenticated", "anon" USING ((EXISTS ( SELECT 1
   FROM "public"."routes" "r"
  WHERE (("r"."id" = "route_stops"."route_id") AND ("r"."is_public" = true) AND ("r"."is_active" = true)))));



CREATE POLICY "route_stops_update" ON "public"."route_stops" FOR UPDATE TO "authenticated" USING (("public"."is_admin"() OR "public"."owns_route"("route_id"))) WITH CHECK (("public"."is_admin"() OR "public"."owns_route"("route_id")));



CREATE POLICY "route_stops_update_owner" ON "public"."route_stops" FOR UPDATE TO "authenticated" USING (("public"."owns_route"("route_id") OR "public"."is_admin"())) WITH CHECK (("public"."owns_route"("route_id") OR "public"."is_admin"()));



ALTER TABLE "public"."routes" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "routes_anon_read_public" ON "public"."routes" FOR SELECT TO "anon" USING ((("is_active" = true) AND ("is_public" = true)));



CREATE POLICY "routes_auth_delete" ON "public"."routes" FOR DELETE TO "authenticated" USING (("public"."is_admin"() OR ("created_by" = "auth"."uid"()) OR ("creator_id" = "auth"."uid"())));



CREATE POLICY "routes_auth_insert" ON "public"."routes" FOR INSERT TO "authenticated" WITH CHECK (("public"."is_admin"() OR ("created_by" = "auth"."uid"()) OR ("creator_id" = "auth"."uid"())));



CREATE POLICY "routes_auth_read" ON "public"."routes" FOR SELECT TO "authenticated" USING ((("is_active" = true) AND (("is_public" = true) OR "public"."is_admin"() OR ("created_by" = "auth"."uid"()) OR ("creator_id" = "auth"."uid"()) OR (EXISTS ( SELECT 1
   FROM "public"."route_access" "ra"
  WHERE (("ra"."route_id" = "routes"."id") AND ("ra"."user_id" = "auth"."uid"())))))));



CREATE POLICY "routes_auth_update" ON "public"."routes" FOR UPDATE TO "authenticated" USING (("public"."is_admin"() OR ("created_by" = "auth"."uid"()) OR ("creator_id" = "auth"."uid"()))) WITH CHECK (("public"."is_admin"() OR ("created_by" = "auth"."uid"()) OR ("creator_id" = "auth"."uid"())));



ALTER TABLE "public"."saved_routes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."shipping_addresses" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."stop_company_packs" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "stop_company_packs_owner_write" ON "public"."stop_company_packs" TO "authenticated" USING ("public"."is_pack_owner"("company_pack_id")) WITH CHECK ("public"."is_pack_owner"("company_pack_id"));



CREATE POLICY "stop_company_packs_public_read" ON "public"."stop_company_packs" FOR SELECT TO "authenticated", "anon" USING ((EXISTS ( SELECT 1
   FROM "public"."company_packs" "cp"
  WHERE (("cp"."id" = "stop_company_packs"."company_pack_id") AND ("cp"."status" = 'published'::"text") AND ("cp"."is_active" = true)))));



CREATE POLICY "user_can_cancel_own_checkout_if_unpaid" ON "public"."checkout_requests" FOR UPDATE TO "authenticated" USING ((("user_id" = "auth"."uid"()) AND ("status" = ANY (ARRAY['created'::"text", 'processing'::"text"])))) WITH CHECK ((("user_id" = "auth"."uid"()) AND ("status" = ANY (ARRAY['canceled'::"text", 'created'::"text", 'processing'::"text"]))));



ALTER TABLE "public"."user_roles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."webhook_context_log" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "webhook_context_log_service_read" ON "public"."webhook_context_log" FOR SELECT TO "service_role" USING (true);



GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON FUNCTION "public"."block_stripe_account_id_update"() TO "anon";
GRANT ALL ON FUNCTION "public"."block_stripe_account_id_update"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."block_stripe_account_id_update"() TO "service_role";



GRANT ALL ON FUNCTION "public"."fill_created_by"() TO "anon";
GRANT ALL ON FUNCTION "public"."fill_created_by"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."fill_created_by"() TO "service_role";



GRANT ALL ON FUNCTION "public"."has_role"("_user_id" "uuid", "_role" "public"."app_role") TO "anon";
GRANT ALL ON FUNCTION "public"."has_role"("_user_id" "uuid", "_role" "public"."app_role") TO "authenticated";
GRANT ALL ON FUNCTION "public"."has_role"("_user_id" "uuid", "_role" "public"."app_role") TO "service_role";



GRANT ALL ON FUNCTION "public"."increment_promo_code_safe"("code_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."increment_promo_code_safe"("code_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."increment_promo_code_safe"("code_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."is_admin"() TO "anon";
GRANT ALL ON FUNCTION "public"."is_admin"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_admin"() TO "service_role";



GRANT ALL ON FUNCTION "public"."is_company_owner"("p_company_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."is_company_owner"("p_company_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_company_owner"("p_company_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."is_pack_owner"("p_pack_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."is_pack_owner"("p_pack_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_pack_owner"("p_pack_id" "uuid") TO "service_role";



REVOKE ALL ON FUNCTION "public"."log_webhook_context"("p_source" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."log_webhook_context"("p_source" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."log_webhook_context"("p_source" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."log_webhook_context"("p_source" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."log_webhook_whoami"() TO "service_role";



GRANT ALL ON FUNCTION "public"."my_company_id"() TO "anon";
GRANT ALL ON FUNCTION "public"."my_company_id"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."my_company_id"() TO "service_role";



GRANT ALL ON FUNCTION "public"."owns_route"("p_route_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."owns_route"("p_route_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."owns_route"("p_route_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."owns_stop"("p_stop_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."owns_stop"("p_stop_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."owns_stop"("p_stop_id" "uuid") TO "service_role";



GRANT ALL ON TABLE "public"."routes" TO "service_role";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "public"."routes" TO "authenticated";



GRANT ALL ON FUNCTION "public"."route_owner_id"("r" "public"."routes") TO "anon";
GRANT ALL ON FUNCTION "public"."route_owner_id"("r" "public"."routes") TO "authenticated";
GRANT ALL ON FUNCTION "public"."route_owner_id"("r" "public"."routes") TO "service_role";



REVOKE ALL ON FUNCTION "public"."set_company_stripe_account"("p_company_id" "uuid", "p_stripe_account_id" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."set_company_stripe_account"("p_company_id" "uuid", "p_stripe_account_id" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."set_company_stripe_account"("p_company_id" "uuid", "p_stripe_account_id" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_company_stripe_account"("p_company_id" "uuid", "p_stripe_account_id" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";



GRANT ALL ON FUNCTION "public"."validate_checkout_ref"() TO "anon";
GRANT ALL ON FUNCTION "public"."validate_checkout_ref"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."validate_checkout_ref"() TO "service_role";



GRANT ALL ON FUNCTION "public"."validate_promo_code"("code_value" "text", "order_total" numeric) TO "anon";
GRANT ALL ON FUNCTION "public"."validate_promo_code"("code_value" "text", "order_total" numeric) TO "authenticated";
GRANT ALL ON FUNCTION "public"."validate_promo_code"("code_value" "text", "order_total" numeric) TO "service_role";



GRANT ALL ON FUNCTION "public"."webhook_whoami"("note" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."webhook_whoami"("note" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."webhook_whoami"("note" "text") TO "service_role";



REVOKE ALL ON FUNCTION "public"."whoami_probe"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."whoami_probe"() TO "anon";
GRANT ALL ON FUNCTION "public"."whoami_probe"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."whoami_probe"() TO "service_role";



GRANT ALL ON TABLE "public"."_service_role_canary" TO "service_role";



GRANT ALL ON SEQUENCE "public"."_service_role_canary_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."_service_role_canary_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."_service_role_canary_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."cart_items" TO "service_role";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "public"."cart_items" TO "authenticated";



GRANT ALL ON TABLE "public"."categories" TO "service_role";
GRANT SELECT ON TABLE "public"."categories" TO "authenticated";
GRANT SELECT ON TABLE "public"."categories" TO "anon";



GRANT ALL ON TABLE "public"."checkout_requests" TO "service_role";
GRANT SELECT,INSERT ON TABLE "public"."checkout_requests" TO "authenticated";



GRANT ALL ON TABLE "public"."companies" TO "service_role";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "public"."companies" TO "authenticated";



GRANT ALL ON TABLE "public"."companies_public" TO "service_role";
GRANT SELECT ON TABLE "public"."companies_public" TO "anon";
GRANT SELECT ON TABLE "public"."companies_public" TO "authenticated";



GRANT ALL ON TABLE "public"."company_packs" TO "service_role";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "public"."company_packs" TO "authenticated";



GRANT ALL ON TABLE "public"."company_packs_public" TO "service_role";
GRANT SELECT ON TABLE "public"."company_packs_public" TO "anon";
GRANT SELECT ON TABLE "public"."company_packs_public" TO "authenticated";



GRANT ALL ON TABLE "public"."company_reviews" TO "service_role";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "public"."company_reviews" TO "authenticated";
GRANT SELECT ON TABLE "public"."company_reviews" TO "anon";



GRANT ALL ON TABLE "public"."contact_messages" TO "service_role";
GRANT SELECT,INSERT ON TABLE "public"."contact_messages" TO "authenticated";
GRANT INSERT ON TABLE "public"."contact_messages" TO "anon";



GRANT ALL ON TABLE "public"."customers" TO "service_role";
GRANT SELECT,INSERT,UPDATE ON TABLE "public"."customers" TO "authenticated";



GRANT ALL ON TABLE "public"."customers_safe" TO "service_role";
GRANT SELECT ON TABLE "public"."customers_safe" TO "anon";
GRANT SELECT ON TABLE "public"."customers_safe" TO "authenticated";



GRANT ALL ON TABLE "public"."favorite_companies" TO "service_role";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "public"."favorite_companies" TO "authenticated";



GRANT ALL ON TABLE "public"."favorites" TO "service_role";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "public"."favorites" TO "authenticated";



GRANT ALL ON TABLE "public"."notifications" TO "service_role";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "public"."notifications" TO "authenticated";



GRANT ALL ON TABLE "public"."order_items" TO "service_role";
GRANT SELECT ON TABLE "public"."order_items" TO "authenticated";



GRANT ALL ON TABLE "public"."orders" TO "service_role";
GRANT SELECT,INSERT ON TABLE "public"."orders" TO "authenticated";



GRANT ALL ON TABLE "public"."pack_analytics" TO "service_role";



GRANT ALL ON TABLE "public"."pack_elements" TO "service_role";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "public"."pack_elements" TO "authenticated";
GRANT SELECT ON TABLE "public"."pack_elements" TO "anon";



GRANT ALL ON TABLE "public"."pack_payments" TO "service_role";
GRANT SELECT ON TABLE "public"."pack_payments" TO "authenticated";



GRANT ALL ON TABLE "public"."pack_products" TO "service_role";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "public"."pack_products" TO "authenticated";
GRANT SELECT ON TABLE "public"."pack_products" TO "anon";



GRANT ALL ON TABLE "public"."pack_reviews" TO "service_role";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "public"."pack_reviews" TO "authenticated";
GRANT SELECT ON TABLE "public"."pack_reviews" TO "anon";



GRANT ALL ON TABLE "public"."pack_templates" TO "service_role";



GRANT ALL ON TABLE "public"."products" TO "service_role";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "public"."products" TO "authenticated";
GRANT SELECT ON TABLE "public"."products" TO "anon";



GRANT ALL ON TABLE "public"."profiles" TO "service_role";
GRANT SELECT,INSERT,UPDATE ON TABLE "public"."profiles" TO "authenticated";



GRANT ALL ON TABLE "public"."promotional_codes" TO "service_role";



GRANT ALL ON TABLE "public"."regions" TO "service_role";
GRANT SELECT ON TABLE "public"."regions" TO "authenticated";
GRANT SELECT ON TABLE "public"."regions" TO "anon";



GRANT ALL ON TABLE "public"."route_access" TO "service_role";
GRANT SELECT ON TABLE "public"."route_access" TO "authenticated";



GRANT ALL ON TABLE "public"."route_company_packs" TO "service_role";
GRANT SELECT ON TABLE "public"."route_company_packs" TO "authenticated";
GRANT SELECT ON TABLE "public"."route_company_packs" TO "anon";



GRANT ALL ON TABLE "public"."route_purchases" TO "service_role";
GRANT SELECT,INSERT,UPDATE ON TABLE "public"."route_purchases" TO "authenticated";



GRANT ALL ON TABLE "public"."route_stops" TO "service_role";
GRANT SELECT ON TABLE "public"."route_stops" TO "authenticated";
GRANT SELECT ON TABLE "public"."route_stops" TO "anon";



GRANT ALL ON TABLE "public"."routes_public" TO "service_role";
GRANT SELECT ON TABLE "public"."routes_public" TO "anon";
GRANT SELECT ON TABLE "public"."routes_public" TO "authenticated";



GRANT ALL ON TABLE "public"."saved_routes" TO "service_role";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "public"."saved_routes" TO "authenticated";



GRANT ALL ON TABLE "public"."shipping_addresses" TO "service_role";
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE "public"."shipping_addresses" TO "authenticated";



GRANT ALL ON TABLE "public"."stop_company_packs" TO "service_role";
GRANT SELECT ON TABLE "public"."stop_company_packs" TO "anon";



GRANT ALL ON TABLE "public"."user_roles" TO "service_role";



GRANT ALL ON TABLE "public"."webhook_context_log" TO "service_role";



GRANT ALL ON SEQUENCE "public"."webhook_context_log_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."webhook_context_log_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."webhook_context_log_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."webhook_whoami_log" TO "service_role";



GRANT ALL ON SEQUENCE "public"."webhook_whoami_log_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."webhook_whoami_log_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."webhook_whoami_log_id_seq" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";







