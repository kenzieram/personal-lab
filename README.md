# Personal Lab

A private, single-administrator workspace for IT projects, learning notes, and browser-based utilities.

## Stack

- Next.js 16 App Router, React 19, TypeScript, and Tailwind CSS 4
- Supabase Auth and PostgreSQL with cookie-based server sessions and row-level security (RLS)
- Supabase packages: `@supabase/ssr` 0.6.x and `@supabase/supabase-js` 2.x
- Builds use Webpack explicitly because Turbopack failed with `Operation not permitted` in this development environment.

## Local development

Requirements: Node.js 20.9 or newer and npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

If `.env.local` already exists, update it locally without replacing its values. Never paste its contents into chat or commit it. The app checks the Supabase URL, key type, and administrator UUID format; this format check does not prove that the project is reachable.

## Supabase setup

Select the section that matches the database's confirmed state. Do not infer the state from the migration files or migration-history table alone. In Supabase Authentication settings, keep public sign-ups disabled and use the existing administrator Auth account where one is already present.

### New database

1. Apply `supabase/migrations/202610110001_initial_schema.sql` in the Supabase SQL Editor.
2. After it succeeds, apply `supabase/migrations/202610110002_harden_admin_rls.sql`.
3. Add the existing administrator Auth UUID to the private allowlist using the SQL shown below.

### Legacy database using the old policy

Use this path only after confirming that the database already has `public.projects` and `public.notes` and still uses the legacy `app.admin_user_id` policy from the original schema. Do not run migration 001 over that database. Apply migration 002, then add the existing administrator Auth UUID to `private.admin_users` using the SQL below. Migration 002 replaces the named legacy policies with the allowlist-based policies.

### This project's database, already migrated manually

The project owner reports that migrations 001 and 002 have already been run manually through Supabase SQL Editor, RLS and permissions have been checked, and the administrator is in the allowlist. **Do not rerun either migration or the allowlist insert for this database as part of a Vercel deployment.** Use read-only metadata checks and an application login/data-operation smoke test if verification is needed. The migration SQL creates schema objects and policies; it is not part of the Vercel build or deploy step.

### Allowlist SQL for new or confirmed legacy databases

Run this only after the migrations for that database have succeeded and the Auth user exists:

   ```sql
   insert into private.admin_users (user_id)
   values ('YOUR_AUTH_USER_UUID');
   ```

Replace the placeholder with the Auth user's UUID. Keep the `private` schema out of the Data API's exposed schemas. For this project's already-configured database, the allowlist entry is already present and this insert should not be repeated.

Set the same Auth UUID as `ADMIN_USER_ID` in `.env.local` for local development and in the hosting provider's encrypted environment settings for deployment. Set `NEXT_PUBLIC_SUPABASE_URL` to the Project URL and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to the publishable key (or legacy anon key). Do not use a `sb_secret_` or `service_role` key in this app. Confirm that the environment's administrator UUID matches the allowlist without printing either value.

If the environment UUID and database allowlist differ, application checks and RLS fail closed and data operations are denied.

The migrations in this repository were applied to this project's database manually through SQL Editor. Manual SQL execution does not establish that Supabase CLI migration history is synchronized. Do not run `supabase db push` or `supabase migration repair` until the live schema and migration history have been compared with these files and a deliberate reconciliation plan has been reviewed.

### Environment variables

| Name | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | HTTPS Supabase project URL (localhost HTTP is allowed for local development) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser-safe publishable key or legacy anon key; service-role/secret keys are rejected |
| `ADMIN_USER_ID` | UUID allowlist used by the server-side application checks |

`.env.local`, other environment files, private keys, certificates, and common credential files are excluded by `.gitignore`. `.env.example` contains placeholder values only.

## Authentication and database security

- The Next.js Proxy and private route layout verify the Supabase session with `auth.getUser()` and allow only the exact `ADMIN_USER_ID`.
- Every server action checks the session and administrator UUID again. Project and note inserts set `user_id` from the verified server-side Auth user; the form cannot choose it.
- The database keeps the single admin UUID in `private.admin_users`, which is not granted to client roles. RLS calls a `SECURITY DEFINER` helper in the private schema. The helper uses an empty `search_path`, reads only whether the caller's `auth.uid()` is allowlisted, and is executable only by `authenticated` users.
- Separate RLS policies protect `SELECT`, `INSERT`, `UPDATE`, and `DELETE` on both `projects` and `notes`. Each requires the allowlisted Auth user and `user_id = auth.uid()`. Anonymous table grants are revoked; ordinary authenticated users cannot read or write these rows, and even the administrator cannot assign rows to another UUID.
- The application uses only a publishable/anon key and the user's cookie session. No service-role key is needed or supported.

The current `projects` and `notes` foreign keys use `ON DELETE CASCADE`. Deleting the administrator from Supabase Auth therefore deletes that user's project and note rows as well; back up or migrate that data before deleting the Auth user.

The SQL regression suite is in `supabase/tests/personal_lab_rls.test.sql`. It uses transaction-scoped fixtures and rolls them back. Run it against a **local** Supabase database with `supabase test db` after setting up the Supabase CLI/local project; it has not been run against a cloud database. Do not run the fixture test in the production SQL Editor.

## Project structure

- `src/app/(private)` — server-protected workspace pages
- `src/app/actions.ts` — authentication and database write actions
- `src/components` — navigation and interactive tools
- `src/lib/supabase` — environment validation and server-side Supabase session clients, including Proxy session refresh
- `src/lib/network.ts` — IPv4 subnet calculation
- `supabase/migrations` — schema, allowlist, and RLS policies
- `supabase/tests` — local database RLS tests

## Features

Implemented: responsive dark workspace shell, authenticated login/logout, admin-only routes, dashboard counts/recent projects, project and note CRUD, note search, IPv4 subnet calculator including `/31` and `/32`, JSON formatter/validator, and cloud documentation placeholders. DNS lookup and AWS resource access are not implemented. Cloud Lab does not provision services.

## Checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

`npm test` covers IPv4 subnet behavior and Supabase environment validation. The database RLS test requires a local Supabase database.

## Deployment

Deploy to a provider that supports the Next.js App Router and configure all three environment variables in its encrypted environment settings. Use HTTPS, keep public sign-up disabled, and configure Supabase Auth's Site URL and allowed redirect URLs for the deployment domain. The project owner reports that the current Supabase schema was already applied and verified manually; Vercel deployment and the production domain have not yet been verified.
