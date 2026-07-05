import { Cpu, Gauge, Layers, Leaf, Radio, Server, Smartphone, Workflow, Zap } from "lucide-react";

import { SectionTitle } from "@/components/ui/page-title";

const layers = [
  {
    title: "React & TypeScript",
    description:
      "Component models, hooks, strict typing, and maintainable UI architecture for growing codebases.",
    tech: ["React", "TypeScript", "Next.js"],
    icon: Layers,
    accent: "from-indigo-500/15 to-transparent",
  },
  {
    title: "JavaScript internals",
    description:
      "Event loop, async patterns, closures, and language behavior that keeps React apps predictable.",
    tech: ["JavaScript", "TypeScript", "Vite"],
    icon: Cpu,
    accent: "from-violet-500/15 to-transparent",
  },
  {
    title: "Rendering & optimization",
    description:
      "Reconciliation, memoization, code splitting, and bundle strategy for fast, stable UIs.",
    tech: ["React", "Performance optimization", "Vite"],
    icon: Gauge,
    accent: "from-cyan-500/15 to-transparent",
  },
  {
    title: "APIs & realtime",
    description:
      "REST endpoints on Express, predictable contracts, and WebSocket flows for live features.",
    tech: ["REST APIs", "Express", "WebSockets", "Node.js"],
    icon: Radio,
    accent: "from-sky-500/15 to-transparent",
  },
  {
    title: "Scalable architecture",
    description:
      "Folder structure, feature boundaries, and service design so teams can extend products safely.",
    tech: ["Microservices", "Full-stack systems", "Docker"],
    icon: Server,
    accent: "from-teal-500/12 to-transparent",
  },
  {
    title: "Also · JVM stack",
    description:
      "Additional experience when products lean on Java / Spring—complementary, not the default stack.",
    tech: ["Java", "Spring Boot"],
    icon: Leaf,
    accent: "from-emerald-500/12 to-transparent",
  },
  {
    title: "Automation & integrations",
    description:
      "Workflow engines and connectors for shipping integrations without reinventing plumbing.",
    tech: ["Zapier", "n8n"],
    icon: Zap,
    accent: "from-amber-500/10 to-transparent",
  },
  {
    title: "Mobile platforms",
    description:
      "Cross-platform apps with shared React patterns and native-ready delivery.",
    tech: ["React Native", "Expo"],
    icon: Smartphone,
    accent: "from-fuchsia-500/15 to-transparent",
  },
  {
    title: "Full-stack delivery",
    description:
      "End-to-end ownership—from UI and APIs to data, deploys, and release discipline.",
    tech: ["Full-stack systems", "Docker", "Git", "CI/CD"],
    icon: Workflow,
    accent: "from-teal-500/12 to-transparent",
  },
];

type Props = { onSelectSkill: (skill: string) => void };

export default function CapabilityArchitecture({ onSelectSkill }: Props) {
  return (
    <section className="scroll-mt-24 pb-8 pt-12 md:pt-16">
      <div className="mb-10 md:mb-12">
        <SectionTitle eyebrow="Architecture" accent="System" rest="layers" className="mb-0" />
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
          React and TypeScript first—then APIs, WebSockets, and patterns for
          scaling projects. Spring Boot is additional JVM experience when teams
          need it.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 md:gap-5">
        {layers.map((layer) => {
          const Icon = layer.icon;
          return (
            <article
              key={layer.title}
              className={`relative overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-br ${layer.accent} p-6 shadow-[0_8px_30px_rgba(0,0,0,0.22)] backdrop-blur-sm transition hover:border-primary/30 md:p-7`}
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-background/50 text-primary">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  {layer.title}
                </h3>
              </div>
              <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                {layer.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {layer.tech.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => onSelectSkill(t)}
                    className="rounded-lg border border-border/80 bg-background/60 px-3 py-1.5 text-xs font-medium transition hover:border-primary/40 hover:bg-primary/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
