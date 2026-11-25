"use client";

import { useEffect, useRef, useState } from "react";
import { portfolioData } from "@/data/portfolio";

export function PortfolioNavigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (!menuOpen) {
      if (wasOpen.current) openButtonRef.current?.focus();
      wasOpen.current = false;
      return;
    }

    wasOpen.current = true;
    const firstLink = drawerRef.current?.querySelector<HTMLElement>("a[href], button");
    firstLink?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        return;
      }

      if (event.key !== "Tab" || !drawerRef.current) return;
      const focusables = Array.from(
        drawerRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
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

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <header className="border-b border-white/15 bg-[var(--pf-blue)]">
      <div className="pf-container flex h-20 items-center justify-between gap-6">
        <a
          href="#top"
          className="inline-flex min-h-11 items-center text-2xl font-extrabold tracking-[-0.03em] text-white"
        >
          {portfolioData.brand}
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
          {portfolioData.navLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="pf-link-underline text-[0.9375rem] font-semibold tracking-[-0.01em] text-white hover:text-[var(--pf-yellow)]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <button
          ref={openButtonRef}
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-expanded={menuOpen}
          aria-controls="mobile-portfolio-nav"
          aria-label="Open navigation menu"
          className="inline-flex min-h-11 min-w-11 items-center justify-center border border-white/35 px-3.5 text-sm font-semibold text-white hover:border-[var(--pf-yellow)] hover:text-[var(--pf-yellow)] md:hidden"
        >
          Menu
        </button>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 h-full w-full border-0 bg-[#071526]/80"
          />
          <div
            ref={drawerRef}
            id="mobile-portfolio-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="relative ml-auto flex h-full w-[min(320px,86vw)] flex-col justify-between border-l border-[var(--pf-yellow)]/40 bg-[var(--pf-blue)] p-6"
          >
            <div>
              <div className="flex items-center justify-between border-b border-white/15 pb-4">
                <span className="text-xl font-extrabold tracking-[-0.03em] text-white">
                  {portfolioData.brand}
                </span>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close navigation menu"
                  className="inline-flex min-h-11 min-w-11 items-center justify-center border border-white/35 px-3 text-sm font-semibold text-white hover:border-[var(--pf-yellow)] hover:text-[var(--pf-yellow)]"
                >
                  Close
                </button>
              </div>

              <nav aria-label="Mobile" className="mt-6 flex flex-col gap-1">
                {portfolioData.navLinks.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex min-h-12 items-center border-b border-white/10 text-xl font-bold tracking-[-0.02em] text-white hover:text-[var(--pf-yellow)]"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>

            <div className="border-t border-white/15 pt-5">
              <a
                href="#terminal"
                onClick={() => setMenuOpen(false)}
                className="flex min-h-11 items-center text-sm font-semibold text-[var(--pf-yellow)]"
              >
                Jump to interactive terminal
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
