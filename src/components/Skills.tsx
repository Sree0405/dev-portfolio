import { motion, useInView } from "framer-motion";
import { useRef } from "react";

/* Skill Categories */
const skillGroups = [
  {
    title: "Frontend Engineering",
    skills: [
      { name: "React", level: 90, color: "#61dafb" },
      { name: "TypeScript", level: 85, color: "#3178c6" },
      { name: "JavaScript", level: 90, color: "#f7df1e" },
      { name: "Next.js", level: 80, color: "#ffffff" },
      { name: "Remix", level: 70, color: "#4b32c3" },
      { name: "React Router", level: 85, color: "#ca4245" },
      { name: "Redux Toolkit", level: 80, color: "#764abc" },
      { name: "Tailwind CSS", level: 90, color: "#38bdf8" },
      { name: "HTML5 / CSS3", level: 95, color: "#e34f26" },
    ],
  },

  {
    title: "Backend Engineering",
    skills: [
      { name: "Node.js", level: 85, color: "#68a063" },
      { name: "Express.js", level: 80, color: "#cccccc" },
      { name: "Java", level: 75, color: "#f89820" },
      { name: "PHP", level: 85, color: "#777bb4" },
      { name: "Python", level: 70, color: "#3776ab" },
      { name: "REST APIs", level: 90, color: "#6e00ff" },
      { name: "Authentication (JWT/OAuth)", level: 80, color: "#22c55e" },
    ],
  },

  {
    title: "Mobile Development",
    skills: [
      { name: "React Native", level: 75, color: "#61dafb" },
      { name: "Expo", level: 70, color: "#000020" },
      { name: "Cross-Platform UI", level: 80, color: "#38bdf8" },
    ],
  },

  {
    title: "Databases & Storage",
    skills: [
      { name: "MySQL", level: 85, color: "#4479a1" },
      { name: "PostgreSQL", level: 80, color: "#336791" },
      { name: "MongoDB", level: 80, color: "#47a248" },
      { name: "Prisma ORM", level: 75, color: "#2d3748" },
      { name: "Database Design", level: 85, color: "#6366f1" },
    ],
  },

  {
    title: "3D & Interactive UI",
    skills: [
      { name: "Three.js", level: 75, color: "#049ef4" },
      { name: "React Three Fiber", level: 80, color: "#22d3ee" },
      { name: "Framer Motion", level: 85, color: "#ec4899" },
      { name: "GSAP", level: 75, color: "#88ce02" },
      { name: "WebGL Basics", level: 70, color: "#6366f1" },
    ],
  },

  {
    title: "System Design & Architecture",
    skills: [
      { name: "System Design", level: 75, color: "#f59e0b" },
      { name: "Scalable Architecture", level: 70, color: "#22c55e" },
      { name: "Microservices", level: 65, color: "#14b8a6" },
      { name: "API Design", level: 85, color: "#8b5cf6" },
      { name: "Performance Optimization", level: 80, color: "#ef4444" },
    ],
  },

  {
    title: "Tools & DevOps",
    skills: [
      { name: "Git / GitHub", level: 90, color: "#f97316" },
      { name: "Docker (Basics)", level: 65, color: "#0db7ed" },
      { name: "CI/CD", level: 70, color: "#22c55e" },
      { name: "Vercel / Netlify", level: 85, color: "#ffffff" },
      { name: "Linux Basics", level: 70, color: "#facc15" },
    ],
  },
];

export default function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="skills"
      ref={ref}
      className="relative py-32 px-6 bg-slate-950"
    >
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <h2 className="text-2xl md:text-4xl font-bold neon-text mb-4">
            Technical Expertise
          </h2>

          <p className="text-l text-muted-foreground font-mono">
            Full-Stack • 3D UI • System Design
          </p>

          <div className="w-24 h-1 bg-gradient-to-r from-primary to-primary-glow mx-auto mt-4" />
        </motion.div>

        {/* Skill Groups */}
        <div className="space-y-24">

          {skillGroups.map((group, groupIndex) => (
            <div key={group.title}>

              {/* Category Title */}
              <motion.h3
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-2xl font-bold mb-8 text-primary"
              >
                {group.title}
              </motion.h3>

              {/* Skills Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

                {group.skills.map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.05,
                    }}
                    className="glass-panel p-6 rounded-xl relative overflow-hidden"
                  >

                    {/* Header */}
                    <div className="flex justify-between mb-3">
                      <h4 className="font-semibold">
                        {skill.name}
                      </h4>

                      <span className="font-mono text-primary text-sm">
                        {skill.level}%
                      </span>
                    </div>

                    {/* Progress */}
                    <div className="relative h-2 bg-muted rounded-full overflow-hidden">

                      <motion.div
                        className="absolute inset-y-0 left-0 rounded-full"
                        style={{
                          background: `linear-gradient(90deg, ${skill.color}, ${skill.color}cc)`,
                          boxShadow: `0 0 12px ${skill.color}80`,
                        }}
                        initial={{ width: 0 }}
                        whileInView={{
                          width: `${skill.level}%`,
                        }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 1,
                          delay: 0.2 + index * 0.05,
                        }}
                      />

                    </div>

                  </motion.div>
                ))}

              </div>

            </div>
          ))}

        </div>

        {/* Learning Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-32 glass-panel p-10 rounded-2xl text-center"
        >

          <h3 className="text-2xl font-bold mb-4">
            Continuous Learning
          </h3>

          <p className="text-muted-foreground mb-6 text-lg">
            Actively improving in system architecture, scalable backend
            design, and high-performance frontend engineering.
          </p>

          <div className="flex flex-wrap justify-center gap-3">

            {[
              "Advanced System Design",
              "Cloud Architecture",
              "Distributed Systems",
              "High-Scale APIs",
              "Mobile Performance",
            ].map((item) => (
              <span
                key={item}
                className="px-4 py-2 rounded-full border border-primary/40 bg-primary/10 text-primary font-mono text-sm"
              >
                🚀 {item}
              </span>
            ))}

          </div>

        </motion.div>

      </div>
    </section>
  );
}
