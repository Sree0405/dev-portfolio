import { PortfolioCard, Reveal, Stagger, StaggerItem } from "@/components/portfolio";
import { primaryStack } from "./skillsData";

const depthClass: Record<string, string> = {
  Daily: "border-primary/35 bg-primary/15 text-primary",
  Production: "border-primary/20 bg-muted/40 portfolio-text-muted",
  Building: "border-border/60 bg-transparent portfolio-text-muted",
};

export default function PrimaryStack() {
  return (
    <section
      id="primary-stack"
      aria-labelledby="primary-stack-heading"
      className="border-t border-primary/10 py-10 sm:py-12"
    >
      <div className="page-container-x">
        <Reveal>
          <div className="mb-3 text-center md:mb-4">
            <p className="section-eyebrow mb-2">Daily tools</p>
            <h2 id="primary-stack-heading" className="section-title">
              <span className="page-title-accent">Primary</span> stack
            </h2>
          </div>
          <p className="mx-auto mb-6 max-w-xl text-center text-sm portfolio-text-muted md:mb-8">
            Includes how work ships (Directus workflows, Git, Vercel) — not only the
            framework row. Labels match the legend above.
          </p>
        </Reveal>

        <Stagger
          className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5"
          stagger={0.08}
          delayChildren={0.06}
        >
          {primaryStack.map((group) => (
            <StaggerItem key={group.label} className="h-full">
              <PortfolioCard spacious className="flex h-full flex-col text-center">
                <p className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-primary">
                  {group.label}
                </p>
                <p className="mt-2 text-xs portfolio-text-muted">{group.hint}</p>
                <ul className="mt-5 flex flex-col gap-3">
                  {group.items.map((item) => (
                    <li
                      key={item.name}
                      className="flex flex-col items-center gap-1.5 border-b border-border/40 pb-3 last:border-0 last:pb-0"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <span
                          className="size-1.5 shrink-0 rounded-full bg-primary"
                          aria-hidden
                        />
                        <span className="text-sm font-semibold text-foreground">
                          {item.name}
                        </span>
                      </span>
                      <span
                        className={`rounded-md border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${depthClass[item.depth]}`}
                      >
                        {item.depth}
                      </span>
                    </li>
                  ))}
                </ul>
              </PortfolioCard>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
