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
        bordered && "border-t border-border/40 pt-4",
        className,
      )}
    >
      {items.map((tech) => (
        <span
          key={tech}
          className="rounded-md bg-muted/50 px-2 py-1 font-mono text-[11px] text-muted-foreground sm:text-xs"
        >
          {tech}
        </span>
      ))}
    </div>
  );
}
