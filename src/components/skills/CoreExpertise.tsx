import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

import { SectionTitle } from "@/components/ui/page-title";
import {
  PortfolioCard,
  Reveal,
  Stagger,
  StaggerItem,
} from "@/components/portfolio";
import { coreExpertise } from "./skillsData";

function ProofLink({ label, href }: { label: string; href: string }) {
  const external = href.startsWith("http");
  const className =
    "mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-[hsl(var(--primary-light))]";

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        Used in {label}
        <ArrowUpRight className="size-3.5" aria-hidden />
      </a>
    );
  }

  return (
    <Link to={href} className={className}>
      Used in {label}
      <ArrowUpRight className="size-3.5" aria-hidden />
    </Link>
  );
}

export default function CoreExpertise() {
  return (
    <section className="py-10 sm:py-12 border-t border-primary/10">
      <div className="page-container-x">
        <Reveal>
          <SectionTitle
            eyebrow="Capabilities"
            accent="Core"
            rest="expertise"
            className="mb-3 text-center md:mb-4 [&_h2]:text-center"
          />
          <p className="mx-auto mb-6 max-w-xl text-center text-sm portfolio-text-muted md:mb-8">
            What I own in product work — each card links to proof in Projects or
            Experience.
          </p>
        </Reveal>

        <Stagger
          className="grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5"
          stagger={0.06}
          delayChildren={0.08}
        >
          {coreExpertise.map((item) => (
            <StaggerItem key={item.title} className="h-full">
              <PortfolioCard
                spacious
                className="flex h-full flex-col text-left"
              >
                <div className="icon-well mb-5 size-12 shrink-0">
                  <item.icon className="size-5" aria-hidden />
                </div>
                <h3 className="page-title-accent mb-3 text-base font-semibold leading-snug">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed portfolio-text-muted">
                  {item.description}
                </p>
                <ProofLink {...item.proof} />
              </PortfolioCard>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
