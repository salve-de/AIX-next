alter table public.aix_next_watches
  add column if not exists change_pack jsonb;
