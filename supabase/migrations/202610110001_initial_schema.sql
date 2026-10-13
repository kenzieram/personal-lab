create extension if not exists pgcrypto;

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

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 100),
  description text not null default '' check (char_length(description) <= 2000),
  category text not null default 'Other' check (category in ('Web Development','Networking','Cloud Computing','Cybersecurity','Hardware & IoT','Other')),
  status text not null default 'Planning' check (status in ('Planning','In Progress','Paused','Completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 160),
  content text not null check (char_length(content) <= 30000),
  category text not null default 'Other' check (category in ('Networking','Cloud','Linux','Web Development','Security','Troubleshooting','Other')),
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists projects_updated_at_idx on public.projects (updated_at desc);
create index if not exists notes_updated_at_idx on public.notes (updated_at desc);
create index if not exists projects_user_id_idx on public.projects (user_id);
create index if not exists notes_user_id_idx on public.notes (user_id);

create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
drop trigger if exists projects_touch_updated_at on public.projects;
create trigger projects_touch_updated_at before update on public.projects for each row execute function public.touch_updated_at();
drop trigger if exists notes_touch_updated_at on public.notes;
create trigger notes_touch_updated_at before update on public.notes for each row execute function public.touch_updated_at();

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
