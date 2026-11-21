import type { Metadata } from "next";
import Link from "next/link";
import { PageHeading } from "@/components/page-heading";

export const metadata: Metadata = { title: "Cloud" };

export default function CloudPage() {
  return (
    <>
      <PageHeading title="Cloud" description="Keep cloud learning notes alongside your other references." />
      <section className="max-w-2xl border-y border-[var(--lab-border)] py-5" aria-labelledby="cloud-scope-heading">
        <h2 id="cloud-scope-heading" className="section-title">Cloud account connections</h2>
        <p className="mt-2 mb-0 text-sm leading-6 muted">No cloud account is connected. This page does not provision resources or store cloud credentials.</p>
        <Link href="/notes" className="mt-4 inline-flex min-h-10 items-center text-sm font-medium text-[var(--lab-accent)] hover:underline">Open notes</Link>
      </section>
    </>
  );
}
