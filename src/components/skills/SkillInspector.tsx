import { motion, AnimatePresence } from "framer-motion";
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
    role: "UI composition & client architecture",
    description:
      "Component models, state patterns, and performance-conscious interfaces for large feature surfaces.",
    tags: ["Hooks", "Server components (where applicable)", "Design systems"],
  },
  "Next.js": {
    title: "Next.js",
    role: "Full-stack web platform",
    description:
      "Routing, data loading, and deployment patterns for SEO-friendly and production-grade apps.",
    tags: ["App Router", "API routes", "Edge-ready"],
  },
  TypeScript: {
    title: "TypeScript",
    role: "End-to-end type safety",
    description:
      "Shared types across UI and APIs to reduce regressions and improve refactor confidence.",
    tags: ["Strict typing", "Inference", "API contracts"],
  },
  "Node.js": {
    title: "Node.js",
    role: "Primary backend runtime",
    description:
      "Main serverside path—APIs and integrations that stay aligned with the JavaScript/TypeScript frontend.",
    tags: ["REST", "Middleware", "Performance"],
  },
  Java: {
    title: "Java",
    role: "Additional · JVM backends",
    description:
      "Complementary enterprise and service work when teams standardize on the JVM—alongside a Node-first default.",
    tags: ["OOP & patterns", "Concurrency", "Interoperability"],
  },
  "Spring Boot": {
    title: "Spring Boot",
    role: "Additional · JVM APIs",
    description:
      "Extra depth for Spring-based services—DI, security modules, and ops-friendly configs when the product calls for it.",
    tags: ["REST controllers", "Data access", "Config profiles"],
  },
  Microservices: {
    title: "Microservices",
    role: "Distributed architecture",
    description:
      "Service boundaries, contracts, and deployment independence—without losing observability or cohesion.",
    tags: ["API design", "Resilience", "Team scalability"],
  },
  Zapier: {
    title: "Zapier",
    role: "No-code automation",
    description:
      "Fast integrations between SaaS tools, triggers, and multi-step Zaps for business workflows.",
    tags: ["Triggers & actions", "Filters", "Error handling"],
  },
  n8n: {
    title: "n8n",
    role: "Workflow automation",
    description:
      "Self-hostable or cloud workflows with branching, code nodes, and deep app connectivity.",
    tags: ["Flows", "Credentials", "Retries & logging"],
  },
  "Full-stack systems": {
    title: "Full-stack systems",
    role: "End-to-end product engineering",
    description:
      "Owning features across UI, APIs, persistence, deployments, and automation so releases stay coherent.",
    tags: ["Vertical slices", "DX", "Release discipline"],
  },
  "Three.js": {
    title: "Three.js",
    role: "3D & immersive web",
    description:
      "WebGL scenes, materials, and interaction patterns for product-grade 3D experiences.",
    tags: ["R3F-friendly", "Shaders (as needed)", "Performance"],
  },
  "Framer Motion": {
    title: "Framer Motion",
    role: "Motion design in React",
    description:
      "Layout transitions, scroll-linked effects, and micro-interactions that feel intentional.",
    tags: ["Layout", "Gestures", "Accessibility-aware motion"],
  },
  "Tailwind CSS": {
    title: "Tailwind CSS",
    role: "Utility-first styling",
    description:
      "Fast iteration, consistent spacing, and design tokens aligned with a cohesive visual system.",
    tags: ["Design tokens", "Responsive", "Dark mode"],
  },
  Tailwind: {
    title: "Tailwind CSS",
    role: "Utility-first styling",
    description:
      "Fast iteration, consistent spacing, and design tokens aligned with a cohesive visual system.",
    tags: ["Design tokens", "Responsive", "Dark mode"],
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
      "Fast local dev and optimized bundles for modern frontend projects.",
    tags: ["HMR", "ESM", "Production build"],
  },
  Express: {
    title: "Express",
    role: "Main HTTP layer",
    description:
      "The default API surface on Node—routing, middleware, and JSON services that ship quickly and stay maintainable.",
    tags: ["Routing", "Middleware", "JSON APIs"],
  },
  "REST APIs": {
    title: "REST APIs",
    role: "Contract-first integration",
    description:
      "Resource-oriented endpoints, versioning, and predictable error models for clients.",
    tags: ["OpenAPI-friendly", "Validation", "Auth boundaries"],
  },
  "React Native": {
    title: "React Native",
    role: "Cross-platform mobile",
    description:
      "Shared React mental model with native navigation and platform-specific polish where needed.",
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
      "LLM-backed flows, tool use, and guardrails wired into real product UX—not demos.",
    tags: ["Prompting", "Agents", "Evaluation"],
  },
  "AI Agents": {
    title: "AI Agents",
    role: "Autonomous workflows",
    description:
      "Multi-step reasoning, tooling, and human-in-the-loop patterns for reliable automation.",
    tags: ["Orchestration", "Safety", "Observability"],
  },
  WebGPU: {
    title: "WebGPU",
    role: "Next-gen web graphics",
    description:
      "GPU compute and rendering paths for experiences that outgrow canvas-only approaches.",
    tags: ["Compute shaders", "Performance", "Future-facing"],
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
        "This skill is part of the broader toolkit used across product work. Open a conversation to go deeper on implementations and tradeoffs.",
      tags: ["Ask for examples", "Architecture fit", "Team context"],
    } satisfies SkillDetail);

  return (
    <AnimatePresence>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="skill-inspector-title"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      >
        <motion.button
          type="button"
          aria-label="Close"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/65 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="relative z-10 m-4 w-full max-w-md overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-b from-background/95 to-background/90 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8"
        >
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
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
