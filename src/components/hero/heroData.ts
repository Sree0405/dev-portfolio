/** Hero copy — one sharp claim + honest context. */
export const heroContent = {
  name: "Sreekanth",
  greeting: "Hi, I'm",
  availability: "Available for full-time",
  valueLine:
    "I own features through delivery — requirements, planning, build, review, and deploy.",
  description:
    "Junior Full-Stack Engineer at EWall Solutions on a multi-deployment resort/restaurant platform (React + Directus). I clarify requirements, plan and estimate, ship features end to end, and collaborate under fixed deadlines — including a ~600-hour client delivery with three engineers — plus named client sites live in production.",
  role: "Frontend-focused full-stack engineer",
} as const;

/** Real context from About / Experience — no invented metrics. */
export const heroIdentity = {
  company: "EWall Solutions Pvt Ltd",
  location: "India",
} as const;

/** Honest signals only — counts match Projects.tsx / real stack. */
export const heroMeta = [
  { label: "Selected work", value: "9 projects" },
  { label: "Proof", value: "Demo · Docs · GitHub" },
  { label: "Based in", value: "India" },
] as const;

export const heroSocialLinks = [
  {
    href: "https://github.com/Sree0405",
    label: "GitHub",
  },
  {
    href: "https://linkedin.com/in/sreekanth04052005",
    label: "LinkedIn",
  },
  {
    href: "mailto:sreekanth04052005@gmail.com",
    label: "Email",
  },
] as const;

export const heroCtas = {
  work: { to: "/projects", label: "See selected work" },
  resume: {
    href: "/resume/Sreekanth_SDE.pdf",
    download: "Sreekanth_SDE.pdf",
    label: "Download resume",
  },
  /** Printable HTML resume — current SoT while public PDF recompile is parked. */
  viewResume: { to: "/cv", label: "View resume" },
} as const;

/**
 * Flagship — personal ops product on a monorepo built to scale from day one.
 */
export const heroFlagship = {
  eyebrow: "Featured system",
  title: "Sree Dev Tool",
  subtitle: "Ops platform in a scalable monorepo",
  type: "Full-Stack Dashboard",
  description:
    "Built into this portfolio on purpose — the repo was designed to scale from day one, so a modular, multi-tenant-capable Dev Tool fits without a second codebase. Session auth, Express APIs, Prisma/PostgreSQL; demo isolates private ops data.",
  tech: ["React", "TypeScript", "Express", "Prisma"],
  image: "/devtool/dashboard-overview.png",
  imageAlt:
    "Sree Dev Tool dashboard overview showing modular operations panels",
  href: "/project/sree-dev-tool",
  cta: "View case study",
} as const;
