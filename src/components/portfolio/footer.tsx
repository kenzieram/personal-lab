import { portfolioData } from "@/data/portfolio";

export function PortfolioFooter() {
  return (
    <footer className="bg-[var(--pf-blue)] py-10 text-white">
      <div className="pf-container flex flex-col gap-6 border-t border-white/20 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
          <span className="text-xl font-extrabold tracking-[-0.03em] text-[var(--pf-yellow)]">
            {portfolioData.brand}
          </span>
          <span className="text-sm text-[var(--pf-blue-tint)]">
            © 2026 Kenzie
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <a
            href={portfolioData.githubProfileUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center text-sm font-semibold text-white hover:text-[var(--pf-yellow)]"
          >
            GitHub ↗
          </a>
          <a
            href="#top"
            className="inline-flex min-h-11 items-center text-sm font-semibold text-[var(--pf-yellow)] hover:underline"
          >
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
