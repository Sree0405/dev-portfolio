import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { PortfolioButton, PortfolioCard } from "@/components/portfolio";

const recoveryLinks = [
  { label: "Projects", to: "/projects" },
  { label: "Experience", to: "/experience" },
  { label: "Skills", to: "/skills" },
  { label: "Contact", to: "/contact" },
] as const;

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="app-canvas flex min-h-screen flex-col items-center justify-center px-6">
      <PortfolioCard className="max-w-md p-8 text-center sm:p-10">
        <p className="section-eyebrow mb-3">404</p>
        <h1 className="page-title mb-2">Page not found</h1>
        <p className="mb-6 text-sm leading-relaxed portfolio-text-muted sm:mb-8 sm:text-base">
          This route doesn&apos;t exist. Jump to proof instead of bouncing.
        </p>
        <div className="flex flex-col items-center gap-3">
          <PortfolioButton asChild variant="primary">
            <Link to="/">Return home</Link>
          </PortfolioButton>
          <nav
            aria-label="Recovery links"
            className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 pt-2 text-sm"
          >
            {recoveryLinks.map((item, i) => (
              <span key={item.to} className="inline-flex items-center gap-3">
                {i > 0 ? (
                  <span className="text-border" aria-hidden>
                    ·
                  </span>
                ) : null}
                <Link
                  to={item.to}
                  className="font-medium text-primary transition-colors hover:text-[hsl(var(--primary-light))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {item.label}
                </Link>
              </span>
            ))}
          </nav>
        </div>
      </PortfolioCard>
    </div>
  );
};

export default NotFound;
