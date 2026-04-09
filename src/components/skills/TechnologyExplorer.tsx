import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiNodedotjs,
  SiThreedotjs,
  SiTailwindcss,
  SiFramer,
  SiPostgresql,
  SiDocker,
  SiGit,
  SiVite,
} from "react-icons/si";
import type { IconType } from "react-icons";
import { motion } from "framer-motion";
import {
  Boxes,
  Coffee,
  Leaf,
  Layers,
  type LucideIcon,
  Workflow,
  Zap,
  Server,
} from "lucide-react";

type TechKind = "si" | "lucide";

type TechItem = {
  name: string;
  hint: string;
  icon: IconType | LucideIcon;
  kind: TechKind;
  skillKey?: string;
  tier?: "main" | "additional";
};

/** Primary: Node & Express–centric backend; JVM listed separately */
const primaryTech: TechItem[] = [
  { name: "React", icon: SiReact, hint: "UI & state", kind: "si", tier: "main" },
  { name: "Next.js", icon: SiNextdotjs, hint: "Full-stack web", kind: "si", tier: "main" },
  { name: "TypeScript", icon: SiTypescript, hint: "Types & APIs", kind: "si", tier: "main" },
  { name: "Node.js", icon: SiNodedotjs, hint: "Main backend runtime", kind: "si", tier: "main" },
  {
    name: "Express",
    icon: Server,
    hint: "Main HTTP layer",
    kind: "lucide",
    tier: "main",
  },
  {
    name: "Microservices",
    icon: Boxes,
    hint: "Service boundaries",
    kind: "lucide",
    tier: "main",
  },
  { name: "PostgreSQL", icon: SiPostgresql, hint: "Data layer", kind: "si", tier: "main" },
  { name: "Docker", icon: SiDocker, hint: "Containers", kind: "si", tier: "main" },
  { name: "Git", icon: SiGit, hint: "Version control", kind: "si", tier: "main" },
  { name: "Vite", icon: SiVite, hint: "Fast builds", kind: "si", tier: "main" },
  { name: "Three.js", icon: SiThreedotjs, hint: "3D on web", kind: "si", tier: "main" },
  {
    name: "Tailwind",
    icon: SiTailwindcss,
    hint: "Design system",
    kind: "si",
    skillKey: "Tailwind CSS",
    tier: "main",
  },
  { name: "Framer Motion", icon: SiFramer, hint: "Motion UX", kind: "si", tier: "main" },
  {
    name: "Zapier",
    icon: Zap,
    hint: "Automation",
    kind: "lucide",
    tier: "main",
  },
  {
    name: "n8n",
    icon: Workflow,
    hint: "Workflows",
    kind: "lucide",
    tier: "main",
  },
  {
    name: "Full-stack systems",
    icon: Layers,
    hint: "End-to-end",
    kind: "lucide",
    skillKey: "Full-stack systems",
    tier: "main",
  },
];

const additionalTech: TechItem[] = [
  {
    name: "Java",
    icon: Coffee,
    hint: "Additional · JVM",
    kind: "lucide",
    tier: "additional",
  },
  {
    name: "Spring Boot",
    icon: Leaf,
    hint: "Additional · APIs",
    kind: "lucide",
    tier: "additional",
  },
];

type Props = { onSelectSkill: (skill: string) => void };

function TechTile({
  t,
  i,
  onSelectSkill,
}: {
  t: TechItem;
  i: number;
  onSelectSkill: (skill: string) => void;
}) {
  const Icon = t.icon;
  const additional = t.tier === "additional";
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.35, delay: Math.min(i * 0.025, 0.3) }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelectSkill(t.skillKey ?? t.name)}
      className={`group flex flex-col items-center gap-3 rounded-2xl border p-4 text-center shadow-[0_8px_24px_rgba(0,0,0,0.2)] backdrop-blur-md transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring md:p-5 ${
        additional
          ? "border-dashed border-primary/30 bg-gradient-to-b from-background/50 to-background/25 hover:border-primary/45 hover:shadow-[0_0_24px_hsl(var(--primary)/0.12)]"
          : "border-border/70 bg-gradient-to-b from-background/80 to-background/40 hover:border-primary/40 hover:shadow-[0_0_32px_hsl(var(--primary)/0.15)]"
      }`}
    >
      <span
        className={`flex h-12 w-12 items-center justify-center rounded-2xl border text-primary transition ${
          additional
            ? "border-primary/25 bg-primary/5 group-hover:bg-primary/10"
            : "border-border/50 bg-primary/10 group-hover:border-primary/30 group-hover:bg-primary/15"
        }`}
      >
        {t.kind === "si" ? (
          <Icon className="text-2xl" aria-hidden />
        ) : (
          <Icon className="h-6 w-6" strokeWidth={1.6} aria-hidden />
        )}
      </span>
      <div>
        <span className="block text-sm font-semibold leading-tight text-foreground">
          {t.name}
        </span>
        <span className="mt-0.5 block text-[11px] text-muted-foreground">
          {t.hint}
        </span>
      </div>
    </motion.button>
  );
}

export default function TechnologyExplorer({ onSelectSkill }: Props) {
  return (
    <section className="scroll-mt-24 pb-8 pt-12 md:pt-16">
      <div className="mb-10 md:mb-12">
        <p className="section-eyebrow mb-2">Stack</p>
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          Technology explorer
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
          <span className="text-foreground">Primary depth</span> in Node.js and
          Express; Java and Spring Boot are{" "}
          <span className="text-foreground">additional</span> JVM experience when
          the stack calls for it.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:gap-4 xl:grid-cols-6">
        {primaryTech.map((t, i) => (
          <TechTile key={t.name} t={t} i={i} onSelectSkill={onSelectSkill} />
        ))}
      </div>

      <p className="section-eyebrow mt-12 mb-4">Also (JVM)</p>
      <div className="mx-auto grid max-w-lg grid-cols-2 gap-3 sm:mx-0">
        {additionalTech.map((t, i) => (
          <TechTile
            key={t.name}
            t={t}
            i={i + primaryTech.length}
            onSelectSkill={onSelectSkill}
          />
        ))}
      </div>
    </section>
  );
}
