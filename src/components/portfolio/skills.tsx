import { portfolioData } from "@/data/portfolio";

export function SkillsSection() {
  return (
    <section
      id="focus"
      data-surface="paper"
      aria-labelledby="focus-heading"
      className="scroll-mt-6 bg-[var(--pf-paper)] py-16 text-[var(--pf-ink)] sm:py-24"
    >
      <div className="pf-container">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[rgb(21_26_32_/_18%)] pb-6">
          <div>
            <p className="m-0 text-sm font-semibold tracking-[-0.01em] text-[var(--pf-blue)]">
              01 / Technical Focus
            </p>
            <h2
              id="focus-heading"
              className="mt-3 mb-0 text-[clamp(2rem,3.8vw,3.125rem)] font-extrabold leading-[1.06] tracking-[-0.03em] text-[var(--pf-ink)]"
            >
              Cloud &amp; Networking first.
            </h2>
          </div>

          <p className="m-0 max-w-[42ch] text-sm leading-6 text-[var(--pf-ink-secondary)]">
            Primary focus in network infrastructure and AWS cloud fundamentals, supported by full-stack web development.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:gap-8">
          {portfolioData.primaryFocus.map((area) => (
            <article
              key={area.id}
              className="border-t-4 border-[var(--pf-yellow)] bg-[var(--pf-blue)] p-6 text-white sm:p-8"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-white/15 pb-4">
                <span className="text-xs font-bold tracking-[0.04em] text-[var(--pf-yellow)] uppercase">
                  Primary Focus
                </span>
                {area.badge && (
                  <span className="border border-[var(--pf-yellow)]/60 px-2.5 py-0.5 text-xs font-semibold text-[var(--pf-yellow)]">
                    {area.badge}
                  </span>
                )}
              </div>

              <h3 className="mt-5 mb-0 text-[clamp(1.5rem,2.4vw,2rem)] font-extrabold leading-[1.12] tracking-[-0.025em] text-white">
                {area.category}
              </h3>

              <p className="mt-3 mb-0 max-w-[46ch] text-[0.9375rem] leading-6 text-[var(--pf-blue-tint)]">
                {area.summary}
              </p>

              <ul className="m-0 mt-6 list-none divide-y divide-white/15 border-t border-white/15 p-0">
                {area.items.map((item) => (
                  <li key={item} className="py-2.5 text-[0.9375rem] font-medium text-white">
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-12 border-t border-[rgb(21_26_32_/_18%)] pt-8">
          <p className="m-0 text-xs font-bold tracking-[0.04em] text-[var(--pf-ink-secondary)] uppercase">
            Supporting Areas
          </p>

          <div className="mt-4 divide-y divide-[rgb(21_26_32_/_16%)] border-b border-[rgb(21_26_32_/_16%)]">
            {portfolioData.supportingFocus.map((area) => (
              <div
                key={area.id}
                className="grid gap-4 py-6 lg:grid-cols-[minmax(220px,0.8fr)_minmax(0,1.2fr)] lg:items-baseline lg:gap-10"
              >
                <div>
                  <h3 className="m-0 text-lg font-bold tracking-[-0.015em] text-[var(--pf-ink)]">
                    {area.category}
                  </h3>
                  <p className="mt-1 mb-0 text-sm leading-6 text-[var(--pf-ink-secondary)]">
                    {area.summary}
                  </p>
                </div>

                <ul className="m-0 flex list-none flex-wrap gap-x-5 gap-y-2 p-0 text-[0.9375rem] font-medium text-[var(--pf-ink)]">
                  {area.items.map((item) => (
                    <li key={item} className="border-b border-[rgb(0_82_146_/_35%)] pb-0.5">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
