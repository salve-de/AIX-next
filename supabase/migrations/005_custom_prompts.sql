alter table public.aix_next_watches
  add column if not exists custom_prompts jsonb not null default '[]'::jsonb,
  add column if not exists custom_latest jsonb,
  add column if not exists custom_history jsonb not null default '[]'::jsonb;

comment on column public.aix_next_watches.custom_prompts is
  'User-defined buyer prompts. Custom prompts never alter the stable Core panel implicitly.';

comment on column public.aix_next_watches.custom_latest is
  'Latest Custom Prompt panel result. Excluded from Core trend metrics.';

comment on column public.aix_next_watches.custom_history is
  'Custom Prompt result history. Kept separate from Core and Discovery histories.';
