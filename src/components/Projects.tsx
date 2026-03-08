import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink, Github, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectPreview } from "./ProjectPreview";
import { useNavigate } from "react-router-dom";


import My3DUIImage from "@/assets/3dUi.png";
import My3DUIVideo from "@/assets/videos/my3dui.mp4";

import FieldstackImage from "@/assets/Dashboard.png";
import FieldstackVideo from "@/assets/videos/fieldstack.mp4";

import EVPortalImage from "@/assets/evpic.png";
import EVPortalVideo from "@/assets/videos/evPortal.mp4";

import NetflixImage from "@/assets/Screenshot 2026-02-01 125107.png";
import NetflixVideo from "@/assets/videos/netflix.mp4";

import LifeAdminImage from "@/assets/LifeAdminMain.png";
/* ============================= */
/* PROJECT DATA */
/* ============================= */

const projects = [
  {
    title: "My3DUI",
    subtitle: "3D Component Library",
    type: "Open Source UI System",
    description:
      "An open-source 3D UI component library built with React Three Fiber. Designed to help developers build immersive web interfaces using composable, reusable primitives.",

    highlights: [
      "Reusable 3D UI Components",
      "Developer Playground",
      "Tree-Shakable Architecture",
      "TypeScript-first API",
    ],

    tech: ["Next.js", "React", "TypeScript", "Three.js", "Tailwind"],

    image: My3DUIImage,
    video: My3DUIVideo,

    live: "https://my3dui.vercel.app/",
    github: "https://github.com/Sree0405/my3dui",
    docs: "https://my3dui.vercel.app/docs",
  },

  {
    title: "Fieldstack",
    subtitle: "Headless Backend Framework",
    type: "Open Source Backend System",

    description:
      "A scalable backend framework with an integrated admin panel, authentication system, and auto-generated APIs designed for modern SaaS platforms.",

    highlights: [
      "JWT Authentication",
      "Role-Based Access",
      "Auto API Generator",
      "Modular Backend Architecture",
    ],

    tech: ["Next.js", "Node.js", "PostgreSQL", "Prisma"],

    image: FieldstackImage,
    video: FieldstackVideo,

    live: "https://fieldstack.onrender.com/",
    github: "https://github.com/Sree0405/fieldstack",
  },

  {
    title: "LifeAdmin Pro",
    subtitle: "Finance & Renewal Tracker",
    type: "Mobile Application",

    description:
      "A mobile productivity application for managing financial renewals, subscriptions, and recurring payments with reminders and analytics.",

    highlights: [
      "Renewal Tracking",
      "Smart Notifications",
      "Offline Storage",
      "Analytics Dashboard",
    ],

    tech: [
      "React Native",
      "Expo",
      "TypeScript",
      "Context API",
      "AsyncStorage",
      "Firebase",
    ],

    image: LifeAdminImage,

    live: "https://drive.google.com/drive/u/1/folders/11vPn0NE1w-0qGiIQ7Mc9iVHhQ7SWEyXO/",
    github: "https://github.com/Sree0405/lifeadmin-pro",
  },

  {
    title: "EV Portal",
    subtitle: "Interactive EV Showcase",
    type: "3D Web Application",

    description:
      "An immersive electric vehicle discovery platform featuring interactive 3D visualizations, animations, and dynamic filtering.",

    highlights: [
      "3D Visualization",
      "Smooth Page Transitions",
      "Dynamic Filtering",
      "High Performance Rendering",
    ],

    tech: ["Next.js", "React", "Three.js", "Tailwind"],

    image: EVPortalImage,
    video: EVPortalVideo,

    live: "https://ev-portal.vercel.app/",
    github: "https://github.com/Sree0405/ev-portal",
  },

  {
    title: "Netflix Clone",
    subtitle: "Full Stack Streaming App",
    type: "Full Stack Application",

    description:
      "A full-stack streaming platform inspired by Netflix featuring authentication, dynamic content rendering, and backend API integration.",

    highlights: [
      "User Authentication",
      "Dynamic Content Loading",
      "Responsive UI",
      "REST API Integration",
    ],

    tech: ["React", "Redux Toolkit", "Next.js", "JavaScript"],

    // image: FlixifyImg,
    video: NetflixVideo,

    live: "https://sree-netflix.vercel.app/",
    github: "https://github.com/Sree0405/netflix-clone",

    warning: "Some content requires VPN connectivity.",
  },
];

/* ============================= */
/* COMPONENT */
/* ============================= */

export default function Projects({ homepage = false }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const navigate = useNavigate();

  const visibleProjects = homepage ? projects.slice(0, 2) : projects;

  return (
    <section
      id="projects"
      ref={ref}
      className="relative py-32 px-6 bg-slate-950 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">

        <div className="space-y-32">

          {visibleProjects.map((project, index) => {

            const reverse = index % 2 !== 0 && !homepage;

            return (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className={`grid lg:grid-cols-2 gap-16 items-center`}
              >

                {/* PREVIEW */}

                <div className={reverse ? "lg:order-2" : ""}>
                  <ProjectPreview project={project} />
                </div>

                {/* CONTENT */}

                <div className="space-y-6">

                  <div className="flex items-center gap-3 flex-wrap">

                    <h3 className="text-2xl font-bold">
                      {project.title}
                    </h3>

                    <span className="px-3 py-1 text-xs font-semibold rounded-full border border-primary/30 bg-primary/10 text-primary">
                      {project.type}
                    </span>

                  </div>

                  <p className="text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>

                  {/* HIGHLIGHTS */}

                  <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">

                    {project.highlights.map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <span className="text-primary">▸</span>
                        {item}
                      </div>
                    ))}

                  </div>

                  {/* TECH */}

                  <div className="flex flex-wrap gap-2">

                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 text-xs font-mono border border-primary/30 rounded-full bg-primary/10 text-primary"
                      >
                        {tech}
                      </span>
                    ))}

                  </div>

                  {/* ACTIONS */}

                  <div className="flex gap-3 pt-2 flex-wrap">

                    {project.live && (
                      <Button
                        onClick={() => window.open(project.live)}
                      >
                        <ExternalLink size={16} className="mr-2" />
                        Live
                      </Button>
                    )}

                    {project.github && (
                      <Button
                        variant="outline"
                        onClick={() => window.open(project.github)}
                      >
                        <Github size={16} className="mr-2" />
                        Code
                      </Button>
                    )}

                    {project.docs && (
                      <Button
                        variant="outline"
                        onClick={() => window.open(project.docs)}
                      >
                        <FileText size={16} className="mr-2" />
                        Docs
                      </Button>
                    )}

                  </div>

                </div>

              </motion.div>
            );
          })}

        </div>

        {/* VIEW ALL BUTTON */}

        {homepage && (
          <div className="text-center mt-20">
            <Button size="lg" onClick={() => navigate("/projects")}>
              View All Projects →
            </Button>
          </div>
        )}

      </div>
    </section>
  );
}