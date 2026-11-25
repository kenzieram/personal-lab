import { portfolioData } from "@/data/portfolio";

export function AboutSection() {
  return (
    <section
      id="about"
      data-surface="paper"
      aria-labelledby="about-heading"
      className="scroll-mt-6 bg-[var(--pf-paper)] py-16 text-[var(--pf-ink)] sm:py-24"
    >
      <div className="pf-container">
        <p className="m-0 border-b border-[rgb(21_26_32_/_18%)] pb-4 text-sm font-semibold tracking-[-0.01em] text-[var(--pf-blue)]">
          03 / About
        </p>

        <div className="mt-10 grid items-start gap-10 lg:mt-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          <h2
            id="about-heading"
            className="m-0 max-w-[16ch] text-[clamp(2rem,3.6vw,3rem)] font-extrabold leading-[1.08] tracking-[-0.025em] text-[var(--pf-blue)]"
          >
            {portfolioData.about.statement}
          </h2>

          <div className="space-y-5">
            {portfolioData.about.paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="m-0 max-w-[58ch] text-[1.0625rem] leading-[1.7] text-[var(--pf-ink)]"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
