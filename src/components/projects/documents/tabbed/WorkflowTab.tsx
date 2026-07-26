import { GitBranch } from "lucide-react";
import DocSection from "./DocSection";
import type { WorkflowStep } from "./types";

interface WorkflowTabProps {
  workflow: WorkflowStep[];
}

export default function WorkflowTab({ workflow }: WorkflowTabProps) {
  return (
    <DocSection
      icon={GitBranch}
      title="Platform Workflow"
      description="How users move through the dashboard from login to daily operations"
    >
      <div className="relative space-y-0">
        {workflow.map((step, index) => (
          <div key={step.step} className="relative flex gap-4 pb-8 last:pb-0">
            {index < workflow.length - 1 && (
              <div className="absolute left-[15px] top-8 h-full w-px bg-purple-500/20" aria-hidden />
            )}
            <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-purple-500/40 bg-purple-900/30 text-sm font-bold text-purple-300">
              {step.step}
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
              <h3 className="font-semibold text-white">{step.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-gray-400">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </DocSection>
  );
}
