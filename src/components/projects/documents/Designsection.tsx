import React from 'react';
import { Settings } from 'lucide-react';
import type { DesignData } from './types';

/**
 * DesignSection
 * Renders design system: themes, principles, and UI patterns.
 * Receives: { data: { themes[], principles[], patterns[] } }
 */
interface DesignSectionProps {
  data: DesignData | null | undefined;
}

const DesignSection: React.FC<DesignSectionProps> = ({ data }) => {
  if (!data) return null;

  return (
    <section className="mb-16">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-8 h-8 text-purple-400" />
        <h2 className="text-3xl font-bold text-white">Design System</h2>
      </div>
      <div className="bg-gray-900/50 border border-purple-500/20 rounded-lg p-8">
        <p className="text-gray-300 leading-relaxed mb-6">
          A consistent, component-driven design system ensuring visual coherence and accessibility across the entire platform.
        </p>

        {data.themes?.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-purple-400 mb-3">Supported Themes</h4>
            <div className="flex flex-wrap gap-2">
              {data.themes.map((theme, i) => (
                <span
                  key={i}
                  className="px-4 py-2 bg-purple-900/20 border border-purple-500/30 rounded-full text-sm text-purple-300"
                >
                  {theme}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.principles?.length > 0 && (
            <div className="bg-purple-900/10 border border-purple-500/20 rounded-lg p-6">
              <h4 className="font-semibold text-purple-400 mb-3">Design Principles</h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                {data.principles.map((p, i) => (
                  <li key={i}>✓ {p}</li>
                ))}
              </ul>
            </div>
          )}

          {data.patterns?.length > 0 && (
            <div className="bg-purple-900/10 border border-purple-500/20 rounded-lg p-6">
              <h4 className="font-semibold text-purple-400 mb-3">UI Component Patterns</h4>
              <div className="space-y-2 text-sm">
                {data.patterns.map((pattern, i) => {
                  const colonIdx = pattern.indexOf(':');
                  const hasColon = colonIdx !== -1;
                  const name = hasColon ? pattern.slice(0, colonIdx) : pattern;
                  const desc = hasColon ? pattern.slice(colonIdx + 1).trim() : null;
                  return (
                    <div key={i}>
                      <span className="text-purple-400 font-mono">{name}</span>
                      {desc && <span className="text-gray-500"> — {desc}</span>}
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

export default DesignSection;