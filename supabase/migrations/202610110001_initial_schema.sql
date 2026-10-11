-- Set app.admin_user_id in Supabase to the UUID of the single administrator.
-- Example (run in SQL editor after creating the Auth user):
-- alter database postgres set app.admin_user_id = '00000000-0000-0000-0000-000000000000';
-- RLS compares auth.uid() against this database-side allowlist setting.
create extension if not exists pgcrypto;

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

create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
drop trigger if exists projects_touch_updated_at on public.projects;
create trigger projects_touch_updated_at before update on public.projects for each row execute function public.touch_updated_at();
drop trigger if exists notes_touch_updated_at on public.notes;
create trigger notes_touch_updated_at before update on public.notes for each row execute function public.touch_updated_at();

alter table public.projects enable row level security;
alter table public.notes enable row level security;
drop policy if exists "admin manages projects" on public.projects;
create policy "admin manages projects" on public.projects for all to authenticated
  using (auth.uid() = nullif(current_setting('app.admin_user_id', true), '')::uuid and user_id = auth.uid())
  with check (auth.uid() = nullif(current_setting('app.admin_user_id', true), '')::uuid and user_id = auth.uid());
drop policy if exists "admin manages notes" on public.notes;
create policy "admin manages notes" on public.notes for all to authenticated
  using (auth.uid() = nullif(current_setting('app.admin_user_id', true), '')::uuid and user_id = auth.uid())
  with check (auth.uid() = nullif(current_setting('app.admin_user_id', true), '')::uuid and user_id = auth.uid());
grant select, insert, update, delete on public.projects, public.notes to authenticated;
