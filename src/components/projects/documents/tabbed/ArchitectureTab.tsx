import { Code2, Rocket, Server } from "lucide-react";
import DocSection from "./DocSection";
import type { ArchitectureContent } from "./types";

interface ArchitectureTabProps {
  architecture: ArchitectureContent;
}

export default function ArchitectureTab({ architecture }: ArchitectureTabProps) {
  return (
    <div>
      <DocSection icon={Code2} title="System Architecture" description="Single-port full-stack design">
        <p className="mb-6 text-sm leading-relaxed text-foreground/80 sm:text-base">
          {architecture.summary}
        </p>

        {architecture.sourcePolicy ? (
          <p className="mb-6 break-words rounded-xl border border-primary/20 bg-primary/[0.06] px-4 py-3 text-sm leading-relaxed text-foreground/90">
            <span className="font-medium text-primary">Source policy. </span>
            {architecture.sourcePolicy}
          </p>
        ) : null}

        <div className="mb-6 max-w-full overflow-x-auto rounded-xl border border-border bg-background/60 p-3 sm:mb-8 sm:p-5">
          <pre className="min-w-0 whitespace-pre-wrap break-words font-mono text-[11px] leading-relaxed portfolio-text-muted sm:text-sm sm:leading-6">
            {architecture.diagram.join("\n")}
          </pre>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {architecture.layers.map((layer) => (
            <div
              key={layer.label}
              className="rounded-xl border border-primary/15 bg-primary/10 p-4"
            >
              <h3 className="mb-2 text-sm font-semibold text-primary">{layer.label}</h3>
              <p className="text-sm portfolio-text-muted">{layer.value}</p>
            </div>
          ))}
        </div>
      </DocSection>

      {architecture.deployment?.length ? (
        <DocSection
          icon={Rocket}
          title="How it ships"
          description="Build, host, and review path — honest production story"
        >
          <ol className="space-y-3">
            {architecture.deployment.map((step, i) => (
              <li key={step} className="flex gap-3 text-sm text-foreground/80">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary">
                  {i + 1}
                </span>
                <span className="min-w-0 break-words">{step}</span>
              </li>
            ))}
          </ol>
        </DocSection>
      ) : null}

      <DocSection icon={Server} title="Backend Pattern">
        <ul className="space-y-2">
          {architecture.backendPattern.map((item) => (
            <li
              key={item}
              className="break-words font-mono text-xs text-foreground/80 sm:text-sm"
            >
              {item}
            </li>
          ))}
        </ul>
      </DocSection>

      <DocSection icon={Code2} title="Frontend Pattern">
        <ul className="space-y-2">
          {architecture.frontendPattern.map((item) => (
            <li
              key={item}
              className="break-words font-mono text-xs text-foreground/80 sm:text-sm"
            >
              {item}
            </li>
          ))}
        </ul>
      </DocSection>

      <DocSection icon={Server} title="Data Flow">
        <ol className="space-y-3">
          {architecture.dataFlow.map((step, i) => (
            <li key={step} className="flex gap-3 text-sm text-foreground/80">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary">
                {i + 1}
              </span>
              <span className="min-w-0 break-words">{step}</span>
            </li>
          ))}
        </ol>
      </DocSection>
    </div>
  );
}
