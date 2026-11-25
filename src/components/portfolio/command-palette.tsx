"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type PaletteAction = {
  id: string;
  label: string;
  hint: string;
  href: string;
  isRoute?: boolean;
};

const ACTIONS: PaletteAction[] = [
  { id: "focus", label: "Technical Focus: Cloud & Networking", hint: "Section 01", href: "#focus" },
  { id: "terminal", label: "Interactive Terminal", hint: "Section 02", href: "#terminal" },
  { id: "about", label: "About Kenzie", hint: "Section 03", href: "#about" },
  { id: "work", label: "Selected Projects", hint: "Section 04", href: "#work" },
  { id: "creative", label: "Photography & Creative Work", hint: "Section 05", href: "#creative" },
  { id: "contact", label: "Contact (kenzie.ram@proton.me)", hint: "Section 06", href: "#contact" },
  { id: "lab", label: "Enter Personal Lab", hint: "/login", href: "/login", isRoute: true },
];

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  function closePalette() {
    setOpen(false);
    setQuery("");
  }

  useEffect(() => {
    function onGlobalKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((prev) => {
          if (!prev) {
            previousFocusRef.current = document.activeElement as HTMLElement | null;
            setQuery("");
          }
          return !prev;
        });
      }
    }

    document.addEventListener("keydown", onGlobalKeyDown);
    return () => document.removeEventListener("keydown", onGlobalKeyDown);
  }, []);

  useEffect(() => {
    if (!open) {
      previousFocusRef.current?.focus();
      return;
    }

    const timer = window.setTimeout(() => inputRef.current?.focus(), 0);

    function onDialogKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closePalette();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusables = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>("input, button:not([disabled])"),
      );
      const first = focusables[0];
      const last = focusables.at(-1);
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onDialogKeyDown);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("keydown", onDialogKeyDown);
    };
  }, [open]);

  if (!open) return null;

  const filtered = ACTIONS.filter((action) =>
    `${action.label} ${action.hint}`.toLowerCase().includes(query.trim().toLowerCase()),
  );

  function runAction(action: PaletteAction) {
    closePalette();
    if (action.isRoute) {
      router.push(action.href);
      return;
    }
    const target = document.getElementById(action.href.replace(/^#/, ""));
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[14vh]">
      <button
        type="button"
        aria-label="Close quick navigation"
        onClick={closePalette}
        className="absolute inset-0 h-full w-full border-0 bg-[#071526]/75"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Quick navigation"
        className="relative w-full max-w-lg border-2 border-[var(--pf-yellow)] bg-[var(--pf-term-bg)] text-white shadow-2xl"
      >
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (filtered[0]) runAction(filtered[0]);
          }}
          className="flex items-center justify-between gap-3 border-b border-[var(--pf-term-border)] px-4 py-3"
        >
          <label htmlFor="palette-search" className="sr-only">
            Jump to section
          </label>
          <input
            ref={inputRef}
            id="palette-search"
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Jump to a section or enter Personal Lab..."
            className="min-h-11 w-full border-0 bg-transparent text-sm text-white placeholder:text-[var(--pf-term-muted)] focus:outline-none"
          />
          <button
            type="button"
            onClick={closePalette}
            className="min-h-11 border border-[var(--pf-term-border)] px-3 text-xs font-semibold text-[var(--pf-term-muted)] hover:border-[var(--pf-yellow)] hover:text-white"
          >
            Esc
          </button>
        </form>

        <ul className="m-0 max-h-72 list-none divide-y divide-[var(--pf-term-border)] overflow-y-auto p-2">
          {filtered.length > 0 ? (
            filtered.map((action) => (
              <li key={action.id}>
                <button
                  type="button"
                  onClick={() => runAction(action)}
                  className="flex min-h-11 w-full items-center justify-between gap-4 px-3 py-2 text-left text-sm font-medium text-white hover:bg-[var(--pf-term-surface)] hover:text-[var(--pf-yellow)]"
                >
                  <span>{action.label}</span>
                  <span className="font-mono text-xs text-[var(--pf-term-muted)]">
                    {action.hint}
                  </span>
                </button>
              </li>
            ))
          ) : (
            <li className="px-3 py-4 text-sm text-[var(--pf-term-muted)]">
              No matching destination.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
