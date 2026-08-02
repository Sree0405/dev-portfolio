import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface DocSectionProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export default function DocSection({ icon: Icon, title, description, children, className = "" }: DocSectionProps) {
  return (
    <section className={`mb-8 min-w-0 sm:mb-10 ${className}`}>
      <div className="mb-4 flex items-start gap-2.5 sm:mb-5 sm:gap-3">
        <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary sm:mt-1 sm:h-7 sm:w-7" aria-hidden />
        <div className="min-w-0">
          <h2 className="text-lg font-bold leading-snug text-foreground sm:text-2xl">{title}</h2>
          {description ? (
            <p className="mt-1 text-sm leading-relaxed portfolio-text-muted">{description}</p>
          ) : null}
        </div>
      </div>
      <div className="min-w-0 overflow-hidden rounded-2xl border border-border bg-background/50 p-4 sm:p-6 md:p-8">
        {children}
      </div>
    </section>
  );
}
