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
    <section className="page-hero-band">
      <div className="particle-bg pointer-events-none absolute inset-0 opacity-30" />

      <div className="page-hero-inner">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex w-full flex-col items-center text-center"
        >
          <PageTitle
            eyebrow="Portfolio"
            accent="Engineering"
            rest="projects"
            titleClassName="mb-6 text-center"
          />
        </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto w-full max-w-2xl text-center text-lg leading-relaxed portfolio-text-muted"
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
                className="rounded-md bg-muted/50 px-4 py-2 font-mono text-xs portfolio-text-muted sm:text-sm"
              >
                {tag}
              </span>
            ))}
          </motion.div>
      </div>
    </section>
  );
}
