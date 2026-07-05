import {
  ArrowUp,
  ArrowUpRight,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
} from "lucide-react";
import { Link } from "react-router-dom";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Experience", href: "/experience" },
  { name: "Projects", href: "/projects" },
  { name: "Skills", href: "/skills" },
  { name: "Contact", href: "/contact" },
] as const;

const bioLinks = [
  { label: "View projects", to: "/projects" },
  { label: "Skills & stack", to: "/skills" },
  { label: "Contact", to: "/contact" },
  {
    label: "GitHub",
    href: "https://github.com/Sree0405",
  },
  {
    label: "My3DUI",
    href: "https://my3dui.vercel.app/",
  },
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
  "Express",
  "Three.js",
] as const;

export default function Footer() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-auto w-full min-w-0 shrink-0 border-t border-border/40">
      <div
        className="pointer-events-none absolute inset-0 bg-background/90 backdrop-blur-xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_70%_at_50%_100%,hsl(var(--primary)/0.06),transparent_50%)]"
        aria-hidden
      />

      <div className="relative w-full">
        <div className="mx-auto w-full max-w-7xl px-4 pb-8 pt-8 sm:px-8 sm:pb-12 sm:pt-12 md:px-12 md:pb-14 md:pt-14 lg:px-16">
          <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:gap-x-8 lg:grid-cols-12 lg:gap-10 xl:gap-14">
            {/* Brand */}
            <div className="col-span-2 lg:col-span-5">
              <div className="flex flex-col gap-4 sm:gap-6">
                <img
                  src="/branding/sreeBrandLogo.png"
                  alt="Sreekanth"
                  className="h-auto w-[50%] max-w-[11rem] object-contain sm:w-[45%] sm:max-w-full"
                />

                <div className="min-w-0 space-y-3 sm:space-y-4">
                  <div className="space-y-1 sm:space-y-2">
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-primary sm:text-[11px]">
                      Full-stack · Frontend-led
                    </p>
                    <h2 className="text-sm font-medium leading-snug text-muted-foreground sm:text-lg">
                      Engineer & product-focused builder
                    </h2>
                  </div>

                  <p className="hidden max-w-lg text-sm leading-relaxed text-muted-foreground sm:block sm:text-[15px]">
                    Frontend-focused full-stack engineer—strongest on interfaces,
                    React/Next systems, and UX—with Node.js & Express for APIs and
                    integrations when owning features end-to-end.
                  </p>

                  <nav
                    aria-label="Quick links"
                    className="hidden border-t border-border/40 pt-5 sm:block sm:pt-6"
                  >
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
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
                              className="group inline-flex items-center gap-1.5 text-sm font-medium text-foreground/85 transition hover:text-primary"
                            >
                              {item.label}
                              <ArrowUpRight className="h-3.5 w-3.5 opacity-50 transition group-hover:opacity-100" />
                            </Link>
                          ) : (
                            <a
                              href={item.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group inline-flex items-center gap-1.5 text-sm font-medium text-foreground/85 transition hover:text-primary"
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

            {/* Explore */}
            <nav
              className="col-span-1 lg:col-span-3"
              aria-label="Site pages"
            >
              <p className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-primary sm:mb-4 sm:text-[11px]">
                Explore
              </p>
              <ul className="space-y-2 text-sm sm:space-y-3">
                {navLinks.map((item) => (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      className="group inline-flex items-center gap-1.5 text-muted-foreground transition hover:text-foreground"
                    >
                      {item.name}
                      <ArrowUpRight className="hidden h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100 sm:inline" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Connect */}
            <div className="col-span-1 lg:col-span-4">
              <p className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-primary sm:mb-4 sm:text-[11px]">
                Connect
              </p>
              <ul className="space-y-2 text-sm sm:space-y-3">
                {externalLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        target={
                          item.href.startsWith("http") ? "_blank" : undefined
                        }
                        rel={
                          item.href.startsWith("http")
                            ? "noopener noreferrer"
                            : undefined
                        }
                        aria-label={item.label}
                        className="group inline-flex items-center gap-2 text-muted-foreground transition hover:text-foreground sm:gap-2.5"
                      >
                        <span className="hidden h-8 w-8 items-center justify-center rounded-lg border border-border/50 bg-background/60 text-primary shadow-sm sm:inline-flex">
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

              <p className="mt-6 hidden font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-primary sm:mt-8 sm:block">
                Stack
              </p>
              <div className="mt-3 hidden flex-wrap gap-2 sm:flex">
                {stackPills.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-lg border border-border/50 bg-background/40 px-2.5 py-1 font-mono text-[10px] text-muted-foreground md:text-[11px]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full border-t border-border/40 bg-background/50">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-8 sm:py-6 md:px-12 lg:px-16">
            <p className="text-[11px] text-muted-foreground sm:text-sm">
              © {year}{" "}
              <span className="text-foreground/90">Sreekanth</span>. All rights
              reserved.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground sm:gap-6 sm:text-sm">
              <a
                href="https://github.com/Sree0405"
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-foreground"
              >
                GitHub
              </a>
              <a
                href="https://linkedin.com/in/sreekanth04052005"
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-foreground"
              >
                LinkedIn
              </a>
              <a
                href="mailto:sreekanth04052005@gmail.com"
                className="transition hover:text-foreground"
              >
                Email
              </a>
              <button
                type="button"
                onClick={scrollTop}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border/50 bg-background/60 px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-foreground transition hover:border-primary/35 sm:px-3 sm:py-1.5 sm:text-xs"
              >
                <ArrowUp className="h-3.5 w-3.5" />
                Top
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
