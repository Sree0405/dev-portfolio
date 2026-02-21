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
      className="
        relative
        min-h-screen
        w-full
        overflow-hidden
        bg-slate-950
      "
    >
      {/* Background Scene (Right Side) */}
      <div className="absolute right-0 top-0 h-full w-1/2">
        <HeroScene />
        <div className="absolute inset-0 bg-gradient-to-l from-black/70 to-transparent" />
      </div>

      {/* Content Grid */}
      <div
        className="
          relative
          z-10
          max-w-7xl
          mx-auto
          px-6
          min-h-screen
          grid
          grid-cols-1
          lg:grid-cols-2
          items-center
        "
      >
        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="
            max-w-xl
            space-y-7
            py-20
          "
        >
          {/* Badge */}
          <div
            className="
              inline-flex
              items-center
              gap-2
              px-4
              py-1.5
              rounded-full
              bg-primary/10
              border
              border-primary/40
              text-primary
              font-mono
              text-sm
            "
          >
            <Sparkles size={14} />
            Building Scalable Web Systems
          </div>

          {/* Name */}
          <h1
            className="
              text-4xl
              md:text-5xl
              lg:text-6xl
              font-bold
              tracking-tight
              leading-tight
            "
          >
            Hi, I’m{" "}
            <span className="text-primary">Sreekanth</span>
          </h1>

          {/* Role */}
          <p
            className="
              text-lg
              md:text-xl
              text-muted-foreground
              font-medium
            "
          >
            Frontend Engineer · UI Architect
          </p>

          {/* Description */}
          <p
            className="
              text-base
              md:text-lg
              leading-relaxed
              text-muted-foreground
            "
          >
            I design and build scalable, high-performance web platforms
            using React, TypeScript, and modern 3D technologies.

            <br />
            <br />

            Focused on clean architecture, system design, and delivering
            production-grade user experiences.
          </p>

          {/* Stack */}
          <div className="flex flex-wrap gap-3">
            {[
              "React",
              "TypeScript",
              "Next.js",
              "System Design",
              "Three.js",
              "Node.js",
            ].map((item) => (
              <span
                key={item}
                className="
                  px-4
                  py-1.5
                  rounded-full
                  border
                  border-primary/40
                  bg-primary/10
                  text-primary
                  text-sm
                  font-mono
                "
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
                flex
                items-center
                gap-2
                bg-primary
                text-white
                px-7
                py-3
                rounded-xl
                font-mono
                uppercase
                tracking-wide
                shadow-lg
                hover:shadow-primary/60
                transition
              "
            >
              View Projects
              <ArrowDown className="w-4 h-4" />
            </Link>

            <Button
              variant="outline"
              className="
                border-primary
                text-primary
                hover:bg-primary/10
                font-mono
                uppercase
                px-7
              "
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
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
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
          </div>
        </motion.div>

        {/* RIGHT SPACER (for grid balance) */}
        <div className="hidden lg:block" />
      </div>
    </section>
  );
}