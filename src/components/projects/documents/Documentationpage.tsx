import React, { useState, useMemo } from 'react';
import OverviewSection from './Overviewsection';
import ProblemSection from './Problemsection';
import FeatureGrid from './Featuregrid';
import ModuleAccordion from './Moduleaccordion';
import WorkflowTimeline from './Workflowtimeline';
import AnalyticsSection from './Analyticssection';
import ArchitecturePanel from './Architecturepanel';
import SecurityPanel from './Securitypanel';
import DesignSection from './Designsection';
import FutureScopeSection from './Futurescopesection';
import CodeExamplesSection from './Codeexamplessection';
import type { DocumentationData } from './types';
import Gallery from './Gallery';
import { CaseStudySummary } from './CaseStudySummary';

// ─── Modal ────────────────────────────────────────────────────────────────────
interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
}

const DetailModal: React.FC<DetailModalProps> = ({ isOpen, onClose, title, description }) => {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-background border border-primary/30 rounded-lg max-w-2xl w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-2xl font-bold text-primary mb-4">{title}</h3>
        <p className="text-foreground/80 leading-relaxed">{description}</p>
        <button
          onClick={onClose}
          className="mt-6 px-4 py-2 bg-primary hover:bg-primary/90 text-foreground rounded-lg transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

// ─── Table of Contents builder ────────────────────────────────────────────────
const TOC_DEFINITIONS = [
  { id: 'overview', label: 'Project Overview', dataKey: 'overview' as const },
{ id: 'gallery', label: 'Screenshots', dataKey: 'gallery' as const },  
  { id: 'problem', label: 'Problem Statement', dataKey: 'problem' as const },
  { id: 'features', label: 'Core Features', dataKey: 'features' as const },
  { id: 'modules', label: 'App Modules', dataKey: 'modules' as const },
  { id: 'workflow', label: 'User Flow & Workflow', dataKey: 'workflow' as const },
  { id: 'analytics', label: 'Analytics & Insights', dataKey: 'analytics' as const },
  { id: 'architecture', label: 'Technical Architecture', dataKey: 'architecture' as const },
  { id: 'security', label: 'Security & Privacy', dataKey: 'security' as const },
  { id: 'design', label: 'Design System', dataKey: 'design' as const },
  { id: 'future', label: 'Future Enhancements', dataKey: 'future' as const },
  { id: 'code', label: 'Code Examples', dataKey: 'codeExamples' as const },
];

// ─── Main Component ───────────────────────────────────────────────────────────
/**
 * DocumentationPage
 *
 * Universal, fully data-driven documentation renderer.
 * Accepts a single `data` prop (imported JSON) and renders all sections.
 *
 * Usage:
 *   import data from '@/data/FinanceTracker.json';
 *   <DocumentationPage data={data} />
 *
 * Adding a new project requires ONLY:
 *   1. Create a new JSON file in /data
 *   2. Import and pass it here
 *   No component changes needed.
 */
interface DocumentationPageProps {
  data: DocumentationData | null | undefined;
  isMobile?: boolean;
}

const DocumentationPage: React.FC<DocumentationPageProps> = ({ data, isMobile = false }) => {
  const [modal, setModal] = useState({ isOpen: false, title: '', description: '' });

  // Build TOC only for sections that have data
  const activeToc = useMemo(() => {
    if (!data) return [];
    return TOC_DEFINITIONS.filter(({ dataKey }) => {
      const val = data[dataKey];
      if (!val) return false;
      if (Array.isArray(val)) return val.length > 0;
      return true;
    });
  }, [data]);

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background flex items-center justify-center">
        <p className="portfolio-text-muted text-lg">No documentation data provided.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* ── Header ───────────────────────────────────────────────────────── */}
        <div className="text-center mb-16 mt-16">
          <h1 className="text-3xl text-center md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
            {data.projectName}
          </h1>
          {data.tagline && (
            <p className="text-sm portfolio-text-muted mb-2 sm:text-[15px]">{data.tagline}</p>
          )}
          <p className="portfolio-text-muted">Complete A–Z Platform Documentation</p>

          {/* Tech stack badges */}
          {data.techStack?.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              {data.techStack.map((tech, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-primary/10 border border-primary/30 rounded-full text-sm text-primary/80"
                >
                  {tech}
                </span>
              ))}
              {data.status && (
                <span className="px-3 py-1 bg-primary/10 border border-primary/30 rounded-full text-sm text-primary/80">
                  {data.status}
                </span>
              )}
            </div>
          )}

          {/* Demo link — only shown if demoUrl exists in JSON */}
          {data.demoUrl && (
            <button
              onClick={() => window.open(data.demoUrl, '_blank')}
              className="mt-6 px-6 py-2 bg-primary hover:bg-primary/90 text-foreground rounded-lg transition-colors"
            >
              View Live Demo
            </button>
          )}
        </div>

        {data.caseStudy ? (
          <CaseStudySummary
            problem={data.caseStudy.problem}
            constraints={data.caseStudy.constraints}
            approach={data.caseStudy.approach}
            results={data.caseStudy.results}
          />
        ) : null}

        {/* ── Table of Contents ─────────────────────────────────────────────── */}
        {activeToc.length > 0 && (
          <div className="bg-background/50 border border-border rounded-2xl p-10 mb-16">
            <h3 className="text-2xl font-bold text-primary mb-8 tracking-wide">
              Table of Contents
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {activeToc.map(({ id, label }, index) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className="group flex items-center gap-4 rounded-xl border border-border/50
                             bg-background/40 px-5 py-4 transition-all
                             hover:border-primary/40 hover:bg-primary/10"
                >
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-full
                               bg-primary/10 text-sm font-semibold text-primary
                               group-hover:bg-primary/20"
                  >
                    {index + 1}
                  </div>
                  <div className="text-foreground/80 group-hover:text-primary/80 transition-colors">
                    {label}
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* ── Sections ──────────────────────────────────────────────────────── */}
        {data.overview && (
          <div id="overview">
            <OverviewSection data={data.overview} projectName={data.projectName} />
          </div>
        )}
        {data.gallery?.length > 0 && (
          <div id="gallery">
            <Gallery ismobile={isMobile} images={data.gallery} title="Screenshots" />
          </div>
        )}
        {data.problem && (
          <div id="problem">
            <ProblemSection data={data.problem} />
          </div>
        )}

        {data.features?.length > 0 && (
          <div id="features">
            <FeatureGrid data={data.features} />
          </div>
        )}

        {data.modules?.length > 0 && (
          <div id="modules">
            <ModuleAccordion data={data.modules} />
          </div>
        )}

        {data.workflow?.length > 0 && (
          <div id="workflow">
            <WorkflowTimeline data={data.workflow} />
          </div>
        )}

        {data.analytics && (
          <div id="analytics">
            <AnalyticsSection data={data.analytics} />
          </div>
        )}

        {data.architecture && (
          <div id="architecture">
            <ArchitecturePanel data={data.architecture} />
          </div>
        )}

        {data.security && (
          <div id="security">
            <SecurityPanel data={data.security} />
          </div>
        )}

        {data.design && (
          <div id="design">
            <DesignSection data={data.design} />
          </div>
        )}

        {data.future && (
          <div id="future">
            <FutureScopeSection data={data.future} />
          </div>
        )}

        {data.codeExamples?.length > 0 && (
          <div id="code">
            <CodeExamplesSection data={data.codeExamples} />
          </div>
        )}

        {/* ── Footer ────────────────────────────────────────────────────────── */}
        <div className="text-center pt-16 pb-8 border-t border-border">
          <p className="portfolio-text-muted mb-2">{data.projectName} Documentation</p>
          <p className="text-sm portfolio-text-muted">
            {data.techStack?.join(', ')}
            {data.status ? ` • ${data.status}` : ''}
          </p>
        </div>
      </div>

      {/* Global Modal */}
      <DetailModal
        isOpen={modal.isOpen}
        onClose={() => setModal({ isOpen: false, title: '', description: '' })}
        title={modal.title}
        description={modal.description}
      />
    </div>
  );
};

export default DocumentationPage;
