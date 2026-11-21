"use client";
import { Trash2 } from "lucide-react";

export function ConfirmDelete({ action, id, label }: { action: (data: FormData) => void; id: string; label: string }) {
  return (
    <form action={action} onSubmit={(event) => { if (!window.confirm(`Delete “${label}”? This cannot be undone.`)) event.preventDefault(); }}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        aria-label={`Delete ${label}`}
        title={`Delete ${label}`}
        className="grid size-10 shrink-0 place-items-center rounded-md border border-transparent text-[var(--lab-secondary)] hover:border-[#694242] hover:bg-[#241719] hover:text-[#ffc1c1] active:bg-[#342022]"
      >
        <Trash2 size={16} aria-hidden="true" />
      </button>
    </form>
  );
}
