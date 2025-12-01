import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const skills = [
  { name: 'JavaScript', level: 90, color: '#f7df1e' },
  { name: 'Three.js', level: 75, color: '#049ef4' },
  { name: 'React Basics', level: 70, color: '#61dafb' },
  { name: 'PHP', level: 85, color: '#777bb4' },
  { name: 'WordPress', level: 90, color: '#21759b' },
  { name: 'MySQL', level: 80, color: '#4479a1' },
  { name: 'HTML5', level: 95, color: '#e34f26' },
  { name: 'CSS3', level: 95, color: '#1572b6' },
  { name: 'GSAP', level: 75, color: '#88ce02' },
  { name: 'REST APIs', level: 80, color: '#6e00ff' },
];

export default function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="skills" ref={ref} className="relative py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 particle-bg opacity-20" />

      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-bold neon-text mb-4">Skills Matrix</h2>
          <p className="text-xl text-muted-foreground font-mono">Technologies I Work With</p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-primary-glow mx-auto mt-4" />
        </motion.div>

        {/* Skills Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.6, delay: 0.1 + index * 0.05 }}
              className="glass-panel p-6 rounded-xl group hover:border-primary/50 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-foreground">{skill.name}</h3>
                <span className="text-sm font-mono text-primary">{skill.level}%</span>
              </div>

              {/* Progress Bar */}
              <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ 
                    background: `linear-gradient(90deg, ${skill.color}, ${skill.color}cc)`,
                    boxShadow: `0 0 10px ${skill.color}80`,
                  }}
                  initial={{ width: 0 }}
                  animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
                  transition={{ duration: 1, delay: 0.3 + index * 0.05, ease: 'easeOut' }}
                />
                
                {/* Animated Glow */}
                <motion.div
                  className="absolute inset-y-0 w-8 rounded-full blur-sm"
                  style={{ 
                    background: skill.color,
                    opacity: 0.6,
                  }}
                  initial={{ left: 0 }}
                  animate={isInView ? { 
                    left: `${skill.level - 8}%`,
                  } : { 
                    left: 0 
                  }}
                  transition={{ duration: 1, delay: 0.3 + index * 0.05, ease: 'easeOut' }}
                />
              </div>

              {/* Particle Effect on Hover */}
              <motion.div
                className="absolute inset-0 rounded-xl"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                style={{
                  background: `radial-gradient(circle at center, ${skill.color}10, transparent)`,
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 glass-panel p-8 rounded-2xl text-center"
        >
          <p className="text-lg text-muted-foreground mb-4">
            Always learning, always growing. Currently exploring advanced React patterns, 
            full-stack development, and cloud technologies.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {['System Design', 'Cloud Architecture', 'Advanced React', 'Node.js'].map((learning) => (
              <span
                key={learning}
                className="px-4 py-2 border border-primary/50 rounded-full text-sm font-mono text-primary bg-primary/10"
              >
                📚 {learning}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
