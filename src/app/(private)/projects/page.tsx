import type { Metadata } from "next";
import { createProject, deleteProject, updateProject } from "@/app/actions";
import { ConfirmDelete } from "@/components/confirm-delete";
import { PageHeading } from "@/components/page-heading";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Projects" };

const categories = ["Web Development", "Networking", "Cloud Computing", "Cybersecurity", "Hardware & IoT", "Other"];
const statuses = ["Planning", "In Progress", "Paused", "Completed"];

const inputClass = "field mt-2 min-h-11 px-3 text-sm";
const labelClass = "block text-sm font-medium text-[var(--lab-secondary)]";

export default async function ProjectsPage() {
  const db = await createClient();
  const { data: projects, error } = await db
    .from("projects")
    .select("id,name,description,category,status,created_at,updated_at")
    .order("updated_at", { ascending: false });

  return (
    <>
      <PageHeading title="Projects" description="Keep experiments and builds in one place.">
        <a className="button-primary" href="#new-project">New project</a>
      </PageHeading>

      <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,.8fr)]">
        <section aria-labelledby="project-list-heading">
          <h2 id="project-list-heading" className="section-title mb-4">Your projects</h2>
          {error ? (
            <p className="py-5 text-sm error-message" role="alert">Could not load projects. Check the database connection and access policies, then reload this page.</p>
          ) : projects?.length ? (
            <ul className="m-0 list-none divide-y divide-[var(--lab-border)] p-0">
              {projects.map((project) => (
                <li key={project.id} className="py-5 first:pt-2">
                  <div className="flex items-start gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <h3 className="m-0 text-base font-medium">{project.name}</h3>
                        <span className="text-sm text-[var(--lab-secondary)]">{project.status}</span>
                      </div>
                      <p className="mt-1 mb-0 text-sm muted">{project.category}</p>
                      {project.description && <p className="mt-3 mb-0 whitespace-pre-wrap break-words text-sm leading-6 text-[var(--lab-secondary)]">{project.description}</p>}
                      <p className="mt-3 mb-0 text-xs quiet">Updated {new Date(project.updated_at).toLocaleDateString("en-GB")}</p>
                    </div>
                    <ConfirmDelete action={deleteProject} id={project.id} label={project.name} />
                  </div>
                  <details className="mt-3">
                    <summary className="inline-flex min-h-9 items-center text-sm font-medium text-[var(--lab-accent)]">Edit project</summary>
                    <form action={updateProject} className="surface mt-3 space-y-4 p-4">
                      <input type="hidden" name="id" value={project.id} />
                      <label className={labelClass}>Project name<input name="name" defaultValue={project.name} required maxLength={100} className={inputClass} /></label>
                      <label className={labelClass}>Description<textarea name="description" defaultValue={project.description} maxLength={2000} className="field mt-2 min-h-24 p-3 text-sm leading-6" /></label>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <label className={labelClass}>Category<select name="category" defaultValue={project.category} className={inputClass}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
                        <label className={labelClass}>Status<select name="status" defaultValue={project.status} className={inputClass}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></label>
                      </div>
                      <button className="button-secondary" type="submit">Save changes</button>
                    </form>
                  </details>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-state">
              <p className="m-0 text-sm font-medium">No projects yet</p>
              <p className="mt-2 mb-0 text-sm muted">Use the form to add the first project to your workspace.</p>
            </div>
          )}
        </section>

        <section id="new-project" className="surface scroll-mt-20 p-5 sm:p-6" aria-labelledby="new-project-heading">
          <h2 id="new-project-heading" className="section-title">New project</h2>
          <form action={createProject} className="mt-5 space-y-4">
            <label className={labelClass}>Project name<input name="name" required maxLength={100} className={inputClass} placeholder="Home network monitor" /></label>
            <label className={labelClass}>Description<textarea name="description" maxLength={2000} className="field mt-2 min-h-24 p-3 text-sm leading-6" placeholder="What are you building or learning?" /></label>
            <label className={labelClass}>Category<select name="category" className={inputClass}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
            <label className={labelClass}>Status<select name="status" className={inputClass}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></label>
            <button className="button-primary w-full" type="submit">Create project</button>
          </form>
        </section>
      </div>
    </>
  );
}
