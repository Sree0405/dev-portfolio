import { motion } from "framer-motion";
import {
  ArrowRight,
  Code2,
  Download,
  Github,
  Layers,
  Linkedin,
  Mail,
  Radio,
  Server,
} from "lucide-react";

import HeroScene from "./HeroScene";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const stackTags = [
  "React",
  "TypeScript",
  "Next.js",
  "Node.js",
  "Express",
  "REST APIs",
  "WebSockets",
  "PostgreSQL",
];

const highlights = [
  {
    icon: Code2,
    title: "React & TypeScript",
    sub: "Rendering, hooks & scalable UI",
  },
  {
    icon: Server,
    title: "APIs & backend",
    sub: "Node · Express · REST",
  },
  {
    icon: Layers,
    title: "System design",
    sub: "HLD/LLD · performance · scale",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] w-full overflow-hidden bg-transparent"
    >
      <div className="absolute inset-0 w-full">
        <div className="absolute inset-0 opacity-45 sm:opacity-50 lg:opacity-100">
          <div className="absolute inset-0 lg:left-[38%] xl:left-[40%]">
            <HeroScene />
          </div>
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-background/96 to-background lg:bg-gradient-to-r lg:from-background lg:via-background/90 lg:to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_70%_25%,hsl(var(--primary)/0.14),transparent_60%)]" />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-[1600px] flex-col justify-center lg:grid lg:min-h-screen lg:grid-cols-12 lg:items-center lg:gap-x-6 xl:gap-x-10">
        <div className="hidden lg:col-span-1 xl:col-span-2 lg:block" aria-hidden />

        <div className="page-hero-pt flex flex-col justify-center px-4 pb-16 sm:px-8 sm:pb-20 md:px-10 lg:col-span-6 lg:px-0 lg:pb-24 xl:col-span-5">
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto flex w-full max-w-[36rem] flex-col items-center text-center lg:mx-0 lg:items-start lg:text-left xl:max-w-[38rem]"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/35 bg-primary/10 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-wider text-primary sm:px-4 sm:text-xs">
              <Radio className="h-3.5 w-3.5 shrink-0" aria-hidden />
              Available for full-stack roles
            </div>

            <h1 className="mt-5 font-display text-[2rem] font-semibold leading-[1.1] tracking-[-0.04em] text-foreground sm:mt-6 sm:text-5xl lg:text-[2.85rem] xl:text-6xl">
              Hi, I&apos;m{" "}
              <span className="page-title-accent">
                Sreekanth
              </span>
            </h1>

            <p className="mt-3 text-base font-medium text-foreground/90 sm:mt-4 sm:text-lg">
              Frontend-focused full-stack engineer
            </p>

            <p className="mt-4 max-w-prose text-sm leading-relaxed text-muted-foreground sm:text-base sm:leading-relaxed">
              I build production apps with{" "}
              <span className="text-foreground/90">React, Next.js, and TypeScript</span>
              —from rendering and performance to REST APIs, WebSockets, and
              scalable project architecture.
            </p>

            <div className="mt-5 grid w-full grid-cols-3 gap-2 sm:mt-6 sm:gap-3">
              {highlights.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.08, duration: 0.45 }}
                    className="rounded-xl border border-border/55 bg-background/55 px-2 py-2.5 text-left backdrop-blur-sm transition hover:border-primary/30 sm:bg-background/50 sm:px-3.5 sm:py-3.5"
                  >
                    <Icon className="mb-1.5 h-3.5 w-3.5 text-primary sm:mb-2 sm:h-4 sm:w-4" />
                    <p className="text-[10px] font-semibold leading-tight text-foreground sm:text-sm">
                      {item.title}
                    </p>
                    <p className="mt-0.5 hidden text-[10px] leading-snug text-muted-foreground min-[400px]:block sm:text-[11px]">
                      {item.sub}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-4 flex w-full flex-wrap justify-center gap-1.5 md:hidden lg:justify-start">
              {stackTags.slice(0, 6).map((item, i) => (
                <motion.span
                  key={item}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.03, duration: 0.35 }}
                  className="rounded-md border border-border/50 bg-background/45 px-2 py-1 font-mono text-[10px] text-muted-foreground"
                >
                  {item}
                </motion.span>
              ))}
            </div>

            <div className="mt-6 hidden w-full flex-wrap justify-center gap-2 md:flex lg:justify-start">
              {stackTags.map((item, i) => (
                <motion.span
                  key={item}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.03, duration: 0.35 }}
                      className="rounded-md bg-muted/50 px-2.5 py-1 font-mono text-[10px] text-muted-foreground sm:px-3 sm:py-1.5 sm:text-xs"
                >
                  {item}
                </motion.span>
              ))}
            </div>

            <nav
              aria-label="Explore site"
              className="mt-5 flex w-full flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-border/40 pt-4 font-mono text-[10px] uppercase tracking-wider text-muted-foreground sm:hidden"
            >
              <Link to="/experience" className="transition hover:text-primary">
                Experience
              </Link>
              <span className="text-border" aria-hidden>
                ·
              </span>
              <Link to="/projects" className="transition hover:text-primary">
                Projects
              </Link>
              <span className="text-border" aria-hidden>
                ·
              </span>
              <Link to="/skills" className="transition hover:text-primary">
                Skills
              </Link>
            </nav>

            <div className="mt-7 flex w-full flex-col gap-2.5 sm:mt-8 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-3 lg:justify-start">
              <Link
                to="/projects"
                className="btn-gradient group inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl px-6 py-3 font-mono text-sm font-semibold uppercase tracking-wide text-primary-foreground sm:w-auto"
              >
                View work
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
              <div className="grid grid-cols-2 gap-2.5 sm:flex sm:gap-3">
                <Link
                  to="/skills"
                  className="btn-glass inline-flex min-h-[44px] items-center justify-center rounded-xl border border-border/60 px-4 py-3 font-mono text-xs font-medium uppercase tracking-wide text-foreground sm:px-5 sm:text-sm"
                >
                  Skills
                </Link>
                <Button
                  asChild
                  variant="outline"
                  className="min-h-[44px] w-full border-primary/35 font-mono text-xs uppercase sm:w-auto sm:text-sm"
                >
                  <a
                    href="/resume/Sreekanth_SDE.pdf"
                    download="Sreekanth_SDE.pdf"
                  >
                    <Download className="mr-1.5 h-4 w-4" />
                    Resume
                  </a>
                </Button>
              </div>
            </div>

            <div className="mt-6 flex w-full max-w-sm items-center justify-center gap-1 rounded-xl border border-border/50 bg-background/40 p-1.5 sm:mt-7 sm:max-w-none sm:gap-2 lg:justify-start">
              {[
                {
                  href: "https://github.com/Sree0405",
                  label: "GitHub",
                  icon: Github,
                },
                {
                  href: "https://linkedin.com/in/sreekanth04052005",
                  label: "LinkedIn",
                  icon: Linkedin,
                },
                {
                  href: "mailto:sreekanth04052005@gmail.com",
                  label: "Email",
                  icon: Mail,
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      item.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    aria-label={item.label}
                    className="inline-flex h-10 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-lg px-2 text-muted-foreground transition hover:bg-primary/10 hover:text-primary sm:h-10 sm:flex-row sm:flex-none sm:gap-2 sm:px-4"
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="text-[10px] font-medium leading-none sm:text-xs">
                      {item.label}
                    </span>
                  </a>
                );
              })}
            </div>
          </motion.div>
        </div>

        <div
          className="hidden min-h-[240px] lg:col-span-4 lg:block xl:col-span-5"
          aria-hidden
        />
      </div>
    </section>
  );
}
