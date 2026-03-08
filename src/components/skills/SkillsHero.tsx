import { motion } from "framer-motion"
import SkillsHeroScene from "./SkillsHeroScene"

export default function SkillsHero() {

  return (

    <section
      className="
      relative
      min-h-[50vh]
      flex
      items-center
      justify-center
      overflow-hidden
      text-center
      "
    >

      {/* 3D Background */}

      <div className="absolute inset-0">

        <SkillsHeroScene />

        {/* Overlay for readability */}

        <div
          className="
          absolute inset-0
          bg-gradient-to-b
          from-slate-950/40
          via-slate-950/70
          to-slate-950
          "
        />

      </div>

      {/* CONTENT */}

      <div className="relative z-10 max-w-3xl px-6">

        <motion.h1
          initial={{ opacity:0, y:30 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:.6 }}
          className="
          text-4xl
          sm:text-5xl
          md:text-6xl
          lg:text-7xl
          font-bold
          mb-6
          tracking-tight
          leading-tight
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
          Capabilities

        </motion.h1>


        <motion.p
          initial={{ opacity:0, y:20 }}
          animate={{ opacity:1, y:0 }}
          transition={{ delay:.2 }}
          className="
          text-muted-foreground
          text-base
          sm:text-lg
          max-w-xl
          mx-auto
          "
        >

          A deep dive into the technologies, architecture patterns,
          and engineering systems used to design scalable platforms,
          immersive interfaces, and modern applications.

        </motion.p>


        {/* TECH TAGS */}

        <motion.div
          initial={{ opacity:0 }}
          animate={{ opacity:1 }}
          transition={{ delay:.4 }}
          className="
          flex flex-wrap
          justify-center
          gap-3
          mt-10
          "
        >

          {[
            "Frontend Systems",
            "Backend Architecture",
            "3D Interfaces",
            "Mobile Platforms",
            "AI Integrations"
          ].map(tag => (

            <span
              key={tag}
              className="
              text-xs
              sm:text-sm
              px-4
              py-2
              rounded-full
              border border-slate-700
              bg-slate-900/60
              backdrop-blur-md
              text-slate-300
              hover:border-indigo-400
              transition
              "
            >

              {tag}

            </span>

          ))}

        </motion.div>

      </div>

    </section>

  )
}