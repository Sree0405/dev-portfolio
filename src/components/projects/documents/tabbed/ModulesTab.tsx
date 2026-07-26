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
              className="group flex flex-col rounded-xl border border-purple-500/20 bg-gray-950/40 p-5 text-left transition-all hover:border-purple-400/50 hover:bg-purple-900/10"
            >
              <div className="mb-4 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/10">
                  <Icon className="h-5 w-5 text-purple-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-white">{mod.name}</h3>
                    <span className="rounded-full border border-purple-500/30 px-2 py-0.5 text-[10px] uppercase text-purple-400">
                      {TYPE_LABELS[mod.type]}
                    </span>
                  </div>
                  <p className="mt-0.5 font-mono text-xs text-gray-600">{mod.route}</p>
                </div>
              </div>

              <p className="mb-3 text-sm text-purple-300/80">{mod.tagline}</p>
              <p className="mb-4 flex-1 text-sm leading-relaxed text-gray-400">{mod.summary}</p>

              <div className="flex flex-wrap gap-1.5">
                {mod.features.slice(0, 3).map((f) => (
                  <span
                    key={f}
                    className="rounded-md bg-purple-900/20 px-2 py-0.5 text-[11px] text-gray-500"
                  >
                    {f.length > 40 ? `${f.slice(0, 40)}…` : f}
                  </span>
                ))}
              </div>

              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-purple-400">
                Full module docs <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </button>
          );
        })}
      </div>
    </DocSection>
  );
}
