import { motion } from "framer-motion";
import { ArrowUpRight, Compass } from "lucide-react";

const emerging = [
  {
    name: "AI Agents",
    detail: "Orchestration, tooling, and productized LLM flows.",
  },
  {
    name: "WebGPU",
    detail: "High-performance compute and graphics on the web.",
  },
  {
    name: "Edge Functions",
    detail: "Low-latency logic at the network edge.",
  },
  {
    name: "Distributed Systems",
    detail: "Resilience, scaling patterns, and service boundaries.",
  },
];

type Props = { onSelectSkill: (skill: string) => void };

export default function EmergingTech({ onSelectSkill }: Props) {
  return (
    <section className="scroll-mt-24 pb-16 pt-12 md:pb-24 md:pt-16">
      <div className="mb-10 md:mb-12 md:flex md:items-end md:justify-between md:gap-8">
        <div>
          <p className="mb-2 font-mono text-xs uppercase tracking-widest text-primary">
            Horizon
          </p>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            Currently exploring
          </h2>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground md:text-base">
            Active R&D themes that inform how upcoming work is shaped—open the
            inspector for a snapshot.
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
        {emerging.map((item, i) => (
          <motion.button
            key={item.name}
            type="button"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onSelectSkill(item.name)}
            className="group flex flex-col rounded-2xl border border-border/70 bg-background/50 p-5 text-left shadow-[0_8px_24px_rgba(0,0,0,0.18)] backdrop-blur-md transition hover:border-primary/35 hover:shadow-[0_0_28px_hsl(var(--primary)/0.12)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring md:p-6"
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-primary/10 text-primary">
                <Compass className="h-4 w-4" strokeWidth={1.75} />
              </span>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
            </div>
            <span className="font-semibold text-foreground capitalize">
              {item.name}
            </span>
            <span className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
              {item.detail}
            </span>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
