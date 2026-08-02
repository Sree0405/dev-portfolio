import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ChevronDown, ExternalLink, FileText, Github, Lock, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TechStack } from "@/components/ui/tech-stack";
import { ProjectPreview } from "../ProjectPreview";
import { PortfolioButton, Reveal } from "@/components/portfolio";
import { cn } from "@/lib/utils";
import { projects, type Project, type ProjectCaseStudy } from "./projectData";

/* ─── helpers ─── */

const SCAN: { key: keyof ProjectCaseStudy; label: string }[] = [
  { key: "problem", label: "Problem" },
  { key: "solution", label: "Solution" },
  { key: "role", label: "My role" },
  { key: "outcome", label: "Outcome" },
];

const DEPTH: { key: keyof ProjectCaseStudy; label: string }[] = [
  { key: "challenges", label: "Challenges" },
  { key: "decisions", label: "Decisions" },
  { key: "architecture", label: "Architecture" },
  { key: "tradeoffs", label: "Tradeoffs" },
];

function openLink(path: string, navigate: (p: string) => void) {
  if (path.startsWith("/")) navigate(path);
  else window.open(path);
}

function ProjectCTAs({
  project,
  onNavigate,
  size = "default",
}: {
  project: Project;
  onNavigate: (p: string) => void;
  size?: "default" | "compact";
}) {
  const btn = size === "compact" ? "min-h-9 px-3.5 py-1.5 text-xs" : "min-h-10 px-4 py-2 text-sm";
  return (
    <div className="flex flex-wrap gap-2">
      {project.live ? (
        <PortfolioButton type="button" className={btn} onClick={() => openLink(project.live!, onNavigate)}>
          <ExternalLink size={14} aria-hidden />
          Live
        </PortfolioButton>
      ) : null}
      {project.github ? (
        <PortfolioButton type="button" variant="secondary" className={btn} onClick={() => window.open(project.github)}>
          <Github size={14} aria-hidden />
          Code
        </PortfolioButton>
      ) : project.sourcePolicy === "private" ? (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/[0.06] font-medium text-primary/90",
            size === "compact" ? "min-h-9 px-3 py-1.5 text-xs" : "min-h-10 px-3.5 py-2 text-xs sm:text-sm",
          )}
          title="Source is private — use Live demo and Docs"
        >
          <Lock size={13} aria-hidden />
          Private source
        </span>
      ) : null}
      {project.docs ? (
        <PortfolioButton type="button" variant="secondary" className={btn} onClick={() => openLink(project.docs!, onNavigate)}>
          <FileText size={14} aria-hidden />
          Docs
        </PortfolioButton>
      ) : null}
    </div>
  );
}

function CaseStudyPanel({
  project,
  onClose,
  className,
}: {
  project: Project;
  onClose: () => void;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduce ? undefined : { opacity: 0, y: 12 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "projects-case-panel relative mt-6 overflow-hidden rounded-2xl border border-primary/20 bg-[hsl(var(--surface)/0.85)] shadow-[0_30px_80px_-40px_hsl(var(--primary)/0.35)] backdrop-blur-md",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 0% 0%, hsl(var(--primary) / 0.12), transparent 55%)",
        }}
        aria-hidden
      />

      <div className="relative flex items-center justify-between gap-4 border-b border-primary/10 px-5 py-4 sm:px-7">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
            Case study
          </p>
          <p className="mt-2.5 font-display text-lg font-semibold tracking-tight text-foreground">
            {project.title}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-primary/20 bg-background/40 text-foreground transition-colors hover:border-primary/45 hover:text-primary"
          aria-label="Close case study"
        >
          <X size={16} />
        </button>
      </div>

      <div className="relative grid gap-10 px-5 py-7 sm:px-7 sm:py-9 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
        <dl className="grid gap-8 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-9">
          {SCAN.map(({ key, label }) => (
            <div key={key} className="flex flex-col gap-3">
              <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
                {label}
              </dt>
              <dd className="m-0 text-sm leading-relaxed portfolio-text-muted">
                {project.caseStudy[key]}
              </dd>
            </div>
          ))}
        </dl>

        <div className="rounded-xl border border-primary/15 bg-background/30 p-5 sm:p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
            Implementation depth
          </p>
          <dl className="mt-5 space-y-6 border-t border-primary/10 pt-6">
            {DEPTH.map(({ key, label }) => (
              <div key={key} className="flex flex-col gap-2.5">
                <dt className="text-sm font-medium text-foreground">{label}</dt>
                <dd className="m-0 text-sm leading-relaxed portfolio-text-muted">
                  {project.caseStudy[key]}
                </dd>
              </div>
            ))}
          </dl>

          {project.highlights?.length ? (
            <ul className="mt-7 space-y-3 border-t border-primary/10 pt-6">
              {project.highlights.map((h) => (
                <li key={h} className="flex gap-2.5 text-sm portfolio-text-muted">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" aria-hidden />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}

function CaseStudyToggle({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium tracking-wide transition-all",
        open
          ? "border-primary/45 bg-primary/15 text-primary"
          : "border-primary/20 bg-background/30 portfolio-text-muted hover:border-primary/40 hover:text-primary",
      )}
    >
      {open ? "Close case study" : "Open case study"}
      <ChevronDown
        className={cn("h-3.5 w-3.5 transition-transform duration-300", open && "rotate-180")}
        aria-hidden
      />
    </button>
  );
}

/* ─── Flagship (Apple / product launch) ─── */

function Flagship({
  project,
  index,
  expandedId,
  setExpandedId,
  onNavigate,
}: {
  project: Project;
  index: number;
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
  onNavigate: (p: string) => void;
}) {
  const open = expandedId === project.id;
  const n = String(index).padStart(2, "0");

  return (
    <section id="showcase-flagship" className="relative scroll-mt-28">
      <div
        className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-primary/[0.08] blur-3xl"
        aria-hidden
      />

      <div className="grid items-stretch gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.18fr)] lg:gap-10 xl:gap-14">
        {/* Sticky copy */}
        <Reveal className="flex flex-col justify-center lg:sticky lg:top-28 lg:self-start">
          <div className="flex items-center gap-3">
            <span className="font-display text-5xl font-bold leading-none tracking-[-0.06em] text-primary/25 sm:text-6xl">
              {n}
            </span>
            <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
              Flagship
            </span>
          </div>

          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-primary/80">
            {project.type}
          </p>
          <h2 className="mt-2 font-display text-[clamp(2rem,4.5vw,3.25rem)] font-bold leading-[1.02] tracking-[-0.04em] text-foreground">
            {project.title}
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed portfolio-text-muted sm:text-[15px]">
            {project.summary}
          </p>

          <div className="mt-6 max-w-md">
            <TechStack items={project.tech.slice(0, 5)} bordered={false} />
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ProjectCTAs project={project} onNavigate={onNavigate} />
            <CaseStudyToggle
              open={open}
              onToggle={() => setExpandedId(open ? null : project.id)}
            />
          </div>
        </Reveal>

        {/* Hero stage */}
        <Reveal delay={0.08} className="relative">
          <div className="projects-media-stage relative aspect-[16/11] w-full sm:aspect-[16/10] lg:min-h-[420px] lg:aspect-auto lg:h-[min(62vh,560px)]">
            <div className="absolute -inset-px rounded-[1.6rem] bg-gradient-to-br from-primary/35 via-primary/5 to-transparent opacity-80" aria-hidden />
            <div className="absolute inset-[1px] overflow-hidden rounded-[1.55rem]">
              <ProjectPreview project={project} frame="bleed" priority className="h-full rounded-[1.55rem]" />
            </div>
            <div className="pointer-events-none absolute -bottom-3 -right-3 hidden h-24 w-24 rounded-full border border-primary/20 sm:block" aria-hidden />
            <div className="pointer-events-none absolute -left-4 top-10 hidden h-16 w-16 rounded-2xl border border-primary/15 bg-primary/[0.04] sm:block" aria-hidden />
          </div>
        </Reveal>
      </div>

      <AnimatePresence initial={false}>
        {open ? (
          <CaseStudyPanel project={project} onClose={() => setExpandedId(null)} />
        ) : null}
      </AnimatePresence>
    </section>
  );
}

/* ─── Bento systems ─── */

function BentoCard({
  project,
  index,
  expandedId,
  setExpandedId,
  onNavigate,
}: {
  project: Project;
  index: number;
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
  onNavigate: (p: string) => void;
}) {
  const open = expandedId === project.id;
  const n = String(index).padStart(2, "0");

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-primary/15 bg-[hsl(var(--surface)/0.55)] transition-colors duration-300 hover:border-primary/35">
      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden">
        <ProjectPreview
          project={project}
          frame="bleed"
          className="absolute inset-0 h-full w-full max-h-full"
        />
        <div className="pointer-events-none absolute left-4 top-4 z-10 flex items-center gap-2">
          <span className="rounded-md bg-background/70 px-2 py-1 font-mono text-[10px] tracking-[0.16em] text-primary backdrop-blur-md">
            {n}
          </span>
          <span className="rounded-md bg-background/60 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-foreground/80 backdrop-blur-md">
            {project.type}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="font-display text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          {project.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed portfolio-text-muted">
          {project.summary}
        </p>
        <div className="mt-4">
          <TechStack items={project.tech.slice(0, 4)} bordered={false} />
        </div>
        <div className="mt-auto flex flex-wrap items-center gap-3 pt-5">
          <ProjectCTAs project={project} onNavigate={onNavigate} size="compact" />
          <CaseStudyToggle open={open} onToggle={() => setExpandedId(open ? null : project.id)} />
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open ? (
          <div className="border-t border-primary/10 px-4 pb-5 pt-1 sm:px-5">
            <CaseStudyPanel
              project={project}
              onClose={() => setExpandedId(null)}
              className="mt-4 border-0 bg-background/40 shadow-none"
            />
          </div>
        ) : null}
      </AnimatePresence>
    </article>
  );
}

function SystemsBento({
  items,
  startIndex,
  expandedId,
  setExpandedId,
  onNavigate,
}: {
  items: Project[];
  startIndex: number;
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
  onNavigate: (p: string) => void;
}) {
  return (
    <section id="showcase-systems" className="relative scroll-mt-28">
      <Reveal>
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="section-eyebrow">Systems</p>
            <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Open architecture
            </h2>
          </div>
          <div className="hidden h-px flex-1 max-w-xs bg-gradient-to-r from-primary/40 to-transparent sm:block" aria-hidden />
        </div>
      </Reveal>

      <div className="grid gap-4 sm:gap-5 lg:grid-cols-2 lg:gap-5">
        <Reveal className="h-full" delay={0.05}>
          <BentoCard
            project={items[0]}
            index={startIndex}
            expandedId={expandedId}
            setExpandedId={setExpandedId}
            onNavigate={onNavigate}
          />
        </Reveal>
        <Reveal className="h-full" delay={0.1}>
          <BentoCard
            project={items[1]}
            index={startIndex + 1}
            expandedId={expandedId}
            setExpandedId={setExpandedId}
            onNavigate={onNavigate}
          />
        </Reveal>
      </div>
    </section>
  );
}

/* ─── Cinematic client strips ─── */

function CinematicStrip({
  project,
  index,
  align,
  expandedId,
  setExpandedId,
  onNavigate,
}: {
  project: Project;
  index: number;
  align: "left" | "right";
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
  onNavigate: (p: string) => void;
}) {
  const open = expandedId === project.id;
  const n = String(index).padStart(2, "0");
  const mediaRight = align === "left";

  return (
    <article className="relative py-4">
      <div
        className={cn(
          "grid items-center gap-8 lg:gap-12",
          "lg:grid-cols-[1fr_1.15fr]",
          !mediaRight && "lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1",
        )}
      >
        <Reveal className={cn(!mediaRight && "lg:pl-4")}>
          <div className="flex items-baseline gap-3">
            <span className="font-display text-4xl font-bold tracking-[-0.05em] text-primary/20">{n}</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary/80">
              Client · Live
            </span>
          </div>
          <h3 className="mt-3 font-display text-[clamp(1.6rem,3vw,2.35rem)] font-bold leading-[1.05] tracking-[-0.035em] text-foreground">
            {project.title}
          </h3>
          <p className="mt-3 max-w-md text-sm leading-relaxed portfolio-text-muted sm:text-[15px]">
            {project.summary}
          </p>
          <div className="mt-5 max-w-sm">
            <TechStack items={project.tech.slice(0, 4)} bordered={false} />
          </div>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <ProjectCTAs project={project} onNavigate={onNavigate} />
            <CaseStudyToggle open={open} onToggle={() => setExpandedId(open ? null : project.id)} />
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <div className="relative">
            <div
              className={cn(
                "pointer-events-none absolute -inset-6 rounded-[2rem] opacity-70",
                mediaRight
                  ? "bg-gradient-to-l from-primary/10 to-transparent"
                  : "bg-gradient-to-r from-primary/10 to-transparent",
              )}
              aria-hidden
            />
            <div className="relative aspect-[16/10] rotate-0 transition-transform duration-500 ease-out hover:-translate-y-1 sm:aspect-[16/9]">
              <ProjectPreview project={project} frame="float" className="aspect-[16/10] sm:aspect-[16/9]" />
            </div>
          </div>
        </Reveal>
      </div>

      <AnimatePresence initial={false}>
        {open ? <CaseStudyPanel project={project} onClose={() => setExpandedId(null)} /> : null}
      </AnimatePresence>
    </article>
  );
}

/* ─── Archive / experiment cards ─── */

function ArchiveCard({
  project,
  index,
  expandedId,
  setExpandedId,
  onNavigate,
}: {
  project: Project;
  index: number;
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
  onNavigate: (p: string) => void;
}) {
  const open = expandedId === project.id;
  const n = String(index).padStart(2, "0");

  return (
    <article className="group relative">
      <div className="relative overflow-hidden rounded-2xl border border-primary/15 bg-[hsl(var(--surface)/0.4)] transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-[0_28px_70px_-40px_hsl(var(--primary)/0.45)]">
        <div className="relative aspect-[16/11] overflow-hidden">
          <ProjectPreview project={project} frame="bleed" className="h-full" />
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-background via-background/20 to-transparent p-5 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
            <p className="line-clamp-2 text-sm text-foreground/90">{project.summary}</p>
          </div>
          <span className="absolute left-4 top-4 font-display text-3xl font-bold tracking-tight text-background/90 drop-shadow-md">
            {n}
          </span>
        </div>

        <div className="p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary/80">{project.type}</p>
          <h3 className="mt-1.5 font-display text-xl font-semibold tracking-tight text-foreground">
            {project.title}
          </h3>
          <p className="mt-2 hidden text-sm portfolio-text-muted sm:line-clamp-2 sm:block">
            {project.summary}
          </p>
          <div className="mt-4">
            <TechStack items={project.tech.slice(0, 3)} bordered={false} />
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            <ProjectCTAs project={project} onNavigate={onNavigate} size="compact" />
            <CaseStudyToggle open={open} onToggle={() => setExpandedId(open ? null : project.id)} />
          </div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open ? (
          <div className="mt-3">
            <CaseStudyPanel project={project} onClose={() => setExpandedId(null)} />
          </div>
        ) : null}
      </AnimatePresence>
    </article>
  );
}

/* ─── Homepage compact strip ─── */

function HomeShowcase({
  items,
  onNavigate,
}: {
  items: Project[];
  onNavigate: (p: string) => void;
}) {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {items.map((project, i) => (
        <Reveal key={project.id} delay={i * 0.06}>
          <button
            type="button"
            onClick={() => onNavigate("/projects")}
            className="group relative w-full overflow-hidden rounded-2xl border border-primary/15 bg-[hsl(var(--surface)/0.45)] text-left transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="aspect-[16/11] overflow-hidden">
              <ProjectPreview project={project} frame="bleed" className="h-full" />
            </div>
            <div className="p-4 sm:p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary/80">
                {project.type}
              </p>
              <h3 className="mt-1 font-display text-lg font-semibold tracking-tight text-foreground">
                {project.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm portfolio-text-muted">{project.summary}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary opacity-80 transition-opacity group-hover:opacity-100">
                View showcase <ArrowUpRight size={14} />
              </span>
            </div>
          </button>
        </Reveal>
      ))}
    </div>
  );
}

/* ─── Page ─── */

export default function Projects({ homepage = false }: { homepage?: boolean }) {
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [flagship, systemsA, systemsB, clientA, clientB, archiveA, archiveB] = projects;

  if (homepage) {
    const homeItems = [flagship, clientA, clientB];
    return (
      <section
        id="projects"
        className="relative w-full min-w-0 border-t border-primary/15 page-container-x py-16 md:py-20"
      >
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-10 text-center md:mb-12">
            <p className="section-eyebrow">Selected work</p>
            <h2 className="section-title mt-3">Recent projects</h2>
            <hr className="brand-divider mx-auto mt-5 max-w-[8rem]" />
          </div>

          <HomeShowcase items={homeItems} onNavigate={navigate} />

          <div className="mt-10 text-center md:mt-12">
            <PortfolioButton type="button" onClick={() => navigate("/projects")}>
              Enter the showcase →
            </PortfolioButton>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div id="projects" className="projects-showcase relative w-full min-w-0">
      <div
        className="pointer-events-none absolute inset-0 particle-bg opacity-70"
        aria-hidden
      />

      <div className="page-container-x relative mx-auto max-w-6xl space-y-24 py-16 md:space-y-32 md:py-24 lg:space-y-40">
        <Flagship
          project={flagship}
          index={1}
          expandedId={expandedId}
          setExpandedId={setExpandedId}
          onNavigate={navigate}
        />

        <section id="showcase-clients" className="scroll-mt-28">
          <Reveal>
            <div className="mb-10 flex items-end justify-between gap-4 md:mb-14">
              <div>
                <p className="section-eyebrow">Client delivery</p>
                <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  Live in production
                </h2>
              </div>
              <div className="hidden h-px flex-1 max-w-md bg-gradient-to-r from-primary/35 to-transparent md:block" aria-hidden />
            </div>
          </Reveal>

          <div className="space-y-16 md:space-y-24">
            <CinematicStrip
              project={clientA}
              index={2}
              align="left"
              expandedId={expandedId}
              setExpandedId={setExpandedId}
              onNavigate={navigate}
            />
            <div className="mx-auto h-px max-w-3xl bg-gradient-to-r from-transparent via-primary/25 to-transparent" aria-hidden />
            <CinematicStrip
              project={clientB}
              index={3}
              align="right"
              expandedId={expandedId}
              setExpandedId={setExpandedId}
              onNavigate={navigate}
            />
          </div>
        </section>

        <SystemsBento
          items={[systemsA, systemsB]}
          startIndex={4}
          expandedId={expandedId}
          setExpandedId={setExpandedId}
          onNavigate={navigate}
        />

        <section id="showcase-experiments" className="scroll-mt-28">
          <Reveal>
            <div className="mb-8 flex items-end justify-between gap-4 md:mb-10">
              <div>
                <p className="section-eyebrow">Experiments</p>
                <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  In progress & exploratory
                </h2>
              </div>
            </div>
          </Reveal>

          <div className="grid gap-5 md:grid-cols-2 md:gap-6">
            <Reveal delay={0.04}>
              <ArchiveCard
                project={archiveA}
                index={6}
                expandedId={expandedId}
                setExpandedId={setExpandedId}
                onNavigate={navigate}
              />
            </Reveal>
            <Reveal delay={0.1}>
              <ArchiveCard
                project={archiveB}
                index={7}
                expandedId={expandedId}
                setExpandedId={setExpandedId}
                onNavigate={navigate}
              />
            </Reveal>
          </div>
        </section>
      </div>
    </div>
  );
}
