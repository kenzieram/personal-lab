-- Upgrade installations that already applied the original schema migration.
-- No application data is changed or deleted by this migration.
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
grant usage on schema private to authenticated;

create table if not exists private.admin_users (
  singleton boolean primary key default true check (singleton),
  user_id uuid not null unique references auth.users(id) on delete cascade
);
alter table private.admin_users enable row level security;
revoke all on table private.admin_users from public, anon, authenticated;

create or replace function private.is_personal_lab_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from private.admin_users
    where user_id = (select auth.uid())
  );
$$;
revoke all on function private.is_personal_lab_admin() from public, anon, authenticated;
grant execute on function private.is_personal_lab_admin() to authenticated;

create index if not exists projects_user_id_idx on public.projects (user_id);
create index if not exists notes_user_id_idx on public.notes (user_id);

alter table public.projects enable row level security;
alter table public.notes enable row level security;
revoke all on table public.projects, public.notes from public, anon, authenticated;
grant select, insert, update, delete on public.projects, public.notes to authenticated;

drop policy if exists "admin manages projects" on public.projects;
drop policy if exists "admin manages notes" on public.notes;

drop policy if exists "personal lab admin select projects" on public.projects;
create policy "personal lab admin select projects" on public.projects for select to authenticated
  using ((select private.is_personal_lab_admin()) and user_id = (select auth.uid()));
drop policy if exists "personal lab admin insert projects" on public.projects;
create policy "personal lab admin insert projects" on public.projects for insert to authenticated
  with check ((select private.is_personal_lab_admin()) and user_id = (select auth.uid()));
drop policy if exists "personal lab admin update projects" on public.projects;
create policy "personal lab admin update projects" on public.projects for update to authenticated
  using ((select private.is_personal_lab_admin()) and user_id = (select auth.uid()))
  with check ((select private.is_personal_lab_admin()) and user_id = (select auth.uid()));
drop policy if exists "personal lab admin delete projects" on public.projects;
create policy "personal lab admin delete projects" on public.projects for delete to authenticated
  using ((select private.is_personal_lab_admin()) and user_id = (select auth.uid()));

drop policy if exists "personal lab admin select notes" on public.notes;
create policy "personal lab admin select notes" on public.notes for select to authenticated
  using ((select private.is_personal_lab_admin()) and user_id = (select auth.uid()));
drop policy if exists "personal lab admin insert notes" on public.notes;
create policy "personal lab admin insert notes" on public.notes for insert to authenticated
  with check ((select private.is_personal_lab_admin()) and user_id = (select auth.uid()));
drop policy if exists "personal lab admin update notes" on public.notes;
create policy "personal lab admin update notes" on public.notes for update to authenticated
  using ((select private.is_personal_lab_admin()) and user_id = (select auth.uid()))
  with check ((select private.is_personal_lab_admin()) and user_id = (select auth.uid()));
drop policy if exists "personal lab admin delete notes" on public.notes;
create policy "personal lab admin delete notes" on public.notes for delete to authenticated
  using ((select private.is_personal_lab_admin()) and user_id = (select auth.uid()));
