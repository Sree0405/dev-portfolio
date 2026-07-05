import { motion, useInView } from "framer-motion";
import { MetaBadge } from "@/components/ui/meta-badge";
import { TechStack } from "@/components/ui/tech-stack";
import { useRef } from "react";
import { ExternalLink, Github, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectPreview } from "../ProjectPreview";
import { useNavigate } from "react-router-dom";


import My3DUIImage from "@/assets/3dUi.png";
import My3DUIVideo from "@/assets/videos/my3dui.mp4";

import FieldstackImage from "@/assets/Dashboard.png";
import FieldstackVideo from "@/assets/videos/fieldstack.mp4";

import EVPortalImage from "@/assets/evpic.png";
import EVPortalVideo from "@/assets/videos/evPortal.mp4";

// import NetflixImage from "@/assets/Screenshot 2026-02-01 125107.png";
import NetflixVideo from "@/assets/videos/netflix.mp4";

import LifeAdminImage from "@/assets/LifeAdminMain.png";

import GBFitnessVideo from "@/assets/videos/gbFitness.mp4";
import GBFitnessImage from "@/assets/gbFitnessimage.png"

import SriThanigaiImage from "@/assets/srithanigaiGarments.png";

/* ============================= */
/* PROJECT DATA */
/* ============================= */

const projects = [
  {
    title: "Sri Thanigai Garments",
    subtitle: "Garments Landing Page",
    type: "Full-Stack Landing Page",
    featured: true,

    description:
      "Premium landing page for a garments company with CMS-backed content, product showcases, and dedicated manufacturing and infrastructure pages.",

    highlights: [
      "CMS Content Management",
      "Product & Service Showcase",
      "Manufacturing Pages",
    ],

    tech: ["React", "Next.js", "TypeScript", "Node.js", "Express"],

    image: SriThanigaiImage,
    live: "https://www.srithanigaigarments.com/",
  },

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
    docs:"/project/fieldstack"
  },
{
  title: "GB Fitness",
  subtitle: "Premium Gym Website",
  type: "Business Website",

  description:
    "A premium fitness studio website built for GB Fitness Studio in Avadi, Chennai. The platform showcases training programs, gym equipment, transformation results, events, and membership plans with a modern glassmorphism UI and high-performance animations.",

  highlights: [
    "Premium Glassmorphism UI",
    "Framer Motion Animations",
    "Fully Responsive Design",
    "Modern Gym Branding",
  ],

  tech: [
    "React",
    "TypeScript",
    "Vite",
    "Tailwind CSS",
    "Framer Motion",
    "React Router",
  ],

  image: GBFitnessImage,
  video: GBFitnessVideo,

  live: "https://gbfitness-eta.vercel.app/",
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
    docs:"/project/lifeAdmin"
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

  const visibleProjects = homepage
    ? [...projects]
        .sort((a, b) => Number(b.featured) - Number(a.featured))
        .slice(0, 3)
    : projects;

  return (
    <section
      id="projects"
      ref={ref}
      className={`relative overflow-hidden border-t border-border/30 bg-transparent page-container-x ${
        homepage ? "py-16 md:py-20" : "page-section-y"
      }`}
    >
      <div className="w-full">

        {homepage && (
          <div className="mb-10 md:mb-12">
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.28em] text-primary">
              Selected work
            </p>
            <h2 className="font-display mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
              Recent projects
            </h2>
          </div>
        )}

        <div className="divide-y divide-border/30">

          {visibleProjects.map((project, index) => {

            const reverse = index % 2 !== 0 && !homepage;

            return (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65 }}
                viewport={{ once: true }}
                className={`grid items-center gap-6 py-10 first:pt-0 last:pb-0 sm:gap-8 lg:grid-cols-2 lg:gap-10 ${
                  homepage ? "lg:py-12" : "lg:py-14"
                }`}
              >

                {/* PREVIEW */}

                <div className={reverse ? "lg:order-2" : ""}>
                  <ProjectPreview project={project} compact={homepage} />
                </div>

                {/* CONTENT */}

                <div className="space-y-4">

                  <div className="flex flex-wrap items-center gap-2.5">

                    <h3 className="text-xl font-bold sm:text-2xl">
                      {project.title}
                    </h3>

                    <MetaBadge>{project.type}</MetaBadge>

                  </div>

                  <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {project.description}
                  </p>

                  {/* HIGHLIGHTS */}

                  <div className="grid grid-cols-1 gap-1.5 text-sm text-muted-foreground sm:grid-cols-2 sm:gap-2">

                    {project.highlights.map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <span className="text-primary">▸</span>
                        {item}
                      </div>
                    ))}

                  </div>

                  {/* TECH */}

                  <TechStack items={project.tech} bordered={false} />

                  {/* ACTIONS */}

                  <div className="flex flex-wrap gap-3 pt-1">

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
          <div className="mt-10 text-center md:mt-12">
            <Button size="lg" onClick={() => navigate("/projects")}>
              View All Projects →
            </Button>
          </div>
        )}

      </div>
    </section>
  );
}