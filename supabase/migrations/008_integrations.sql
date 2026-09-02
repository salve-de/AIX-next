create table if not exists public.aix_next_integrations (
  id text primary key,
  watch_id text not null references public.aix_next_watches(id) on delete cascade,
  kind text not null check (kind in ('github','wordpress')),
  public_config jsonb not null default '{}'::jsonb,
  secret_ciphertext text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(watch_id, kind)
);

create index if not exists aix_next_integrations_watch_idx on public.aix_next_integrations(watch_id, kind);
alter table public.aix_next_integrations enable row level security;
-- Server-side service-role access only. Encrypted secrets never flow through /api/watch.
