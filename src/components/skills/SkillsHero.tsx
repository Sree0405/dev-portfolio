import { PageTitle } from "@/components/ui/page-title";
import { Reveal } from "@/components/portfolio";
import { skillsHero } from "./skillsData";

export default function SkillsHero() {
  return (
    <section className="page-hero-band !pb-8 sm:!pb-10">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,hsl(var(--primary)/0.12),transparent_55%)]"
        aria-hidden
      />

      <div className="page-hero-inner relative z-10 max-w-3xl">
        <Reveal>
          <PageTitle
            eyebrow={skillsHero.eyebrow}
            accent={skillsHero.accent}
            rest={skillsHero.rest}
            titleClassName="mb-5"
          />
        </Reveal>

        <Reveal delay={0.08}>
          <p className="mx-auto max-w-2xl font-display text-base font-semibold leading-snug tracking-[-0.02em] text-foreground sm:text-lg">
            {skillsHero.lead}
          </p>
        </Reveal>

        <Reveal delay={0.12}>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed portfolio-text-muted sm:mt-6">
            {skillsHero.body}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
