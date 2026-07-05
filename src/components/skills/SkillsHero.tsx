import { ChevronDown, Code2 } from "lucide-react";

import { PageTitle } from "@/components/ui/page-title";

const pillars = [
  "React & TypeScript",
  "JavaScript internals",
  "Rendering & optimization",
  "REST APIs",
  "WebSockets",
  "Scalable architecture",
  "Node.js & Express",
  "Full-stack delivery",
];

export default function SkillsHero() {
  return (
    <section className="relative -mx-5 flex min-h-[48vh] flex-col items-center justify-center overflow-hidden border-y border-border/50 bg-gradient-to-b from-background via-background/90 to-background text-center sm:-mx-8 md:-mx-12 md:min-h-[52vh] lg:-mx-16 xl:-mx-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,hsl(var(--primary)/0.14),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_80%,hsl(var(--primary)/0.06),transparent_50%)]" />

      <div className="page-hero-pt relative z-10 mx-auto w-full max-w-3xl px-5 pb-14 sm:px-8 md:px-12 md:pb-16 lg:px-16">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-md bg-primary/10 px-4 py-1.5 font-mono text-xs text-primary sm:text-sm">
          <Code2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Frontend engineering depth
        </div>

        <PageTitle
          accent="Engineering"
          rest="capabilities"
          titleClassName="mb-5"
        />

        <p className="mx-auto max-w-xl text-base text-muted-foreground sm:text-lg">
          Deepest work in{" "}
          <span className="text-foreground">React, TypeScript, and JavaScript</span>
          —rendering behavior, performance, scalable project design, REST APIs, and
          WebSockets when products need real-time or full-stack depth.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-2 sm:mt-10 sm:gap-3">
          {pillars.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-muted/50 px-3 py-1.5 text-xs text-muted-foreground sm:px-4 sm:py-2 sm:text-sm"
            >
              {tag}
            </span>
          ))}
        </div>

        <p className="mt-8 flex items-center justify-center gap-1 text-xs text-muted-foreground sm:mt-10">
          <span>Explore below</span>
          <ChevronDown className="h-4 w-4 animate-bounce" aria-hidden />
        </p>
      </div>
    </section>
  );
}
