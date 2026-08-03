import { Reveal } from "@/components/portfolio";

const sections = [
  { n: "01", label: "All reviews", href: "#reviews" },
  { n: "02", label: "Leave a review", href: "#leave-a-review" },
] as const;

export default function ReviewsHero() {
  return (
    <section className="relative overflow-hidden border-b border-primary/10">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 0%, hsl(var(--primary) / 0.16), transparent 55%), radial-gradient(ellipse 50% 40% at 50% 30%, hsl(var(--primary) / 0.08), transparent 50%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
        aria-hidden
      />

      <div className="page-container-x relative mx-auto max-w-3xl page-hero-pt pb-14 text-center sm:pb-16 md:pb-20">
        <Reveal>
          <p className="section-eyebrow mb-5">Social proof</p>
          <h1 className="mx-auto max-w-[16ch] font-display text-[clamp(2.35rem,5.5vw,3.85rem)] font-bold leading-[1.05] tracking-[-0.04em] text-foreground">
            Reviews from people
            <span className="page-title-accent mt-1 block">
              I&apos;ve worked with.
            </span>
          </h1>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mx-auto mt-5 max-w-sm text-sm leading-relaxed portfolio-text-muted sm:mt-6 sm:text-[15px]">
            Notes from colleagues, clients, and collaborators. Leave one if
            we&apos;ve shipped together — honest and short.
          </p>
          <nav
            aria-label="Reviews sections"
            className="mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-2"
          >
            {sections.map((s) => (
              <a
                key={s.href}
                href={s.href}
                className="font-mono text-[11px] uppercase tracking-[0.16em] portfolio-text-muted transition-colors hover:text-primary"
              >
                <span className="text-primary/70">{s.n}</span> {s.label}
              </a>
            ))}
          </nav>
        </Reveal>
      </div>
    </section>
  );
}
