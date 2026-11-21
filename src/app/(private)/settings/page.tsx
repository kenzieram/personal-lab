import type { Metadata } from "next";
import { signOut } from "@/app/actions";
import { PageHeading } from "@/components/page-heading";
import { isAppConfigured } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Settings" };

export default function Settings() {
  const configured = isAppConfigured();

  return (
    <>
      <PageHeading title="Settings" />
      <section className="max-w-2xl border-y border-[var(--lab-border)] py-5" aria-labelledby="connection-heading">
        <h2 id="connection-heading" className="section-title">Supabase connection</h2>
        <p className="mt-2 mb-0 text-sm muted">
          {configured
            ? "Required environment values are present. This does not verify database connectivity."
            : "Configuration is incomplete. Check the required values in your deployment environment."}
        </p>
        <p className={`mt-4 mb-0 text-sm font-medium ${configured ? "success-message" : "error-message"}`} role="status">
          {configured ? "Configuration present" : "Configuration incomplete"}
        </p>
      </section>

      <section className="mt-10 max-w-2xl" aria-labelledby="account-heading">
        <h2 id="account-heading" className="section-title">Account</h2>
        <p className="mt-2 mb-4 text-sm muted">Sign out of this administrator session.</p>
        <form action={signOut}>
          <button className="button-secondary" type="submit">Sign out</button>
        </form>
      </section>
    </>
  );
}
