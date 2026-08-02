/**
 * NORMAL LAYOUT
 * - Portfolio canvas + skip link + scroll progress + single main
 * - ThemeProvider scoped here so dashboard stays on :root tokens
 */

import { Outlet } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { ScrollProgress } from "@/components/portfolio/ScrollProgress";
import { DocumentMeta } from "@/components/portfolio/DocumentMeta";
import { HashScroll } from "@/components/portfolio/HashScroll";
import { PortfolioThemeProvider } from "@/components/portfolio/ThemeProvider";

export default function NormalLayout() {
  return (
    <PortfolioThemeProvider>
      <div className="app-canvas min-w-0 w-full max-w-full overflow-x-clip">
        <DocumentMeta />
        <HashScroll />
        <a href="#main" className="skip-link print:hidden">
          Skip to content
        </a>
        <div className="print:hidden">
          <ScrollProgress />
        </div>
        <div className="print:hidden">
          <Navigation />
        </div>
        <main id="main" className="min-h-0 min-w-0 w-full max-w-full overflow-x-clip pt-0 print:pt-0" tabIndex={-1}>
          <Outlet />
        </main>
      </div>
    </PortfolioThemeProvider>
  );
}
