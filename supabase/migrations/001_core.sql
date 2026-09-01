create table if not exists public.aix_next_scans (
  id text primary key,
  target_url text not null,
  stage text not null,
  progress integer not null default 0,
  message text not null default '',
  result jsonb,
  error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.aix_next_watches (
  id text primary key,
  token text not null unique,
  email text not null,
  scan_id text references public.aix_next_scans(id) on delete set null,
  status text not null default 'trial',
  paid boolean not null default false,
  baseline jsonb not null,
  latest jsonb not null,
  history jsonb not null default '[]'::jsonb,
  evidence jsonb not null default '[]'::jsonb,
  next_run_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists aix_next_scans_created_idx on public.aix_next_scans(created_at desc);
create index if not exists aix_next_watches_due_idx on public.aix_next_watches(status, next_run_at);
create index if not exists aix_next_watches_email_idx on public.aix_next_watches(lower(email));

alter table public.aix_next_scans enable row level security;
alter table public.aix_next_watches enable row level security;
-- No anon or authenticated policies are created. Application access is server-side service-role only.
