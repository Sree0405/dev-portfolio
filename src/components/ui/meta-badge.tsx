import { cn } from "@/lib/utils";

type MetaBadgeProps = {
  children: React.ReactNode;
  className?: string;
};

/** Small inline label — rounded-md, not pill-shaped */
export function MetaBadge({ children, className }: MetaBadgeProps) {
  return (
    <span
      className={cn(
        "meta-badge inline-flex items-center rounded-md border border-primary/25 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary",
        className,
      )}
    >
      {children}
    </span>
  );
}
