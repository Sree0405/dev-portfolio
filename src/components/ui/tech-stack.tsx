import { cn } from "@/lib/utils";

type TechStackProps = {
  items: string[];
  className?: string;
  bordered?: boolean;
};

export function TechStack({
  items,
  className,
  bordered = true,
}: TechStackProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap gap-1.5",
        bordered && "border-t border-border pt-4",
        className,
      )}
    >
      {items.map((tech) => (
        <span
          key={tech}
          className="tech-pill rounded-md border border-primary/20 bg-primary/5 px-2.5 py-1.5 font-mono text-xs portfolio-text-muted transition-colors duration-[var(--motion-fast,150ms)] hover:border-primary/45 hover:bg-primary/10 hover:text-primary"
        >
          {tech}
        </span>
      ))}
    </div>
  );
}
