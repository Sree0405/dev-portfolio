import { motion } from "framer-motion";
import { Crosshair, Cpu, Layers, Sparkles, Leaf } from "lucide-react";

const radarLevels = [
  {
    name: "Core",
    blurb: "Product UI, design systems, and typesafe React / Next applications.",
    skills: ["React", "Next.js", "TypeScript"],
    icon: Crosshair,
    accent: "from-violet-500/20 to-transparent",
    ring: "text-violet-400",
  },
  {
    name: "APIs & services",
    blurb: "Node and Express for HTTP APIs and integrations—full-stack, not frontend-only.",
    skills: ["Node.js", "Express", "Microservices", "REST APIs"],
    icon: Cpu,
    accent: "from-cyan-500/20 to-transparent",
    ring: "text-cyan-400",
  },
  {
    name: "Platform",
    blurb: "Shipping, environments, collaboration, and workflow automation.",
    skills: ["Docker", "Git", "CI/CD", "Zapier", "n8n"],
    icon: Layers,
    accent: "from-indigo-500/20 to-transparent",
    ring: "text-indigo-400",
  },
  {
    name: "Also (JVM)",
    blurb: "Additional enterprise experience — when the team uses Java / Spring.",
    skills: ["Java", "Spring Boot"],
    icon: Leaf,
    accent: "from-emerald-500/15 to-transparent",
    ring: "text-emerald-400",
  },
  {
    name: "Immersive & AI",
    blurb: "Motion, 3D interfaces, and intelligent product features.",
    skills: ["Three.js", "Framer Motion", "AI Integration"],
    icon: Sparkles,
    accent: "from-fuchsia-500/20 to-transparent",
    ring: "text-fuchsia-400",
  },
];

type Props = { onSelectSkill: (skill: string) => void };

export default function RadarVisualization({ onSelectSkill }: Props) {
  return (
    <section className="scroll-mt-24 pb-8 pt-16 md:pt-20">
      <div className="mb-10 md:mb-14 md:flex md:items-end md:justify-between md:gap-8">
        <div>
          <p className="section-eyebrow mb-2">Map</p>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            Technology radar
          </h2>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground md:text-base">
            Frontend systems at the center of how I work; Node & Express sit
            here for APIs. Spring Boot is{" "}
            <span className="text-foreground">additional</span> JVM depth — tap any
            chip for detail.
          </p>
        </div>
        <p className="mt-4 hidden text-sm text-muted-foreground md:mt-0 md:block md:max-w-xs md:text-right">
          Tap a skill to open the inspector.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 xl:gap-4">
        {radarLevels.map((level, index) => {
          const Icon = level.icon;
          return (
            <motion.article
              key={level.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: index * 0.05 }}
              className={`relative overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-br ${level.accent} p-5 shadow-[0_8px_30px_rgba(0,0,0,0.25)] backdrop-blur-sm transition hover:border-primary/35 hover:shadow-[0_0_40px_hsl(var(--primary)/0.12)] md:p-6`}
            >
              <div className="mb-4 flex items-start justify-between gap-2">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl border border-border/60 bg-background/40 ${level.ring}`}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <h3 className="mb-2 text-base font-semibold leading-snug text-foreground md:text-lg">
                {level.name}
              </h3>
              <p className="mb-4 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                {level.blurb}
              </p>

              <div className="flex flex-wrap gap-2">
                {level.skills.map((skill) => (
                  <motion.button
                    key={skill}
                    type="button"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelectSkill(skill)}
                    className="rounded-lg border border-border/80 bg-background/60 px-3 py-1.5 text-left text-xs font-medium text-foreground transition hover:border-primary/40 hover:bg-primary/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    {skill}
                  </motion.button>
                ))}
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
