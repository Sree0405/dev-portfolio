import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Code2,
  Palette,
  Rocket,
  Zap,
  Briefcase,
  MapPin,
  Layers,
} from "lucide-react";

import devImg from "@/assets/sree_img.jpg";

/* Highlights */
const highlights = [
  {
    icon: Code2,
    title: "Frontend Excellence",
    description:
      "Engineering scalable, accessible, and production-ready UI systems.",
  },
  {
    icon: Palette,
    title: "Product Design Mindset",
    description:
      "Blending usability, aesthetics, and consistency across platforms.",
  },
  {
    icon: Rocket,
    title: "Performance Engineering",
    description:
      "Optimizing rendering, bundle size, and runtime performance.",
  },
  {
    icon: Zap,
    title: "3D & Motion",
    description:
      "Crafting immersive experiences with WebGL and animations.",
  },
];

/* Focus Areas */
const focusAreas = [
  "Design Systems",
  "Scalable Frontends",
  "3D UI",
  "System Architecture",
  "Developer Experience",
  "Performance Optimization",
];

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-120px" });

  return (
    <section
      id="about"
      ref={ref}
      className="relative py-28 px-6 overflow-hidden bg-slate-950"
    >
      {/* Ambient Background */}
      <div className="absolute inset-0 particle-bg opacity-30" />

      <div className="relative max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <h2 className="text-2xl md:text-4xl font-bold neon-text mb-4">
            About the Developer
          </h2>

          <p className="text-muted-foreground font-mono text-lg">
            Building modern systems • crafting meaningful experiences
          </p>

          <div className="w-24 h-1   mx-auto mt-5" />
        </motion.div>
<div className="flex gap-16 flex-col items-center">

        <div className="grid lg:grid-cols-2 gap-14 items-start">

          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9 }}
            className="relative"
          >
            <div className="glass-panel p-8 rounded-3xl hover-scale relative overflow-hidden">

              {/* Status Badge */}
              {/* <div className="absolute top-5 right-5 flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 border border-primary/40 text-xs font-mono text-primary">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Open to Opportunities
              </div> */}

              {/* Image */}
              <div className="relative aspect-square rounded-2xl overflow-hidden border border-primary/30 mb-6">

                <img
                  src={devImg}
                  alt="Sreekanth"
                  className="w-full h-full object-cover"
                />

                {/* Overlay Glow */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              </div>

              {/* Profile Info */}
              <div className="space-y-2 text-center">

                <h3 className="text-2xl font-bold">
                  Sreekanth
                </h3>

                <p className="font-mono text-primary">
                  Frontend Engineer & UI Architect
                </p>

                <div className="flex justify-center gap-5 text-xs text-muted-foreground mt-3">

                  <div className="flex items-center gap-1">
                    <Briefcase size={14} />
                    EWall Solutions
                  </div>

                  <div className="flex items-center gap-1">
                    <MapPin size={14} />
                    India
                  </div>

                </div>

              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="space-y-8"
          >

            {/* Story */}
            <div className="glass-panel p-8 rounded-2xl space-y-6">

              <p className="text-lg leading-relaxed text-muted-foreground">
                I’m a software engineer focused on building scalable,
                high-performance web platforms that balance technical
                excellence with thoughtful design.
              </p>

              <p className="text-lg leading-relaxed text-muted-foreground">
                At{" "}
                <span className="text-primary font-semibold">
                  EWall Solutions Pvt Ltd
                </span>
                , I design and implement frontend architectures, customize
                WordPress systems, and develop component-driven UI platforms.
              </p>

              <p className="text-lg leading-relaxed text-muted-foreground">
                Through projects like{" "}
                <span className="text-primary font-semibold">
                  My3DUI
                </span>
                , I explore the future of web interfaces — combining
                engineering discipline with interactive 3D experiences.
              </p>

              <p className="text-lg leading-relaxed text-muted-foreground">
                My long-term goal is to evolve into a full-stack systems
                engineer who architects reliable, scalable, and elegant
                digital products.
              </p>

            </div>

            {/* Focus Areas */}
            <div className="glass-panel p-6 rounded-xl">

              <div className="flex items-center gap-2 mb-4 text-primary font-semibold">
                <Layers size={18} />
                Current Focus
              </div>

              <div className="flex flex-wrap gap-3">

                {focusAreas.map((item) => (
                  <span
                    key={item}
                    className="px-4 py-1.5 rounded-full border border-primary/40 bg-primary/10 text-primary text-sm font-mono"
                  >
                    {item}
                  </span>
                ))}

              </div>

            </div>



          </motion.div>

        </div>
        {/* Highlights */}
        <div className="grid sm:grid-cols-2 gap-8 gap-x-16 g w-full">

          {highlights.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.5 + index * 0.1,
              }}
              className="glass-panel p-6 rounded-xl group hover:border-primary/50 hover:shadow-glow transition-all hover-scale"
            >
              <item.icon
                className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform"
              />

              <h4 className="font-semibold mb-2">
                {item.title}
              </h4>

              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>

            </motion.div>
          ))}

        </div>
</div>
      </div>
    </section>
  );
}
