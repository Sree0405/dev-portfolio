import { cn } from "@/lib/utils";

type PortfolioCardProps = React.HTMLAttributes<HTMLDivElement> & {
  interactive?: boolean;
  elevated?: boolean;
  /** Extra padding for feature blocks */
  spacious?: boolean;
  as?: "div" | "article" | "li";
};

/**
 * Portfolio card — brand-aware surfaces; teal edge on interactive hover.
 */
export function PortfolioCard({
  children,
  className,
  interactive = false,
  elevated = false,
  spacious = false,
  as: Comp = "div",
  ...props
}: PortfolioCardProps) {
  return (
    <Comp
      className={cn(
        "portfolio-card rounded-xl border p-5 text-left sm:p-6",
        spacious && "p-6 sm:p-7 md:p-8",
        elevated && "bg-[hsl(var(--surface-2))] shadow-[var(--shadow-soft)]",
        interactive &&
          "portfolio-card-interactive transition-[transform,border-color,box-shadow,background] duration-[var(--motion-normal,250ms)] ease-out hover:-translate-y-1 focus-within:-translate-y-1",
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}
