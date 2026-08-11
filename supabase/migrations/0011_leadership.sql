-- Leadership role: 'leader' profiles get a read-only management panel scoped
-- to the team they lead (leads_team = 'all' for company-wide leadership).
alter table profiles add column leads_team text;

-- Assign role + leads_team by email at signup time, since these are known
-- leadership hires — everyone still goes through the normal mandatory
-- job_title/team profile step regardless of this.
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  assigned_team text;
begin
  assigned_team := case lower(new.email)
    when 'karen.silva@morada.ai' then 'marketing'
    when 'pedro.miranda@morada.ai' then 'cs'
    when 'luiza.kolanscki@morada.ai' then 'onboarding'
    when 'lucas.carvalho@morada.ai' then 'tecnologia'
    when 'gabriel.chaves@morada.ai' then 'produto'
    when 'ramon@morada.ai' then 'all'
    when 'luis@morada.ai' then 'all'
    when 'gabriel.maracaipe@morada.ai' then 'all'
    else null
  end;

  insert into public.profiles (id, email, full_name, avatar_url, role, leads_team)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url',
    case when assigned_team is not null then 'leader' else 'member' end,
    assigned_team
  );
  return new;
end;
$$;

-- Backfill in case any of them already signed in before this migration ran.
update profiles set role = 'leader', leads_team = 'marketing' where lower(email) = 'karen.silva@morada.ai';
update profiles set role = 'leader', leads_team = 'cs' where lower(email) = 'pedro.miranda@morada.ai';
update profiles set role = 'leader', leads_team = 'onboarding' where lower(email) = 'luiza.kolanscki@morada.ai';
update profiles set role = 'leader', leads_team = 'tecnologia' where lower(email) = 'lucas.carvalho@morada.ai';
update profiles set role = 'leader', leads_team = 'produto' where lower(email) = 'gabriel.chaves@morada.ai';
update profiles set role = 'leader', leads_team = 'all' where lower(email) in ('ramon@morada.ai', 'luis@morada.ai', 'gabriel.maracaipe@morada.ai');

create function is_leader()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'leader');
$$;

create function leader_scope()
returns text
language sql
security definer set search_path = public
stable
as $$
  select leads_team from profiles where id = auth.uid() and role = 'leader';
$$;

-- Leaders can see progress for people on their team ('all' = everyone) —
-- on top of the existing own_progress and admin_reads_progress policies.
create policy leader_reads_scoped_progress on lesson_progress for select to authenticated
  using (
    is_leader()
    and (
      leader_scope() = 'all'
      or leader_scope() = (select team from profiles where id = lesson_progress.user_id)
    )
  );
