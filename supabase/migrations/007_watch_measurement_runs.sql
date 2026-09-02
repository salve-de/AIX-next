create table if not exists public.aix_next_watch_runs (
  id text primary key,
  watch_id text not null references public.aix_next_watches(id) on delete cascade,
  watch_token text not null,
  status text not null check (status in ('pending', 'running', 'completed', 'failed')),
  target_url text not null,
  discovery jsonb not null,
  prompts jsonb not null default '[]'::jsonb,
  panel_kind text not null check (panel_kind in ('free', 'core', 'discovery')),
  repetitions integer not null check (repetitions > 0),
  switch_to_core boolean not null default false,
  next_prompt_index integer not null default 0 check (next_prompt_index >= 0),
  observations jsonb not null default '[]'::jsonb,
  error text,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists aix_next_watch_runs_watch_idx
  on public.aix_next_watch_runs(watch_id, created_at desc);

create unique index if not exists aix_next_watch_runs_one_active_idx
  on public.aix_next_watch_runs(watch_id)
  where status in ('pending', 'running');

alter table public.aix_next_watch_runs enable row level security;
