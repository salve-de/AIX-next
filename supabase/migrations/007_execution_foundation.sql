alter table public.aix_next_watches
  add column if not exists domain_claim jsonb,
  add column if not exists executions jsonb not null default '[]'::jsonb;

comment on column public.aix_next_watches.domain_claim is
  'Domain ownership challenge and verification state required before external execution.';

comment on column public.aix_next_watches.executions is
  'Append-only product-level audit summary of approval-gated GitHub PR and WordPress draft creation.';
