import { motion } from "framer-motion";
import { Heart, Github, Linkedin, Twitter, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative  border-border bg-slate-950 backdrop-blur py-16 px-6">

      {/* Subtle background effect */}
      <div className="pointer-events-none absolute inset-0 " />

      <div className="relative max-w-7xl mx-auto">

        {/* Top */}
        <div className="grid gap-12 md:grid-cols-3 mb-16">

          {/* Brand */}
          <div className="space-y-4">

            <motion.h3
              whileHover={{ scale: 1.05 }}
              className="text-3xl font-bold neon-text tracking-tight"
            >
              Sreekanth
            </motion.h3>

            <p className="text-sm leading-relaxed text-muted-foreground max-w-sm">
              Frontend Engineer specializing in high-performance web apps,
              interactive UI systems, and modern product experiences.
            </p>

            <a
              href="mailto:sreekanth04052005@gmail.com"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <Mail className="w-4 h-4" />
              Let’s work together
            </a>

          </div>

          {/* Links */}
          <div>

            <h4 className="mb-5 text-sm font-semibold uppercase tracking-wider text-foreground">
              Navigation
            </h4>

            <ul className="space-y-3 text-sm">

              {["About", "Experience", "Projects", "Skills", "Contact"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href={`#${item.toLowerCase()}`}
                      className="text-muted-foreground hover:text-foreground transition"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}

            </ul>

          </div>

          {/* Social */}
          <div>

            <h4 className="mb-5 text-sm font-semibold uppercase tracking-wider text-foreground">
              Connect
            </h4>

            <div className="flex gap-4">

              {[
                {
                  icon: Github,
                  href: "https://github.com/Sree0405",
                },
                {
                  icon: Linkedin,
                  href: "https://in.linkedin.com/in/sreekanth04052005",
                },
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3, scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-muted/40 hover:bg-accent/10 hover:border-accent transition"
                >
                  <social.icon className="h-5 w-5 text-muted-foreground hover:text-accent" />
                </motion.a>
              ))}

            </div>

          </div>

        </div>

        {/* Bottom */}
        <div className="flex flex-col gap-4 border-t border-border pt-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">

          <p>
            © {new Date().getFullYear()} Sreekanth. All rights reserved.
          </p>

          <p className="flex items-center gap-2">
            Crafted with
            <Heart className="h-4 w-4 text-primary animate-pulse" />
            using React & Three.js
          </p>

        </div>

      </div>
    </footer>
  );
}
