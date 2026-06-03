-- ============================================================================
-- B2B MESSAGING: conversaciones y mensajes privados entre empresas
-- ----------------------------------------------------------------------------
-- - b2b_conversations: 1 fila por par de empresas (ordenado con company_a < company_b
--   para evitar duplicados)
-- - b2b_messages: mensajes en cada conversación
-- - RLS: cada empresa solo ve conversaciones donde participa (a través de su user_id
--   en companies)
-- - Realtime: ambas tablas en supabase_realtime
-- ============================================================================

create extension if not exists "uuid-ossp";

-- ----------------------------------------------------------------------------
-- b2b_conversations
-- ----------------------------------------------------------------------------
create table if not exists public.b2b_conversations (
  id uuid primary key default uuid_generate_v4(),
  -- IDs de empresa ordenados para unicidad. Siempre company_a_id < company_b_id
  company_a_id uuid not null references public.companies(id) on delete cascade,
  company_b_id uuid not null references public.companies(id) on delete cascade,
  last_message text,
  last_message_at timestamptz,
  last_sender_company_id uuid references public.companies(id) on delete set null,
  unread_a int not null default 0,  -- mensajes sin leer por la empresa A
  unread_b int not null default 0,  -- mensajes sin leer por la empresa B
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint b2b_conv_ordered check (company_a_id < company_b_id),
  constraint b2b_conv_distinct check (company_a_id <> company_b_id),
  constraint b2b_conv_unique unique (company_a_id, company_b_id)
);

create index if not exists idx_b2b_conv_a on public.b2b_conversations(company_a_id);
create index if not exists idx_b2b_conv_b on public.b2b_conversations(company_b_id);
create index if not exists idx_b2b_conv_last_msg on public.b2b_conversations(last_message_at desc nulls last);

-- ----------------------------------------------------------------------------
-- b2b_messages
-- ----------------------------------------------------------------------------
create table if not exists public.b2b_messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid not null references public.b2b_conversations(id) on delete cascade,
  sender_company_id uuid not null references public.companies(id) on delete cascade,
  body text not null check (length(body) between 1 and 4000),
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_b2b_msg_conv on public.b2b_messages(conversation_id, created_at);
create index if not exists idx_b2b_msg_sender on public.b2b_messages(sender_company_id);

-- ----------------------------------------------------------------------------
-- Función helper: empresas (ids) propiedad del usuario actual
-- ----------------------------------------------------------------------------
create or replace function public.user_company_ids()
returns table(company_id uuid)
language sql
stable
security definer
set search_path = public
as $$
  select id from public.companies where user_id = auth.uid()
$$;

-- ----------------------------------------------------------------------------
-- RLS
-- ----------------------------------------------------------------------------
alter table public.b2b_conversations enable row level security;
alter table public.b2b_messages enable row level security;

-- Conversaciones: la empresa del usuario debe ser A o B
drop policy if exists b2b_conv_select on public.b2b_conversations;
create policy b2b_conv_select on public.b2b_conversations
  for select using (
    company_a_id in (select company_id from public.user_company_ids())
    or company_b_id in (select company_id from public.user_company_ids())
  );

drop policy if exists b2b_conv_insert on public.b2b_conversations;
create policy b2b_conv_insert on public.b2b_conversations
  for insert with check (
    company_a_id in (select company_id from public.user_company_ids())
    or company_b_id in (select company_id from public.user_company_ids())
  );

drop policy if exists b2b_conv_update on public.b2b_conversations;
create policy b2b_conv_update on public.b2b_conversations
  for update using (
    company_a_id in (select company_id from public.user_company_ids())
    or company_b_id in (select company_id from public.user_company_ids())
  );

-- Mensajes: el usuario debe poseer la empresa que envía o pertenecer a la conversación
drop policy if exists b2b_msg_select on public.b2b_messages;
create policy b2b_msg_select on public.b2b_messages
  for select using (
    conversation_id in (
      select id from public.b2b_conversations
      where company_a_id in (select company_id from public.user_company_ids())
         or company_b_id in (select company_id from public.user_company_ids())
    )
  );

drop policy if exists b2b_msg_insert on public.b2b_messages;
create policy b2b_msg_insert on public.b2b_messages
  for insert with check (
    sender_company_id in (select company_id from public.user_company_ids())
    and conversation_id in (
      select id from public.b2b_conversations
      where company_a_id in (select company_id from public.user_company_ids())
         or company_b_id in (select company_id from public.user_company_ids())
    )
  );

drop policy if exists b2b_msg_update on public.b2b_messages;
create policy b2b_msg_update on public.b2b_messages
  for update using (
    conversation_id in (
      select id from public.b2b_conversations
      where company_a_id in (select company_id from public.user_company_ids())
         or company_b_id in (select company_id from public.user_company_ids())
    )
  );

-- ----------------------------------------------------------------------------
-- Trigger: al insertar mensaje, actualiza la conversación
-- ----------------------------------------------------------------------------
create or replace function public.b2b_on_message_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  conv public.b2b_conversations%rowtype;
begin
  select * into conv from public.b2b_conversations where id = new.conversation_id;
  if not found then
    return new;
  end if;

  update public.b2b_conversations
  set
    last_message = left(new.body, 240),
    last_message_at = new.created_at,
    last_sender_company_id = new.sender_company_id,
    updated_at = now(),
    -- Incrementar contador unread del receptor (no del emisor)
    unread_a = case
      when new.sender_company_id = conv.company_b_id then unread_a + 1
      else unread_a
    end,
    unread_b = case
      when new.sender_company_id = conv.company_a_id then unread_b + 1
      else unread_b
    end
  where id = new.conversation_id;

  return new;
end;
$$;

drop trigger if exists trg_b2b_on_message_insert on public.b2b_messages;
create trigger trg_b2b_on_message_insert
  after insert on public.b2b_messages
  for each row execute function public.b2b_on_message_insert();

-- ----------------------------------------------------------------------------
-- RPC: obtener-o-crear conversación entre la empresa del usuario y otra empresa
-- ----------------------------------------------------------------------------
create or replace function public.b2b_get_or_create_conversation(other_company_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  my_company_id uuid;
  a_id uuid;
  b_id uuid;
  conv_id uuid;
begin
  select id into my_company_id from public.companies where user_id = auth.uid() limit 1;
  if my_company_id is null then
    raise exception 'No tienes empresa asociada';
  end if;
  if my_company_id = other_company_id then
    raise exception 'No puedes iniciar conversación contigo mismo';
  end if;

  if my_company_id < other_company_id then
    a_id := my_company_id;
    b_id := other_company_id;
  else
    a_id := other_company_id;
    b_id := my_company_id;
  end if;

  select id into conv_id from public.b2b_conversations
  where company_a_id = a_id and company_b_id = b_id
  limit 1;

  if conv_id is null then
    insert into public.b2b_conversations(company_a_id, company_b_id)
    values (a_id, b_id)
    returning id into conv_id;
  end if;

  return conv_id;
end;
$$;

-- ----------------------------------------------------------------------------
-- RPC: marcar conversación como leída para la empresa del usuario
-- ----------------------------------------------------------------------------
create or replace function public.b2b_mark_conversation_read(conv_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  my_company_id uuid;
  conv public.b2b_conversations%rowtype;
begin
  select id into my_company_id from public.companies where user_id = auth.uid() limit 1;
  if my_company_id is null then
    return;
  end if;

  select * into conv from public.b2b_conversations where id = conv_id;
  if not found then
    return;
  end if;

  if conv.company_a_id = my_company_id then
    update public.b2b_conversations set unread_a = 0, updated_at = now() where id = conv_id;
  elsif conv.company_b_id = my_company_id then
    update public.b2b_conversations set unread_b = 0, updated_at = now() where id = conv_id;
  end if;

  update public.b2b_messages
  set read_at = now()
  where conversation_id = conv_id
    and sender_company_id <> my_company_id
    and read_at is null;
end;
$$;

-- ----------------------------------------------------------------------------
-- Realtime
-- ----------------------------------------------------------------------------
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'b2b_messages'
  ) then
    execute 'alter publication supabase_realtime add table public.b2b_messages';
  end if;
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'b2b_conversations'
  ) then
    execute 'alter publication supabase_realtime add table public.b2b_conversations';
  end if;
exception when others then
  -- Ignorar si la publicación no existe (entornos locales)
  null;
end$$;

-- Grants (security definer maneja la auth real, pero los grants permiten ejecutar)
grant execute on function public.b2b_get_or_create_conversation(uuid) to authenticated;
grant execute on function public.b2b_mark_conversation_read(uuid) to authenticated;
grant execute on function public.user_company_ids() to authenticated;
