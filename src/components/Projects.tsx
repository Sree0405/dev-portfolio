import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink, Github, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectPreview } from "./ProjectPreview";

import { useNavigate } from "react-router-dom";


/* Assets */
import FlixifyImg from "@/assets/Screenshot 2026-02-01 125107.png";

import myuipic from "@/assets/3dUi.png";
import My3DUIVideo from "@/assets/videos/my3dui.mp4";
import Netflixvideo from "@/assets/videos/netflix.mp4";

import fieldstackimg from "@/assets/Dashboard.png";
import fieldstackvideo from "@/assets/videos/fieldstack.mp4";

import EVPortalPic from "@/assets/evpic.png";
import EVPortalVideo from "@/assets/videos/evPortal.mp4";
import LiveAdminMain from "@/assets/LifeAdminMain.png";
/* Project Data */
const projects = [
  {
    title: "My3DUI — 3D Component Library",
    type: "Open Source Library",
    description:
      "An open-source 3D UI system built with React and Three.js. Enables developers to build immersive interfaces with reusable components.",
    highlights: [
      "React Three Fiber",
      "TypeScript First",
      "Tree-Shakable Build",
      "Component Playground",
    ],
    tech: ["Next Js", "React", "TypeScript", "Three.js", "Tailwind", "Vite"],
    image: myuipic,
    url: "https://my3dui.vercel.app/",
    video: My3DUIVideo,
    gitHub: "https://github.com/Sree0405/my3dui",
    docs: "https://my3dui.vercel.app/docs",
  },

  {
    title: "Flixify — Backend Framework Dashboard",
    type: "Open Source Framework",
    description:
      "Production-ready headless CMS framework with admin panel and auto-generated APIs.",
    highlights: [
      "JWT Authentication",
      "Users & Roles",
      "API Generator",
      "Scalable Backend",
    ],
    tech: ["React", "Next.js", "Node.js", "PostgreSQL", "Prisma"],
    image: fieldstackimg,
    video: fieldstackvideo,
    url: "https://fieldstack.onrender.com/",
    gitHub: "https://github.com/Sree0405/fieldstack",
    docs: "/project/fieldstack",
  },

  {
    title: "LifeAdmin Pro — Finance & Renewal Tracker",
    type: "Mobile App",
    description:
      "Personal finance & renewal management app with smart reminders and analytics.",
    highlights: [
      "Renewal Tracking",
      "Smart Reminders",
      "Offline Storage",
      "Analytics",
    ],
    tech: [
      "React Native",
      "Expo",
      "TypeScript",
      "Context API",
      "AsyncStorage",
      "Firebase"
    ],
    image: LiveAdminMain,
    url: "https://drive.google.com/drive/u/1/folders/11vPn0NE1w-0qGiIQ7Mc9iVHhQ7SWEyXO/",
    gitHub: "https://github.com/Sree0405/lifeadmin-pro",
    docs: "/project/lifeadmin",
  },

  {
    title: "EV Portal — Interactive EV Showcase",
    type: "Web App",
    description:
      "3D-powered EV discovery platform with smooth animations.",
    highlights: [
      "3D Visualization",
      "Smooth Transitions",
      "Filters",
      "High Performance",
    ],
    tech: ["Next.js", "React", "Three.js", "Tailwind CSS"],
    url: "https://ev-portal.vercel.app/",
    image: EVPortalPic,
    video: EVPortalVideo,
    gitHub: "https://github.com/Sree0405/ev-portal",
  },

  {
    title: "Netflix Clone — Full Stack App",
    type: "Web App",
    description:
      "Full-stack Netflix clone with authentication and backend integration.",
    highlights: [
      "User Auth",
      "Dynamic Content",
      "Responsive UI",
      "REST APIs",
    ],
    tech: ["JavaScript", "React", "Redux Toolkit", "NextJs"],
    video: Netflixvideo,
    warning: "This features require VPN connectivity",
    url: "https://sree-netflix.vercel.app/",
    gitHub: "https://github.com/Sree0405/netflix-clone",
  },
];

export default function Projects({ homepage = false }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const visibleProjects = homepage
    ? projects.slice(0, 2)
    : projects;
  const navigate = useNavigate();

  return (
    <section
      id="projects"
      ref={ref}
      className={`relative px-6 ${homepage ? "py-24 bg-slate-950" : "py-32 bg-slate-950"
        }`}
    >
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className={`text-center ${homepage ? "mb-16" : "mb-24"}`}
        >
          <h2 className="text-3xl md:text-4xl font-bold neon-text mb-4">
            {homepage ? "Featured Work" : "Featured Projects"}
          </h2>

          <p className="text-muted-foreground text-l font-mono">
            Real Products • Real Engineering • Real Impact
          </p>
        </motion.div>

        {/* Projects */}
        <div className={homepage ? "grid gap-16 md:grid-cols-2" : "space-y-32"}>

          {visibleProjects.map((project, i) => {
            const reverse = !homepage && i % 2 !== 0;

            return (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className={
                  homepage
                    ? "flex flex-col gap-6"
                    : `grid lg:grid-cols-2 gap-16 items-center   backdrop-blur
  border border-slate-700/40
  rounded-xl
  p-6
  shadow-xl${reverse ? "lg:flex-row-reverse" : ""
                    }`
                }
              >

                {/* Preview */}
                <div className="relative group">
                  <ProjectPreview project={project} />
                </div>

                {/* Content */}
                <div className="
  space-y-6

">
                  <div className="flex flex-wrap items-center gap-3">

                    <h3 className="text-2xl font-bold text-foreground">
                      {project.title}
                    </h3>

                    {/* Project Type Badge */}
                    {project.type && (
                      <span className="
      px-3 py-1 rounded-full text-xs font-semibold
      bg-gradient-to-r from-indigo-500/20 to-purple-500/20
      text-indigo-300 border border-indigo-500/30
      backdrop-blur
    ">
                        {project.type}
                      </span>
                    )}

                  </div>

                  <p className="text-muted-foreground leading-relaxed text-base">
                    {project.description}
                  </p>
                  {/* Highlights */}
                  <div className="grid grid-cols-2 gap-2 text-sm text-slate-300">

                    {project.highlights?.map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-2"
                      >
                        <span className="text-indigo-400">▸</span>
                        {item}
                      </div>
                    ))}

                  </div>
                  {/* Tech */}
                  <div className="flex flex-wrap gap-2">
                    {project.tech.slice(0, homepage ? 4 : project.tech.length).map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 rounded-full text-xs font-mono bg-primary/10 text-primary border border-primary/30"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="flex gap-4 pt-2">
                    <Button
                      size={homepage ? "sm" : "default"}
                      onClick={() => window.open(project.url)}
                    >
                      View Live
                    </Button>

                    {!homepage && project.docs && (
                      <Button
                        variant="outline"
                        onClick={() => window.open(project.docs)}
                      >
                        Documentation
                      </Button>
                    )}
                  </div>

                </div>

              </motion.div>
            );
          })}

        </div>

        {/* VIEW ALL CTA (Homepage only) */}
        {homepage && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="mt-20 text-center"
          >
            <Button
              size="lg"
              variant="outline"
              onClick={() => (navigate("/projects"))}
            >
              View All Projects →
            </Button>
          </motion.div>
        )}

      </div>
    </section>
  );
}
