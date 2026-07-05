import { ArrowUpRight, Compass } from "lucide-react";

import { SectionTitle } from "@/components/ui/page-title";

const emerging = [
  {
    name: "React Server Components",
    detail: "Streaming, boundaries, and hybrid rendering models in Next.js apps.",
  },
  {
    name: "Distributed Systems",
    detail: "Resilience, scaling patterns, and clear service boundaries.",
  },
  {
    name: "Edge Functions",
    detail: "Low-latency logic close to users for auth and transforms.",
  },
  {
    name: "AI Integration",
    detail: "LLM-backed features with guardrails in production codepaths.",
  },
];

type Props = { onSelectSkill: (skill: string) => void };

export default function EmergingTech({ onSelectSkill }: Props) {
  return (
    <section className="scroll-mt-24 pb-16 pt-12 md:pb-24 md:pt-16">
      <div className="mb-10 md:mb-12 md:flex md:items-end md:justify-between md:gap-8">
        <div>
          <SectionTitle eyebrow="Horizon" accent="Currently" rest="exploring" className="mb-0" />
          <p className="mt-3 max-w-xl text-sm text-muted-foreground md:text-base">
            Engineering themes that shape how upcoming systems are designed—tap
            any card for a snapshot.
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
        {emerging.map((item) => (
          <button
            key={item.name}
            type="button"
            onClick={() => onSelectSkill(item.name)}
            className="group flex flex-col rounded-2xl border border-border/70 bg-background/50 p-5 text-left shadow-[0_8px_24px_rgba(0,0,0,0.18)] backdrop-blur-md transition hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-[0_0_28px_hsl(var(--primary)/0.12)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring md:p-6"
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-primary/10 text-primary">
                <Compass className="h-4 w-4" strokeWidth={1.75} />
              </span>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
            </div>
            <span className="font-semibold text-foreground">{item.name}</span>
            <span className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
              {item.detail}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
