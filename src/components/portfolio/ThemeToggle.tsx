import { Moon, Sun } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePortfolioTheme } from "@/hooks/usePortfolioTheme";

type ThemeToggleProps = {
  className?: string;
};

/**
 * Compact sun/moon toggle for portfolio nav.
 * Persists via ThemeProvider; cycles light ↔ dark.
 */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = usePortfolioTheme();
  const reduceMotion = useReducedMotion();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={!isDark}
      className={cn(
        "relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-[hsl(var(--surface-2))] text-foreground transition-[background-color,border-color,color,transform] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background hover:border-primary/40 hover:bg-primary/10 hover:text-primary active:scale-[0.98]",
        reduceMotion
          ? "duration-0"
          : "duration-[var(--motion-fast,150ms)] ease-out",
        className,
      )}
    >
      <Sun
        className={cn(
          "absolute h-[1.125rem] w-[1.125rem] transition-[opacity,transform]",
          reduceMotion ? "duration-0" : "duration-200 ease-out",
          isDark
            ? "scale-75 opacity-0"
            : "scale-100 opacity-100",
        )}
        strokeWidth={1.75}
        aria-hidden
      />
      <Moon
        className={cn(
          "absolute h-[1.125rem] w-[1.125rem] transition-[opacity,transform]",
          reduceMotion ? "duration-0" : "duration-200 ease-out",
          isDark
            ? "scale-100 opacity-100"
            : "scale-75 opacity-0",
        )}
        strokeWidth={1.75}
        aria-hidden
      />
    </button>
  );
}
