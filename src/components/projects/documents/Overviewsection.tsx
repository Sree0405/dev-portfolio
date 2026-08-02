import React from 'react';
import { Home } from 'lucide-react';
import type { OverviewData } from './types';

/**
 * OverviewSection
 * Renders project purpose, target users, and key benefits.
 * Receives: { data: { purpose, targetUsers[], benefits[] }, projectName }
 */
interface OverviewSectionProps {
  data: OverviewData | null | undefined;
  projectName: string;
}

const OverviewSection: React.FC<OverviewSectionProps> = ({ data, projectName }) => {
  if (!data) return null;

  return (
    <section className="mb-16">
      <div className="flex items-center gap-3 mb-6">
        <Home className="w-8 h-8 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">What is {projectName}?</h2>
      </div>
      <div className="bg-background/50 border border-border rounded-lg p-8">
        {data.purpose && (
          <p className="text-foreground/80 text-lg leading-relaxed mb-6">{data.purpose}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {data.targetUsers?.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-primary mb-4">Target Users</h3>
              <ul className="space-y-3 text-foreground/80">
                {data.targetUsers.map((user, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-primary mt-1">•</span>
                    <span>{user}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.benefits?.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-primary mb-4">Key Benefits</h3>
              <div className="space-y-3">
                {data.benefits.map((benefit, i) => {
                  const [title, ...rest] = benefit.split(':');
                  const hasColon = benefit.includes(':');
                  return (
                    <div key={i} className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                      {hasColon ? (
                        <>
                          <h4 className="font-semibold text-primary mb-1">{title}</h4>
                          <p className="text-sm portfolio-text-muted">{rest.join(':').trim()}</p>
                        </>
                      ) : (
                        <p className="text-sm portfolio-text-muted">{benefit}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default OverviewSection;