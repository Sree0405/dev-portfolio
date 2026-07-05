import { motion } from "framer-motion";

import { PageTitle } from "@/components/ui/page-title";

const tags = [
  "Open Source",
  "3D Interfaces",
  "Full-Stack Systems",
  "Mobile Applications",
  "AI Integrations",
];

export default function ProjectsHero() {
  return (
    <section className="page-hero-pt page-hero-pb relative overflow-hidden border-b border-border/25 text-center">
      <div className="particle-bg pointer-events-none absolute inset-0 opacity-30" />

      <div className="page-container-x relative">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <PageTitle
              eyebrow="Portfolio"
              accent="Engineering"
              rest="projects"
              titleClassName="mb-6"
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground"
          >
            A collection of systems, platforms, and experimental interfaces
            designed to explore scalable architectures, immersive user
            experiences, and modern engineering patterns.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-10 flex flex-wrap justify-center gap-3"
          >
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-muted/50 px-4 py-2 font-mono text-xs text-muted-foreground sm:text-sm"
              >
                {tag}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
