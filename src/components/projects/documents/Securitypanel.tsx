import React from 'react';
import { Shield } from 'lucide-react';
import type { SecurityData } from './types';

/**
 * SecurityPanel
 * Renders security & privacy information from JSON.
 * Receives: { data: { authentication?, encryption?, privacy? } }
 */
interface SecurityPanelProps {
  data: SecurityData | null | undefined;
}

const SecurityPanel: React.FC<SecurityPanelProps> = ({ data }) => {
  if (!data) return null;

  const layers = [
    { key: 'authentication' as const, label: 'Authentication' },
    { key: 'encryption' as const, label: 'Encryption' },
    { key: 'privacy' as const, label: 'Privacy' },
  ].filter(({ key }) => data[key]);

  return (
    <section className="mb-16">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-8 h-8 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">Security & Privacy</h2>
      </div>
      <div className="bg-background/50 border border-border rounded-lg p-8">
        <p className="text-foreground/80 leading-relaxed mb-6">
          Security measures and privacy guarantees protecting user data and system integrity.
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

export default SecurityPanel;
