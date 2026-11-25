import Link from "next/link";
import { portfolioData } from "@/data/portfolio";

export function WorkspaceCta() {
  const { labAccess } = portfolioData;

  return (
    <section
      id="lab-access"
      data-surface="yellow"
      aria-labelledby="lab-access-heading"
      className="scroll-mt-6 bg-[var(--pf-yellow)] py-10 text-[var(--pf-ink)] sm:py-12"
    >
      <div className="pf-container">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2
              id="lab-access-heading"
              className="m-0 text-sm font-extrabold tracking-[0.06em] text-[var(--pf-blue)] uppercase"
            >
              {labAccess.label}
            </h2>
            <p className="mt-1.5 mb-0 max-w-[54ch] text-base font-medium leading-6 text-[var(--pf-ink)]">
              {labAccess.description}
            </p>
          </div>

          <Link href={labAccess.href} className="pf-btn-blue shrink-0">
            {labAccess.ctaLabel} ↗
          </Link>
        </div>
      </div>
    </section>
  );
}
