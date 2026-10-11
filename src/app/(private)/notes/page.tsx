import { createNote, deleteNote, updateNote } from "@/app/actions";
import { ConfirmDelete } from "@/components/confirm-delete";
import { createClient } from "@/lib/supabase/server";
import { BookOpenText, Plus } from "lucide-react";

const categories = ["Networking", "Cloud", "Linux", "Web Development", "Security", "Troubleshooting", "Other"];
const field = "focus-ring mt-2 w-full rounded-lg border border-white/[.09] bg-[#0c0d10] px-3 text-sm";

export default async function NotesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const db = await createClient();
  const { data: notes, error } = await db.from("notes").select("id,title,content,category,tags,created_at,updated_at").order("updated_at", { ascending: false });
  const filtered = (notes ?? []).filter(n => !q || `${n.title} ${n.content} ${n.category} ${(n.tags ?? []).join(" ")}`.toLowerCase().includes(q.toLowerCase()));
  return <>
    <div className="mb-7"><p className="mb-2 text-xs font-medium text-violet-300">WORKSPACE / REFERENCE</p><h1 className="font-display text-3xl font-semibold">Knowledge base</h1><p className="mt-2 text-sm text-zinc-500">Save the details you want to remember next time.</p></div>
    <div className="grid gap-5 lg:grid-cols-[.8fr_1.2fr]">
      <form action={createNote} className="h-fit rounded-xl border border-white/[.07] bg-[#111216] p-5">
        <div className="flex items-center gap-2"><Plus size={16} className="text-violet-300"/><h2 className="text-sm font-semibold">New note</h2></div>
        <label className="mt-5 block text-xs text-zinc-400">Title<input name="title" required maxLength={160} className={`${field} h-10`} placeholder="A useful concept or command"/></label>
        <label className="mt-4 block text-xs text-zinc-400">Content<textarea name="content" required maxLength={30000} className={`${field} min-h-44 p-3 leading-6`} placeholder="Write your notes here…"/></label>
        <label className="mt-4 block text-xs text-zinc-400">Category<select name="category" className={`${field} h-10 px-2 text-xs`}>{categories.map(x => <option key={x}>{x}</option>)}</select></label>
        <label className="mt-4 block text-xs text-zinc-400">Tags <span className="text-zinc-600">(comma separated)</span><input name="tags" className={`${field} h-10`} placeholder="subnetting, notes"/></label>
        <button className="focus-ring mt-5 h-10 w-full rounded-lg bg-violet-500 text-xs font-semibold hover:bg-violet-400">Save note</button>
      </form>
      <section>
        <form className="mb-3"><label className="sr-only" htmlFor="note-search">Search notes</label><input id="note-search" name="q" defaultValue={q} placeholder="Search title, content, category, or tags…" className="focus-ring h-10 w-full rounded-lg border border-white/[.08] bg-[#111216] px-3 text-sm placeholder:text-zinc-700"/></form>
        <div className="space-y-3">{error ? <div className="rounded-xl border border-white/[.07] bg-[#111216] p-5 text-sm text-rose-300">Could not load notes. Apply the database migration and check connection settings.</div> : filtered.length ? filtered.map(n => <article key={n.id} className="rounded-xl border border-white/[.07] bg-[#111216] p-5">
          <div className="flex items-start gap-2"><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="text-sm font-semibold">{n.title}</h2><span className="rounded-full bg-violet-500/[.09] px-2 py-0.5 text-[10px] text-violet-200">{n.category}</span></div><p className="mt-1 text-[10px] text-zinc-700">Updated {new Date(n.updated_at).toLocaleDateString("en-GB")}</p></div><ConfirmDelete action={deleteNote} id={n.id} label={n.title}/></div>
          <p className="mt-4 whitespace-pre-wrap break-words text-xs leading-6 text-zinc-400">{n.content}</p>
          {n.tags?.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{n.tags.map((tag: string) => <span key={tag} className="rounded-md border border-white/[.06] px-2 py-1 text-[10px] text-zinc-600">#{tag}</span>)}</div>}
          <details className="mt-4"><summary className="focus-ring cursor-pointer text-[11px] text-violet-300">Edit note</summary><form action={updateNote} className="mt-3 space-y-3 rounded-lg border border-white/[.06] p-3"><input type="hidden" name="id" value={n.id}/><input name="title" defaultValue={n.title} required maxLength={160} aria-label="Note title" className="focus-ring h-9 w-full rounded-lg border border-white/[.08] bg-[#0c0d10] px-3 text-xs"/><textarea name="content" defaultValue={n.content} required maxLength={30000} aria-label="Note content" className="focus-ring min-h-32 w-full rounded-lg border border-white/[.08] bg-[#0c0d10] p-3 text-xs leading-5"/><div className="grid gap-2 sm:grid-cols-2"><select name="category" defaultValue={n.category} aria-label="Category" className="focus-ring h-9 rounded-lg border border-white/[.08] bg-[#0c0d10] px-2 text-[10px]">{categories.map(x => <option key={x}>{x}</option>)}</select><input name="tags" defaultValue={(n.tags ?? []).join(", ")} aria-label="Tags" className="focus-ring h-9 rounded-lg border border-white/[.08] bg-[#0c0d10] px-3 text-xs"/></div><button className="focus-ring h-9 rounded-lg bg-white/[.08] px-3 text-xs hover:bg-white/[.12]">Save changes</button></form></details>
        </article>) : <div className="grid min-h-52 place-items-center rounded-xl border border-white/[.07] bg-[#111216] p-8 text-center"><div><BookOpenText className="mx-auto text-zinc-600" size={20}/><p className="mt-3 text-sm text-zinc-400">{q ? "No notes match your search" : "No notes yet"}</p><p className="mt-1 text-xs text-zinc-600">Capture a useful idea while it&apos;s fresh.</p></div></div>}</div>
      </section>
    </div>
  </>;
}
