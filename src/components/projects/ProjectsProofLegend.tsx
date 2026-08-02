import { ExternalLink, FileText, Github, Lock } from "lucide-react";

import { PortfolioCard, Reveal, Stagger, StaggerItem } from "@/components/portfolio";

const legend = [
  {
    id: "live",
    icon: ExternalLink,
    label: "Live",
    meaning: "Runnable product or site — start here for product feel.",
  },
  {
    id: "docs",
    icon: FileText,
    label: "Docs",
    meaning: "Architecture and case study when you want the engineering.",
  },
  {
    id: "code",
    icon: Github,
    label: "Code",
    meaning: "Public GitHub — clone and review when present.",
  },
  {
    id: "private",
    icon: Lock,
    label: "Private source",
    meaning: "Used only when code is not public. Dev Tool uses Code → portfolio monorepo instead.",
  },
] as const;

/**
 * Projects page — how to read proof CTAs without assuming missing Code = weak work.
 */
export default function ProjectsProofLegend() {
  return (
    <section
      id="projects-proof"
      aria-labelledby="projects-proof-heading"
      className="border-b border-primary/10"
    >
      <div className="page-container-x mx-auto max-w-6xl py-8 sm:py-10">
        <Reveal>
          <div className="mb-5 flex flex-col gap-2 sm:mb-6 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
            <div>
              <p className="section-eyebrow mb-2">For reviewers</p>
              <h2 id="projects-proof-heading" className="section-title">
                <span className="page-title-accent">How proof</span> is labeled
              </h2>
            </div>
            <p className="max-w-md text-sm portfolio-text-muted sm:text-right">
              Sree Dev Tool ships in github.com/Sree0405/dev-portfolio — a monorepo
              built to scale so product modules grow without a second stack. Demo
              keeps personal ops data out of review sessions.
            </p>
          </div>
        </Reveal>

        <Stagger
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4"
          stagger={0.05}
          delayChildren={0.04}
        >
          {legend.map((item) => {
            const Icon = item.icon;
            return (
              <StaggerItem key={item.id}>
                <PortfolioCard className="flex h-full flex-col px-4 py-3.5 text-left sm:px-5 sm:py-4">
                  <div className="mb-2.5 flex items-center gap-2.5">
                    <span className="icon-well size-8 shrink-0">
                      <Icon className="size-3.5" aria-hidden />
                    </span>
                    <p className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-primary">
                      {item.label}
                    </p>
                  </div>
                  <p className="text-xs leading-relaxed portfolio-text-muted sm:text-[13px]">
                    {item.meaning}
                  </p>
                </PortfolioCard>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
