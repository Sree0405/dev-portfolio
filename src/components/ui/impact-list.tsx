import { cn } from "@/lib/utils";

type ImpactAccent = "primary" | "amber" | "cyan" | "default";

const dotClass: Record<ImpactAccent, string> = {
  primary: "bg-primary",
  amber: "bg-amber-400",
  cyan: "bg-cyan-400",
  default: "bg-primary",
};

type ImpactListProps = {
  items: string[];
  accent?: ImpactAccent;
  columns?: boolean;
  className?: string;
};

export function ImpactList({
  items,
  accent = "default",
  columns = true,
  className,
}: ImpactListProps) {
  return (
    <ul
      className={cn(
        "grid gap-x-4 gap-y-2",
        columns ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1",
        className,
      )}
    >
      {items.map((item) => (
        <li
          key={item}
          className="relative pl-3.5 text-left text-sm leading-snug portfolio-text-muted"
        >
          <span
            className={cn(
              "absolute left-0 top-[0.4rem] h-1.5 w-1.5 rounded-full",
              dotClass[accent],
            )}
            aria-hidden
          />
          {item}
        </li>
      ))}
    </ul>
  );
}
