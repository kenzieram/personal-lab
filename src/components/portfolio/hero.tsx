import { portfolioData } from "@/data/portfolio";

export function PortfolioHero() {
  return (
    <section aria-labelledby="hero-heading" className="bg-[var(--pf-blue)] pt-12 pb-16 sm:pt-20 sm:pb-24">
      <div className="pf-container">
        <h1
          id="hero-heading"
          className="m-0 max-w-[14ch] text-[clamp(2.75rem,7.2vw,6rem)] font-extrabold leading-[0.98] tracking-[-0.03em] text-[var(--pf-yellow)]"
        >
          {portfolioData.hero.headlineLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>

        <div className="pf-rule-yellow mt-10 pt-8 sm:mt-14 sm:pt-10">
          <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:gap-12">
            <p className="m-0 max-w-[44ch] text-[clamp(1.125rem,1.6vw,1.4rem)] font-normal leading-[1.5] text-white">
              {portfolioData.hero.description}
            </p>

            <div className="flex flex-wrap items-center gap-3 lg:justify-end">
              <a href={portfolioData.hero.primaryAction.href} className="pf-btn-primary">
                {portfolioData.hero.primaryAction.label}
              </a>
              <a href={portfolioData.hero.secondaryAction.href} className="pf-btn-outline-light">
                {portfolioData.hero.secondaryAction.label}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
