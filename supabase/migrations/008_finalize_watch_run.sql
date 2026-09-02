create or replace function public.aix_next_finalize_watch_run(
  p_run_id text,
  p_watch_token text,
  p_latest jsonb,
  p_baseline jsonb,
  p_history jsonb,
  p_watch_status text,
  p_next_run_at timestamptz,
  p_completed_at timestamptz default now()
)
returns setof public.aix_next_watches
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1
    from public.aix_next_watch_runs
    where id = p_run_id
      and watch_token = p_watch_token
      and status in ('pending', 'running')
  ) then
    raise exception 'watch run is not active';
  end if;

  update public.aix_next_watch_runs
  set status = 'completed',
      next_prompt_index = jsonb_array_length(prompts),
      error = null,
      completed_at = p_completed_at,
      updated_at = p_completed_at
  where id = p_run_id
    and watch_token = p_watch_token;

  return query
  update public.aix_next_watches as watch
  set latest = p_latest,
      baseline = p_baseline,
      history = p_history,
      status = p_watch_status,
      next_run_at = p_next_run_at,
      updated_at = p_completed_at
  where watch.token = p_watch_token
  returning watch.*;
end;
$$;

revoke all on function public.aix_next_finalize_watch_run(text, text, jsonb, jsonb, jsonb, text, timestamptz, timestamptz) from public, anon, authenticated;
grant execute on function public.aix_next_finalize_watch_run(text, text, jsonb, jsonb, jsonb, text, timestamptz, timestamptz) to service_role;
