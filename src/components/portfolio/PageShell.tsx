import { cn } from "@/lib/utils";

type PageShellProps = {
  children: React.ReactNode;
  className?: string;
  wide?: boolean;
  /** When true, applies horizontal container padding/max-width */
  contained?: boolean;
};

/**
 * Outer page wrapper only — layout owns `<main id="main">`.
 * Do not nest another `<main>` inside pages.
 */
export function PageShell({
  children,
  className,
  wide = false,
  contained = false,
}: PageShellProps) {
  return (
    <div
      className={cn(
        "relative min-h-0 w-full",
        contained && (wide ? "page-container-wide" : "page-container-x"),
        className,
      )}
    >
      {children}
    </div>
  );
}
