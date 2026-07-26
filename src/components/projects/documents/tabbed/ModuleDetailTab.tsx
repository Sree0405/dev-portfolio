import { ArrowLeft, CheckCircle2, Code2, HelpCircle, ImageIcon, ListChecks } from "lucide-react";
import DocSection from "./DocSection";
import ScreenshotPlaceholder from "./ScreenshotPlaceholder";
import { resolveDocIcon } from "./iconMap";
import type { DevToolModule } from "./types";

interface ModuleDetailTabProps {
  module: DevToolModule;
  onBack: () => void;
  shouldLoadImages?: boolean;
}

const TYPE_LABELS: Record<DevToolModule["type"], string> = {
  "full-stack": "Full-Stack Module",
  hybrid: "Hybrid Module",
  "client-only": "Client-Only Module",
};

export default function ModuleDetailTab({ module, onBack, shouldLoadImages = false }: ModuleDetailTabProps) {
  const Icon = resolveDocIcon(module.icon);

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-purple-300"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to all modules
      </button>

      <div className="mb-8 rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-900/20 to-gray-900/50 p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-purple-500/15">
            <Icon className="h-7 w-7 text-purple-400" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-white sm:text-3xl">{module.name}</h1>
              <span className="rounded-full border border-purple-500/30 px-2.5 py-0.5 text-xs text-purple-400">
                {TYPE_LABELS[module.type]}
              </span>
            </div>
            <p className="mt-1 text-purple-300">{module.tagline}</p>
            <p className="mt-2 font-mono text-sm text-gray-500">{module.route}</p>
            {module.apiBase && (
              <p className="mt-1 font-mono text-xs text-gray-600">API: {module.apiBase}</p>
            )}
          </div>
        </div>
        <p className="mt-5 text-base leading-relaxed text-gray-300">{module.summary}</p>
      </div>

      <DocSection icon={HelpCircle} title="Why This Module">
        <p className="text-base leading-relaxed text-gray-300">{module.why}</p>
      </DocSection>

      <DocSection icon={ListChecks} title="What It Does">
        <ul className="space-y-3">
          {module.what.map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm text-gray-300 sm:text-base">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-purple-400" />
              {item}
            </li>
          ))}
        </ul>
      </DocSection>

      <DocSection icon={Code2} title="How It Works">
        <ul className="space-y-3">
          {module.how.map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm text-gray-300 sm:text-base">
              <span className="mt-1 font-mono text-xs text-purple-500">→</span>
              {item}
            </li>
          ))}
        </ul>
      </DocSection>

      <DocSection icon={CheckCircle2} title="Key Features">
        <div className="grid gap-3 sm:grid-cols-2">
          {module.features.map((feature) => (
            <div
              key={feature}
              className="rounded-lg border border-purple-500/15 bg-purple-900/10 px-4 py-3 text-sm text-gray-300"
            >
              {feature}
            </div>
          ))}
        </div>
      </DocSection>

      {module.subPages && module.subPages.length > 0 && (
        <DocSection icon={ListChecks} title="Sub-Pages" description="Routes within this module">
          <div className="grid gap-3 sm:grid-cols-2">
            {module.subPages.map((page) => (
              <div
                key={page.route}
                className="rounded-lg border border-purple-500/15 bg-gray-950/40 px-4 py-3"
              >
                <p className="font-medium text-white">{page.name}</p>
                <p className="mt-0.5 font-mono text-xs text-gray-600">{page.route}</p>
                <p className="mt-2 text-sm text-gray-400">{page.description}</p>
              </div>
            ))}
          </div>
        </DocSection>
      )}

      {module.techStack && module.techStack.length > 0 && (
        <div className="mb-10 flex flex-wrap gap-2">
          {module.techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-purple-500/25 bg-purple-900/20 px-3 py-1 text-xs text-purple-300"
            >
              {tech}
            </span>
          ))}
        </div>
      )}

      <DocSection
        icon={ImageIcon}
        title="Screenshots"
        description="Captured from the live dashboard"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {module.screenshots.map((shot) => (
            <ScreenshotPlaceholder key={shot.id} item={shot} shouldLoad={shouldLoadImages} />
          ))}
        </div>
      </DocSection>
    </div>
  );
}
