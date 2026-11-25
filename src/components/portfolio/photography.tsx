import { portfolioData } from "@/data/portfolio";

export function PhotographySection() {
  return (
    <section
      id="creative"
      data-surface="paper"
      aria-labelledby="creative-heading"
      className="scroll-mt-6 border-b border-[rgb(21_26_32_/_14%)] bg-[var(--pf-paper)] py-14 text-[var(--pf-ink)] sm:py-16"
    >
      <div className="pf-container grid items-baseline gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
        <div>
          <p className="m-0 text-sm font-semibold tracking-[-0.01em] text-[var(--pf-blue)]">
            05 / Photography &amp; Creative Work
          </p>
          <h2
            id="creative-heading"
            className="mt-3 mb-0 text-[clamp(1.5rem,2.6vw,2.125rem)] font-extrabold leading-[1.12] tracking-[-0.02em] text-[var(--pf-ink)]"
          >
            {portfolioData.creativeWork.heading}
          </h2>
        </div>

        <p className="m-0 max-w-[56ch] text-base leading-[1.68] text-[var(--pf-ink-secondary)]">
          {portfolioData.creativeWork.description}
        </p>
      </div>
    </section>
  );
}
