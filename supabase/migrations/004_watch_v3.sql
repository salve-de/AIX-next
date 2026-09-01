alter table public.aix_next_watches
  add column if not exists trial_ends_at timestamptz,
  add column if not exists discovery_latest jsonb,
  add column if not exists discovery_history jsonb not null default '[]'::jsonb,
  add column if not exists change_packs jsonb not null default '[]'::jsonb;

update public.aix_next_watches
set trial_ends_at = coalesce(trial_ends_at, created_at + interval '14 days')
where trial_ends_at is null;

alter table public.aix_next_watches
  alter column trial_ends_at set default (now() + interval '14 days');

create index if not exists aix_next_watches_trial_end_idx
  on public.aix_next_watches(status, trial_ends_at);

comment on column public.aix_next_watches.discovery_latest is
  'Latest rotating Discovery panel. Never used in Core trend denominators.';

comment on column public.aix_next_watches.discovery_history is
  'Rotating Discovery panel history, stored separately from Core history.';

comment on column public.aix_next_watches.change_packs is
  'Approval-gated change packages generated from tracked losses and evidence.';
