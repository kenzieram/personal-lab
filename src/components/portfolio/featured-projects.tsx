import { portfolioData } from "@/data/portfolio";

export function FeaturedProjects() {
  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="scroll-mt-6 bg-[var(--pf-blue)] py-16 text-white sm:py-24"
    >
      <div className="pf-container">
        <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-[rgb(255_201_40_/_55%)] pb-4">
          <p className="m-0 text-sm font-semibold tracking-[-0.01em] text-[var(--pf-yellow)]">
            04 / Selected Projects
          </p>
          <p className="m-0 text-sm text-[var(--pf-blue-tint)]">
            Experiments, tooling, and personal builds
          </p>
        </div>

        <h2
          id="work-heading"
          className="mt-8 mb-0 max-w-[18ch] text-[clamp(2rem,4vw,3.125rem)] font-extrabold leading-[1.06] tracking-[-0.03em] text-[var(--pf-yellow)]"
        >
          What I have been building and testing.
        </h2>

        <div className="mt-10 divide-y divide-white/20 border-y border-white/20">
          {portfolioData.selectedProjects.map((project) => (
            <article
              key={project.name}
              className="grid gap-5 py-8 lg:grid-cols-[minmax(220px,0.75fr)_minmax(0,1.25fr)] lg:gap-12"
            >
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-xs text-[var(--pf-yellow)]">
                    {project.index}
                  </span>
                  <span className="text-xs font-semibold text-[var(--pf-blue-tint)]">
                    {project.context}
                  </span>
                </div>
                <h3 className="mt-2 mb-0 text-2xl font-bold tracking-[-0.02em] text-white">
                  {project.name}
                </h3>
              </div>

              <div>
                <p className="m-0 max-w-[58ch] text-base leading-[1.65] text-[var(--pf-blue-tint)]">
                  {project.description}
                </p>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                  <ul className="m-0 flex list-none flex-wrap gap-x-4 gap-y-1.5 p-0 text-xs font-semibold text-[var(--pf-yellow)]">
                    {project.stack.map((tech) => (
                      <li key={tech}>{tech}</li>
                    ))}
                  </ul>

                  {project.href && project.linkLabel && (
                    <a
                      href={project.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-11 items-center text-sm font-semibold text-white underline decoration-[var(--pf-yellow)] underline-offset-4 hover:text-[var(--pf-yellow)]"
                    >
                      {project.linkLabel}
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
