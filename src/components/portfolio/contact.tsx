"use client";

import { useEffect, useState } from "react";
import { portfolioData } from "@/data/portfolio";

export function ContactSection() {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");

  useEffect(() => {
    if (copyState === "idle") return;
    const timer = window.setTimeout(() => setCopyState("idle"), 2200);
    return () => window.clearTimeout(timer);
  }, [copyState]);

  async function handleCopyEmail() {
    try {
      await navigator.clipboard.writeText(portfolioData.email);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
  }

  return (
    <section
      id="contact"
      data-surface="paper"
      aria-labelledby="contact-heading"
      className="scroll-mt-6 bg-[var(--pf-paper)] py-16 text-[var(--pf-ink)] sm:py-24"
    >
      <div className="pf-container">
        <p className="m-0 border-b border-[rgb(21_26_32_/_18%)] pb-4 text-sm font-semibold tracking-[-0.01em] text-[var(--pf-blue)]">
          06 / Contact
        </p>

        <div className="mt-10 grid items-start gap-10 lg:mt-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          <div>
            <h2
              id="contact-heading"
              className="m-0 max-w-[16ch] text-[clamp(2rem,3.6vw,3rem)] font-extrabold leading-[1.06] tracking-[-0.025em] text-[var(--pf-ink)]"
            >
              {portfolioData.contact.heading}
            </h2>
            <p className="mt-4 mb-0 max-w-[44ch] text-base leading-7 text-[var(--pf-ink-secondary)]">
              {portfolioData.contact.description}
            </p>
          </div>

          <div className="space-y-6">
            <div className="border-y border-[rgb(21_26_32_/_18%)] py-6">
              <span className="block text-xs font-bold tracking-[0.04em] text-[var(--pf-ink-secondary)] uppercase">
                Email
              </span>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
                <a
                  href={`mailto:${portfolioData.email}`}
                  className="inline-flex min-h-11 items-center text-[clamp(1.25rem,2.4vw,1.75rem)] font-extrabold tracking-[-0.02em] text-[var(--pf-blue)] underline decoration-[var(--pf-yellow)] decoration-2 underline-offset-4 hover:text-[var(--pf-blue-deep)]"
                >
                  {portfolioData.email}
                </a>

                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="pf-btn-outline-dark"
                >
                  {copyState === "copied"
                    ? "Copied"
                    : copyState === "error"
                      ? "Copy failed"
                      : "Copy email"}
                </button>
              </div>
              <span className="sr-only" aria-live="polite">
                {copyState === "copied"
                  ? "Email address copied to clipboard."
                  : copyState === "error"
                    ? "Could not copy email address."
                    : ""}
              </span>
            </div>

            <ul className="m-0 list-none divide-y divide-[rgb(21_26_32_/_18%)] border-b border-[rgb(21_26_32_/_18%)] p-0">
              <li>
                <a
                  href={portfolioData.githubProfileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex min-h-14 flex-wrap items-center justify-between gap-4 py-4 transition-colors hover:text-[var(--pf-blue)]"
                >
                  <div>
                    <span className="block text-base font-bold tracking-[-0.01em] text-[var(--pf-ink)] group-hover:text-[var(--pf-blue)]">
                      GitHub Profile
                    </span>
                    <span className="block text-sm text-[var(--pf-ink-secondary)]">
                      github.com/kenzieram
                    </span>
                  </div>
                  <span aria-hidden="true" className="text-lg font-bold text-[var(--pf-blue)]">
                    ↗
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={portfolioData.githubRepoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex min-h-14 flex-wrap items-center justify-between gap-4 py-4 transition-colors hover:text-[var(--pf-blue)]"
                >
                  <div>
                    <span className="block text-base font-bold tracking-[-0.01em] text-[var(--pf-ink)] group-hover:text-[var(--pf-blue)]">
                      Personal Lab Repository
                    </span>
                    <span className="block text-sm text-[var(--pf-ink-secondary)]">
                      github.com/kenzieram/personal-lab
                    </span>
                  </div>
                  <span aria-hidden="true" className="text-lg font-bold text-[var(--pf-blue)]">
                    ↗
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
