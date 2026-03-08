import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Code2,
  Brain,
  Layers,
  Rocket,
  Briefcase,
  MapPin,
  Cpu,
  Server,
} from "lucide-react";

import devImg from "@/assets/sree_img.jpg";

/* ============================= */
/* CONTENT CONFIG */
/* ============================= */

const aboutContent = {
  name: "Sreekanth",
  role: "Frontend-Focused Full-Stack Engineer",
  company: "EWall Solutions Pvt Ltd",
  location: "India",

  intro: [
    "I’m a frontend-focused full-stack engineer who builds scalable digital products with strong user experiences and solid system foundations.",

    "My primary expertise lies in modern frontend engineering using React, Next.js, and TypeScript — designing maintainable UI architectures and high-performance interfaces.",

    "Alongside frontend development, I work across backend services, APIs, and AI integrations to deliver complete, production-ready applications."
  ],

  mission:
    "My focus is building scalable SaaS platforms and intelligent applications where great product design meets reliable engineering systems."
};

/* Focus Areas */
const focusAreas = [
  "Scalable Frontend Architecture",
  "Next.js Applications",
  "Design Systems",
  "AI Integrations",
  "SaaS Platforms",
  "Performance Optimization",
];

/* Capability Highlights */

const capabilities = [
  {
    icon: Code2,
    title: "Frontend Engineering",
    description:
      "Designing scalable React and Next.js applications with clean architecture and production-grade performance.",
  },
  {
    icon: Layers,
    title: "UI Systems & Design Systems",
    description:
      "Building reusable component systems that scale across complex applications.",
  },
  {
    icon: Server,
    title: "Full-Stack Development",
    description:
      "Developing APIs and backend services that support modern SaaS platforms.",
  },
  {
    icon: Brain,
    title: "AI Integration",
    description:
      "Integrating AI services and automation workflows into real-world applications.",
  },
];
/* ============================= */
/* COMPONENT */
/* ============================= */

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-120px" });

  return (
    <section
      id="about"
      ref={ref}
      className="relative py-32 px-6 overflow-hidden bg-slate-950"
    >
      <div className="max-w-7xl mx-auto">

        {/* ================= HEADER ================= */}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            About Me
          </h2>

          <p className="text-muted-foreground font-mono text-lg">
            Frontend Systems • Scalable Products • Modern Web Platforms
          </p>
        </motion.div>

        {/* ================= MAIN GRID ================= */}

        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* ================= PROFILE CARD ================= */}

          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9 }}
          >
            <div className="glass-panel p-8 rounded-3xl border border-primary/20">

              {/* Image */}

              <div className="relative aspect-square rounded-xl overflow-hidden border border-primary/30 mb-6">
                <img
                  src={devImg}
                  alt="Sreekanth"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}

              <div className="text-center space-y-3">

                <h3 className="text-2xl font-bold">
                  {aboutContent.name}
                </h3>

                <p className="font-mono text-primary">
                  {aboutContent.role}
                </p>

                <div className="flex justify-center gap-6 text-xs text-muted-foreground mt-3">

                  <div className="flex items-center gap-1">
                    <Briefcase size={14} />
                    {aboutContent.company}
                  </div>

                  <div className="flex items-center gap-1">
                    <MapPin size={14} />
                    {aboutContent.location}
                  </div>

                </div>

              </div>
            </div>
          </motion.div>

          {/* ================= TEXT CONTENT ================= */}

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9 }}
            className="space-y-8"
          >

            {/* Intro */}

            <div className="glass-panel p-8 rounded-2xl space-y-6">

              {aboutContent.intro.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-lg leading-relaxed text-muted-foreground"
                >
                  {paragraph}
                </p>
              ))}

              <p className="text-lg leading-relaxed text-muted-foreground">
                {aboutContent.mission}
              </p>

            </div>

            {/* Focus Areas */}

            <div className="glass-panel p-6 rounded-xl">

              <div className="flex items-center gap-2 mb-4 text-primary font-semibold">
                <Layers size={18} />
                Current Focus
              </div>

              <div className="flex flex-wrap gap-3">

                {focusAreas.map((item) => (
                  <span
                    key={item}
                    className="px-4 py-1.5 rounded-full border border-primary/40 bg-primary/10 text-primary text-sm font-mono"
                  >
                    {item}
                  </span>
                ))}

              </div>

            </div>

          </motion.div>
        </div>

        {/* ================= CAPABILITIES ================= */}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">

          {capabilities.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.3 + index * 0.1,
              }}
              className="glass-panel p-6 rounded-xl border border-primary/20 hover:border-primary/50 transition"
            >

              <item.icon className="w-8 h-8 text-primary mb-4" />

              <h4 className="font-semibold mb-2">
                {item.title}
              </h4>

              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>

            </motion.div>
          ))}

        </div>

      </div>
    </section>
  );
}