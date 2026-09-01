alter table public.aix_next_watches
  add column if not exists agent_ingest_key_hash text;

create index if not exists aix_next_watches_agent_ingest_key_idx
  on public.aix_next_watches(agent_ingest_key_hash)
  where agent_ingest_key_hash is not null;

create table if not exists public.aix_next_agent_events (
  id text primary key,
  watch_id text not null references public.aix_next_watches(id) on delete cascade,
  occurred_at timestamptz not null,
  kind text not null check (kind in ('crawler','referral')),
  agent text not null,
  path text not null,
  referrer_domain text,
  status_code integer,
  conversion boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists aix_next_agent_events_watch_time_idx
  on public.aix_next_agent_events(watch_id, occurred_at desc);
create index if not exists aix_next_agent_events_watch_agent_idx
  on public.aix_next_agent_events(watch_id, agent, occurred_at desc);

alter table public.aix_next_agent_events enable row level security;
-- No anon/authenticated policies: ingestion and reads are server-side only.
-- Raw IP addresses are intentionally not stored by this table.
