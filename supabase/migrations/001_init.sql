create extension if not exists pgcrypto;

create table if not exists public.aix_next_scans (
  id uuid primary key,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.aix_next_watches (
  id uuid primary key,
  token text not null unique,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists aix_next_scans_updated_idx on public.aix_next_scans(updated_at desc);
create index if not exists aix_next_watches_updated_idx on public.aix_next_watches(updated_at desc);

alter table public.aix_next_scans enable row level security;
alter table public.aix_next_watches enable row level security;
-- No anon/authenticated policies. Server-side service role only.
