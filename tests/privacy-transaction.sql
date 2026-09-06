-- Run only in a disposable database with migrations 001-011 applied.
begin;
create function pg_temp.check_privacy(ok boolean, message text) returns void
language plpgsql as $$ begin if ok is distinct from true then raise exception '%', message; end if; end; $$;

insert into public.aix_next_scans(id,target_url,stage) values
 ('privacy_scan','https://example.com','complete'),
 ('shared_scan','https://example.com','complete'),
 ('profile_scan','https://example.com','complete');
insert into public.aix_next_watches(id,token,email,scan_id,baseline,latest,next_run_at) values
 ('privacy_watch','private_token','owner@example.com','privacy_scan','{}','{}',now()),
 ('shared_a','shared_token_a','a@example.com','shared_scan','{}','{}',now()),
 ('shared_b','shared_token_b','b@example.com','shared_scan','{}','{}',now()),
 ('profile_watch','profile_watch_token','owner@example.com','profile_scan','{}','{}',now());
insert into public.aix_next_public_profiles(id,slug,status,title,brand_name,target_url,token,source_scan_id,expires_at)
 values ('foreign_profile','foreign-profile','draft','PRIVATE DRAFT','Company','https://example.com','foreign_profile_secret','profile_scan',now()+interval '1 day');
insert into public.aix_next_watch_runs(id,watch_id,watch_token,status,target_url,discovery,prompts,panel_kind,repetitions)
 select 'privacy_run_'||n,'privacy_watch','private_token','completed','https://example.com','{}','[]','free',1
 from generate_series(1,1101) n;
insert into public.aix_next_watch_runs(id,watch_id,watch_token,status,target_url,discovery,panel_kind,repetitions)
 values ('foreign_run','shared_b','shared_token_b','completed','https://example.com','{}','free',1);

select pg_temp.check_privacy(jsonb_array_length(public.aix_next_export_watch_data('private_token',' OWNER@EXAMPLE.COM ')->'measurementRuns')=1101,'export silently paginated');
select pg_temp.check_privacy(public.aix_next_export_watch_data('private_token','owner@example.com')->'scan'->>'id'='privacy_scan','linked scan missing');
select pg_temp.check_privacy(public.aix_next_export_watch_data('private_token','owner@example.com')::text not like '%private_token%','bearer leaked');
select pg_temp.check_privacy(public.aix_next_export_watch_data('shared_token_a','a@example.com')::text not like '%foreign_run%','other Watch runs leaked');
select pg_temp.check_privacy(public.aix_next_export_watch_data('profile_watch_token','owner@example.com')::text not like '%foreign_profile_secret%','profile owner token leaked');

do $$ begin
 begin
  perform public.aix_next_export_watch_data('private_token','wrong@example.com');
  raise exception 'wrong email accepted';
 exception when invalid_authorization_specification then null;
 end;
end $$;

-- Fail at the LAST write: all earlier deletes must roll back together.
create function pg_temp.reject_privacy_audit() returns trigger language plpgsql as $$
begin raise exception 'injected audit failure' using errcode='23514'; end; $$;
create trigger privacy_test_audit_failure before insert on public.aix_next_deletion_audit
 for each row execute function pg_temp.reject_privacy_audit();
do $$ begin
 begin
  perform public.aix_next_delete_watch_data('private_token','owner@example.com',null,false);
  raise exception 'injected failure ignored';
 exception when check_violation then null;
 end;
end $$;
select pg_temp.check_privacy(exists(select 1 from public.aix_next_watches where id='privacy_watch'),'Watch lost after rollback');
select pg_temp.check_privacy(exists(select 1 from public.aix_next_scans where id='privacy_scan'),'Scan lost after rollback');
select pg_temp.check_privacy((select count(*) from public.aix_next_watch_runs where watch_id='privacy_watch')=1101,'runs lost after rollback');
select pg_temp.check_privacy(not exists(select 1 from public.aix_next_deletion_audit where watch_id='privacy_watch'),'failed deletion audit committed');
drop trigger privacy_test_audit_failure on public.aix_next_deletion_audit;

do $$ declare first_result jsonb; retry_result jsonb; begin
 first_result := public.aix_next_delete_watch_data('private_token','owner@example.com',null,false);
 retry_result := public.aix_next_delete_watch_data('private_token','OWNER@example.com',null,false);
 perform pg_temp.check_privacy(first_result=retry_result,'retry receipt changed');
 perform pg_temp.check_privacy(first_result->>'scanDeleted'='true','unshared Scan not deleted');
 begin
  perform public.aix_next_delete_watch_data('private_token','wrong@example.com',null,false);
  raise exception 'receipt disclosed to wrong email';
 exception when invalid_authorization_specification then null;
 end;
end $$;
select pg_temp.check_privacy(not exists(select 1 from public.aix_next_watch_runs where watch_id='privacy_watch'),'runs survived deletion');
select pg_temp.check_privacy((select count(*) from public.aix_next_deletion_audit where watch_id='privacy_watch')=1,'duplicate audit on retry');

select public.aix_next_delete_watch_data('shared_token_a','a@example.com',null,false);
select pg_temp.check_privacy(exists(select 1 from public.aix_next_scans where id='shared_scan'),'shared Scan deleted');
select pg_temp.check_privacy(exists(select 1 from public.aix_next_watches where id='shared_b'),'other Watch deleted');
select pg_temp.check_privacy(exists(select 1 from public.aix_next_watch_runs where id='foreign_run'),'other Watch run deleted');
select public.aix_next_delete_watch_data('shared_token_b','b@example.com',null,false);
select pg_temp.check_privacy(not exists(select 1 from public.aix_next_scans where id='shared_scan'),'last Watch left orphan Scan');

select public.aix_next_delete_watch_data('profile_watch_token','owner@example.com',null,false);
select pg_temp.check_privacy(exists(select 1 from public.aix_next_public_profiles where id='foreign_profile'),'independent profile deleted');
select pg_temp.check_privacy(exists(select 1 from public.aix_next_scans where id='profile_scan'),'independent profile source deleted');
select pg_temp.check_privacy(not has_function_privilege('anon','public.aix_next_delete_watch_data(text,text,text,boolean)','EXECUTE'),'anon can delete');
select pg_temp.check_privacy(not has_function_privilege('authenticated','public.aix_next_export_watch_data(text,text)','EXECUTE'),'authenticated can export');
select pg_temp.check_privacy(has_function_privilege('service_role','public.aix_next_delete_watch_data(text,text,text,boolean)','EXECUTE'),'service role blocked');
rollback;
