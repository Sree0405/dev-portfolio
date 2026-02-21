import React from 'react';
import { BarChart2 } from 'lucide-react';
import type { AnalyticsData } from './types';

/**
 * AnalyticsSection
 * Renders analytics metrics, visuals description, and logic summary.
 * Receives: { data: { metrics[], visuals[], logic } }
 */
interface AnalyticsSectionProps {
  data: AnalyticsData | null | undefined;
}

const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({ data }) => {
  if (!data) return null;

  return (
    <section className="mb-16">
      <div className="flex items-center gap-3 mb-6">
        <BarChart2 className="w-8 h-8 text-purple-400" />
        <h2 className="text-3xl font-bold text-white">Analytics & Insights</h2>
      </div>
      <div className="bg-gray-900/50 border border-purple-500/20 rounded-lg p-8">
        <p className="text-gray-300 leading-relaxed mb-6">
          The analytics layer transforms stored data into actionable insights. Visual breakdowns and historical comparisons help users understand patterns and plan ahead.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {data.metrics?.length > 0 && (
            <div className="bg-purple-900/10 border border-purple-500/20 rounded-lg p-6">
              <h4 className="font-semibold text-purple-400 mb-4">Data Points</h4>
              <div className="space-y-3 text-sm">
                {data.metrics.map((metric, i) => {
                  const colonIdx = metric.indexOf(':');
                  const hasColon = colonIdx !== -1;
                  const label = hasColon ? metric.slice(0, colonIdx) : `Metric ${i + 1}`;
                  const value = hasColon ? metric.slice(colonIdx + 1).trim() : metric;
                  return (
                    <div key={i} className="flex items-start gap-3">
                      <span className="font-mono text-purple-400 flex-shrink-0">{label}</span>
                      <span className="text-gray-400">{value}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {data.visuals?.length > 0 && (
            <div className="bg-purple-900/10 border border-purple-500/20 rounded-lg p-6">
              <h4 className="font-semibold text-purple-400 mb-4">Visual Components</h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                {data.visuals.map((visual, i) => (
                  <li key={i}>✓ {visual}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {data.logic && (
          <div className="bg-purple-900/10 border border-purple-500/20 rounded-lg p-6">
            <h4 className="font-semibold text-purple-400 mb-3">Implementation Logic</h4>
            <p className="text-gray-300 text-sm leading-relaxed">{data.logic}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default AnalyticsSection;