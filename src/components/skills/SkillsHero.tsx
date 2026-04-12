import { motion } from "framer-motion";
import { ChevronDown, Sparkles } from "lucide-react";
import SkillsHeroScene from "./SkillsHeroScene";

const pillars = [
  "React & Next.js",
  "Product UX",
  "APIs (Node / Express)",
  "Microservices",
  "Java & Spring (also)",
  "Zapier & n8n",
  "Full-stack delivery",
  "3D & motion",
  "AI integrations",
];

export default function SkillsHero() {
  return (
    <section className="relative -mx-5 flex min-h-[56vh] flex-col items-center justify-center overflow-hidden border-y border-border/50 bg-gradient-to-b from-background via-background/80 to-background text-center sm:-mx-8 md:-mx-12 md:min-h-[58vh] lg:-mx-16 xl:-mx-24">
      <div className="absolute inset-0">
        <SkillsHeroScene />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/75 to-background" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,hsl(var(--primary)/0.12),transparent_55%)]" />
      </div>

      <div className="page-hero-pt relative z-10 mx-auto w-full max-w-3xl px-5 pb-16 sm:px-8 md:px-12 md:pb-20 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-primary/35 bg-primary/10 px-4 py-1.5 font-mono text-xs text-primary sm:text-sm"
        >
          <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Skills & engineering depth
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.06 }}
          className="mb-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
        >
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Engineering
          </span>{" "}
          capabilities
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.55 }}
          className="mx-auto max-w-xl text-base text-muted-foreground sm:text-lg"
        >
          Deepest craft on{" "}
          <span className="text-foreground">interfaces and frontend systems</span>
          ; full-stack delivery includes Node & Express APIs. Java and Spring
          Boot are complementary JVM experience—tap any skill below for detail.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="mt-10 flex flex-wrap justify-center gap-2 sm:gap-3"
        >
          {pillars.map((tag, i) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.05 }}
              className="rounded-full border border-border/80 bg-background/50 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur-md transition hover:border-primary/40 hover:text-foreground sm:px-4 sm:py-2 sm:text-sm"
            >
              {tag}
            </motion.span>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
          className="mt-10 flex items-center justify-center gap-1 text-xs text-muted-foreground"
        >
          <span>Explore below</span>
          <ChevronDown className="h-4 w-4 animate-bounce" aria-hidden />
        </motion.p>
      </div>
    </section>
  );
}
