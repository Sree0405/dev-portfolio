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
        <Database className="w-8 h-8 text-purple-400" />
        <h2 className="text-3xl font-bold text-white">App Modules</h2>
      </div>
      <div className="bg-gray-900/50 border border-purple-500/20 rounded-lg p-8">
        <p className="text-gray-300 leading-relaxed mb-6">
          The application is organized into {data.length} primary modules. Every module is purpose-built to handle a specific dimension of the platform.
        </p>

        <div className="space-y-3">
          {data.map((mod, i) => (
            <div
              key={i}
              className="border border-purple-500/20 rounded-lg overflow-hidden bg-gray-950/40"
            >
              {/* Header */}
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-purple-900/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/10 text-sm font-semibold text-purple-400">
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{mod.name}</p>
                    {mod.purpose && (
                      <p className="text-xs text-gray-500 mt-0.5">{mod.purpose}</p>
                    )}
                  </div>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-purple-400 transition-transform duration-200 ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Body */}
              {openIndex === i && (
                <div className="px-6 pb-5 border-t border-purple-500/10">
                  {mod.features?.length > 0 && (
                    <ul className="space-y-2 text-gray-300 text-sm mt-4 mb-4">
                      {mod.features.map((f, j) => (
                        <li key={j}>✓ {f}</li>
                      ))}
                    </ul>
                  )}
                  {mod.summary && (
                    <p className="text-sm text-gray-500 italic border-t border-purple-500/10 pt-3">
                      {mod.summary}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick nav summary */}
        <div className="bg-purple-900/10 border border-purple-500/20 rounded-lg p-6 mt-6">
          <h4 className="font-semibold text-purple-400 mb-3">Module Index</h4>
          <div className="flex flex-wrap gap-2">
            {data.map((mod, i) => (
              <button
                key={i}
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                  openIndex === i
                    ? 'border-purple-400 bg-purple-500/20 text-purple-300'
                    : 'border-purple-500/20 text-gray-400 hover:border-purple-400/40 hover:text-purple-300'
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