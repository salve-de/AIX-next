-- Existing records remain manual. Only authenticated management can opt in.
alter table public.aix_next_public_profiles
  add column if not exists automation jsonb;

create index if not exists aix_next_public_profiles_automation_watch_idx
  on public.aix_next_public_profiles ((automation->>'watchId'))
  where status = 'published';
