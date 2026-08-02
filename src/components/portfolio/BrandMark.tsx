import { cn } from "@/lib/utils";

type BrandMarkProps = {
  className?: string;
  /** Larger mark for footer / open compositions */
  size?: "nav" | "footer";
};

/**
 * Typographic wordmark — “Sree” as the brand signal (no logo image).
 */
export function BrandMark({ className, size = "nav" }: BrandMarkProps) {
  return (
    <span
      className={cn(
        "brand-mark inline-flex select-none leading-none text-foreground",
        size === "nav" && "text-base sm:text-[1.125rem]",
        size === "footer" && "text-xl sm:text-2xl",
        className,
      )}
      aria-label="Sree"
    >
      Sree
    </span>
  );
}
