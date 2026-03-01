-- BidSutra AI (Supabase) schema
-- Run in Supabase SQL Editor.

-- 1) Users profile table (separate from auth.users)
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  full_name text,
  phone text,
  created_at timestamptz not null default now()
);

-- 2) Organizations
create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  gstin text,
  pan text,
  msme_udyam text,
  address text,
  turnover_band text,
  certifications text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3) Tenders
create table if not exists public.tenders (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  source text not null default 'upload',
  title text not null,
  department text,
  state text,
  deadline date,
  est_value_cr numeric,
  raw_text text,
  created_at timestamptz not null default now()
);

-- 4) Risk scores
create table if not exists public.risk_scores (
  id uuid primary key default gen_random_uuid(),
  tender_id uuid not null references public.tenders(id) on delete cascade,
  org_id uuid not null references public.organizations(id) on delete cascade,
  score int not null check (score between 0 and 100),
  level text not null check (level in ('LOW','MEDIUM','HIGH','CRITICAL')),
  drivers jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- 5) Compliance items
create table if not exists public.compliance_items (
  id uuid primary key default gen_random_uuid(),
  tender_id uuid not null references public.tenders(id) on delete cascade,
  org_id uuid not null references public.organizations(id) on delete cascade,
  label text not null,
  status text not null default 'missing' check (status in ('missing','in_progress','ready')),
  notes text,
  due_by date,
  created_at timestamptz not null default now()
);

-- 6) GeM listings (public metadata only)
create table if not exists public.gem_listings (
  id uuid primary key default gen_random_uuid(),
  gem_id text,
  title text not null,
  category text,
  department text,
  state text,
  published_at timestamptz,
  url text,
  created_at timestamptz not null default now()
);

-- 7) Alerts
create table if not exists public.alerts (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  channel text not null check (channel in ('email','whatsapp')),
  target text not null,
  filters jsonb not null default '{}'::jsonb,
  enabled boolean not null default true,
  created_at timestamptz not null default now()
);

-- 8) Subscriptions
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  plan text not null default 'FREE' check (plan in ('FREE','PRO','ENTERPRISE')),
  status text not null default 'active' check (status in ('active','past_due','canceled')),
  current_period_end timestamptz,
  created_at timestamptz not null default now()
);

-- Trigger to auto-update updated_at
create or replace function public.set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists organizations_set_updated_at on public.organizations;
create trigger organizations_set_updated_at
before update on public.organizations
for each row execute function public.set_updated_at();

-- RLS (minimal starter; tighten before production)
alter table public.users enable row level security;
alter table public.organizations enable row level security;
alter table public.tenders enable row level security;
alter table public.risk_scores enable row level security;
alter table public.compliance_items enable row level security;
alter table public.alerts enable row level security;
alter table public.subscriptions enable row level security;

-- Policies
-- users: user can read/write own profile
create policy if not exists "users_select_own" on public.users
for select using (auth.uid() = id);
create policy if not exists "users_upsert_own" on public.users
for insert with check (auth.uid() = id);
create policy if not exists "users_update_own" on public.users
for update using (auth.uid() = id);

-- organizations: owner can access
create policy if not exists "org_select_owner" on public.organizations
for select using (auth.uid() = owner_user_id);
create policy if not exists "org_insert_owner" on public.organizations
for insert with check (auth.uid() = owner_user_id);
create policy if not exists "org_update_owner" on public.organizations
for update using (auth.uid() = owner_user_id);

-- tenders/risk/compliance/subscriptions/alerts: scoped by org ownership
create policy if not exists "tenders_select_owner" on public.tenders
for select using (
  exists (
    select 1 from public.organizations o
    where o.id = tenders.org_id and o.owner_user_id = auth.uid()
  )
);
create policy if not exists "tenders_insert_owner" on public.tenders
for insert with check (
  exists (
    select 1 from public.organizations o
    where o.id = tenders.org_id and o.owner_user_id = auth.uid()
  )
);
create policy if not exists "tenders_update_owner" on public.tenders
for update using (
  exists (
    select 1 from public.organizations o
    where o.id = tenders.org_id and o.owner_user_id = auth.uid()
  )
);

create policy if not exists "risk_select_owner" on public.risk_scores
for select using (
  exists (
    select 1 from public.organizations o
    where o.id = risk_scores.org_id and o.owner_user_id = auth.uid()
  )
);
create policy if not exists "risk_insert_owner" on public.risk_scores
for insert with check (
  exists (
    select 1 from public.organizations o
    where o.id = risk_scores.org_id and o.owner_user_id = auth.uid()
  )
);

create policy if not exists "compliance_select_owner" on public.compliance_items
for select using (
  exists (
    select 1 from public.organizations o
    where o.id = compliance_items.org_id and o.owner_user_id = auth.uid()
  )
);
create policy if not exists "compliance_insert_owner" on public.compliance_items
for insert with check (
  exists (
    select 1 from public.organizations o
    where o.id = compliance_items.org_id and o.owner_user_id = auth.uid()
  )
);

create policy if not exists "alerts_select_owner" on public.alerts
for select using (
  exists (
    select 1 from public.organizations o
    where o.id = alerts.org_id and o.owner_user_id = auth.uid()
  )
);
create policy if not exists "alerts_insert_owner" on public.alerts
for insert with check (
  exists (
    select 1 from public.organizations o
    where o.id = alerts.org_id and o.owner_user_id = auth.uid()
  )
);

create policy if not exists "subs_select_owner" on public.subscriptions
for select using (
  exists (
    select 1 from public.organizations o
    where o.id = subscriptions.org_id and o.owner_user_id = auth.uid()
  )
);
create policy if not exists "subs_insert_owner" on public.subscriptions
for insert with check (
  exists (
    select 1 from public.organizations o
    where o.id = subscriptions.org_id and o.owner_user_id = auth.uid()
  )
);
