import { motion } from "framer-motion";
import {
  Heart,
  Github,
  Linkedin,
  Mail,
  ArrowUpRight,
  ArrowUp
} from "lucide-react";

import { Link } from "react-router-dom";

export default function Footer() {

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative border-t border-border bg-slate-950 overflow-hidden">

      {/* Background Gradient Glow */}
      <div className="absolute inset-0 pointer-events-none">

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10 blur-3xl" />

      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-20">

        {/* TOP GRID */}

        <div className="grid gap-12 lg:grid-cols-4 md:grid-cols-2 mb-16">

          {/* BRAND */}

          <div className="space-y-5">

            <motion.h3
              whileHover={{ scale: 1.05 }}
              className="
              text-3xl
              font-bold
              tracking-tight
              bg-gradient-to-r
              from-indigo-400
              via-purple-400
              to-cyan-400
              bg-clip-text
              text-transparent
              "
            >
              Sreekanth
            </motion.h3>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Frontend-focused full stack engineer building scalable SaaS
              platforms, immersive UI systems, and production-grade
              applications across web, mobile and backend infrastructure.
            </p>

            <a
              href="mailto:sreekanth04052005@gmail.com"
              className="inline-flex items-center gap-2 text-indigo-300 hover:text-indigo-200 transition text-sm"
            >
              <Mail className="w-4 h-4" />
              Contact Me
            </a>

          </div>

          {/* NAVIGATION */}

          <div>

            <h4 className="text-sm font-semibold mb-5 uppercase tracking-wider text-foreground">
              Navigation
            </h4>

            <ul className="space-y-3 text-sm">

              {[
                { name: "Home", link: "/" },
                { name: "Experience", link: "/experience" },
                { name: "Projects", link: "/projects" },
                { name: "Skills", link: "/skills" },
                { name: "Contact", link: "/contact" }
              ].map((item) => (

                <li key={item.name}>

                  <Link
                    to={item.link}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition"
                  >
                    {item.name}
                    <ArrowUpRight className="w-3 h-3 opacity-60" />
                  </Link>

                </li>

              ))}

            </ul>

          </div>

          {/* TECHNOLOGY */}

          <div>

            <h4 className="text-sm font-semibold mb-5 uppercase tracking-wider text-foreground">
              Technologies
            </h4>

            <div className="flex flex-wrap gap-3">

              {[
                "React",
                "Next.js",
                "TypeScript",
                "Three.js",
                "Node.js",
                "AI Integration"
              ].map((tech) => (

                <span
                  key={tech}
                  className="
                  px-3 py-1.5
                  rounded-full
                  border border-indigo-400/30
                  bg-indigo-500/10
                  text-indigo-300
                  text-xs
                  font-mono
                  "
                >
                  {tech}
                </span>

              ))}

            </div>

          </div>

          {/* SOCIAL */}

          <div>

            <h4 className="text-sm font-semibold mb-5 uppercase tracking-wider text-foreground">
              Connect
            </h4>

            <div className="flex gap-4">

              {[
                {
                  icon: Github,
                  href: "https://github.com/Sree0405"
                },
                {
                  icon: Linkedin,
                  href: "https://linkedin.com/in/sreekanth04052005"
                }
              ].map((social, i) => (

                <motion.a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -4, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  border border-border
                  bg-muted/30
                  hover:border-indigo-400
                  hover:bg-indigo-500/10
                  transition
                  "
                >
                  <social.icon className="h-5 w-5 text-muted-foreground hover:text-indigo-300 transition" />
                </motion.a>

              ))}

            </div>

          </div>

        </div>

        {/* DIVIDER */}

        <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent mb-8" />

        {/* BOTTOM */}

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between text-sm text-muted-foreground">

          <p>
            © {new Date().getFullYear()} Sreekanth. All rights reserved.
          </p>

          <p className="flex items-center gap-2">
            Crafted with
            <Heart className="w-4 h-4 text-indigo-400 animate-pulse" />
            using React & Three.js
          </p>

          {/* BACK TO TOP */}

          <button
            onClick={scrollTop}
            className="
            flex items-center gap-2
            px-4 py-2
            rounded-lg
            border border-border
            hover:border-indigo-400
            hover:bg-indigo-500/10
            transition
            "
          >
            <ArrowUp className="w-4 h-4" />
            Top
          </button>

        </div>

      </div>

    </footer>
  );
}