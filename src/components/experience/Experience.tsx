import {
  ArrowRight,
  Building2,
  Calendar,
  GraduationCap,
  MapPin,
  Rocket,
} from "lucide-react";

import { ImpactList } from "@/components/ui/impact-list";
import { TechStack } from "@/components/ui/tech-stack";

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
  storyBeats?: { step: string; detail: string }[];
  projectTypes?: { title: string; examples: string }[];
  impacts?: string[];
  technologies?: string[];
  focusAreas?: string[];
};

const ewallChapter: Chapter = {
  id: "ewall",
  eyebrow: "Current company",
  title: "EWall Solutions Pvt. Ltd.",
  tagline: "Intern to junior — shipping production SaaS and client platforms.",
  location: "India",
  icon: Building2,
  accent: "primary",
  stats: [
    { label: "Path", value: "Intern → Junior" },
    { label: "Focus", value: "SaaS & client apps" },
    { label: "Stack", value: "React · Node · Linux" },
  ],
  roles: [
    {
      id: "ewall-junior",
      role: "Junior Software Developer",
      duration: "Aug 2025 — Present",
      focus: "Own features end-to-end — from UI to deploy.",
      impacts: [
        "Production React & Next.js apps",
        "Reusable UI, hooks & REST APIs",
        "Auth & RBAC for multi-tenant SaaS",
        "Memo, lazy load & code splitting",
        "Nginx · PM2 production releases",
        "Mentor freshers & unblock tasks",
        "Client reqs → HLD / LLD",
        "Production fixes under deadlines",
      ],
      technologies: [
        "React",
        "Next.js",
        "TypeScript",
        "Node.js",
        "Express",
        "REST APIs",
        "Nginx",
        "PM2",
        "Linux",
        "RBAC",
        "Git",
      ],
    },
    {
      id: "ewall-intern",
      role: "Software Developer Intern",
      duration: "May 2025 — Aug 2025",
      focus: "Learned the release rhythm inside a fast-moving team.",
      impacts: [
        "React & TypeScript UI work",
        "API integration & responsive layouts",
        "Backend tweaks & bug fixes",
        "Production troubleshooting",
      ],
      technologies: ["React", "TypeScript", "REST APIs", "Git"],
    },
  ],
  storyBeats: [
    { step: "Ship", detail: "Features to production" },
    { step: "Design", detail: "HLD & LLD upfront" },
    { step: "Review", detail: "PRs before release" },
    { step: "Mentor", detail: "Guide freshers daily" },
    { step: "Fix", detail: "Debug live issues" },
  ],
};

const freelanceChapter: Chapter = {
  id: "freelance",
  eyebrow: "Chapter · Freelance",
  title: "Freelance Full Stack Developer",
  tagline: "Six-plus real client builds — not demos, software teams actually used.",
  duration: "Nov 2024 — May 2025",
  location: "Remote · Part-time",
  icon: Rocket,
  accent: "amber",
  stats: [
    { label: "Delivered", value: "6+ projects" },
    { label: "Owned", value: "Call → deploy" },
    { label: "Stack", value: "React · Node · PG" },
  ],
  storyBeats: [
    { step: "Discover", detail: "Client call & scope" },
    { step: "Design", detail: "HLD before code" },
    { step: "Build", detail: "Milestone shipping" },
    { step: "Deploy", detail: "Live & monitored" },
    { step: "Fix", detail: "Post-launch support" },
  ],
  projectTypes: [
    {
      title: "Business websites",
      examples: "Garments · fitness · local services",
    },
    {
      title: "Dashboards & admin",
      examples: "Analytics · orders · CMS panels",
    },
    {
      title: "SaaS & MVPs",
      examples: "Auth · APIs · multi-tenant apps",
    },
  ],
  impacts: [
    "Direct client collaboration",
    "Tight deadlines & hotfixes",
    "Requirements → shipped product",
    "PostgreSQL-backed full stack",
  ],
  technologies: [
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "Express",
    "PostgreSQL",
    "REST APIs",
    "Deployment",
  ],
};

const educationChapter: Chapter = {
  id: "education",
  eyebrow: "Education",
  title: "SA College Of Arts & Science",
  tagline: "BSc Computer Science — foundations that shaped how I design systems today.",
  duration: "2024 — 2025",
  location: "Chennai",
  icon: GraduationCap,
  accent: "cyan",
  focusAreas: [
    "Software engineering fundamentals",
    "Data structures & algorithms",
    "Backend systems & databases",
    "Academic automation projects",
  ],
  technologies: ["Java", "Python", "Spring Boot", "DSA", "Database Systems"],
};

const accentStyles = {
  primary: {
    icon: "border-primary/30 bg-primary/10 text-primary",
    border: "border-primary/20",
    beat: "border-border/50 bg-background/50",
    dot: "primary" as const,
  },
  amber: {
    icon: "border-amber-400/30 bg-amber-500/10 text-amber-300",
    border: "border-amber-400/20",
    beat: "border-border/50 bg-background/50",
    dot: "amber" as const,
  },
  cyan: {
    icon: "border-cyan-400/30 bg-cyan-500/10 text-cyan-300",
    border: "border-cyan-400/20",
    beat: "border-border/50 bg-background/50",
    dot: "cyan" as const,
  },
};

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
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-background/50 px-2.5 py-1 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5 text-primary/80" />
          {duration}
        </span>
      ) : null}
      {location ? (
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-background/50 px-2.5 py-1 text-xs text-muted-foreground">
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
        <div
          key={stat.label}
          className="rounded-xl border border-border/50 bg-background/50 px-4 py-3 text-left"
        >
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {stat.label}
          </p>
          <p className="mt-0.5 text-sm font-semibold text-foreground">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}

function StoryFlow({
  beats,
  accent,
}: {
  beats: { step: string; detail: string }[];
  accent: keyof typeof accentStyles;
}) {
  const styles = accentStyles[accent];

  return (
    <ol className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-stretch sm:gap-2">
      {beats.map((beat, i) => (
        <li
          key={beat.step}
          className="flex min-w-0 items-center sm:flex-1 sm:max-w-[9rem]"
        >
          <div
            className={`w-full rounded-lg border px-3 py-2.5 text-left ${styles.beat}`}
          >
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {String(i + 1).padStart(2, "0")}
            </p>
            <p className="mt-0.5 text-sm font-semibold text-foreground">
              {beat.step}
            </p>
            <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
              {beat.detail}
            </p>
          </div>
          {i < beats.length - 1 ? (
            <ArrowRight
              className="mx-1 hidden h-3.5 w-3.5 shrink-0 text-muted-foreground/40 lg:block"
              aria-hidden
            />
          ) : null}
        </li>
      ))}
    </ol>
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
    <article className="rounded-xl border border-border/50 bg-background/40 p-5 sm:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h4 className="text-base font-semibold text-foreground sm:text-lg">
            {role.role}
          </h4>
          <p className="mt-1 text-sm text-muted-foreground">{role.focus}</p>
        </div>
        <MetaChips duration={role.duration} />
      </div>

      <ImpactList items={role.impacts} accent={accentStyles[accent].dot} />
      <TechStack items={role.technologies} />
    </article>
  );
}

function ExperienceChapter({ chapter }: { chapter: Chapter }) {
  const Icon = chapter.icon;
  const styles = accentStyles[chapter.accent];

  return (
    <section aria-labelledby={`${chapter.id}-heading`} className="w-full min-w-0">
      <div className="mb-6 flex items-start gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${styles.icon}`}
        >
          <Icon className="h-6 w-6" strokeWidth={1.75} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary sm:text-xs">
            {chapter.eyebrow}
          </p>
          <h2
            id={`${chapter.id}-heading`}
            className="section-title text-2xl sm:text-3xl"
          >
            {chapter.title}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            {chapter.tagline}
          </p>
          {(chapter.duration || chapter.location) && (
            <div className="mt-3">
              <MetaChips duration={chapter.duration} location={chapter.location} />
            </div>
          )}
        </div>
      </div>

      <div
        className={`space-y-6 rounded-2xl border p-5 sm:p-6 md:p-7 ${styles.border} bg-background/30`}
      >
        {chapter.stats ? <StatStrip stats={chapter.stats} /> : null}

        {chapter.storyBeats ? (
          <div>
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              How this chapter unfolded
            </p>
            <StoryFlow beats={chapter.storyBeats} accent={chapter.accent} />
          </div>
        ) : null}

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
              <div
                key={project.title}
                className="rounded-xl border border-border/50 bg-background/40 p-4"
              >
                <p className="text-sm font-semibold text-foreground">
                  {project.title}
                </p>
                <p className="mt-2 font-mono text-[11px] leading-relaxed text-muted-foreground sm:text-xs">
                  {project.examples}
                </p>
              </div>
            ))}
          </div>
        ) : null}

        {chapter.impacts ? (
          <div>
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Key outcomes
            </p>
            <ImpactList items={chapter.impacts} accent={accentStyles[chapter.accent].dot} />
          </div>
        ) : null}

        {chapter.focusAreas ? (
          <ImpactList
            items={chapter.focusAreas}
            accent={accentStyles[chapter.accent].dot}
          />
        ) : null}

        {chapter.technologies && !chapter.roles ? (
          <TechStack items={chapter.technologies} />
        ) : null}
      </div>
    </section>
  );
}

export default function Experience() {
  return (
    <section
      id="experience"
      className="page-section-y page-container-x relative w-full min-w-0"
    >
      <div className="mx-auto w-full min-w-0 max-w-4xl space-y-14 md:space-y-20">
        <ExperienceChapter chapter={ewallChapter} />
        <ExperienceChapter chapter={freelanceChapter} />
        <ExperienceChapter chapter={educationChapter} />
      </div>
    </section>
  );
}
