/**
 * Tabbed documentation schema — aligns with /data/*.json files.
 * Add a new project by creating JSON + a thin page wrapper only.
 */

export type DocTabId = "overview" | "modules" | "module" | "architecture" | "security" | "workflow";

export interface DocTabDefinition {
  id: DocTabId;
  label: string;
  icon: string;
}

export interface ScreenshotItem {
  id: string;
  label: string;
  description?: string;
  /** Empty string = placeholder until screenshot is added */
  src: string;
  alt: string;
}

export interface ModuleSubPage {
  name: string;
  route: string;
  description: string;
}

export interface DevToolModule {
  id: string;
  name: string;
  route: string;
  type: "full-stack" | "hybrid" | "client-only";
  icon: string;
  tagline: string;
  summary: string;
  why: string;
  what: string[];
  how: string[];
  features: string[];
  apiBase?: string;
  subPages?: ModuleSubPage[];
  screenshots: ScreenshotItem[];
  techStack?: string[];
}

export interface OverviewContent {
  whyBuilt: string;
  whatWeDo: string;
  howWeDo: string;
  highlights: { title: string; description: string }[];
  targetUsers: string[];
  platformGoals: string[];
  /** Set at runtime from devToolScreenshotMap — login page preview */
  heroImage?: string;
}

export interface ArchitectureLayer {
  label: string;
  value: string;
}

export interface ArchitectureContent {
  summary: string;
  diagram: string[];
  layers: ArchitectureLayer[];
  backendPattern: string[];
  frontendPattern: string[];
  dataFlow: string[];
}

export interface SecurityContent {
  summary: string;
  authentication: string[];
  dataIsolation: string[];
  practices: string[];
}

export interface WorkflowStep {
  step: number;
  title: string;
  description: string;
}

export interface TabbedDocumentationData {
  slug: string;
  projectName: string;
  tagline: string;
  description: string;
  techStack: string[];
  status: string;
  demoUrl?: string;
  docsUrl?: string;
  tabs: DocTabDefinition[];
  overview: OverviewContent;
  modules: DevToolModule[];
  architecture: ArchitectureContent;
  security: SecurityContent;
  workflow: WorkflowStep[];
}
