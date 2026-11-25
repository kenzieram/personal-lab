import type { Metadata } from "next";
import "@/components/portfolio/portfolio.css";
import { AboutSection } from "@/components/portfolio/about";
import { CommandPalette } from "@/components/portfolio/command-palette";
import { ContactSection } from "@/components/portfolio/contact";
import { FeaturedProjects } from "@/components/portfolio/featured-projects";
import { PortfolioFooter } from "@/components/portfolio/footer";
import { PortfolioHero } from "@/components/portfolio/hero";
import { PortfolioNavigation } from "@/components/portfolio/navigation";
import { PhotographySection } from "@/components/portfolio/photography";
import { SkillsSection } from "@/components/portfolio/skills";
import { PortfolioTerminal } from "@/components/portfolio/terminal";
import { WorkspaceCta } from "@/components/portfolio/workspace-cta";

export const metadata: Metadata = {
  title: { absolute: "Kenzie. | Student Developer" },
  description:
    "Personal portfolio of Kenzie, a student developer focused on cloud computing, networking, and practical software engineering.",
};

export default function HomePage() {
  return (
    <div id="top" className="portfolio-root">
      <PortfolioNavigation />
      <main id="main-content">
        <PortfolioHero />
        <SkillsSection />
        <PortfolioTerminal />
        <AboutSection />
        <FeaturedProjects />
        <PhotographySection />
        <ContactSection />
        <WorkspaceCta />
      </main>
      <PortfolioFooter />
      <CommandPalette />
    </div>
  );
}
