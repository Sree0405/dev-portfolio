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
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/sreekanth04052005",
    label: "LinkedIn profile",
  },
  {
    name: "Email",
    href: "mailto:sreekanth04052005@gmail.com",
    label: "Email Sreekanth",
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
        <div className="mx-auto w-full max-w-7xl px-5 pb-12 pt-12 sm:px-8 md:px-12 md:pb-14 md:pt-14 lg:px-16">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10 xl:gap-14">
            {/* Brand — SaaS-style lockup + bio + quick links */}
            <div className="lg:col-span-5 xl:col-span-5">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
                <div
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-border/50 bg-gradient-to-br from-primary/15 via-background to-accent/10 font-semibold tracking-tight text-foreground shadow-[0_0_0_1px_hsl(var(--primary)/0.12)_inset] sm:h-16 sm:w-16"
                  aria-hidden
                >
                  <span className="bg-gradient-to-br from-indigo-300 via-purple-300 to-cyan-300 bg-clip-text text-2xl text-transparent sm:text-[1.65rem]">
                    S
                  </span>
                </div>

                <div className="min-w-0 flex-1 space-y-4">
                  <div className="space-y-2">
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-primary sm:text-[11px]">
                      Full-stack · Frontend-led
                    </p>
                    <h2 className="text-3xl font-bold leading-[1.08] tracking-tight sm:text-4xl lg:text-[2.625rem]">
                      <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                        Sreekanth
                      </span>
                      <span className="mt-2 block text-base font-medium leading-snug text-muted-foreground sm:text-lg">
                        Engineer & product-focused builder
                      </span>
                    </h2>
                  </div>

                  <p className="max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-[15px] sm:leading-relaxed">
                    Frontend-focused full-stack engineer—strongest on interfaces,
                    React/Next systems, and UX—with Node.js & Express for APIs and
                    integrations when owning features end-to-end.
                  </p>

                  <nav
                    aria-label="Quick links"
                    className="flex flex-col gap-2 border-t border-border/40 pt-5 sm:pt-6"
                  >
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
                      Links
                    </p>
                    <ul className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:gap-x-1 sm:gap-y-2">
                      {bioLinks.map((item, i) => (
                        <li
                          key={"to" in item ? item.to : item.href}
                          className="flex items-center sm:inline-flex"
                        >
                          {i > 0 ? (
                            <span
                              className="mx-3 hidden text-border sm:inline"
                              aria-hidden
                            >
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

            <nav
              className="lg:col-span-3 xl:col-span-3"
              aria-label="Site pages"
            >
              <p className="mb-4 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                Explore
              </p>
              <ul className="space-y-3 text-sm">
                {navLinks.map((item) => (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      className="group inline-flex items-center gap-2 text-muted-foreground transition hover:text-foreground"
                    >
                      {item.name}
                      <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="lg:col-span-4 xl:col-span-4">
              <p className="mb-4 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                Connect
              </p>
              <ul className="space-y-3 text-sm">
                {externalLinks.map((item) => (
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
                      className="group inline-flex items-center gap-2.5 text-muted-foreground transition hover:text-foreground"
                    >
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border/50 bg-background/60 text-primary shadow-sm">
                        {item.name === "GitHub" ? (
                          <Github className="h-3.5 w-3.5" />
                        ) : item.name === "LinkedIn" ? (
                          <Linkedin className="h-3.5 w-3.5" />
                        ) : (
                          <Mail className="h-3.5 w-3.5" />
                        )}
                      </span>
                      {item.name}
                      <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100" />
                    </a>
                  </li>
                ))}
              </ul>

              <p className="mt-8 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                Stack
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
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
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8 md:px-12 lg:px-16">
            <p className="text-xs text-muted-foreground sm:text-sm">
              © {year}{" "}
              <span className="text-foreground/90">Sreekanth</span>. All rights
              reserved.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground sm:gap-6 sm:text-sm">
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
                className="inline-flex items-center gap-1.5 rounded-lg border border-border/50 bg-background/60 px-3 py-1.5 font-mono text-[10px] font-medium uppercase tracking-wider text-foreground transition hover:border-primary/35 sm:text-xs"
              >
                <ArrowUp className="h-3.5 w-3.5" />
                Back to top
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
