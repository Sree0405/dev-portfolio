import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  Download,
  Github,
  Linkedin,
  Mail,
  Sparkles,
} from "lucide-react";

import HeroScene from "./HeroScene";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const stackTags = [
  "Next.js",
  "React",
  "TypeScript",
  "Node.js",
  "Express",
  "Microservices",
  "Java",
  "Spring Boot",
  "Zapier",
  "n8n",
  "AI Agents",
  "Full-stack systems",
];

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen w-full overflow-hidden bg-transparent"
    >
      {/* Full-bleed background: 3D + gradients */}
      <div className="absolute inset-0 w-full">
        <div className="absolute inset-0 opacity-40 lg:opacity-100">
          <div className="absolute inset-0 left-0 right-0 top-0 bottom-0 lg:left-[40%] xl:left-[42%]">
            <HeroScene />
          </div>
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-background/94 to-background lg:bg-gradient-to-r lg:from-background lg:via-background/88 lg:to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_65%_at_65%_28%,hsl(var(--primary)/0.12),transparent_58%)]" />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
      </div>

      {/* Content: centered on small screens; inset + max measure on large so it does not hug the viewport edge */}
      <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-[1600px] flex-col justify-center lg:min-h-screen lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-6 xl:gap-x-10">
        {/* Left gutter — optical breathing room from the corner */}
        <div
          className="hidden lg:col-span-1 xl:col-span-2 lg:block"
          aria-hidden
        />

        <div className="page-hero-pt flex flex-col justify-center px-5 pb-20 sm:px-8 sm:pb-24 md:px-10 md:pb-28 lg:col-span-6 lg:px-0 lg:pb-24 xl:col-span-5">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto flex w-full max-w-[34rem] flex-col items-center text-center sm:max-w-[36rem] lg:mx-0 lg:max-w-[min(100%,32rem)] lg:items-start lg:text-left xl:max-w-[36rem]"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-background/75 px-4 py-1.5 font-mono text-[11px] text-primary shadow-[0_0_28px_hsl(var(--primary)/0.1)] backdrop-blur-md sm:text-xs md:text-sm">
              <Sparkles size={14} className="shrink-0" aria-hidden />
              React & UX · Full-stack · APIs · Automation
            </div>

            <h1 className="mt-7 text-[2.125rem] font-bold leading-[1.12] tracking-[-0.02em] sm:mt-8 sm:text-5xl sm:leading-[1.1] lg:text-[2.75rem] lg:leading-[1.08] xl:text-6xl xl:leading-[1.06]">
              Hi, I&apos;m{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Sreekanth
              </span>
            </h1>

            <p className="mt-4 text-base font-medium text-muted-foreground sm:text-lg md:text-xl">
              Frontend-focused full-stack engineer
            </p>

            <p className="mt-5 max-w-prose text-[0.9375rem] leading-relaxed text-muted-foreground sm:text-base sm:leading-relaxed md:text-lg md:leading-relaxed">
              I lead with{" "}
              <span className="font-medium text-foreground/95">
                React, Next.js, and product UX
              </span>
              —and ship full-stack: TypeScript across the stack,{" "}
              <span className="font-medium text-foreground/95">
                Node.js & Express
              </span>{" "}
              for APIs when features need it, plus automation (Zapier & n8n), JVM
              work with Java & Spring Boot when teams require it, and AI-assisted
              product work.
            </p>

            <div className="mt-8 grid w-full max-w-lg grid-cols-1 gap-3 sm:max-w-none sm:grid-cols-2 sm:gap-3 lg:max-w-xl">
              {[
                { title: "UI & product", sub: "React · Next · UX" },
                { title: "APIs & services", sub: "Node · Express" },
                { title: "Automation", sub: "Zapier · n8n" },
                { title: "Also · JVM", sub: "Java · Spring Boot" },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-border/60 bg-background/45 px-3.5 py-3.5 text-left shadow-sm backdrop-blur-md transition hover:border-primary/35 sm:px-4"
                >
                  <p className="text-sm font-semibold text-primary">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground sm:text-xs">
                    {item.sub}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-7 flex w-full max-w-lg flex-wrap justify-center gap-2 sm:max-w-none lg:justify-start">
              {stackTags.map((item, i) => (
                <motion.span
                  key={item}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 + i * 0.025, duration: 0.35 }}
                  className="rounded-full border border-primary/25 bg-primary/[0.08] px-3 py-1 text-[11px] font-mono text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition hover:border-primary/45 hover:bg-primary/12 sm:px-3.5 sm:py-1.5 sm:text-xs md:text-sm"
                >
                  {item}
                </motion.span>
              ))}
            </div>

            <div className="mt-8 flex w-full flex-wrap items-center justify-center gap-3 sm:gap-4 lg:justify-start">
              <Link
                to="/projects"
                className="group inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-mono text-sm font-semibold uppercase tracking-wide text-primary-foreground shadow-[0_10px_28px_hsl(var(--primary)/0.35)] transition hover:scale-[1.02] hover:shadow-[0_0_32px_hsl(var(--primary)/0.4)]"
              >
                View work
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/skills"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-border/70 bg-background/55 px-5 py-3 font-mono text-sm font-medium uppercase tracking-wide text-foreground backdrop-blur-md transition hover:border-primary/40"
              >
                Skill map
                <ArrowDown className="h-4 w-4 opacity-70" />
              </Link>
              <Button
                variant="outline"
                className="min-h-[44px] border-primary/45 font-mono text-sm uppercase"
              >
                <Download className="mr-2 h-4 w-4" />
                Resume
              </Button>
            </div>

            <div className="mt-8 flex justify-center gap-6 text-muted-foreground lg:justify-start lg:gap-5">
              <a
                href="https://github.com/Sree0405"
                target="_blank"
                rel="noreferrer"
                className="rounded-lg p-2 transition hover:bg-primary/10 hover:text-primary"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com/in/sreekanth04052005"
                target="_blank"
                rel="noreferrer"
                className="rounded-lg p-2 transition hover:bg-primary/10 hover:text-primary"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="mailto:sreekanth04052005@gmail.com"
                className="rounded-lg p-2 transition hover:bg-primary/10 hover:text-primary"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Reserves horizontal space for the 3D canvas on large screens */}
        <div
          className="hidden min-h-[240px] lg:col-span-4 lg:block xl:col-span-5"
          aria-hidden
        />
      </div>
    </section>
  );
}
