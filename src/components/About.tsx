import { motion, useInView } from "framer-motion";
import { SectionTitle } from "@/components/ui/page-title";
import { ImpactList } from "@/components/ui/impact-list";
import { useRef } from "react";
import {
  Code2,
  Brain,
  Layers,
  Briefcase,
  MapPin,
  Server,
} from "lucide-react";

import devImg from "@/assets/sree_img.jpg";

const aboutContent = {
  name: "Sreekanth",
  role: "Frontend-Focused Full-Stack Engineer",
  company: "EWall Solutions Pvt Ltd",
  location: "India",

  intro: [
    "I'm a frontend-focused full-stack engineer building scalable digital products with strong UX and solid engineering foundations.",

    "I work primarily with React, Next.js, and TypeScript, and extend into APIs and backend services to ship production-ready applications.",
  ],
};

const focusAreas = [
  "Frontend Architecture",
  "Next.js Applications",
  "Design Systems",
  "SaaS Platforms",
];

const capabilities = [
  {
    icon: Code2,
    title: "Frontend Engineering",
    description: "Scalable React and Next.js apps with clean architecture.",
  },
  {
    icon: Layers,
    title: "UI & Design Systems",
    description: "Reusable component systems for complex applications.",
  },
  {
    icon: Server,
    title: "Full-Stack Development",
    description: "APIs and backend services for modern web platforms.",
  },
  {
    icon: Brain,
    title: "AI Integration",
    description: "AI services and automation in real-world products.",
  },
];

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="about"
      ref={ref}
      className="relative overflow-hidden border-t border-border/30 bg-transparent page-section-y"
    >
      <div className="page-container-x">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-10 text-center md:mb-12"
        >
          <SectionTitle
            eyebrow="Profile"
            accent="About"
            rest="me"
            className="mb-3 text-center md:mb-4 [&_h2]:text-center"
          />
          <p className="font-mono text-sm text-muted-foreground sm:text-base">
            Frontend • Full-Stack • Modern Web
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, delay: 0.1 }}
          className="glass-panel rounded-2xl border border-primary/20 p-6 sm:p-8"
        >
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
            <aside className="flex shrink-0 flex-col items-center gap-4 text-center lg:w-48 lg:items-start lg:text-left xl:w-52">
              <div className="relative size-28 overflow-hidden rounded-2xl border border-primary/30 shadow-[0_0_24px_hsl(var(--primary)/0.12)] sm:size-32">
                <img
                  src={devImg}
                  alt="Sreekanth"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold sm:text-2xl">
                  {aboutContent.name}
                </h3>
                <p className="font-mono text-sm text-primary">
                  {aboutContent.role}
                </p>
              </div>

              <div className="flex w-full flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start">
                <div className="inline-flex items-center justify-center gap-1.5 lg:justify-start">
                  <Briefcase size={14} className="shrink-0 text-primary/80" />
                  <span className="text-center lg:text-left">
                    {aboutContent.company}
                  </span>
                </div>
                <div className="inline-flex items-center justify-center gap-1.5 lg:justify-start">
                  <MapPin size={14} className="shrink-0 text-primary/80" />
                  {aboutContent.location}
                </div>
              </div>
            </aside>

            <div className="min-w-0 flex-1 space-y-6 border-t border-border/40 pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
              <div className="space-y-4">
                {aboutContent.intro.map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-base leading-relaxed text-muted-foreground sm:text-[1.05rem]"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              <div>
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary">
                  <Layers size={16} />
                  Current Focus
                </div>
                <ImpactList items={focusAreas} columns={false} />
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:mt-10">
          {capabilities.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.55,
                delay: 0.2 + index * 0.08,
              }}
              className="glass-panel rounded-xl border border-primary/20 p-5 transition hover:border-primary/45"
            >
              <item.icon className="mb-3 h-7 w-7 text-primary" />
              <h4 className="mb-1.5 text-sm font-semibold sm:text-base">
                {item.title}
              </h4>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
