import React from 'react';
import { Zap } from 'lucide-react';
import type { FutureScopeData } from './types';

// ─── FutureScopeSection ───────────────────────────────────────────────────────
/**
 * FutureScopeSection
 * Renders future roadmap features and roadmap summary.
 * Receives: { data: { features[], roadmap } }
 */
interface FutureScopeSectionProps {
  data: FutureScopeData | null | undefined;
}

const FutureScopeSection: React.FC<FutureScopeSectionProps> = ({ data }) => {
  if (!data) return null;

  const phaseMap: Record<string, string[]> = {};
  const general: string[] = [];

  data.features?.forEach((feature) => {
    const phaseMatch = feature.match(/^(Phase \d+ \([^)]+\)):/);
    if (phaseMatch) {
      const phaseKey = phaseMatch[1];
      if (!phaseMap[phaseKey]) phaseMap[phaseKey] = [];
      phaseMap[phaseKey].push(feature.replace(phaseMatch[0], '').trim());
    } else {
      general.push(feature);
    }
  });

  const phases = Object.entries(phaseMap);

  return (
    <section className="mb-16">
      <div className="flex items-center gap-3 mb-6">
        <Zap className="w-8 h-8 text-purple-400" />
        <h2 className="text-3xl font-bold text-white">Future Enhancements</h2>
      </div>
      <div className="bg-gray-900/50 border border-purple-500/20 rounded-lg p-8">
        {data.roadmap && (
          <p className="text-gray-300 leading-relaxed mb-6">{data.roadmap}</p>
        )}

        {phases.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {phases.map(([phase, items]) => (
                <div key={phase} className="bg-purple-900/10 border border-purple-500/20 rounded-lg p-6">
                  <h4 className="font-semibold text-purple-300 mb-3">{phase}</h4>
                  <ul className="space-y-1 text-gray-300 text-sm">
                    {items.map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </>
        )}

        {general.length > 0 && (
          <div className="bg-purple-900/10 border border-purple-500/20 rounded-lg p-6">
            <h4 className="font-semibold text-purple-400 mb-3">Additional Planned Features</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              {general.map((item, i) => (
                <li key={i}>• {item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};

export default FutureScopeSection;
