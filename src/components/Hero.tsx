import { motion } from "framer-motion";
import {
  ArrowDown,
  Download,
  Github,
  Linkedin,
  Mail,
  Sparkles,
} from "lucide-react";

import HeroScene from "./HeroScene";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen w-full overflow-hidden bg-slate-950"
    >
      {/* Right Background Scene */}
      <div className="absolute right-0 top-0 h-full w-1/2 hidden lg:block">
        <HeroScene />
        <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/50 to-transparent" />
      </div>

      {/* Soft Gradient Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 left-1/3 w-[600px] h-[600px] bg-purple-600/20 blur-[140px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[160px]" />
      </div>

      {/* Layout */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 min-h-screen grid grid-cols-1 lg:grid-cols-2 items-center">

        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-xl space-y-8 py-20"
        >

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/40 text-primary font-mono text-sm">
            <Sparkles size={14} />
            AI • SaaS • Scalable Systems
          </div>

          {/* Name */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">

            Hi, I'm{" "}

            <span
              className="
              bg-gradient-to-r
              from-indigo-400
              via-purple-400
              to-cyan-400
              bg-clip-text
              text-transparent
              "
            >
              Sreekanth
            </span>

          </h1>

          {/* Role */}
          <p className="text-lg md:text-xl text-muted-foreground font-medium">
            Frontend-Focused Full-Stack Engineer
          </p>

          {/* Description */}
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            I build scalable SaaS platforms, AI-powered systems, and
            production-grade applications across web, mobile, and backend
            architectures.
          </p>

          {/* Capability Highlights */}
          <div className="grid grid-cols-3 gap-4 pt-2 text-sm font-mono">

            <div className="p-3 rounded-lg border border-primary/30 bg-primary/5 hover:bg-primary/10 transition">
              <p className="text-primary font-semibold">AI Systems</p>
              <p className="text-muted-foreground text-xs">Agents • Automation</p>
            </div>

            <div className="p-3 rounded-lg border border-primary/30 bg-primary/5 hover:bg-primary/10 transition">
              <p className="text-primary font-semibold">Full Stack</p>
              <p className="text-muted-foreground text-xs">Web • Mobile • APIs</p>
            </div>

            <div className="p-3 rounded-lg border border-primary/30 bg-primary/5 hover:bg-primary/10 transition">
              <p className="text-primary font-semibold">Architecture</p>
              <p className="text-muted-foreground text-xs">SaaS • Systems</p>
            </div>

          </div>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-3 pt-2">
            {[
              "Next.js",
              "React",
              "TypeScript",
              "Node.js",
              "AI Agents",
              "System Design",
            ].map((item) => (
              <span
                key={item}
                className="px-4 py-1.5 rounded-full border border-primary/40 bg-primary/10 text-primary text-sm font-mono hover:bg-primary/20 transition"
              >
                {item}
              </span>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-wrap gap-4 pt-4">
            <Link
              to="/projects"
              className="
              flex items-center gap-2
              bg-primary
              text-white
              px-7 py-3
              rounded-xl
              font-mono
              uppercase
              tracking-wide
              shadow-lg
              hover:shadow-primary/60
              transition
              "
            >
              Explore Projects
              <ArrowDown className="w-4 h-4" />
            </Link>

            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10 font-mono uppercase px-7"
            >
              <Download className="w-4 h-4 mr-2" />
              Resume
            </Button>
          </div>

          {/* Socials */}
          <div className="flex gap-6 pt-4 text-muted-foreground">
            <a
              href="https://github.com/Sree0405"
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary transition"
            >
              <Github />
            </a>

            <a
              href="https://linkedin.com/in/sreekanth04052005"
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary transition"
            >
              <Linkedin />
            </a>

            <a
              href="mailto:sreekanth04052005@gmail.com"
              className="hover:text-primary transition"
            >
              <Mail />
            </a>
          </div>

        </motion.div>

        {/* Spacer */}
        <div className="hidden lg:block" />

      </div>
    </section>
  );
}