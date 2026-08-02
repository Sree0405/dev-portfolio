import { ArrowUpRight, BookOpen, Briefcase, Code2 } from "lucide-react";
import { Link } from "react-router-dom";

import {
  PortfolioCard,
  Reveal,
  Stagger,
  StaggerItem,
} from "@/components/portfolio";

const steps = [
  {
    id: "product",
    step: "01",
    icon: BookOpen,
    title: "Product proof",
    description:
      "Sree Dev Tool — built into a portfolio monorepo designed to scale from day one. Demo + docs; multi-tenant-capable modules without a second stack.",
    href: "/project/sree-dev-tool",
    cta: "Open case study",
    external: false,
  },
  {
    id: "source",
    step: "02",
    icon: Code2,
    title: "Open source",
    description:
      "dev-portfolio (Dev Tool + this site), plus My3DUI and Fieldstack — clone what you want to review.",
    href: "https://github.com/Sree0405/dev-portfolio",
    cta: "Open monorepo",
    external: true,
  },
  {
    id: "ownership",
    step: "03",
    icon: Briefcase,
    title: "Ownership story",
    description:
      "Platform modules at EWall — UI, APIs, auth edges, and Linux releases. Named client sites live in production.",
    href: "/experience",
    cta: "Read experience",
    external: false,
  },
] as const;

/**
 * Recruiter scan path — three proof links, no invented metrics.
 */
export default function ReviewerPath() {
  return (
    <section
      id="for-reviewers"
      aria-labelledby="for-reviewers-heading"
      className="page-section-y page-container-x relative w-full min-w-0"
    >
      <div className="mx-auto w-full min-w-0 max-w-6xl">
        <Reveal>
          <div className="mb-6 md:mb-8">
            <p className="section-eyebrow mb-2">For reviewers</p>
            <h2 id="for-reviewers-heading" className="section-title">
              <span className="page-title-accent">Three proofs</span> in under
              five minutes
            </h2>
          </div>
          <p className="mb-8 max-w-2xl text-sm leading-relaxed portfolio-text-muted sm:mb-10 sm:text-[15px]">
            Skip the scroll if you&apos;re short on time. Start with the live
            system, then open-source code, then production ownership.
          </p>
        </Reveal>

        <Stagger className="grid gap-4 sm:grid-cols-3 sm:gap-5">
          {steps.map((item) => {
            const Icon = item.icon;
            const linkClass =
              "group flex h-full flex-col text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

            const body = (
              <PortfolioCard className="flex h-full flex-col p-5 sm:p-6">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-primary/80">
                    {item.step}
                  </span>
                  <div className="icon-well size-10 shrink-0">
                    <Icon className="size-5" aria-hidden />
                  </div>
                </div>
                <h3 className="text-base font-semibold text-foreground sm:text-[17px]">
                  <span className="page-title-accent">{item.title}</span>
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed portfolio-text-muted">
                  {item.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors group-hover:text-[hsl(var(--primary-light))]">
                  {item.cta}
                  <ArrowUpRight
                    className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden
                  />
                </span>
              </PortfolioCard>
            );

            return (
              <StaggerItem key={item.id}>
                {item.external ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                  >
                    {body}
                  </a>
                ) : (
                  <Link to={item.href} className={linkClass}>
                    {body}
                  </Link>
                )}
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
