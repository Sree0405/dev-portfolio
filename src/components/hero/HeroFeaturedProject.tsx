import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { motion, type Variants } from "framer-motion";

import { TechStack } from "@/components/ui/tech-stack";
import { cn } from "@/lib/utils";

type HeroFlagshipProject = {
  eyebrow: string;
  title: string;
  subtitle: string;
  type: string;
  description: string;
  tech: readonly string[];
  image: string;
  imageAlt: string;
  href: string;
  cta: string;
};

type HeroFeaturedProjectProps = {
  project: HeroFlagshipProject;
  variants?: Variants;
  /** Smaller footprint for the home hero column */
  compact?: boolean;
};

/**
 * Product surface for the hero — browser chrome + real screenshot.
 */
export function HeroFeaturedProject({
  project,
  variants,
  compact = false,
}: HeroFeaturedProjectProps) {
  return (
    <motion.div variants={variants} className="relative w-full">
      <Link
        to={project.href}
        aria-label={`${project.title} — ${project.cta}`}
        className="group relative block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
      >
        <div className="hero-featured-frame overflow-hidden rounded-xl border border-border/80 bg-[hsl(var(--surface))] shadow-[var(--shadow-soft)] transition-[border-color,transform,box-shadow] duration-[var(--motion-normal,250ms)] ease-out motion-safe:group-hover:-translate-y-1 group-hover:border-primary/30 sm:rounded-2xl">
          <div
            className={cn(
              "flex items-center gap-2 border-b border-border/70 bg-[hsl(var(--surface-2))]",
              compact ? "px-3 py-2" : "px-4 py-3",
            )}
          >
            <span className="flex gap-1.5" aria-hidden>
              <span className="h-2 w-2 rounded-full bg-foreground/15" />
              <span className="h-2 w-2 rounded-full bg-foreground/15" />
              <span className="h-2 w-2 rounded-full bg-primary/50" />
            </span>
            <span className="ml-1.5 flex min-w-0 flex-1 items-center truncate rounded-md border border-border/50 bg-background/60 px-2.5 py-0.5 font-mono text-[11px] text-foreground/50">
              www.sreekanth.pro{project.href}
            </span>
          </div>

          <div
            className={cn(
              "relative w-full overflow-hidden",
              compact ? "aspect-[16/11]" : "aspect-[16/10]",
            )}
          >
            <img
              src={project.image}
              alt={project.imageAlt}
              loading="eager"
              fetchPriority="high"
              className="h-full w-full object-cover object-top transition-transform duration-[500ms] ease-out motion-safe:group-hover:scale-[1.03] motion-safe:group-focus-within:scale-[1.03]"
            />

            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/90 via-background/25 to-transparent opacity-85"
            />

            <div
              className={cn(
                "absolute inset-x-0 bottom-0 flex items-end justify-between gap-3",
                compact ? "p-3.5 sm:p-4" : "p-5 sm:p-6",
              )}
            >
              <div className="min-w-0">
                <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-primary">
                  {project.eyebrow}
                </p>
                <p
                  className={cn(
                    "mt-1 font-display font-semibold tracking-tight text-foreground",
                    compact ? "text-sm sm:text-[15px]" : "text-base sm:text-lg",
                  )}
                >
                  {project.title}
                </p>
                <p className="mt-0.5 text-sm text-secondary-foreground">
                  {project.subtitle}
                </p>
              </div>

              <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border/80 bg-background/80 px-2.5 py-1.5 font-mono text-[11px] font-medium text-foreground backdrop-blur-sm transition-colors group-hover:border-primary/45 group-hover:text-primary">
                {project.cta}
                <ArrowUpRight className="h-3 w-3" />
              </span>
            </div>
          </div>
        </div>

        <div
          className={cn(
            "flex flex-col gap-2.5",
            compact ? "mt-3 sm:mt-3.5" : "mt-4 sm:mt-5 sm:flex-row sm:items-end sm:justify-between",
          )}
        >
          <p
            className={cn(
              "leading-relaxed tracking-normal portfolio-text-muted",
              compact ? "text-sm" : "max-w-md text-base",
            )}
          >
            {project.description}
          </p>
          <TechStack
            items={[...project.tech]}
            bordered={false}
            className="shrink-0"
          />
        </div>
      </Link>
    </motion.div>
  );
}
