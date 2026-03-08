import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Building2,
  Calendar,
  MapPin,
  Cpu,
  Layers,
  Rocket,
} from "lucide-react";

/* ============================= */
/* EXPERIENCE DATA */
/* ============================= */

const experiences = [
  {
    company: "EWall Solutions Pvt Ltd",
    role: "Frontend-Focused Full-Stack Engineer",
    duration: "2025 — Present",
    location: "India",

    impact: [
      "Building scalable React and Next.js platforms used across multiple client systems.",
      "Developing backend APIs and automation workflows powering production environments.",
      "Integrating AI-powered workflows and automation pipelines into enterprise systems.",
    ],

    responsibilities: [
      "Designing maintainable frontend architectures for modern web platforms.",
      "Developing REST APIs and backend integrations for scalable applications.",
      "Implementing automation pipelines and third-party integrations.",
      "Improving performance, reliability, and deployment workflows.",
    ],

    technologies: [
      "React",
      "Next.js",
      "TypeScript",
      "Node.js",
      "PHP",
      "MySQL",
      "REST APIs",
      "Spring Boot",
      "Directus",
      "Zapier",
      "AI Integration",
      "Automation",
      "Git",
    ],

    color: "#8c4bff",
  },

  {
    company: "Freelance",
    role: "Frontend Developer",
    duration: "2024 — 2025",
    location: "Remote",

    impact: [
      "Delivered modern, responsive interfaces for multiple client platforms.",
      "Built high-performance React applications optimized for production deployment.",
      "Improved user experience and performance across several projects.",
    ],

    responsibilities: [
      "Designing component-based UI systems.",
      "Integrating APIs and external services.",
      "Optimizing performance and responsiveness.",
      "Deploying and maintaining production builds.",
    ],

    technologies: [
      "React",
      "JavaScript",
      "TypeScript",
      "HTML",
      "CSS",
      "API Integration",
      "Responsive Design",
      "Animations",
      "Deployment",
    ],

    color: "#5e00d4",
  },

  {
    company: "SA College Of Arts & Science",
    role: "BSc Computer Science",
    duration: "2024 — 2025",
    location: "Chennai",

    impact: [
      "Built foundational knowledge in software engineering and algorithms.",
      "Completed academic projects involving backend systems and automation.",
      "Developed problem-solving and system design thinking.",
    ],

    responsibilities: [
      "Studying data structures and algorithms.",
      "Building backend and AI-related projects.",
      "Learning software engineering best practices.",
    ],

    technologies: [
      "Java",
      "Python",
      "Spring Boot",
      "AI Concepts",
      "Data Structures",
      "Algorithms",
      "Database Systems",
    ],

    color: "#5e00d4",
  },
];

/* ============================= */
/* COMPONENT */
/* ============================= */

export default function Experience() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-120px" });

  return (
    <section
      id="experience"
      ref={ref}
      className="relative py-32 px-6 overflow-hidden bg-slate-950"
    >
      {/* Ambient background */}
      <div className="absolute inset-0 bg-slate-950 opacity-20" />

      <div className="relative max-w-6xl mx-auto">

        {/* Header */}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
<h2
  className="
  text-3xl md:text-4xl font-bold mb-4
  bg-gradient-to-r
  from-indigo-400
  via-purple-400
  to-cyan-400
  bg-clip-text
  text-transparent
"
>
  Professional Experience
</h2>
<p className="text-muted-foreground font-mono text-lg tracking-wide">
  Building scalable platforms • designing systems • delivering real-world impact
</p>
        </motion.div>

        {/* Timeline */}

        <div className="relative">

          {/* Center Line */}

          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary via-primary-glow to-transparent transform -translate-x-1/2" />

          <div className="space-y-20">

            {experiences.map((exp, index) => (

              <motion.div
                key={exp.company}
                initial={{ opacity: 0, x: index % 2 === 0 ? -60 : 60 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.7, delay: index * 0.2 }}
                className={`relative flex items-center ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >

                {/* Card */}

                <div className="w-full md:w-5/12 glass-panel p-8 rounded-2xl border border-primary/20 hover:border-primary/50 transition-all hover:shadow-xl">

                  {/* Header */}

                  <div className="flex items-start gap-4 mb-5">

                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{
                        background: `${exp.color}20`,
                        border: `1px solid ${exp.color}`,
                      }}
                    >
                      <Building2 size={22} style={{ color: exp.color }} />
                    </div>

                    <div>
                      <h3 className="text-xl font-bold">
                        {exp.company}
                      </h3>
<p
  className="
  text-sm font-semibold
  bg-gradient-to-r
  from-indigo-300
  via-purple-300
  to-cyan-300
  bg-clip-text
  text-transparent
"
>
  {exp.role}
</p>
                    </div>

                  </div>

                  {/* Meta */}

                  <div className="flex flex-wrap gap-4 mb-6 text-sm text-muted-foreground">

                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      {exp.duration}
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      {exp.location}
                    </div>

                  </div>

                  {/* Impact */}

                  <div className="mb-5">
                    <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <Rocket size={16} /> Impact
                    </p>

                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {exp.impact.map((item, i) => (
                        <li key={i}>• {item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Responsibilities */}

                  <div className="mb-6">
                    <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <Layers size={16} /> Responsibilities
                    </p>

                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {exp.responsibilities.map((item, i) => (
                        <li key={i}>• {item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Tech */}

                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech) => (
                      <span
                        key={tech}
className="
px-3 py-1
text-xs
font-mono
rounded-full
border border-indigo-400/40
bg-indigo-500/10
text-indigo-300
hover:border-cyan-400
hover:text-cyan-300
transition
"                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                </div>

                {/* Timeline Node */}

                <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">

                  <motion.div
                    className="w-6 h-6 rounded-full border-4 border-background"
                    style={{ background: exp.color }}
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ delay: index * 0.2 }}
                  >
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{ background: exp.color }}
                      animate={{
                        scale: [1, 1.6, 1],
                        opacity: [0.5, 0, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    />
                  </motion.div>

                </div>

                <div className="hidden md:block w-5/12" />

              </motion.div>

            ))}

          </div>

        </div>

      </div>
    </section>
  );
}