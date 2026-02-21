/**
 * Shared TypeScript interfaces for documentation components.
 * Aligns with JSON schema in /data/*.json files.
 */

import { GalleryItem } from "./Gallery";

export interface OverviewData {
  purpose?: string;
  targetUsers?: string[];
  benefits?: string[];
}

export interface ProblemData {
  summary?: string;
  painPoints?: string[];
}

export interface FeatureItem {
  title?: string;
  description?: string;
  points?: string[];
}

export interface ModuleItem {
  name: string;
  purpose?: string;
  features?: string[];
  summary?: string;
}

export interface WorkflowStep {
  step?: number;
  title?: string;
  description?: string;
}

export interface AnalyticsData {
  metrics?: string[];
  visuals?: string[];
  logic?: string;
}

export interface ArchitectureData {
  frontend?: string;
  backend?: string;
  state?: string;
  storage?: string;
  api?: string;
}

export interface SecurityData {
  authentication?: string;
  encryption?: string;
  privacy?: string;
}

export interface DesignData {
  themes?: string[];
  principles?: string[];
  patterns?: string[];
}

export interface FutureScopeData {
  features?: string[];
  roadmap?: string;
}

export interface CodeExampleItem {
  title?: string;
  language?: string;
  code?: string;
}

export interface DocumentationData {
  slug?: string;
  projectName: string;
  tagline?: string;
  description?: string;
  platform?: string[];
  techStack?: string[];
  status?: string;
  demoUrl?: string;
  overview?: OverviewData;
  problem?: ProblemData;
  features?: FeatureItem[];
  modules?: ModuleItem[];
  workflow?: WorkflowStep[];
  analytics?: AnalyticsData;
  architecture?: ArchitectureData;
  security?: SecurityData;
  design?: DesignData;
  future?: FutureScopeData;
  codeExamples?: CodeExampleItem[];
    gallery?: GalleryItem[];
    isMobile?: boolean;

}
