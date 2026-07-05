import { useEffect } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";

type SkillDetail = {
  title: string;
  role: string;
  description: string;
  tags: string[];
};

const SKILL_DETAILS: Record<string, SkillDetail> = {
  React: {
    title: "React",
    role: "UI architecture & rendering",
    description:
      "Component composition, hooks, reconciliation, and performance-conscious patterns for large feature surfaces.",
    tags: ["Rendering behavior", "Hooks", "Memoization", "Code splitting"],
  },
  "Next.js": {
    title: "Next.js",
    role: "Full-stack React platform",
    description:
      "App structure, routing, data loading, and deployment patterns for scalable production apps.",
    tags: ["App Router", "API routes", "SSR / SSG"],
  },
  TypeScript: {
    title: "TypeScript",
    role: "Type-safe engineering",
    description:
      "Strict typing, generics, and shared contracts across UI and APIs to keep refactors safe at scale.",
    tags: ["Strict mode", "Inference", "API contracts"],
  },
  JavaScript: {
    title: "JavaScript",
    role: "Language fundamentals",
    description:
      "Event loop, closures, prototypes, and async patterns—the base for predictable React and Node code.",
    tags: ["Async / await", "Closures", "ES modules"],
  },
  "Node.js": {
    title: "Node.js",
    role: "APIs & runtime",
    description:
      "Server-side JavaScript for REST services, tooling, and full-stack delivery alongside React.",
    tags: ["REST", "Middleware", "I/O patterns"],
  },
  Express: {
    title: "Express",
    role: "HTTP & REST APIs",
    description:
      "Routing, middleware, and JSON endpoints for features owned end-to-end with the frontend.",
    tags: ["Routing", "Middleware", "JSON APIs"],
  },
  WebSockets: {
    title: "WebSockets",
    role: "Realtime communication",
    description:
      "Persistent connections for live updates, notifications, and collaborative features.",
    tags: ["Connection lifecycle", "Reconnection", "Event payloads"],
  },
  "REST APIs": {
    title: "REST APIs",
    role: "Contract-first integration",
    description:
      "Resource-oriented endpoints, versioning, validation, and predictable error models.",
    tags: ["OpenAPI-friendly", "Validation", "Auth boundaries"],
  },
  "Performance optimization": {
    title: "Performance optimization",
    role: "Fast, stable UIs",
    description:
      "Bundle analysis, lazy loading, render profiling, and caching strategies for production apps.",
    tags: ["Code splitting", "Memoization", "Core Web Vitals"],
  },
  Microservices: {
    title: "Microservices",
    role: "Scalable system design",
    description:
      "Service boundaries, contracts, and deployment independence as products grow.",
    tags: ["API design", "Resilience", "Team scalability"],
  },
  Java: {
    title: "Java",
    role: "Additional · JVM backends",
    description:
      "Complementary enterprise work when teams standardize on the JVM.",
    tags: ["OOP & patterns", "Concurrency", "Interoperability"],
  },
  "Spring Boot": {
    title: "Spring Boot",
    role: "Additional · JVM APIs",
    description:
      "Spring-based services with DI, security modules, and ops-friendly configuration.",
    tags: ["REST controllers", "Data access", "Config profiles"],
  },
  Zapier: {
    title: "Zapier",
    role: "No-code automation",
    description:
      "Integrations between SaaS tools, triggers, and multi-step Zaps for business workflows.",
    tags: ["Triggers & actions", "Filters", "Error handling"],
  },
  n8n: {
    title: "n8n",
    role: "Workflow automation",
    description:
      "Self-hostable workflows with branching, code nodes, and deep app connectivity.",
    tags: ["Flows", "Credentials", "Retries & logging"],
  },
  "Full-stack systems": {
    title: "Full-stack systems",
    role: "End-to-end delivery",
    description:
      "Owning features across UI, APIs, persistence, and deploys so releases stay coherent.",
    tags: ["Vertical slices", "Scalable structure", "Release discipline"],
  },
  "Tailwind CSS": {
    title: "Tailwind CSS",
    role: "Utility-first styling",
    description:
      "Consistent spacing and responsive layouts without blocking core engineering work.",
    tags: ["Responsive", "Design tokens", "Dark mode"],
  },
  Tailwind: {
    title: "Tailwind CSS",
    role: "Utility-first styling",
    description:
      "Consistent spacing and responsive layouts without blocking core engineering work.",
    tags: ["Responsive", "Design tokens", "Dark mode"],
  },
  PostgreSQL: {
    title: "PostgreSQL",
    role: "Relational data",
    description:
      "Schema design, migrations, and query patterns suited for SaaS workloads.",
    tags: ["Prisma / SQL", "Indexing", "Integrity"],
  },
  Docker: {
    title: "Docker",
    role: "Consistent environments",
    description:
      "Containerized dev and deploy paths for predictable builds across machines.",
    tags: ["Images", "Compose", "CI"],
  },
  Git: {
    title: "Git",
    role: "Version control",
    description:
      "Branching, reviews, and release hygiene for collaborative engineering.",
    tags: ["PR workflow", "Releases", "Traceability"],
  },
  Vite: {
    title: "Vite",
    role: "Build tooling",
    description:
      "Fast local dev and optimized production bundles for modern frontend projects.",
    tags: ["HMR", "ESM", "Production build"],
  },
  "React Native": {
    title: "React Native",
    role: "Cross-platform mobile",
    description:
      "Shared React mental model with native navigation and platform-specific polish.",
    tags: ["Navigation", "Native modules", "OTA updates"],
  },
  Expo: {
    title: "Expo",
    role: "Mobile delivery",
    description:
      "Streamlined builds, dev client workflows, and distribution for React Native apps.",
    tags: ["EAS", "Config plugins", "Dev builds"],
  },
  "AI Integration": {
    title: "AI integration",
    role: "Intelligent product features",
    description:
      "LLM-backed flows, tool use, and guardrails wired into production codepaths.",
    tags: ["Prompting", "Agents", "Evaluation"],
  },
  "React Server Components": {
    title: "React Server Components",
    role: "Hybrid rendering",
    description:
      "Server and client boundaries, streaming, and composition models in modern React apps.",
    tags: ["Streaming", "Boundaries", "Next.js"],
  },
  "Edge Functions": {
    title: "Edge Functions",
    role: "Latency-sensitive logic",
    description:
      "Run close to users for auth, personalization, and lightweight transforms.",
    tags: ["CDN edge", "Cold start aware", "Security"],
  },
  "Distributed Systems": {
    title: "Distributed Systems",
    role: "Scale & reliability",
    description:
      "Thinking in services, failures, and consistency tradeoffs for growing platforms.",
    tags: ["Resilience", "Observability", "Boundaries"],
  },
  "CI/CD": {
    title: "CI/CD",
    role: "Ship with confidence",
    description:
      "Automated test and deploy pipelines so merges translate to safe releases.",
    tags: ["GitHub Actions", "Preview deploys", "Quality gates"],
  },
};

type Props = {
  skill: string | null;
  onClose: () => void;
};

export default function SkillInspector({ skill, onClose }: Props) {
  useEffect(() => {
    if (!skill) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [skill, onClose]);

  if (!skill) return null;

  const detail =
    SKILL_DETAILS[skill] ??
    ({
      title: skill,
      role: "Engineering capability",
      description:
        "Part of the broader toolkit used across product work. Open a conversation to go deeper on implementations and tradeoffs.",
      tags: ["Ask for examples", "Architecture fit", "Team context"],
    } satisfies SkillDetail);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="skill-inspector-title"
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
    >
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/65 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 m-4 w-full max-w-md overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-b from-background/95 to-background/90 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-primary">
              Skill detail
            </p>
            <h3
              id="skill-inspector-title"
              className="mt-1 text-2xl font-bold tracking-tight text-foreground"
            >
              {detail.title}
            </h3>
            <p className="mt-1 text-sm font-medium text-muted-foreground">
              {detail.role}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border/70 bg-background/50 text-muted-foreground transition hover:border-primary/40 hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground">
          {detail.description}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {detail.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-lg border border-border/60 bg-primary/5 px-3 py-1 text-xs font-medium text-primary"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3 border-t border-border/50 pt-6">
          <Link
            to="/projects"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_8px_24px_hsl(var(--primary)/0.35)] transition hover:opacity-95"
          >
            See projects
          </Link>
          <Link
            to="/contact"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-xl border border-border/80 bg-background/60 px-4 py-2.5 text-sm font-medium text-foreground transition hover:border-primary/40"
          >
            Hire / contact
          </Link>
        </div>
      </div>
    </div>
  );
}
