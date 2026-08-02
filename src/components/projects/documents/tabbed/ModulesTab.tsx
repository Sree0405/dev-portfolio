import { ArrowRight, Layers } from "lucide-react";
import DocSection from "./DocSection";
import { resolveDocIcon } from "./iconMap";
import type { DevToolModule } from "./types";

interface ModulesTabProps {
  modules: DevToolModule[];
  onModuleSelect: (moduleId: string) => void;
}

const TYPE_LABELS: Record<DevToolModule["type"], string> = {
  "full-stack": "Full-Stack",
  hybrid: "Hybrid",
  "client-only": "Client-Only",
};

export default function ModulesTab({ modules, onModuleSelect }: ModulesTabProps) {
  return (
    <DocSection
      icon={Layers}
      title="All Modules"
      description={`${modules.length} independent modules — each with its own route, logic, and documentation`}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {modules.map((mod) => {
          const Icon = resolveDocIcon(mod.icon);

          return (
            <button
              key={mod.id}
              type="button"
              onClick={() => onModuleSelect(mod.id)}
              className="group flex flex-col rounded-xl border border-border bg-background/40 p-5 text-left transition-all hover:border-primary/50 hover:bg-primary/10"
            >
              <div className="mb-4 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-foreground">{mod.name}</h3>
                    <span className="rounded-full border border-primary/30 px-2 py-0.5 text-[10px] uppercase text-primary">
                      {TYPE_LABELS[mod.type]}
                    </span>
                  </div>
                  <p className="mt-0.5 font-mono text-xs portfolio-text-muted">{mod.route}</p>
                </div>
              </div>

              <p className="mb-3 text-sm text-primary/80">{mod.tagline}</p>
              <p className="mb-4 flex-1 text-sm leading-relaxed portfolio-text-muted">{mod.summary}</p>

              <div className="flex flex-wrap gap-1.5">
                {mod.features.slice(0, 3).map((f) => (
                  <span
                    key={f}
                    className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] portfolio-text-muted"
                  >
                    {f.length > 40 ? `${f.slice(0, 40)}…` : f}
                  </span>
                ))}
              </div>

              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Full module docs <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </button>
          );
        })}
      </div>
    </DocSection>
  );
}
