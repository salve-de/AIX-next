create unique index if not exists aix_next_watches_scan_email_unique_idx
  on public.aix_next_watches(scan_id, email)
  where scan_id is not null;
