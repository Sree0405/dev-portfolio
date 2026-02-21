import React from 'react';
import { Zap } from 'lucide-react';
import type { ProblemData } from './types';

/**
 * ProblemSection
 * Renders problem summary and pain points.
 * Receives: { data: { summary, painPoints[] } }
 */
interface ProblemSectionProps {
  data: ProblemData | null | undefined;
}

const ProblemSection: React.FC<ProblemSectionProps> = ({ data }) => {
  if (!data) return null;

  return (
    <section className="mb-16">
      <div className="flex items-center gap-3 mb-6">
        <Zap className="w-8 h-8 text-purple-400" />
        <h2 className="text-3xl font-bold text-white">Problem Statement & Vision</h2>
      </div>
      <div className="bg-gray-900/50 border border-purple-500/20 rounded-lg p-8">
        {data.summary && (
          <>
            <h3 className="text-xl font-semibold text-purple-400 mb-4">The Core Challenge</h3>
            <p className="text-gray-300 leading-relaxed mb-8">{data.summary}</p>
          </>
        )}

        {data.painPoints?.length > 0 && (
          <>
            <h3 className="text-xl font-semibold text-purple-400 mb-4">Problems Solved</h3>
            <ul className="space-y-3 text-gray-300">
              {data.painPoints.map((point, i) => {
                const colonIdx = point.indexOf(':');
                const hasColon = colonIdx !== -1;
                const title = hasColon ? point.slice(0, colonIdx) : null;
                const body = hasColon ? point.slice(colonIdx + 1).trim() : point;
                return (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>
                      {title && <strong>{title}:</strong>} {body}
                    </span>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
    </section>
  );
};

export default ProblemSection;