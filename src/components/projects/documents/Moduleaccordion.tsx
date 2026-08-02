import React, { useState } from 'react';
import { Database, ChevronDown } from 'lucide-react';
import type { ModuleItem } from './types';

/**
 * ModuleAccordion
 * Renders app modules as expandable accordion cards.
 * Receives: { data: [{ name, purpose, features[], summary }] }
 */
interface ModuleAccordionProps {
  data: ModuleItem[] | null | undefined;
}

const ModuleAccordion: React.FC<ModuleAccordionProps> = ({ data }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!data?.length) return null;

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className="mb-16">
      <div className="flex items-center gap-3 mb-6">
        <Database className="w-8 h-8 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">App Modules</h2>
      </div>
      <div className="bg-background/50 border border-border rounded-lg p-8">
        <p className="text-foreground/80 leading-relaxed mb-6">
          The application is organized into {data.length} primary modules. Every module is purpose-built to handle a specific dimension of the platform.
        </p>

        <div className="space-y-3">
          {data.map((mod, i) => (
            <div
              key={i}
              className="border border-border rounded-lg overflow-hidden bg-background/40"
            >
              {/* Header */}
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-primary/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{mod.name}</p>
                    {mod.purpose && (
                      <p className="text-xs portfolio-text-muted mt-0.5">{mod.purpose}</p>
                    )}
                  </div>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-primary transition-transform duration-200 ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Body */}
              {openIndex === i && (
                <div className="px-6 pb-5 border-t border-border/50">
                  {mod.features?.length > 0 && (
                    <ul className="space-y-2 text-foreground/80 text-sm mt-4 mb-4">
                      {mod.features.map((f, j) => (
                        <li key={j}>✓ {f}</li>
                      ))}
                    </ul>
                  )}
                  {mod.summary && (
                    <p className="text-sm portfolio-text-muted italic border-t border-border/50 pt-3">
                      {mod.summary}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick nav summary */}
        <div className="bg-primary/10 border border-border rounded-lg p-6 mt-6">
          <h4 className="font-semibold text-primary mb-3">Module Index</h4>
          <div className="flex flex-wrap gap-2">
            {data.map((mod, i) => (
              <button
                key={i}
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                  openIndex === i
                    ? 'border-primary bg-primary/20 text-primary/80'
                    : 'border-border portfolio-text-muted hover:border-primary/40 hover:text-primary/80'
                }`}
              >
                {mod.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModuleAccordion;