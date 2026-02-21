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
        <Home className="w-8 h-8 text-purple-400" />
        <h2 className="text-3xl font-bold text-white">What is {projectName}?</h2>
      </div>
      <div className="bg-gray-900/50 border border-purple-500/20 rounded-lg p-8">
        {data.purpose && (
          <p className="text-gray-300 text-lg leading-relaxed mb-6">{data.purpose}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {data.targetUsers?.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-purple-400 mb-4">Target Users</h3>
              <ul className="space-y-3 text-gray-300">
                {data.targetUsers.map((user, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>{user}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.benefits?.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-purple-400 mb-4">Key Benefits</h3>
              <div className="space-y-3">
                {data.benefits.map((benefit, i) => {
                  const [title, ...rest] = benefit.split(':');
                  const hasColon = benefit.includes(':');
                  return (
                    <div key={i} className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                      {hasColon ? (
                        <>
                          <h4 className="font-semibold text-purple-400 mb-1">{title}</h4>
                          <p className="text-sm text-gray-400">{rest.join(':').trim()}</p>
                        </>
                      ) : (
                        <p className="text-sm text-gray-400">{benefit}</p>
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