-- BidSutra AI — Multi-tenant SaaS schema (Supabase)
-- Run in Supabase SQL editor.

create extension if not exists "pgcrypto";

-- =====================================================
-- ENUMS
-- =====================================================
do $$ begin
  if not exists (select 1 from pg_type where typname = 'role_type') then
    create type public.role_type as enum ('owner','admin','analyst','viewer');
  end if;
  if not exists (select 1 from pg_type where typname = 'plan_type') then
    create type public.plan_type as enum ('free','pro','enterprise');
  end if;
  if not exists (select 1 from pg_type where typname = 'tender_status') then
    create type public.tender_status as enum ('draft','active','submitted','won','lost','archived');
  end if;
  if not exists (select 1 from pg_type where typname = 'severity_type') then
    create type public.severity_type as enum ('low','medium','high','critical');
  end if;
end $$;

-- =====================================================
-- CORE TENANCY
-- =====================================================
create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  plan public.plan_type not null default 'free',
  created_at timestamptz not null default now()
);

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  org_id uuid not null references public.organizations(id) on delete cascade,
  role public.role_type not null default 'owner',
  created_at timestamptz not null default now()
);

create index if not exists users_org_id_idx on public.users(org_id);

-- =====================================================
-- TENDERS
-- =====================================================
create table if not exists public.tenders (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  title text not null,
  authority text,
  risk_score integer not null default 0 check (risk_score between 0 and 100),
  status public.tender_status not null default 'draft',
  created_at timestamptz not null default now()
);

create index if not exists tenders_org_created_idx on public.tenders(org_id, created_at desc);
create index if not exists tenders_org_status_idx on public.tenders(org_id, status);

create table if not exists public.tender_clauses (
  id uuid primary key default gen_random_uuid(),
  tender_id uuid not null references public.tenders(id) on delete cascade,
  clause_type text not null,
  severity public.severity_type not null default 'medium',
  content text not null,
  created_at timestamptz not null default now()
);
create index if not exists tender_clauses_tender_idx on public.tender_clauses(tender_id);

create table if not exists public.risk_scores (
  id uuid primary key default gen_random_uuid(),
  tender_id uuid not null unique references public.tenders(id) on delete cascade,
  eligibility integer not null default 0 check (eligibility between 0 and 100),
  financial integer not null default 0 check (financial between 0 and 100),
  penalty integer not null default 0 check (penalty between 0 and 100),
  experience integer not null default 0 check (experience between 0 and 100),
  deadline integer not null default 0 check (deadline between 0 and 100),
  total integer not null default 0 check (total between 0 and 100),
  created_at timestamptz not null default now()
);
create index if not exists risk_scores_tender_idx on public.risk_scores(tender_id);

create table if not exists public.compliance_items (
  id uuid primary key default gen_random_uuid(),
  tender_id uuid not null references public.tenders(id) on delete cascade,
  label text not null,
  completed boolean not null default false,
  required boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists compliance_items_tender_idx on public.compliance_items(tender_id);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  tender_id uuid not null references public.tenders(id) on delete cascade,
  file_url text not null,
  uploaded_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists documents_tender_idx on public.documents(tender_id);

-- =====================================================
-- GEM + ALERTS
-- =====================================================
create table if not exists public.gem_listings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text,
  value numeric,
  deadline timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists gem_listings_deadline_idx on public.gem_listings(deadline);

create table if not exists public.alerts (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists alerts_org_created_idx on public.alerts(org_id, created_at desc);

-- =====================================================
-- BILLING
-- =====================================================
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null unique references public.organizations(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  status text not null default 'inactive',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists subscriptions_org_idx on public.subscriptions(org_id);

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  action text not null,
  created_at timestamptz not null default now()
);
create index if not exists activity_logs_org_created_idx on public.activity_logs(org_id, created_at desc);

-- =====================================================
-- UPDATED_AT TRIGGER
-- =====================================================
create or replace function public.set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

do $$ begin
  if not exists (select 1 from pg_trigger where tgname = 'subscriptions_set_updated_at') then
    create trigger subscriptions_set_updated_at before update on public.subscriptions
    for each row execute function public.set_updated_at();
  end if;
end $$;

-- =====================================================
-- ORG + USER AUTO-PROVISION ON SIGNUP
-- =====================================================
create or replace function public.handle_new_auth_user() returns trigger as $$
declare
  new_org_id uuid;
  org_name text;
begin
  org_name := coalesce(new.raw_user_meta_data->>'org_name', split_part(new.email, '@', 1));

  insert into public.organizations(name, plan)
  values (org_name, 'free')
  returning id into new_org_id;

  insert into public.users(id, org_id, role)
  values (new.id, new_org_id, 'owner');

  insert into public.subscriptions(org_id, status)
  values (new_org_id, 'inactive')
  on conflict (org_id) do nothing;

  return new;
end;
$$ language plpgsql security definer;

-- Ensure it can write
revoke all on function public.handle_new_auth_user() from public;


do $$ begin
  if not exists (select 1 from pg_trigger where tgname = 'on_auth_user_created') then
    create trigger on_auth_user_created
      after insert on auth.users
      for each row execute function public.handle_new_auth_user();
  end if;
end $$;

-- =====================================================
-- RLS
-- =====================================================
alter table public.organizations enable row level security;
alter table public.users enable row level security;
alter table public.tenders enable row level security;
alter table public.tender_clauses enable row level security;
alter table public.risk_scores enable row level security;
alter table public.compliance_items enable row level security;
alter table public.documents enable row level security;
alter table public.alerts enable row level security;
alter table public.subscriptions enable row level security;
alter table public.activity_logs enable row level security;

-- Helper: current user's org_id
create or replace function public.current_org_id() returns uuid as $$
  select org_id from public.users where id = auth.uid();
$$ language sql stable;

-- organizations: members can read; owners/admins can update
create policy org_read on public.organizations
  for select using (id = public.current_org_id());

create policy org_update on public.organizations
  for update using (
    id = public.current_org_id() and
    exists (select 1 from public.users u where u.id = auth.uid() and u.role in ('owner','admin'))
  );

-- users: org members can read; only owner/admin can manage
create policy users_read on public.users
  for select using (org_id = public.current_org_id());

create policy users_insert on public.users
  for insert with check (
    org_id = public.current_org_id() and
    exists (select 1 from public.users u where u.id = auth.uid() and u.role in ('owner','admin'))
  );

create policy users_update on public.users
  for update using (
    org_id = public.current_org_id() and
    exists (select 1 from public.users u where u.id = auth.uid() and u.role in ('owner','admin'))
  );

-- tenders: org members
create policy tenders_rw on public.tenders
  for all using (org_id = public.current_org_id())
  with check (org_id = public.current_org_id());

create policy clauses_rw on public.tender_clauses
  for all using (
    exists (select 1 from public.tenders t where t.id = tender_id and t.org_id = public.current_org_id())
  )
  with check (
    exists (select 1 from public.tenders t where t.id = tender_id and t.org_id = public.current_org_id())
  );

create policy risk_rw on public.risk_scores
  for all using (
    exists (select 1 from public.tenders t where t.id = tender_id and t.org_id = public.current_org_id())
  )
  with check (
    exists (select 1 from public.tenders t where t.id = tender_id and t.org_id = public.current_org_id())
  );

create policy compliance_rw on public.compliance_items
  for all using (
    exists (select 1 from public.tenders t where t.id = tender_id and t.org_id = public.current_org_id())
  )
  with check (
    exists (select 1 from public.tenders t where t.id = tender_id and t.org_id = public.current_org_id())
  );

create policy documents_rw on public.documents
  for all using (
    exists (select 1 from public.tenders t where t.id = tender_id and t.org_id = public.current_org_id())
  )
  with check (
    exists (select 1 from public.tenders t where t.id = tender_id and t.org_id = public.current_org_id())
  );

create policy alerts_rw on public.alerts
  for all using (org_id = public.current_org_id())
  with check (org_id = public.current_org_id());

create policy subs_read on public.subscriptions
  for select using (org_id = public.current_org_id());

create policy subs_update_owner_admin on public.subscriptions
  for update using (
    org_id = public.current_org_id() and
    exists (select 1 from public.users u where u.id = auth.uid() and u.role in ('owner','admin'))
  );

create policy logs_rw on public.activity_logs
  for all using (org_id = public.current_org_id())
  with check (org_id = public.current_org_id());
