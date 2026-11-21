import type { Metadata } from "next";
import { createNote, deleteNote, updateNote } from "@/app/actions";
import { ConfirmDelete } from "@/components/confirm-delete";
import { PageHeading } from "@/components/page-heading";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Notes" };

const categories = ["Networking", "Cloud", "Linux", "Web Development", "Security", "Troubleshooting", "Other"];
const inputClass = "field mt-2 min-h-11 px-3 text-sm";
const labelClass = "block text-sm font-medium text-[var(--lab-secondary)]";

export default async function NotesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const db = await createClient();
  const { data: notes, error } = await db.from("notes").select("id,title,content,category,tags,created_at,updated_at").order("updated_at", { ascending: false });
  const filtered = (notes ?? []).filter((note) => !q || `${note.title} ${note.content} ${note.category} ${(note.tags ?? []).join(" ")}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <PageHeading title="Notes" description="Keep technical details you want to find again.">
        <a className="button-primary" href="#new-note">New note</a>
      </PageHeading>

      <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,.8fr)]">
        <section aria-labelledby="notes-list-heading">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <h2 id="notes-list-heading" className="section-title">Saved notes</h2>
            <form action="/notes" role="search" className="w-full sm:w-72">
              <label className="sr-only" htmlFor="note-search">Search notes</label>
              <input id="note-search" name="q" type="search" defaultValue={q} placeholder="Search notes" className="field min-h-11 px-3 text-sm" />
            </form>
          </div>

          {error ? (
            <p className="py-5 text-sm error-message" role="alert">Could not load notes. Check the database connection and access policies, then reload this page.</p>
          ) : filtered.length ? (
            <ul className="m-0 list-none divide-y divide-[var(--lab-border)] p-0">
              {filtered.map((note) => (
                <li key={note.id} className="py-5 first:pt-2">
                  <div className="flex items-start gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <h3 className="m-0 text-base font-medium">{note.title}</h3>
                        <span className="text-sm text-[var(--lab-secondary)]">{note.category}</span>
                      </div>
                      <p className="mt-1 mb-0 text-xs quiet">Updated {new Date(note.updated_at).toLocaleDateString("en-GB")}</p>
                    </div>
                    <ConfirmDelete action={deleteNote} id={note.id} label={note.title} />
                  </div>
                  <p className="mt-4 mb-0 whitespace-pre-wrap break-words text-sm leading-6 text-[var(--lab-secondary)]">{note.content}</p>
                  {note.tags?.length > 0 && <p className="mt-3 mb-0 break-words text-xs quiet">{note.tags.join(" · ")}</p>}
                  <details className="mt-3">
                    <summary className="inline-flex min-h-9 items-center text-sm font-medium text-[var(--lab-accent)]">Edit note</summary>
                    <form action={updateNote} className="surface mt-3 space-y-4 p-4">
                      <input type="hidden" name="id" value={note.id} />
                      <label className={labelClass}>Title<input name="title" defaultValue={note.title} required maxLength={160} className={inputClass} /></label>
                      <label className={labelClass}>Content<textarea name="content" defaultValue={note.content} required maxLength={30000} className="field mt-2 min-h-40 p-3 text-sm leading-6" /></label>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <label className={labelClass}>Category<select name="category" defaultValue={note.category} className={inputClass}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
                        <label className={labelClass}>Tags<input name="tags" defaultValue={(note.tags ?? []).join(", ")} className={inputClass} /></label>
                      </div>
                      <button className="button-secondary" type="submit">Save changes</button>
                    </form>
                  </details>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-state">
              <p className="m-0 text-sm font-medium">{q ? "No notes match this search" : "No notes yet"}</p>
              <p className="mt-2 mb-0 text-sm muted">{q ? "Try another title, category, or tag." : "Add a note to keep a useful detail close."}</p>
            </div>
          )}
        </section>

        <section id="new-note" className="surface scroll-mt-20 p-5 sm:p-6" aria-labelledby="new-note-heading">
          <h2 id="new-note-heading" className="section-title">New note</h2>
          <form action={createNote} className="mt-5 space-y-4">
            <label className={labelClass}>Title<input name="title" required maxLength={160} className={inputClass} placeholder="A useful concept or command" /></label>
            <label className={labelClass}>Content<textarea name="content" required maxLength={30000} className="field mt-2 min-h-48 p-3 text-sm leading-6" placeholder="Write your note" /></label>
            <label className={labelClass}>Category<select name="category" className={inputClass}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
            <label className={labelClass}>Tags<input name="tags" className={inputClass} placeholder="subnetting, linux" /><span className="mt-1 block text-xs quiet">Separate tags with commas.</span></label>
            <button className="button-primary w-full" type="submit">Save note</button>
          </form>
        </section>
      </div>
    </>
  );
}
