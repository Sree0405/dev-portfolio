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
        "inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary sm:text-xs",
        className,
      )}
    >
      {children}
    </span>
  );
}
