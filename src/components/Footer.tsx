import { ArrowUp, ArrowUpRight, ExternalLink, Github, Linkedin, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { BrandMark } from "@/components/portfolio/BrandMark";
import { Reveal } from "@/components/portfolio/Reveal";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Experience", href: "/experience" },
  { name: "Projects", href: "/projects" },
  { name: "Skills", href: "/skills" },
  { name: "Contact", href: "/contact" },
] as const;

const bioLinks = [
  { label: "For reviewers", to: "/#for-reviewers" },
  { label: "Experience", to: "/experience" },
  { label: "Projects", to: "/projects" },
  { label: "Reviews", to: "/reviews" },
  { label: "Skills", to: "/skills" },
  { label: "Contact", to: "/contact" },
  { label: "GitHub", href: "https://github.com/Sree0405" },
] as const;

const externalLinks = [
  {
    name: "GitHub",
    href: "https://github.com/Sree0405",
    label: "GitHub profile",
    icon: Github,
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/sreekanth04052005",
    label: "LinkedIn profile",
    icon: Linkedin,
  },
  {
    name: "Email",
    href: "mailto:sreekanth04052005@gmail.com",
    label: "Email Sreekanth",
    icon: Mail,
  },
] as const;

const stackPills = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "PostgreSQL",
  "Directus",
] as const;

export default function Footer() {
  const scrollTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };
  const year = new Date().getFullYear();

  return (
    <Reveal as="footer" className="relative mt-auto w-full min-w-0 shrink-0 border-t border-border">
        <div className="relative w-full border-t border-primary/15 bg-[hsl(var(--surface))]">
        <div className="page-container-x pb-10 pt-10 sm:pb-14 sm:pt-14 md:pb-16 md:pt-16">
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:gap-x-10 lg:grid-cols-12 lg:gap-12 xl:gap-14">
            <div className="col-span-2 lg:col-span-5">
              <div className="flex flex-col gap-4 sm:gap-6">
                <Link
                  to="/"
                  className="inline-flex w-fit rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="Sree — Home"
                >
                  <BrandMark size="footer" />
                </Link>

                <div className="min-w-0 space-y-3 sm:space-y-4">
                  <div className="space-y-1 sm:space-y-2">
                    <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                      EWall · Junior full-stack
                    </p>
                    <h2 className="text-sm font-medium leading-snug text-secondary-foreground sm:text-base">
                      Ships React products end to end
                    </h2>
                  </div>

                  <p className="hidden max-w-lg text-sm leading-relaxed portfolio-text-muted sm:block">
                    Feature ownership at EWall — React + Directus, from planning
                    through deploy. Proof on Projects; public code on GitHub
                    (My3DUI, Fieldstack).
                  </p>

                  <nav
                    aria-label="Quick links"
                    className="hidden border-t border-border pt-5 sm:block sm:pt-6"
                  >
                    <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                      Links
                    </p>
                    <ul className="mt-2 flex flex-row flex-wrap gap-x-1 gap-y-2">
                      {bioLinks.map((item, i) => (
                        <li
                          key={"to" in item ? item.to : item.href}
                          className="inline-flex items-center"
                        >
                          {i > 0 ? (
                            <span className="mx-3 text-border" aria-hidden>
                              ·
                            </span>
                          ) : null}
                          {"to" in item ? (
                            <Link
                              to={item.to}
                              className="group inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              {item.label}
                              <ArrowUpRight className="h-3.5 w-3.5 opacity-50 transition group-hover:opacity-100" />
                            </Link>
                          ) : (
                            <a
                              href={item.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              {item.label}
                              <ExternalLink className="h-3 w-3 opacity-50 transition group-hover:opacity-100" />
                            </a>
                          )}
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              </div>
            </div>

            <nav className="col-span-1 lg:col-span-3" aria-label="Site pages">
              <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary sm:mb-4">
                Explore
              </p>
              <ul className="space-y-2 text-sm sm:space-y-2.5">
                {navLinks.map((item) => (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      className="group inline-flex items-center gap-1.5 portfolio-text-muted transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {item.name}
                      <ArrowUpRight className="hidden h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100 sm:inline" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="col-span-1 lg:col-span-4">
              <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary sm:mb-4">
                Connect
              </p>
              <ul className="space-y-2 text-sm sm:space-y-2.5">
                {externalLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                        rel={
                          item.href.startsWith("http")
                            ? "noopener noreferrer"
                            : undefined
                        }
                        aria-label={item.label}
                        className="group inline-flex items-center gap-2 portfolio-text-muted transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:gap-2.5"
                      >
                        <span className="icon-well hidden h-9 w-9 sm:inline-flex">
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                        <Icon
                          className="h-3.5 w-3.5 text-primary sm:hidden"
                          aria-hidden
                        />
                        {item.name}
                        <ArrowUpRight className="hidden h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100 sm:inline" />
                      </a>
                    </li>
                  );
                })}
              </ul>

              <p className="mt-6 hidden font-mono text-xs font-semibold uppercase tracking-[0.2em] text-primary sm:mt-8 sm:block">
                Stack
              </p>
              <div className="mt-3 hidden flex-wrap gap-2 sm:flex">
                {stackPills.map((tech) => (
                  <span
                    key={tech}
                    className="tech-pill rounded-lg border border-primary/20 bg-[hsl(var(--surface-2))] px-2.5 py-1 font-mono text-xs portfolio-text-muted transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full border-t border-border bg-[hsl(var(--background))]">
          <div className="page-container-x flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:py-6">
            <p className="w-full text-center text-sm portfolio-text-muted sm:w-auto sm:text-left">
              © {year} <span className="text-foreground">Sreekanth</span>. All
              rights reserved.
            </p>
            <div className="flex w-full flex-wrap items-center justify-between gap-3 text-sm portfolio-text-muted sm:w-auto sm:justify-end sm:gap-6">
              <a
                href="https://github.com/Sree0405"
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                GitHub
              </a>
              <a
                href="https://linkedin.com/in/sreekanth04052005"
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                LinkedIn
              </a>
              <a
                href="mailto:sreekanth04052005@gmail.com"
                className="transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Email
              </a>
              <button
                type="button"
                onClick={scrollTop}
                aria-label="Scroll to top"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-[hsl(var(--surface))] px-3 py-1.5 font-mono text-xs font-medium uppercase tracking-wider text-foreground transition hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <ArrowUp className="h-3.5 w-3.5" />
                Top
              </button>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
