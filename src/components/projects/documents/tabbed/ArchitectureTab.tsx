import { Code2, Server } from "lucide-react";
import DocSection from "./DocSection";
import type { ArchitectureContent } from "./types";

interface ArchitectureTabProps {
  architecture: ArchitectureContent;
}

export default function ArchitectureTab({ architecture }: ArchitectureTabProps) {
  return (
    <div>
      <DocSection icon={Code2} title="System Architecture" description="Single-port full-stack design">
        <p className="mb-6 text-base leading-relaxed text-gray-300">{architecture.summary}</p>

        <div className="mb-8 overflow-x-auto rounded-xl border border-purple-500/20 bg-gray-950/60 p-5 font-mono text-sm">
          {architecture.diagram.map((line, i) => (
            <div key={i} className="text-gray-400">
              {line}
            </div>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {architecture.layers.map((layer) => (
            <div
              key={layer.label}
              className="rounded-xl border border-purple-500/15 bg-purple-900/10 p-4"
            >
              <h3 className="mb-2 text-sm font-semibold text-purple-400">{layer.label}</h3>
              <p className="text-sm text-gray-400">{layer.value}</p>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection icon={Server} title="Backend Pattern">
        <ul className="space-y-2">
          {architecture.backendPattern.map((item) => (
            <li key={item} className="font-mono text-sm text-gray-300">
              {item}
            </li>
          ))}
        </ul>
      </DocSection>

      <DocSection icon={Code2} title="Frontend Pattern">
        <ul className="space-y-2">
          {architecture.frontendPattern.map((item) => (
            <li key={item} className="font-mono text-sm text-gray-300">
              {item}
            </li>
          ))}
        </ul>
      </DocSection>

      <DocSection icon={Server} title="Data Flow">
        <ol className="space-y-3">
          {architecture.dataFlow.map((step, i) => (
            <li key={step} className="flex gap-3 text-sm text-gray-300">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-xs font-semibold text-purple-400">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </DocSection>
    </div>
  );
}
