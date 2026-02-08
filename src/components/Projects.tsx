import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink, Github, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

/* Assets */
import FlixifyImg from "@/assets/Screenshot 2026-02-01 125107.png";
import My3DUIVideo from "@/assets/videos/my3dui.mp4";
import Netflixvideo from "@/assets/videos/netflix.mp4";
import fieldstackvideo from "@/assets/videos/fieldstack.mp4";
/* Project Data */
const projects = [
  {
    title: "Flixify — Backend Framework Dashboard",
    description:
      "FieldStack is a production-ready, self-hosted headless CMS framework inspired by Directus. it provides a complete solution for managing dynamic content through an intuitive admin interface and auto-generated REST APIs.",
    highlights: [
      "JWT Authentication",
      "Users and Roles Management",
      "Api Generator",
      "Scalable Backend",
    ],
    tech: ["React", "Next.js", "Node.js", "PostgreSQL", "Prisma"],
    video: fieldstackvideo,
    url: "https://fieldstack.onrender.com/",
    gitHub: "https://github.com/Sree0405/fieldstack",
    docs: "/project/fieldstack",
  },

  {
    title: "My3DUI — 3D Component Library",
    description:
      "An open-source 3D UI system built with React and Three.js. Enables developers to build immersive interfaces with reusable components.",
    highlights: [
      "React Three Fiber",
      "TypeScript First",
      "Tree-Shakable Build",
      "Component Playground",
    ],
    tech: ["Next Js","React", "TypeScript", "Three.js", "Tailwind", "Vite"],
    image: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    url: "https://my3dui.vercel.app/",
    video: My3DUIVideo,
    gitHub: "https://github.com/Sree0405/my3dui",
    docs: "https://my3dui.vercel.app/docs",
  },

  {
    title: "Netflix Clone — Full Stack App",
    description:
      "A complete Netflix clone with authentication, browsing, and backend integration.",
    highlights: [
      "User Auth",
      "Dynamic Content",
      "Responsive UI",
      "REST APIs",
    ],
    tech: ["JavaScript", "React", "Redux Toolkit", "SSR", "NextJs"],
    video: Netflixvideo,
    warning: "This features require VPN connectivity",
    url: "https://sree-netlix-clone.vercel.app/browse",
    gitHub: "https://github.com/Sree0405/netflix-clone",
    docs: "/project/netflix-clone",
  },
];

export default function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="projects"
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
          <h2 className="text-3xl md:text-4xl font-bold neon-text mb-4">
            Featured Projects
          </h2>

          <p className="text-muted-foreground text-l font-mono">
            Real Products • Real Engineering • Real Impact
          </p>
        </motion.div>

        {/* Projects */}
        <div className="space-y-32">

          {projects.map((project, i) => {
            const reverse = i % 2 !== 0;

            return (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className={`grid lg:grid-cols-2 gap-16 items-center ${reverse ? "lg:flex-row-reverse" : ""
                  }`}
              >

                {/* Preview */}
                <div className="relative group">

                  <div className="relative rounded-2xl overflow-hidden border border-primary/20 shadow-xl">
                    {project.video ? (
                      <video
                        src={project.video}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-[320px] object-cover"
                      />
                    ) :

                      typeof project.image === "string" &&
                        project.image.startsWith("linear") ? (
                        <div
                          className="w-full h-[320px]"
                          style={{ background: project.image }}
                        />
                      ) : (
                        <img
                          src={project.image}
                          className="w-full h-[320px] object-cover"
                          alt={project.title}
                        />
                      )
                    }

                    {/* Image / Video */}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-4">

                      <Button
                        size="sm"
                        onClick={() => window.open(project.url)}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Live
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(project.gitHub)}
                      >
                        <Github className="w-4 h-4 mr-2" />
                        Code
                      </Button>

                    </div>

                  </div>

                </div>

                {/* Content */}
                <div className="space-y-6">

                  <h3 className="text-2xl font-bold text-foreground">
                    {project.title}
                  </h3>

                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {project.description}
                  </p>

                  {/* Warning */}
                  {project.warning && (
                    <div className="flex items-center gap-2 text-yellow-400 bg-yellow-400/10 px-4 py-2 rounded-lg w-fit">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-sm">
                        {project.warning}
                      </span>
                    </div>
                  )}

                  {/* Highlights */}
                  <div>
                    <h4 className="font-semibold mb-2">
                      Key Features
                    </h4>

                    <ul className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                      {project.highlights.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 pt-2">

                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 rounded-full text-xs font-mono bg-primary/10 text-primary border border-primary/30"
                      >
                        {tech}
                      </span>
                    ))}

                  </div>

                  {/* CTA */}
                  <div className="flex gap-4 pt-4">

                    <Button
                      onClick={() => window.open(project.url)}
                    >
                      View Live
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => window.open(project.docs)}
                    >
                      Documentation
                    </Button>

                  </div>

                </div>

              </motion.div>
            );
          })}

        </div>

      </div>
    </section>
  );
}
