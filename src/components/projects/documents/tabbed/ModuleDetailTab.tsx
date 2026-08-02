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
        className="mb-6 inline-flex items-center gap-2 text-sm portfolio-text-muted transition-colors hover:text-primary/80"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to all modules
      </button>

      <div className="mb-8 min-w-0 rounded-2xl border border-border bg-gradient-to-br from-primary/20 to-background/80 p-4 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 sm:h-14 sm:w-14">
            <Icon className="h-6 w-6 text-primary sm:h-7 sm:w-7" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg font-bold text-foreground sm:text-2xl">{module.name}</h1>
              <span className="rounded-full border border-primary/30 px-2.5 py-0.5 text-[10px] text-primary sm:text-xs">
                {TYPE_LABELS[module.type]}
              </span>
            </div>
            <p className="mt-1 text-sm text-primary/80 sm:text-base">{module.tagline}</p>
            <p className="mt-2 break-all font-mono text-xs portfolio-text-muted sm:text-sm">
              {module.route}
            </p>
            {module.apiBase ? (
              <p className="mt-1 break-all font-mono text-[11px] portfolio-text-muted sm:text-xs">
                API: {module.apiBase}
              </p>
            ) : null}
          </div>
        </div>
        <p className="mt-5 text-sm leading-relaxed text-foreground/80 sm:text-base">
          {module.summary}
        </p>
      </div>

      <DocSection icon={HelpCircle} title="Why This Module">
        <p className="text-base leading-relaxed text-foreground/80">{module.why}</p>
      </DocSection>

      <DocSection icon={ListChecks} title="What It Does">
        <ul className="space-y-3">
          {module.what.map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm text-foreground/80 sm:text-base">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              {item}
            </li>
          ))}
        </ul>
      </DocSection>

      <DocSection icon={Code2} title="How It Works">
        <ul className="space-y-3">
          {module.how.map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm text-foreground/80 sm:text-base">
              <span className="mt-1 font-mono text-xs text-primary">→</span>
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
              className="rounded-lg border border-primary/15 bg-primary/10 px-4 py-3 text-sm text-foreground/80"
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
                className="rounded-lg border border-primary/15 bg-background/40 px-4 py-3"
              >
                <p className="font-medium text-foreground">{page.name}</p>
                <p className="mt-0.5 font-mono text-xs portfolio-text-muted">{page.route}</p>
                <p className="mt-2 text-sm portfolio-text-muted">{page.description}</p>
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
              className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs text-primary/80"
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
