import type { Metadata } from "next";
import Link from "next/link";
import { FlaskConical } from "lucide-react";
import { signIn } from "@/app/actions";
import { isAppConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = { title: "Sign in" };

const messages: Record<string, string> = {
  setup: "Supabase configuration is missing or invalid. Check the URL, publishable key, and administrator UUID described in the README.",
  unauthorized: "This account is not authorized for this workspace.",
  credentials: "Sign-in failed. Check your email and password, then try again.",
};

export default async function Login({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const configured = isAppConfigured();

  return (
    <main id="main-content" className="grid min-h-screen lg:grid-cols-[1fr_1fr]">
      <section className="hidden border-r border-[var(--lab-border)] bg-[var(--lab-surface)] p-12 lg:flex lg:flex-col lg:justify-between xl:p-16">
        <Link href="/login" className="flex w-fit items-center gap-3 text-base font-semibold">
          <span className="brand-mark" aria-hidden="true"><FlaskConical size={18} strokeWidth={1.8} /></span>
          Personal Lab
        </Link>
        <div className="max-w-md">
          <h1 className="text-4xl font-medium leading-tight tracking-[-.04em]">A private workspace for your technical work.</h1>
          <p className="mt-5 max-w-sm text-base leading-7 muted">Projects, notes, and small tools for the things you build and study.</p>
        </div>
        <p className="mb-0 text-sm quiet">Administrator access only</p>
      </section>

      <section className="flex min-h-screen items-center justify-center px-5 py-12 sm:px-8">
        <div className="w-full max-w-[400px]">
          <Link href="/login" className="mb-12 flex w-fit items-center gap-3 text-base font-semibold lg:hidden">
            <span className="brand-mark" aria-hidden="true"><FlaskConical size={18} strokeWidth={1.8} /></span>
            Personal Lab
          </Link>
          <h2 className="text-3xl font-medium tracking-[-.035em]">Sign in</h2>
          <p className="mt-2 mb-0 text-sm muted">Use the administrator account for this workspace.</p>

          {error && <p role="alert" className="mt-6 border-l-2 border-[#c66e6e] bg-[#241719] p-3 text-sm leading-6 text-[#ffc1c1]">{messages[error] ?? messages.credentials}</p>}
          {!configured && <p role="alert" className="mt-5 border-l-2 border-[#d6b975] bg-[#211e16] p-3 text-sm leading-6 text-[#ead7a3]">Supabase configuration is missing or invalid. Check the required values in <code>.env.local</code>. Do not use a service-role key.</p>}

          <form action={signIn} className="mt-8 space-y-5">
            <label className="block text-sm font-medium text-[var(--lab-secondary)]">
              Email
              <input name="email" type="email" autoComplete="username" required className="field mt-2 min-h-12 px-3 text-base" placeholder="email@example.com" />
            </label>
            <label className="block text-sm font-medium text-[var(--lab-secondary)]">
              Password
              <input name="password" type="password" autoComplete="current-password" required className="field mt-2 min-h-12 px-3 text-base" placeholder="Your password" />
            </label>
            <button disabled={!configured} className="button-primary min-h-12 w-full" type="submit">Sign in</button>
          </form>
          <p className="mt-6 mb-0 text-sm leading-6 quiet">Public account creation is disabled.</p>
        </div>
      </section>
    </main>
  );
}
