create table if not exists public.aix_next_public_profiles (
  id text primary key,
  slug text not null unique,
  status text not null check (status in ('draft', 'published', 'revoked', 'expired')),
  title text not null,
  brand_name text not null,
  target_url text not null,
  summary text not null default '',
  market text not null default '',
  target_customers jsonb not null default '[]'::jsonb,
  use_cases jsonb not null default '[]'::jsonb,
  facts jsonb not null default '[]'::jsonb,
  source_pages jsonb not null default '[]'::jsonb,
  structured_data text not null default '',
  markdown text not null default '',
  json text not null default '',
  token text not null unique,
  source_scan_id text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  expires_at timestamptz not null,
  published_at timestamptz
);

create index if not exists aix_next_public_profiles_status_expiry_idx
  on public.aix_next_public_profiles(status, expires_at);

create index if not exists aix_next_public_profiles_scan_idx
  on public.aix_next_public_profiles(source_scan_id);

alter table public.aix_next_public_profiles enable row level security;
