import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeading } from "@/components/page-heading";

export const metadata: Metadata = { title: "Overview" };

export default async function Dashboard() {
  const db = await createClient();
  const [projectsCount, activeCount, notesCount, recentProjects] = await Promise.all([
    db.from("projects").select("id", { count: "exact", head: true }),
    db.from("projects").select("id", { count: "exact", head: true }).eq("status", "In Progress"),
    db.from("notes").select("id", { count: "exact", head: true }),
    db.from("projects").select("id,name,category,status,updated_at").order("updated_at", { ascending: false }).limit(5),
  ]);
  const summaryError = projectsCount.error || activeCount.error || notesCount.error;

  return (
    <div className="mx-auto w-full max-w-[1120px]">
      <PageHeading
        title="Overview"
        description="Your current projects and saved technical notes."
      >
        <Link className="button-primary" href="/projects">
          <Plus size={15} strokeWidth={2} aria-hidden="true" />
          New project
        </Link>
      </PageHeading>

      <section className="mb-11 border-y border-[var(--lab-border)] py-5" aria-label="Workspace totals">
        <dl className="grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-6">
          {[
            { label: "Projects", value: projectsCount.count },
            { label: "In progress", value: activeCount.count },
            { label: "Notes", value: notesCount.count },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-baseline justify-between gap-4 sm:flex-col sm:gap-1">
              <dt className="text-sm text-[var(--lab-secondary)]">{label}</dt>
              <dd className="m-0 text-xl font-medium tabular-nums">{summaryError ? "Unavailable" : value ?? 0}</dd>
            </div>
          ))}
        </dl>
        {summaryError && <p className="mt-4 text-sm error-message" role="status">Could not load workspace totals. Check the database connection and access policies.</p>}
      </section>

      <section aria-labelledby="recent-projects-heading">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 id="recent-projects-heading" className="section-title">Recently updated</h2>
          <Link href="/projects" className="text-sm font-medium text-[var(--lab-accent)] hover:underline">All projects</Link>
        </div>

        {recentProjects.error ? (
          <div className="empty-state" role="alert">
            <p className="m-0 text-sm error-message">Could not load projects.</p>
            <p className="mt-2 mb-0 text-sm muted">Check the database connection and access policies, then reload this page.</p>
          </div>
        ) : recentProjects.data?.length ? (
          <ul className="m-0 list-none divide-y divide-[var(--lab-border)] p-0">
            {recentProjects.data.map((project) => (
              <li key={project.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 py-4 sm:grid-cols-[minmax(0,1.5fr)_minmax(160px,.75fr)_minmax(130px,.65fr)]">
                <Link href="/projects" className="min-w-0 truncate text-sm font-medium hover:text-[var(--lab-accent)]">{project.name}</Link>
                <span className="col-start-1 row-start-2 text-sm muted sm:col-start-2 sm:row-start-1">{project.category}</span>
                <span className="row-span-2 text-right text-sm text-[var(--lab-secondary)] sm:row-span-1 sm:text-left">{project.status}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty-state">
            <p className="m-0 text-sm font-medium">No projects yet</p>
            <p className="mt-2 mb-0 text-sm muted">Create a project to keep an experiment or build in view.</p>
            <Link className="mt-4 inline-flex text-sm font-medium text-[var(--lab-accent)] hover:underline" href="/projects">Create a project</Link>
          </div>
        )}
      </section>
    </div>
  );
}
