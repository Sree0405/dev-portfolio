import { ArrowUpRight, BookOpen, Briefcase, Layers } from "lucide-react";
import { Link } from "react-router-dom";

import {
  PortfolioCard,
  Reveal,
  Stagger,
  StaggerItem,
} from "@/components/portfolio";
import { depthLegend } from "./skillsData";

const paths = [
  {
    id: "stack",
    icon: Layers,
    title: "Read the stack",
    description:
      "Daily / Production / Building labels below — skim Primary stack first.",
    href: "#primary-stack",
    cta: "Jump to stack",
    external: false,
  },
  {
    id: "proof",
    icon: BookOpen,
    title: "Open proof",
    description:
      "Each expertise card links to a case study or live site — not a bare skill name.",
    href: "/projects",
    cta: "Browse projects",
    external: false,
  },
  {
    id: "ownership",
    icon: Briefcase,
    title: "Check ownership",
    description:
      "platform modules and named client deploys live on Experience — scope, not buzzwords.",
    href: "/experience",
    cta: "Read experience",
    external: false,
  },
] as const;

/**
 * Recruiter scan for Skills — how to read depth + where proof lives.
 */
export default function SkillsHowToRead() {
  return (
    <section
      id="skills-how-to-read"
      aria-labelledby="skills-how-to-read-heading"
      className="border-t border-primary/10 py-10 sm:py-12"
    >
      <div className="page-container-x">
        <Reveal>
          <div className="mb-6 text-center md:mb-8">
            <p className="section-eyebrow mb-2">For reviewers</p>
            <h2 id="skills-how-to-read-heading" className="section-title">
              <span className="page-title-accent">How to read</span> this page
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm portfolio-text-muted">
              Skills without proof are noise. Use the path below, then trust the
              depth labels.
            </p>
          </div>
        </Reveal>

        <Stagger
          className="mx-auto mb-8 grid max-w-4xl gap-3 sm:grid-cols-3 sm:gap-4"
          stagger={0.06}
          delayChildren={0.04}
        >
          {depthLegend.map((item) => (
            <StaggerItem key={item.label}>
              <PortfolioCard className="px-4 py-3 text-left">
                <p className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-primary">
                  {item.label}
                </p>
                <p className="mt-1.5 text-xs leading-relaxed portfolio-text-muted sm:text-[13px]">
                  {item.meaning}
                </p>
              </PortfolioCard>
            </StaggerItem>
          ))}
        </Stagger>

        <Stagger
          className="grid gap-4 sm:grid-cols-3 sm:gap-5"
          stagger={0.06}
          delayChildren={0.08}
        >
          {paths.map((item) => {
            const Icon = item.icon;
            const className =
              "group flex h-full flex-col text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

            const body = (
              <PortfolioCard className="flex h-full flex-col p-5 sm:p-6">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="icon-well size-10 shrink-0">
                    <Icon className="size-5" aria-hidden />
                  </div>
                </div>
                <h3 className="text-base font-semibold text-foreground">
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

            if (item.href.startsWith("#")) {
              return (
                <StaggerItem key={item.id}>
                  <a href={item.href} className={className}>
                    {body}
                  </a>
                </StaggerItem>
              );
            }

            return (
              <StaggerItem key={item.id}>
                <Link to={item.href} className={className}>
                  {body}
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
