import type { ReactNode } from "react";
import {
  PortfolioThemeContext,
  usePortfolioThemeState,
} from "@/hooks/usePortfolioTheme";

export {
  usePortfolioTheme,
  PORTFOLIO_THEME_KEY,
  type ThemePreference,
  type ResolvedTheme,
} from "@/hooks/usePortfolioTheme";

export function PortfolioThemeProvider({ children }: { children: ReactNode }) {
  const value = usePortfolioThemeState();

  return (
    <PortfolioThemeContext.Provider value={value}>
      {children}
    </PortfolioThemeContext.Provider>
  );
}
