import React from 'react';
import { FileText } from 'lucide-react';
import type { WorkflowStep } from './types';

/**
 * WorkflowTimeline
 * Renders user workflow as a numbered vertical timeline.
 * Receives: { data: [{ step, title, description }] }
 */
interface WorkflowTimelineProps {
  data: WorkflowStep[] | null | undefined;
}

const WorkflowTimeline: React.FC<WorkflowTimelineProps> = ({ data }) => {
  if (!data?.length) return null;

  return (
    <section className="mb-16">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-8 h-8 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">User Flow & Workflow</h2>
      </div>
      <div className="bg-background/50 border border-border rounded-lg p-8">
        <p className="text-foreground/80 leading-relaxed mb-8">
          A step-by-step walkthrough of how users interact with the system from start to finish.
        </p>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[19px] top-0 bottom-0 w-px bg-primary/20" />

          <div className="space-y-6">
            {data.map((step, i) => (
              <div key={i} className="flex gap-6 relative">
                {/* Step badge */}
                <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 border border-primary/30 text-sm font-bold text-primary z-10">
                  {step.step ?? i + 1}
                </div>

                {/* Content */}
                <div className="flex-1 bg-primary/10 border border-border/50 rounded-lg p-5 hover:border-primary/30 transition-colors">
                  {step.title && (
                    <h4 className="font-semibold text-primary/80 mb-2">{step.title}</h4>
                  )}
                  {step.description && (
                    <p className="portfolio-text-muted text-sm leading-relaxed">{step.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkflowTimeline;