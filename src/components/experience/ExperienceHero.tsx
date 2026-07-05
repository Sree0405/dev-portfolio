import { Briefcase, GraduationCap, Rocket, Users } from "lucide-react";

import { PageTitle } from "@/components/ui/page-title";

const highlights = [
  "React & Next.js production apps",
  "REST APIs & SaaS platforms",
  "HLD / LLD & code review",
  "Mentoring & client delivery",
];

export default function ExperienceHero() {
  return (
    <section className="page-hero-pt page-hero-pb relative overflow-hidden border-b border-border/25 text-center">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,hsl(var(--primary)/0.12),transparent_55%)]" />

      <div className="page-container-x relative">
        <div className="mx-auto max-w-3xl">
          <PageTitle
            eyebrow="Career"
            accent="Professional"
            rest="journey"
            titleClassName="mb-5"
          />

          <p className="mx-auto max-w-xl text-base text-muted-foreground sm:text-lg">
            EWall · freelance delivery · mentoring — told chapter by chapter.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-2 sm:mt-10 sm:gap-3">
            {highlights.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-muted/50 px-3 py-1.5 font-mono text-xs text-muted-foreground sm:px-4 sm:py-2 sm:text-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground sm:gap-10">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary" />
              <span>
                <span className="font-semibold text-foreground">EWall</span>{" "}
                intern → junior
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Rocket className="h-4 w-4 text-primary" />
              <span>
                <span className="font-semibold text-foreground">6+</span>{" "}
                freelance projects
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span>
                <span className="font-semibold text-foreground">Mentoring</span>{" "}
                & code review
              </span>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-primary" />
              <span>
                <span className="font-semibold text-foreground">BSc</span> CS
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
