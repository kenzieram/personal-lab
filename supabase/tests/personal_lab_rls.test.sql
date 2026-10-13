-- Run with `supabase test db` after applying migrations locally.
-- All fixture rows are rolled back at the end of this transaction.
begin;
select no_plan();

insert into auth.users (id, email) values
  ('11111111-1111-4111-8111-111111111111', 'personal-lab-admin@example.invalid'),
  ('22222222-2222-4222-8222-222222222222', 'personal-lab-nonadmin@example.invalid');
insert into private.admin_users (user_id)
values ('11111111-1111-4111-8111-111111111111');
insert into public.projects (id, user_id, name)
values ('33333333-3333-4333-8333-333333333333', '11111111-1111-4111-8111-111111111111', 'RLS project fixture');
insert into public.notes (id, user_id, title, content)
values ('44444444-4444-4444-8444-444444444444', '11111111-1111-4111-8111-111111111111', 'RLS note fixture', 'fixture');

-- Anonymous requests have no table grants.
set local role anon;
select throws_ok($$select * from public.projects$$, '42501', null, 'anon cannot select projects');
select throws_ok($$insert into public.projects (user_id, name) values ('11111111-1111-4111-8111-111111111111', 'blocked')$$, '42501', null, 'anon cannot insert projects');
select throws_ok($$update public.projects set name = 'blocked' returning id$$, '42501', null, 'anon cannot update projects');
select throws_ok($$delete from public.projects returning id$$, '42501', null, 'anon cannot delete projects');
select throws_ok($$select * from public.notes$$, '42501', null, 'anon cannot select notes');
select throws_ok($$insert into public.notes (user_id, title, content) values ('11111111-1111-4111-8111-111111111111', 'blocked', 'blocked')$$, '42501', null, 'anon cannot insert notes');
select throws_ok($$update public.notes set title = 'blocked' returning id$$, '42501', null, 'anon cannot update notes');
select throws_ok($$delete from public.notes returning id$$, '42501', null, 'anon cannot delete notes');

-- Authenticated but non-admin requests have grants, but fail the RLS allowlist.
set local role authenticated;
set local request.jwt.claim.sub = '22222222-2222-4222-8222-222222222222';
select is(private.is_personal_lab_admin(), false, 'non-admin fails the private allowlist check');
select is_empty($$select id from public.projects$$, 'non-admin cannot read projects');
select is_empty($$select id from public.notes$$, 'non-admin cannot read notes');
select throws_ok($$insert into public.projects (user_id, name) values ('22222222-2222-4222-8222-222222222222', 'blocked')$$, '42501', null, 'non-admin cannot insert a project for self');
select throws_ok($$insert into public.projects (user_id, name) values ('11111111-1111-4111-8111-111111111111', 'blocked')$$, '42501', null, 'non-admin cannot insert a project for admin');
select throws_ok($$insert into public.notes (user_id, title, content) values ('22222222-2222-4222-8222-222222222222', 'blocked', 'blocked')$$, '42501', null, 'non-admin cannot insert a note for self');
select throws_ok($$insert into public.notes (user_id, title, content) values ('11111111-1111-4111-8111-111111111111', 'blocked', 'blocked')$$, '42501', null, 'non-admin cannot insert a note for admin');
select is_empty($$update public.projects set name = 'blocked' returning id$$, 'non-admin cannot update projects');
select is_empty($$delete from public.projects returning id$$, 'non-admin cannot delete projects');
select is_empty($$update public.notes set title = 'blocked' returning id$$, 'non-admin cannot update notes');
select is_empty($$delete from public.notes returning id$$, 'non-admin cannot delete notes');

-- The configured admin may CRUD its own rows. Inserts use auth.uid() and cannot forge user_id.
set local request.jwt.claim.sub = '11111111-1111-4111-8111-111111111111';
select is(private.is_personal_lab_admin(), true, 'configured administrator passes the private allowlist check');
select results_eq($$select name from public.projects where id = '33333333-3333-4333-8333-333333333333'$$, array['RLS project fixture'], 'admin reads projects');
select results_eq($$select title from public.notes where id = '44444444-4444-4444-8444-444444444444'$$, array['RLS note fixture'], 'admin reads notes');
select results_eq($$insert into public.projects (name) values ('admin-created project') returning user_id::text$$, array['11111111-1111-4111-8111-111111111111'], 'project default user_id comes from auth.uid()');
select results_eq($$insert into public.notes (title, content) values ('admin-created note', 'created') returning user_id::text$$, array['11111111-1111-4111-8111-111111111111'], 'note default user_id comes from auth.uid()');
select throws_ok($$insert into public.projects (user_id, name) values ('22222222-2222-4222-8222-222222222222', 'forged')$$, '42501', null, 'admin cannot forge a project owner');
select throws_ok($$insert into public.notes (user_id, title, content) values ('22222222-2222-4222-8222-222222222222', 'forged', 'forged')$$, '42501', null, 'admin cannot forge a note owner');
select throws_ok($$update public.projects set user_id = '22222222-2222-4222-8222-222222222222' where id = '33333333-3333-4333-8333-333333333333'$$, '42501', null, 'admin cannot reassign a project owner');
select throws_ok($$update public.notes set user_id = '22222222-2222-4222-8222-222222222222' where id = '44444444-4444-4444-8444-444444444444'$$, '42501', null, 'admin cannot reassign a note owner');
select results_eq($$update public.projects set name = 'updated project' where id = '33333333-3333-4333-8333-333333333333' returning name$$, array['updated project'], 'admin updates own project');
select results_eq($$update public.notes set title = 'updated note' where id = '44444444-4444-4444-8444-444444444444' returning title$$, array['updated note'], 'admin updates own note');
select results_eq($$delete from public.projects where id = '33333333-3333-4333-8333-333333333333' returning name$$, array['updated project'], 'admin deletes own project');
select results_eq($$delete from public.notes where id = '44444444-4444-4444-8444-444444444444' returning title$$, array['updated note'], 'admin deletes own note');

select * from finish();
rollback;
