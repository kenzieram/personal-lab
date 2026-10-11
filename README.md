# Personal Lab

A private, administrator-only workspace for IT projects, learning notes, and browser-based utilities. The repository was empty when implementation started, so this is a new Next.js App Router application.

## Stack

- Next.js 15 App Router, React 19, TypeScript, Tailwind CSS
- Supabase Auth and PostgreSQL, with cookie-based server sessions and row-level security
- Lucide icons

## Local development

Requirements: Node.js 20.9 or newer and npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000). Configure Supabase as described below before private routes can be used. Without configuration, the app redirects to `/login` and clearly reports the missing setup; it never accepts a fake login.

## Structure

- `src/app/(private)` — server-protected workspace pages
- `src/app/actions.ts` — server actions for auth and data writes
- `src/components` — navigation and interactive tools
- `src/lib/supabase` — server-side Supabase clients and middleware session refresh
- `src/lib/network.ts` — local IPv4 subnet calculation
- `supabase/migrations` — schema, constraints, triggers, and RLS policies

## Supabase setup and admin account

1. Create a Supabase project and copy its Project URL and publishable/anon key into `.env.local` as `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Set `ADMIN_USER_ID` to the UUID of the one administrator. Do not add a service-role key to this app.
2. In Supabase Authentication settings, disable **Allow new users to sign up**. Create the administrator yourself in the Supabase Dashboard (or another trusted administrative process). No public registration route exists.
3. Apply `supabase/migrations/202610110001_initial_schema.sql` in the Supabase SQL editor. Set the database setting in that SQL file's comment to the same admin UUID, e.g. `alter database postgres set app.admin_user_id = '...';`. Reconnect the app after changing the database setting.
4. For production, configure the same three variables in the hosting provider's encrypted environment settings. Use HTTPS and update Supabase Auth's site URL and allowed redirect URLs for the chosen domain.

The middleware verifies the Supabase user server-side and checks the stable user UUID against `ADMIN_USER_ID`. Server actions repeat the check before writes. The database RLS policies independently require the authenticated UUID to match the database-side `app.admin_user_id` allowlist and the row's `user_id`. Never put a service-role key in this project. To verify anonymous isolation, run `select * from public.projects;` using an anonymous Supabase client (expect no rows / a permission error), then query with the administrator session; an authenticated non-admin should also see no rows and cannot write. Confirm SQL editor/service roles are not used for this test because they bypass RLS.

### Environment variables

| Name | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser-safe publishable key (RLS remains mandatory) |
| `ADMIN_USER_ID` | UUID allowlist for the single administrator |

`.env.local` and other local env files are ignored by Git. `.env.example` contains placeholders only.

## Features

Implemented: responsive dark workspace shell, authenticated login/logout flow, server-verified admin-only routes, dashboard counts/recent projects, project and note creation/deletion, note search, IPv4 subnet calculator including `/31` and `/32`, JSON formatter/validator, cloud documentation placeholders, and settings.

Still needs setup or further work: Supabase project/database/admin configuration; dedicated project detail routes; additional dev utilities; automated browser viewport checks; production deployment and the final school domain. DNS lookup and AWS resource access are deliberately not implemented. Cloud Lab does not provision services. Dashboard counts are real database queries, not infrastructure monitoring.

## Checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

The subnet calculator test file covers a `/24`, `/31`, `/32`, and invalid input.

## Deployment and domain

Deploy to a provider that supports the Next.js App Router and configure the environment variables there. Vercel Hobby can be considered for a personal project, but check its current usage limits and terms before relying on it. Add the school-provided domain only after it is assigned; configure DNS and HTTPS at the provider, then update Supabase Auth's site URL/redirect allowlist. The source has no hard-coded domain.

## Troubleshooting

- `/login?error=setup`: fill the three variables in `.env.local`, restart `npm run dev`.
- Login returns an error: check that sign-in is enabled for the admin account and that `ADMIN_USER_ID` exactly matches the Auth user UUID.
- Tables fail to load: apply the migration and database setting, then verify RLS and the project URL/key.
- Auth redirects fail in production: add the HTTPS production URL and callback URLs to Supabase Auth settings.
