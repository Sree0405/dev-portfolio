import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Code2, Palette, Rocket, Zap } from 'lucide-react';
import devImg from '@/assets/sree_img.jpg';
const highlights = [
  {
    icon: Code2,
    title: 'Frontend Mastery',
    description: 'Crafting pixel-perfect, responsive interfaces with modern frameworks',
  },
  {
    icon: Palette,
    title: 'Design Thinking',
    description: 'Creating aesthetic experiences that blend form and function',
  },
  {
    icon: Rocket,
    title: 'Performance First',
    description: 'Building fast, optimized applications that scale',
  },
  {
    icon: Zap,
    title: '3D & Animations',
    description: 'Bringing depth and motion to web experiences with WebGL',
  },
];

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" ref={ref} className="relative py-32 px-6 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 particle-bg opacity-30" />

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-bold neon-text mb-4">
            About Me
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-primary-glow mx-auto" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Avatar/Visual */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="glass-panel p-8 rounded-3xl hover-scale">
              <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-primary/30 mb-6">
                {/* Placeholder for avatar/hologram */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary-glow/20 flex items-center justify-center">

                  <div className="w-full  rounded-md overflow-hidden">
                    <img
                      src={devImg}
                      alt="img"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

              </div>

              <div className="space-y-2 text-center">
                <h3 className="text-2xl font-bold text-foreground">Sreekanth</h3>
                <p className="font-mono text-primary">Software Engineer-Frontend</p>
                <div className="flex justify-center gap-2 pt-2">
                  <span className="px-3 py-1 bg-primary/20 border border-primary/50 rounded-full text-xs font-mono">
                    Available for Work
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            <div className="glass-panel p-8 rounded-2xl space-y-6">
              <p className="text-lg leading-relaxed text-muted-foreground">
                I'm a passionate developer who loves to build modern, aesthetic, and performant web experiences.
                My journey in web development started with a curiosity for how things work on the internet,
                and it has evolved into a deep passion for creating immersive digital experiences.
              </p>

              <p className="text-lg leading-relaxed text-muted-foreground">
                Currently working at <span className="text-primary font-semibold">EWall Solutions Pvt Ltd</span>,
                I specialize in frontend development, WordPress customization, and creating stunning user interfaces.
                I'm constantly exploring new technologies, especially in the realm of 3D web experiences and animations.
              </p>

              <p className="text-lg leading-relaxed text-muted-foreground">
                My goal is to become a full-stack engineer who can architect and build complete web applications
                that are not just functional, but also beautiful and memorable.
              </p>
            </div>

            {/* Highlights Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {highlights.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  className="glass-panel p-6 rounded-xl hover:border-primary/50 transition-all group hover-scale"
                >
                  <item.icon className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
                  <h4 className="font-semibold mb-2 text-foreground">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
