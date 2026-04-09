import { motion } from "framer-motion";
import { Box, Layers, Server, Smartphone, Workflow, Zap, Leaf } from "lucide-react";

const layers = [
  {
    title: "Frontend systems",
    description:
      "Composable UI, design tokens, and performance-first rendering for complex apps.",
    tech: ["React", "Next.js", "TypeScript"],
    icon: Layers,
    accent: "from-indigo-500/15 to-transparent",
  },
  {
    title: "Backend (Node & Express)",
    description:
      "Main backend surface: Node.js runtimes, Express APIs, REST contracts, and service-style boundaries.",
    tech: ["Node.js", "Express", "REST APIs", "Microservices"],
    icon: Server,
    accent: "from-cyan-500/15 to-transparent",
  },
  {
    title: "Also · JVM stack",
    description:
      "Additional experience when products lean on Java / Spring — complementary, not the default tool choice.",
    tech: ["Java", "Spring Boot"],
    icon: Leaf,
    accent: "from-emerald-500/12 to-transparent",
  },
  {
    title: "Automation & integrations",
    description:
      "Workflow engines and connectors to ship integrations without reinventing plumbing.",
    tech: ["Zapier", "n8n"],
    icon: Zap,
    accent: "from-amber-500/10 to-transparent",
  },
  {
    title: "Interactive interfaces",
    description:
      "Spatial UX, animation systems, and immersive web experiences.",
    tech: ["Three.js", "Framer Motion"],
    icon: Box,
    accent: "from-violet-500/15 to-transparent",
  },
  {
    title: "Mobile platforms",
    description:
      "Cross-platform apps with native-grade flows and offline-ready patterns.",
    tech: ["React Native", "Expo"],
    icon: Smartphone,
    accent: "from-fuchsia-500/15 to-transparent",
  },
  {
    title: "Full-stack delivery",
    description:
      "End-to-end ownership—from UX and APIs to data, deploys, and automation.",
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
        <p className="section-eyebrow mb-2">Architecture</p>
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          System layers
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
          Express-centred services with Node.js as the main path; Spring Boot
          called out explicitly as additional JVM depth.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 md:gap-5">
        {layers.map((layer, index) => {
          const Icon = layer.icon;
          return (
            <motion.article
              key={layer.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: index * 0.04 }}
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
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
