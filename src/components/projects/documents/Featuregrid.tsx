import React from 'react';
import { Layers } from 'lucide-react';
import type { FeatureItem } from './types';

/**
 * FeatureGrid
 * Renders a list of features as a grid with descriptions and bullet points.
 * Receives: { data: [{ title, description, points[] }] }
 */
interface FeatureGridProps {
  data: FeatureItem[] | null | undefined;
}

const FeatureGrid: React.FC<FeatureGridProps> = ({ data }) => {
  if (!data?.length) return null;

  return (
    <section className="mb-16">
      <div className="flex items-center gap-3 mb-6">
        <Layers className="w-8 h-8 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">Core Features</h2>
      </div>
      <div className="bg-background/50 border border-border rounded-lg p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.map((feature, i) => (
            <div
              key={i}
              className="bg-primary/10 border border-border rounded-lg p-6"
            >
              {feature.title && (
                <h4 className="font-semibold text-primary mb-2 text-lg">{feature.title}</h4>
              )}
              {feature.description && (
                <p className="text-foreground/80 text-sm leading-relaxed mb-4">{feature.description}</p>
              )}
              {feature.points?.length > 0 && (
                <ul className="space-y-1 portfolio-text-muted text-sm">
                  {feature.points.map((pt, j) => (
                    <li key={j}>✓ {pt}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;