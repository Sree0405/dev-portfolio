import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ExternalLink, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';

const projects = [
  {
    title: 'Flixify - Netflix-Style Streaming Platform',
    description:
      'A fully customized streaming platform theme with dark UI, smooth animations, and optimized for real-world content creators.',
    tech: ['WordPress', 'PHP', 'Blocksy Theme', 'MySQL'],
    image: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#667eea',
    url: 'https://fieldstack.onrender.com/',
    gitHub:'https://github.com/Sree0405/fieldstack',
    Docs:'/project/fieldstack'
  },
  {
    title: 'Student Database Management System',
    description:
      'Complete full-stack system to manage student records with secure backend and clean dashboard UI.',
    tech: ['HTML', 'CSS', 'JS', 'Core Java', 'MySQL'],
    image: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    color: '#f5576c',
  },
  {
    title: '5 Star Interior Work & Design Website',
    description:
      'A modern showcase website for an interior design business with smooth animations and gallery sections.',
    tech: ['HTML', 'CSS', 'JS', 'PHP'],
    image: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    color: '#4facfe',
  },
];

export default function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="projects" ref={ref} className="relative py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 particle-bg opacity-20" />

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-bold neon-text mb-4">Featured Projects</h2>
          <p className="text-xl text-muted-foreground font-mono">Building the Future, One Project at a Time</p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-primary-glow mx-auto mt-4" />
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 50, rotateX: 45 }}
              animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 50, rotateX: 45 }}
              transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
              className="group perspective-1000"
            >
              <div className="glass-panel rounded-2xl overflow-hidden hover-scale h-full flex flex-col">
                {/* Project Image/Preview */}
                <div
                  className="relative h-48 overflow-hidden"
                  style={{ background: project.image }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-background/95 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(project.url)}
                      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Demo
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      <Github className="w-4 h-4 mr-2" />
                      Code
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(project.Docs)}
                      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Docs
                    </Button>
                  </div>

                  {/* Scan Effect */}
                  <motion.div
                    className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"
                    initial={{ y: 0 }}
                    animate={{ y: [0, 192, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                  />
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1">
                    {project.description}
                  </p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 text-xs font-mono rounded-full border border-primary/30 bg-primary/10 text-primary"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Projects Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Button
            size="lg"
            className="bg-primary hover:bg-primary-glow text-primary-foreground font-mono uppercase tracking-wider px-8 shadow-neon hover-scale"
          >
            View All Projects
            <ExternalLink className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
