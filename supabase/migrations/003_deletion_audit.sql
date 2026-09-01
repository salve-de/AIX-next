create table if not exists public.aix_next_deletion_audit (
  id uuid primary key default gen_random_uuid(),
  email_hash text not null,
  domain_hash text not null,
  watch_id text,
  scan_id text,
  completed_at timestamptz not null default now()
);

create index if not exists aix_next_deletion_audit_completed_idx on public.aix_next_deletion_audit(completed_at desc);
alter table public.aix_next_deletion_audit enable row level security;
-- Service-role only; no public policies.
