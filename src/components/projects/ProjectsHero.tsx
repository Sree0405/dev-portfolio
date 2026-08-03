import { Reveal } from "@/components/portfolio";

const sections = [
  { n: "01", label: "Flagship", href: "#showcase-flagship" },
  { n: "02", label: "Clients", href: "#showcase-clients" },
  { n: "03", label: "Systems", href: "#showcase-systems" },
  { n: "04", label: "Experiments", href: "#showcase-experiments" },
] as const;

export default function ProjectsHero() {
  return (
    <section className="projects-showcase-hero relative overflow-hidden border-b border-primary/10">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 15% 0%, hsl(var(--primary) / 0.16), transparent 55%), radial-gradient(ellipse 50% 40% at 90% 20%, hsl(var(--primary) / 0.08), transparent 50%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
        aria-hidden
      />

      <div className="page-container-x relative mx-auto max-w-6xl page-hero-pt pb-14 sm:pb-16 md:pb-20">
        <div className="grid items-start gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:items-end">
          <Reveal>
            <p className="section-eyebrow mb-5">Selected work</p>
            <h1 className="max-w-[14ch] font-display text-[clamp(2.35rem,5.5vw,3.85rem)] font-bold leading-[1.05] tracking-[-0.04em] text-foreground">
              Proof you can
              <span className="page-title-accent mt-1 block">scroll through.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.1} className="lg:pb-1">
            <p className="max-w-sm text-sm leading-relaxed portfolio-text-muted sm:text-[15px] lg:ml-auto lg:text-right">
              Flagship first, then live clients (including one honest WIP), then
              systems. Expand a case study for tradeoffs — labels below explain
              Live, Docs, Code, and Private source.
            </p>
            <nav
              aria-label="Showcase sections"
              className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 sm:flex sm:flex-wrap sm:justify-end sm:gap-x-7 sm:gap-y-2"
            >
              {sections.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  className="font-mono text-[11px] uppercase tracking-[0.16em] portfolio-text-muted transition-colors hover:text-primary lg:text-right"
                >
                  <span className="text-primary/70">{s.n}</span>{" "}
                  {s.label}
                </a>
              ))}
            </nav>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
