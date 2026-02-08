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
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950"
    >
      {/* 3D Background */}
      <HeroScene />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/70 to-background pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center space-y-10"
        >

          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/40 text-primary font-mono text-sm"
          >
            <Sparkles size={16} />
            Building Scalable Web Systems
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl md:text-2xl lg:text-4xl font-bold leading-tight neon-text"
          >
            Hi, I’m{" "}
            <span className="text-primary">Sreekanth</span>
            <br />
            <span className="text-muted-foreground text-xl md:text-xl lg:text-2xl font-normal">
              Frontend Engineer & UI Architect
            </span>
          </motion.h1>

          {/* Sub Headline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="max-w-3xl mx-auto text-lg md:text-l text-muted-foreground leading-relaxed"
          >
            I design and engineer modern web platforms using React,
            TypeScript, and 3D technologies — focused on performance,
            scalability, and user experience.
          </motion.p>

          {/* Focus Strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {[
              "React",
              "TypeScript",
              "System Design",
              "3D UI",
              "Full-Stack",
            ].map((item) => (
              <span
                key={item}
                className="px-4 py-1.5 rounded-full border border-primary/40 bg-primary/10 text-primary text-sm font-mono"
              >
                {item}
              </span>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-6"
          >

            <Link
              to="/projects"
              className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-7 py-3 rounded-xl font-mono uppercase tracking-wide shadow-neon hover:bg-primary-glow hover-scale transition"
            >
              View Projects
              <ArrowDown className="w-4 h-4 animate-bounce" />
            </Link>

            <Button
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-mono uppercase tracking-wide px-8 hover-scale"
            >
              <Download className="w-4 h-4 mr-2" />
              Resume
            </Button>

          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="flex justify-center gap-6 pt-6 text-muted-foreground"
          >
            <a
              href="https://github.com/Sree0405"
              target="_blank"
              className="hover:text-primary transition"
            >
              <Github />
            </a>

            <a
              href="https://linkedin.com"
              target="_blank"
              className="hover:text-primary transition"
            >
              <Linkedin />
            </a>

            <a
              href="mailto:yourmail@gmail.com"
              className="hover:text-primary transition"
            >
              <Mail />
            </a>
          </motion.div>

        </motion.div>

      </div>
    </section>
  );
}
