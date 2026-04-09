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
      {/* Full-bleed background: 3D + gradients (no side margins) */}
      <div className="absolute inset-0 w-full">
        <div className="absolute inset-0 lg:opacity-100 opacity-40">
          <div className="absolute inset-0 lg:left-[38%] left-0 right-0 top-0 bottom-0">
            <HeroScene />
          </div>
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-background/92 to-background lg:bg-gradient-to-r lg:from-background lg:via-background/90 lg:to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_70%_30%,hsl(var(--primary)/0.14),transparent_55%)]" />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/60 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[100%] flex-col justify-center lg:grid lg:min-h-screen lg:grid-cols-[1fr_minmax(0,1.1fr)]">
        <div className="page-hero-pt flex flex-col justify-center px-5 pb-16 sm:px-8 md:px-12 lg:px-16 lg:pb-20 xl:px-16 2xl:px-20">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75 }}
            className="max-w-xl space-y-7 lg:max-w-lg xl:max-w-xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/35 bg-background/70 px-4 py-1.5 font-mono text-xs text-primary shadow-[0_0_24px_hsl(var(--primary)/0.12)] backdrop-blur-md sm:text-sm">
              <Sparkles size={14} className="shrink-0" />
              Node & Express • Full-stack • Automation • AI
            </div>

            <h1 className="text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl xl:text-[3.35rem]">
              Hi, I'm{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Sreekanth
              </span>
            </h1>

            <p className="text-lg font-medium text-muted-foreground sm:text-xl">
              Frontend-focused full-stack engineer
            </p>

            <p className="max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
              I build end-to-end systems with{" "}
              <span className="text-foreground">Node.js and Express</span> as my
              main backend path—plus microservices, JVM work with Java & Spring
              Boot when the stack needs it, workflow automation (Zapier & n8n),
              and AI-powered product features.
            </p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-3">
              {[
                { title: "Full-stack", sub: "Web · API · Data" },
                { title: "Backend (main)", sub: "Node · Express" },
                { title: "Automation", sub: "Zapier · n8n" },
                { title: "Also · JVM", sub: "Java · Spring Boot" },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-border/70 bg-background/50 px-3 py-3 backdrop-blur-md transition hover:border-primary/35 sm:px-3.5"
                >
                  <p className="text-sm font-semibold text-primary">
                    {item.title}
                  </p>
                  <p className="text-[11px] text-muted-foreground sm:text-xs">
                    {item.sub}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {stackTags.map((item, i) => (
                <motion.span
                  key={item}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.03, duration: 0.35 }}
                  className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-mono text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition hover:border-primary/50 hover:bg-primary/15 sm:px-3.5 sm:py-1.5 sm:text-sm"
                >
                  {item}
                </motion.span>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/projects"
                className="group inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-mono text-sm font-semibold uppercase tracking-wide text-primary-foreground shadow-[0_10px_28px_hsl(var(--primary)/0.38)] transition hover:scale-[1.02] hover:shadow-[0_0_32px_hsl(var(--primary)/0.45)]"
              >
                View work
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/skills"
                className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-background/60 px-5 py-3 font-mono text-sm font-medium uppercase tracking-wide backdrop-blur-md transition hover:border-primary/40"
              >
                Skill map
                <ArrowDown className="h-4 w-4 opacity-70" />
              </Link>
              <Button
                variant="outline"
                className="border-primary/50 font-mono text-sm uppercase"
              >
                <Download className="mr-2 h-4 w-4" />
                Resume
              </Button>
            </div>

            <div className="flex gap-5 pt-2 text-muted-foreground">
              <a
                href="https://github.com/Sree0405"
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-primary"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com/in/sreekanth04052005"
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-primary"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="mailto:sreekanth04052005@gmail.com"
                className="transition hover:text-primary"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Right column: breathing room for 3D on large screens */}
        <div className="hidden min-h-[200px] lg:block" aria-hidden />
      </div>
    </section>
  );
}
