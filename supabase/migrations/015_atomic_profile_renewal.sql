-- Serialize entitlement checks with subscription cancellation.
create or replace function public.aix_next_renew_public_profiles(p_watch_token text)
returns setof public.aix_next_public_profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  v_watch public.aix_next_watches%rowtype;
  v_now timestamptz;
begin
  select * into v_watch from public.aix_next_watches
  where token = p_watch_token for update;
  if not found or not v_watch.paid or v_watch.status <> 'active'
     or coalesce(v_watch.stripe_subscription_id, '') = '' then
    return;
  end if;
  v_now := clock_timestamp();
  return query
  update public.aix_next_public_profiles as profile
  set expires_at = greatest(profile.expires_at, v_now + interval '8 days'),
      automation = profile.automation || jsonb_build_object(
        'freeExpiresAt', coalesce(profile.automation->'freeExpiresAt', to_jsonb(profile.expires_at)),
        'renewalExpiresAt', v_now + interval '8 days',
        'renewedAt', v_now
      ),
      updated_at = greatest(v_now, profile.updated_at + interval '1 millisecond')
  where profile.status = 'published'
    and profile.expires_at > v_now
    and profile.automation->>'watchId' = v_watch.id
    and coalesce(profile.automation->>'maintenanceEnabled', profile.automation->>'enabled') = 'true'
    and profile.target_url = v_watch.latest->>'targetUrl'
    and (profile.source_scan_id = v_watch.scan_id or profile.source_scan_id = 'direct-creation')
    and coalesce(nullif(profile.automation->>'renewedAt', '')::timestamptz, '-infinity'::timestamptz) <= v_now - interval '1 day'
  returning profile.*;
end;
$$;
revoke all on function public.aix_next_renew_public_profiles(text) from public, anon, authenticated;
grant execute on function public.aix_next_renew_public_profiles(text) to service_role;
