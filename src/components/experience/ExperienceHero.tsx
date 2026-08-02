import { Briefcase, GraduationCap, Rocket, ShieldCheck } from "lucide-react";

import { PageTitle } from "@/components/ui/page-title";
import { Reveal } from "@/components/portfolio";

const highlights = [
  "Feature lifecycle ownership",
  "Deadline delivery (3-eng · ~600h)",
  "Technical mentoring (~8-eng team)",
  "Auth, config & deploy tooling",
];

export default function ExperienceHero() {
  return (
    <section className="page-hero-band">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,hsl(var(--primary)/0.12),transparent_55%)]" />

      <div className="page-hero-inner max-w-3xl">
        <Reveal>
          <PageTitle
            eyebrow="Career"
            accent="Professional"
            rest="journey"
            titleClassName="mb-5"
          />
        </Reveal>

        <Reveal delay={0.08}>
          <p className="mx-auto max-w-xl text-sm portfolio-text-muted sm:text-[15px]">
            Junior Full-Stack Engineer at EWall — feature ownership from
            planning through integration and deploy, including collaborative
            delivery on a ~600-hour client project with three engineers. Not a
            lead title; evidence over invented metrics.
          </p>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="mt-8 flex flex-wrap justify-center gap-2 sm:mt-10 sm:gap-3">
            {highlights.map((tag) => (
              <span
                key={tag}
                className="tech-pill rounded-md border border-primary/20 bg-muted/50 px-3 py-1.5 font-mono text-xs portfolio-text-muted transition-colors hover:border-primary/40 hover:text-primary sm:px-4 sm:py-2 sm:text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.16}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm portfolio-text-muted sm:gap-10">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary" />
              <span>
                <span className="page-title-accent font-semibold">EWall</span>{" "}
                · intern → junior
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Rocket className="h-4 w-4 text-primary" />
              <span>
                <span className="page-title-accent font-semibold">2</span> named
                client sites live
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>
                <span className="page-title-accent font-semibold">Feature</span>{" "}
                lifecycle ownership
              </span>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-primary" />
              <span>
                <span className="page-title-accent font-semibold">BSc</span> CS
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
