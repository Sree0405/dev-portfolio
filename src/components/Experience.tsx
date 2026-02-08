import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Building2, Calendar, MapPin } from 'lucide-react';

const experiences = [
  {
    company: 'EWall Solutions Pvt Ltd',
    role: 'Junior Developer',
    duration: '2025 - Present',
    location: 'India',
    description:
      'Working on full-stack web development with a strong focus on backend systems, automation, and scalable architecture. Actively involved in building and maintaining React-based platforms, REST APIs, and third-party integrations. Contributing to deployment workflows, automation processes, and AI-assisted features across multiple client and internal projects.',
    color: '#8c4bff',
    technologies: [
      'React',
      'JavaScript',
      'TypeScript',
      'Next.js',
      'PHP',
      'MySQL',
      'REST APIs',
      'Java Spring Boot',
      'Directus',
      'Zapier',
      'AI Integration',
      'Automation',
      'Deployment',
      'Git'
    ],
  },
  {
    company: 'Freelance',
    role: 'Frontend Developer',
    duration: '2024 - 2025',
    location: 'Remote',
    description:
      'Designed and developed modern, performance-optimized web interfaces for clients across various domains. Focused on creating responsive, visually appealing UIs using React and JavaScript, while integrating APIs, automating workflows, and ensuring smooth deployment to production environments.',
    color: '#5e00d4',
    technologies: [
      'React',
      'JavaScript',
      'TypeScript',
      'HTML',
      'CSS',
      'Responsive Design',
      'UI Animations',
      'API Integration',
      'Automation',
      'Deployment'
    ],
  },
  {
    company: 'SA College Of Arts & Science',
    role: 'Bachelor of Science in Computer Science',
    duration: '2024 - 2025',
    location: 'Chennai',
    description:
      'Completed a Bachelor’s degree in Computer Science with a strong foundation in software engineering principles, data structures, and algorithms. Gained hands-on experience through academic projects involving AI concepts, backend development, automation, and problem-solving using multiple programming languages.',
    color: '#5e00d4',
    technologies: [
      'Java',
      'Python',
      'Data Structures & Algorithms',
      'Java Spring Boot',
      'AI',
      'Automation',
      'Database Fundamentals'
    ],
  },  
];


export default function Experience() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="experience" ref={ref} className="relative py-32 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 particle-bg opacity-20" />

      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-bold neon-text mb-4">Experience</h2>
          <p className="text-xl text-muted-foreground font-mono">My Professional Journey</p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-primary-glow mx-auto mt-4" />
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Center Line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary-glow to-transparent transform -translate-x-1/2" />

          <div className="space-y-16">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.company}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                transition={{ duration: 0.8, delay: 0.2 + index * 0.2 }}
                className={`relative flex items-center ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Content Card */}
                <div className="w-full md:w-5/12 glass-panel p-8 rounded-2xl hover-scale group">
                  {/* Company Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center border-2"
                        style={{ 
                          borderColor: exp.color,
                          background: `${exp.color}20`,
                        }}
                      >
                        <Building2 className="w-6 h-6" style={{ color: exp.color }} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                          {exp.company}
                        </h3>
                        <p className="text-primary font-semibold text-sm">{exp.role}</p>
                      </div>
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{exp.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{exp.location}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {exp.description}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 text-xs font-mono rounded-full border"
                        style={{
                          borderColor: `${exp.color}50`,
                          background: `${exp.color}10`,
                          color: exp.color,
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Timeline Node (Hidden on mobile) */}
                <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
                  <motion.div
                    className="w-6 h-6 rounded-full border-4 border-background"
                    style={{ background: exp.color }}
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : { scale: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.2 }}
                  >
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{ background: exp.color }}
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    />
                  </motion.div>
                </div>

                {/* Empty space for alternating layout */}
                <div className="hidden md:block w-5/12" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
