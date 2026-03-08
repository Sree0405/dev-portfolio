import { motion } from "framer-motion";

export default function ProjectsHero() {

  const tags = [
    "Open Source",
    "3D Interfaces",
    "Full-Stack Systems",
    "Mobile Applications",
    "AI Integrations"
  ];

  return (
    <section className="relative pt-32 text-center overflow-hidden">

      {/* Ambient Background */}
      <div className="absolute inset-0 particle-bg opacity-20" />

      <div className="relative max-w-4xl mx-auto px-6">

        {/* Title */}

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .6 }}
          className="
          text-4xl
          sm:text-5xl
          md:text-6xl
          font-bold
          tracking-tight
          mb-6
          "
        >

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
            Engineering
          </span>{" "}
          Projects

        </motion.h1>

        {/* Description */}

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: .2 }}
          className="
          text-muted-foreground
          text-lg
          leading-relaxed
          max-w-2xl
          mx-auto
          "
        >
          A collection of systems, platforms, and experimental interfaces
          designed to explore scalable architectures, immersive user
          experiences, and modern engineering patterns.
        </motion.p>

        {/* Tech Tags */}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: .4 }}
          className="
          flex
          flex-wrap
          justify-center
          gap-3
          mt-10
          "
        >

          {tags.map(tag => (

            <span
              key={tag}
              className="
              text-xs
              sm:text-sm
              px-4
              py-2
              rounded-full
              border
              border-indigo-400/40
              bg-indigo-500/10
              text-indigo-300
              font-mono
              "
            >
              {tag}
            </span>

          ))}

        </motion.div>

      </div>

    </section>
  );
}