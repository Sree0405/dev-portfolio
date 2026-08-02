import React from 'react';
import { Layers } from 'lucide-react';
import type { ArchitectureData } from './types';

/**
 * ArchitecturePanel
 * Renders technical architecture layers from JSON.
 * Receives: { data: { frontend, backend, state, storage, api } }
 */
interface ArchitecturePanelProps {
  data: ArchitectureData | null | undefined;
}

const ArchitecturePanel: React.FC<ArchitecturePanelProps> = ({ data }) => {
  if (!data) return null;

  const layers = [
    { key: 'frontend', label: 'Frontend' },
    { key: 'backend',  label: 'Backend'  },
    { key: 'state',    label: 'State'    },
    { key: 'storage',  label: 'Storage'  },
    { key: 'api',      label: 'API / Integrations' },
  ].filter(({ key }) => data[key]);

  return (
    <section className="mb-16">
      <div className="flex items-center gap-3 mb-6">
        <Layers className="w-8 h-8 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">Technical Architecture</h2>
      </div>
      <div className="bg-background/50 border border-border rounded-lg p-8">
        <p className="text-foreground/80 leading-relaxed mb-6">
          A layered architecture breakdown covering every technology decision from presentation to persistence.
        </p>

        <div className="space-y-3">
          {layers.map(({ key, label }) => (
            <div
              key={key}
              className="flex flex-col md:flex-row md:items-start gap-2 md:gap-6 bg-primary/10 border border-border rounded-lg p-5"
            >
              <div className="md:w-40 flex-shrink-0">
                <span className="font-mono text-sm font-semibold text-primary">{label}</span>
              </div>
              <p className="text-foreground/80 text-sm leading-relaxed">{data[key]}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArchitecturePanel;  