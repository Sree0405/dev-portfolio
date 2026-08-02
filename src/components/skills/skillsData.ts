import {
  Boxes,
  Code2,
  Database,
  Layers,
  PackageCheck,
  Server,
  type LucideIcon,
} from "lucide-react";

export const skillsHero = {
  eyebrow: "Specialization",
  accent: "Engineering",
  rest: "expertise",
  lead: "Production React/Next.js with backend ownership — not a tool bingo card.",
  body: "What I use daily on the EWall platform and client work, what I have shipped to production, and what I am actively building. Every capability links to Projects or Experience.",
};

/** Honest depth key — shown once for reviewers. */
export const depthLegend = [
  {
    label: "Daily",
    meaning: "In use on current production work (EWall / clients).",
  },
  {
    label: "Production",
    meaning: "Shipped with it before — not my default day-to-day tool.",
  },
  {
    label: "Building",
    meaning: "Active growth in real projects — not claimed mastery.",
  },
] as const;

export type ExpertiseCard = {
  icon: LucideIcon;
  title: string;
  description: string;
  proof: { label: string; href: string };
};

export const coreExpertise: ExpertiseCard[] = [
  {
    icon: Code2,
    title: "Frontend Engineering",
    description:
      "Production React/Next.js UIs — reusable structure, performance habits, and admin density that stays usable.",
    proof: { label: "Sree Dev Tool", href: "/project/sree-dev-tool" },
  },
  {
    icon: Layers,
    title: "Full-Stack Development",
    description:
      "Owning a slice from UI through APIs and data models — not handing off at the mock boundary.",
    proof: { label: "Fieldstack", href: "/project/fieldstack" },
  },
  {
    icon: Server,
    title: "Backend APIs",
    description:
      "Auth, REST contracts, and service layers on multi-module products — EWall platform in production, Fieldstack in open source.",
    proof: { label: "Experience / EWall", href: "/experience" },
  },
  {
    icon: Database,
    title: "Database Design",
    description:
      "Prisma/PostgreSQL schemas and isolation patterns used in real ops and CMS work.",
    proof: { label: "Sree Dev Tool", href: "/project/sree-dev-tool" },
  },
  {
    icon: Boxes,
    title: "Product Architecture",
    description:
      "Modular boundaries others can extend — libraries and admin systems, not one-off demos.",
    proof: { label: "My3DUI", href: "https://my3dui.vercel.app/docs" },
  },
  {
    icon: PackageCheck,
    title: "Product Delivery",
    description:
      "Brief → production on named client sites and EWall platform features that ship to live deployments.",
    proof: { label: "Experience", href: "/experience" },
  },
];

export type StackItem = {
  name: string;
  /** Honest depth signal — not years invented. */
  depth: "Daily" | "Production" | "Building";
};

export type StackGroup = {
  label: string;
  hint: string;
  items: StackItem[];
};

export const primaryStack: StackGroup[] = [
  {
    label: "Primary Frontend",
    hint: "Day-to-day at EWall and client work",
    items: [
      { name: "React", depth: "Daily" },
      { name: "Next.js", depth: "Daily" },
      { name: "TypeScript", depth: "Daily" },
      { name: "JavaScript", depth: "Daily" },
    ],
  },
  {
    label: "Backend",
    hint: "APIs and services I ship with",
    items: [
      { name: "Node.js", depth: "Daily" },
      { name: "Express", depth: "Daily" },
      { name: "Directus", depth: "Daily" },
      { name: "NestJS", depth: "Building" },
    ],
  },
  {
    label: "Database",
    hint: "Persistence I design and query",
    items: [
      { name: "PostgreSQL", depth: "Daily" },
      { name: "Prisma", depth: "Daily" },
      { name: "MySQL", depth: "Production" },
    ],
  },
  {
    label: "Delivery & Ops",
    hint: "How work reaches production hosts",
    items: [
      { name: "Git", depth: "Daily" },
      { name: "Vercel", depth: "Production" },
      { name: "Docker", depth: "Building" },
    ],
  },
];

export const productsIBuild = [
  {
    title: "Admin Dashboards",
    description: "Operational UIs for data, users, and workflows — including EWall platform modules.",
    proof: { label: "Sree Dev Tool", href: "/project/sree-dev-tool" },
  },
  {
    title: "CMS Platforms",
    description:
      "Directus in production at EWall; Fieldstack as early-stage open-source NestJS/Prisma CMS practice.",
    proof: { label: "Experience", href: "/experience" },
  },
  {
    title: "Client Marketing Sites",
    description: "Production business sites with clear hierarchy and CMS updates.",
    proof: {
      label: "Sri Thanigai",
      href: "https://www.srithanigaigarments.com/",
    },
  },
  {
    title: "Open-Source UI Kits",
    description: "Reusable libraries others can install — public code for review.",
    proof: { label: "My3DUI", href: "https://github.com/Sree0405/my3dui" },
  },
  {
    title: "Authentication Systems",
    description:
      "Password expiry flows and Microsoft Authentication on the EWall platform; JWT/session work on personal systems.",
    proof: { label: "Experience", href: "/experience" },
  },
  {
    title: "Deploy automation",
    description:
      "Internal Directus schema sync and PostgreSQL backup/restore tooling that cut deploy effort ~80%.",
    proof: { label: "Experience", href: "/experience" },
  },
];

export const currentFocus = [
  {
    title: "Feature delivery ownership",
    detail:
      "Requirements through deploy and production support for features I own — plus clear PR feedback.",
  },
  {
    title: "Production React depth",
    detail: "Performance and structure on dense admin surfaces I already ship.",
  },
  {
    title: "Open-source proof",
    detail: "Hardening Fieldstack and My3DUI so public code matches the portfolio claims.",
  },
];
