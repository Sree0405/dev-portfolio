import React from 'react';
import { Code } from 'lucide-react';
import type { CodeExampleItem } from './types';

/**
 * CodeExamplesSection
 * Renders code snippets from JSON.
 * Receives: { data: [{ title, language, code }] }
 */
interface CodeExamplesSectionProps {
  data: CodeExampleItem[] | null | undefined;
}

const CodeExamplesSection: React.FC<CodeExamplesSectionProps> = ({ data }) => {
  if (!data?.length) return null;

  return (
    <section className="mb-16">
      <div className="flex items-center gap-3 mb-6">
        <Code className="w-8 h-8 text-purple-400" />
        <h2 className="text-3xl font-bold text-white">Code Examples</h2>
      </div>
      <div className="bg-gray-900/50 border border-purple-500/20 rounded-lg p-8">
        <div className="space-y-6">
          {data.map((example, i) => (
            <div key={i}>
              {example.title && (
                <h4 className="text-lg font-semibold text-purple-400 mb-3">{example.title}</h4>
              )}
              {example.code && (
                <div className="bg-black/50 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-sm text-gray-300 whitespace-pre">{example.code}</pre>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CodeExamplesSection;