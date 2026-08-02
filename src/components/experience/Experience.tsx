import {
  Building2,
  Calendar,
  GraduationCap,
  MapPin,
  Rocket,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { ImpactList } from "@/components/ui/impact-list";
import { TechStack } from "@/components/ui/tech-stack";
import { PortfolioCard, Reveal, Stagger, StaggerItem } from "@/components/portfolio";

type RoleBlock = {
  id: string;
  role: string;
  duration: string;
  focus: string;
  impacts: string[];
  technologies: string[];
};

type Chapter = {
  id: string;
  eyebrow: string;
  title: string;
  tagline: string;
  duration?: string;
  location?: string;
  icon: typeof Building2;
  accent: "primary" | "amber" | "cyan";
  stats?: { label: string; value: string }[];
  roles?: RoleBlock[];
  projectTypes?: { title: string; examples: string }[];
  impacts?: string[];
  technologies?: string[];
  focusAreas?: string[];
};

const ewallChapter: Chapter = {
  id: "ewall",
  eyebrow: "Current company",
  title: "EWall Solutions Pvt. Ltd.",
  tagline:
    "Production SaaS delivery on a multi-module company platform — React/Next.js UI through Node APIs and Linux deploys.",
  location: "India",
  icon: Building2,
  accent: "primary",
  stats: [
    { label: "Path", value: "Intern → Junior" },
    { label: "Product", value: "EWall platform" },
    { label: "Ships via", value: "Nginx · PM2 · Linux" },
  ],
  roles: [
    {
      id: "ewall-junior",
      role: "Junior Software Developer",
      duration: "Aug 2025 — Present",
      focus:
        "Own production features across platform modules — UI, APIs, auth edges, and release.",
      impacts: [
        "Owned Kitchen Module delivery end to end — React surfaces, API contracts, and production fixes so operators run kitchen workflows without filing tickets for routine changes",
        "Delivered Voting Module as a full slice (UI states, permissions, API) so campaign voting runs on the live platform environment",
        "Owned Contract & Location Management UI + API integration used when ops configures multi-location contracts — fewer ambiguous handoffs between teams",
        "Designed Timezone Management behavior so scheduled actions and displays stay correct across regions instead of drifting on server-local time",
        "Led Campaign Module work wired to ScreenCloud Integration and the Print System pipeline — display/print paths that ops depends on in production",
        "Hardened Authentication and RBAC edges shared across modules — role checks that keep tenant-scoped data isolated at the API boundary",
        "Optimized dense admin views with memoization, lazy routes, and code splitting so hot admin screens stay usable under real data",
        "Shipped releases to Linux via Nginx + PM2 on the same cadence as the team; mentored freshers through code review on production modules",
      ],
      technologies: [
        "React",
        "Next.js",
        "TypeScript",
        "Node.js",
        "Express",
        "REST APIs",
        "RBAC",
        "Nginx",
        "PM2",
        "Linux",
        "Git",
      ],
    },
    {
      id: "ewall-intern",
      role: "Software Developer Intern",
      duration: "May 2025 — Aug 2025",
      focus:
        "Shipped platform UI slices and API integrations under review — earned ownership of production modules.",
      impacts: [
        "Built React/TypeScript UI for platform surfaces that shipped in live client environments",
        "Integrated REST APIs for module data (including early Kitchen and location-related flows) with production bug fixes under mentor review",
        "Delivered responsive admin layouts that stayed consistent with the platform design system",
        "Translated requirements into HLD/LLD notes before coding — reducing rework on shared modules",
      ],
      technologies: ["React", "TypeScript", "Next.js", "REST APIs", "Git"],
    },
  ],
};

const freelanceChapter: Chapter = {
  id: "freelance",
  eyebrow: "Chapter · Freelance",
  title: "Freelance Full Stack Developer",
  tagline:
    "Owned client delivery from discovery to deploy — Sri Thanigai Garments and GB Fitness live in production.",
  duration: "Nov 2024 — May 2025",
  location: "Remote · Part-time",
  icon: Rocket,
  accent: "amber",
  stats: [
    { label: "Live clients", value: "2 named sites" },
    { label: "Ownership", value: "Brief → deploy" },
    { label: "Stack", value: "React · Node · PG" },
  ],
  projectTypes: [
    {
      title: "Sri Thanigai Garments",
      examples:
        "Architected CMS-backed marketing + manufacturing pages — live at srithanigaigarments.com",
    },
    {
      title: "GB Fitness Studio",
      examples:
        "Delivered program/membership marketing site for Avadi gym — production Vercel deploy",
    },
    {
      title: "Additional MVPs",
      examples:
        "Built auth-aware dashboards and API-backed admin pieces where briefs required full stack",
    },
  ],
  impacts: [
    "Delivered Sri Thanigai Garments to a production company domain — CMS-backed pages so marketing updates content without an engineering ticket per change",
    "Delivered GB Fitness to a public Vercel URL with program/membership paths the gym can share with customers",
    "Owned discovery → scope → deploy → post-launch fixes for both clients — single owner from first call to live site",
    "Integrated Node/Express and PostgreSQL only where the brief needed server-backed content — not bolted on for resume keywords",
  ],
  technologies: [
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "Express",
    "PostgreSQL",
    "REST APIs",
    "Vercel",
  ],
};

const educationChapter: Chapter = {
  id: "education",
  eyebrow: "Education",
  title: "SA College Of Arts & Science",
  tagline:
    "BSc Computer Science — systems thinking applied to real builds, not course checklists.",
  duration: "BSc Computer Science",
  location: "Chennai",
  icon: GraduationCap,
  accent: "cyan",
  focusAreas: [
    "Applied software engineering and system design fundamentals to freelance and internship delivery",
    "Used data structures and algorithms where they affected product performance and correctness",
    "Built academic automation projects that required APIs, persistence, and clear ownership of delivery",
  ],
  technologies: ["Java", "Python", "DSA", "Database Systems"],
};

const chapters = [ewallChapter, freelanceChapter, educationChapter];

const accentStyles = {
  primary: {
    icon: "border-primary/30 bg-primary/10 text-primary",
    dot: "border-primary/60 bg-primary",
    list: "primary" as const,
  },
  amber: {
    icon: "border-primary/25 bg-primary/8 text-primary",
    dot: "border-primary/45 bg-primary/70",
    list: "primary" as const,
  },
  cyan: {
    icon: "border-primary/25 bg-primary/8 text-primary",
    dot: "border-primary/40 bg-primary/50",
    list: "primary" as const,
  },
};

function TimelineLine() {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <div
        className="absolute bottom-0 left-[23px] top-0 w-px bg-gradient-to-b from-primary/50 via-border to-border/40"
        aria-hidden
      />
    );
  }

  return (
    <motion.div
      className="absolute bottom-0 left-[23px] top-0 w-px origin-top bg-gradient-to-b from-primary/50 via-border to-border/40"
      aria-hidden
      initial={{ scaleY: 0, opacity: 0 }}
      whileInView={{ scaleY: 1, opacity: 1 }}
      viewport={{ once: true, margin: "-64px" }}
      transition={{ duration: 0.6, ease: [0, 0, 0.2, 1] }}
    />
  );
}

function MetaChips({
  duration,
  location,
}: {
  duration?: string;
  location?: string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {duration ? (
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-muted/30 px-2.5 py-1 text-xs portfolio-text-muted">
          <Calendar className="h-3.5 w-3.5 text-primary/80" />
          {duration}
        </span>
      ) : null}
      {location ? (
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-muted/30 px-2.5 py-1 text-xs portfolio-text-muted">
          <MapPin className="h-3.5 w-3.5 text-primary/80" />
          {location}
        </span>
      ) : null}
    </div>
  );
}

function StatStrip({ stats }: { stats: { label: string; value: string }[] }) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
      {stats.map((stat) => (
        <PortfolioCard key={stat.label} className="px-4 py-3 text-left">
          <p className="font-mono text-xs uppercase tracking-wider portfolio-text-muted">
            {stat.label}
          </p>
          <p className="mt-0.5 text-sm font-semibold">
            <span className="page-title-accent">{stat.value}</span>
          </p>
        </PortfolioCard>
      ))}
    </div>
  );
}

function RoleBlockCard({
  role,
  accent,
}: {
  role: RoleBlock;
  accent: keyof typeof accentStyles;
}) {
  return (
    <PortfolioCard as="article">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h4 className="text-[15px] font-semibold sm:text-base">
            <span className="page-title-accent">{role.role}</span>
          </h4>
          <p className="mt-1 text-sm portfolio-text-muted">
            {role.focus}
          </p>
        </div>
        <MetaChips duration={role.duration} />
      </div>

      <ImpactList items={role.impacts} accent={accentStyles[accent].list} />
      <TechStack items={role.technologies} />
    </PortfolioCard>
  );
}

function ExperienceChapter({ chapter }: { chapter: Chapter }) {
  const Icon = chapter.icon;
  const styles = accentStyles[chapter.accent];

  return (
    <section
      aria-labelledby={`${chapter.id}-heading`}
      className="relative w-full min-w-0 pl-14 md:pl-16"
    >
      <div
        className={`absolute left-[17px] top-6 z-10 h-3.5 w-3.5 rounded-full border-2 ${styles.dot}`}
        aria-hidden
      />

      <Reveal>
        <div className="mb-6 flex items-start gap-4">
          <div
            className={`icon-well flex h-11 w-11 shrink-0 items-center justify-center ${styles.icon}`}
          >
            <Icon className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="section-eyebrow">{chapter.eyebrow}</p>
            <h2 id={`${chapter.id}-heading`} className="section-title mt-2">
              {chapter.title}
            </h2>
            <p className="mt-2 text-sm portfolio-text-muted sm:text-[15px]">
              {chapter.tagline}
            </p>
            {(chapter.duration || chapter.location) && (
              <div className="mt-3">
                <MetaChips
                  duration={chapter.duration}
                  location={chapter.location}
                />
              </div>
            )}
          </div>
        </div>
      </Reveal>

      <PortfolioCard className="space-y-6 text-left md:p-7">
        {chapter.stats ? <StatStrip stats={chapter.stats} /> : null}

        {chapter.roles ? (
          <div className="space-y-4">
            {chapter.roles.map((role) => (
              <RoleBlockCard key={role.id} role={role} accent={chapter.accent} />
            ))}
          </div>
        ) : null}

        {chapter.projectTypes ? (
          <div className="grid gap-3 sm:grid-cols-3">
            {chapter.projectTypes.map((project) => (
              <PortfolioCard key={project.title} className="text-left">
                <p className="text-sm font-semibold">
                  <span className="page-title-accent">{project.title}</span>
                </p>
                <p className="mt-2 font-mono text-xs leading-relaxed portfolio-text-muted">
                  {project.examples}
                </p>
              </PortfolioCard>
            ))}
          </div>
        ) : null}

        {chapter.impacts ? (
          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-primary/80">
              Key outcomes
            </p>
            <ImpactList
              items={chapter.impacts}
              accent={accentStyles[chapter.accent].list}
            />
          </div>
        ) : null}

        {chapter.focusAreas ? (
          <ImpactList
            items={chapter.focusAreas}
            accent={accentStyles[chapter.accent].list}
          />
        ) : null}

        {chapter.technologies && !chapter.roles ? (
          <TechStack items={chapter.technologies} />
        ) : null}
      </PortfolioCard>
    </section>
  );
}

function OwnershipScopeNote() {
  return (
    <Reveal className="relative z-10 mb-12 md:mb-16">
      <PortfolioCard className="border-primary/20 bg-primary/[0.04] p-5 text-left sm:p-6">
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-primary">
          Scope of ownership
        </p>
        <p className="mt-2 text-sm leading-relaxed text-foreground sm:text-[15px]">
          Title is Junior. Scope is module ownership — UI, API contracts, auth
          edges, and release on platform slices I ship — not company-wide
          architecture or headcount. Claims below stay at that level; no
          invented traffic or revenue numbers.
        </p>
      </PortfolioCard>
    </Reveal>
  );
}

export default function Experience() {
  return (
    <section
      id="experience"
      className="page-section-y page-container-x relative w-full min-w-0"
    >
      <div className="relative mx-auto w-full min-w-0 max-w-4xl">
        <OwnershipScopeNote />

        <TimelineLine />

        <Stagger className="space-y-14 md:space-y-20">
          {chapters.map((chapter) => (
            <StaggerItem key={chapter.id}>
              <ExperienceChapter chapter={chapter} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
