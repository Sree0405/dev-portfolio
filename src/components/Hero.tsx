import { motion } from 'framer-motion';
import { ArrowDown, Download, Github, Linkedin, Mail } from 'lucide-react';
import HeroScene from './HeroScene';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function Hero() {


  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Background Scene */}
      <HeroScene />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="space-y-6"
        >
          {/* Greeting */}
          <motion.p
            className="font-mono text-primary text-sm md:text-base uppercase tracking-widest"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            ← Welcome to My Universe →
          </motion.p>

          {/* Main Title */}
          <motion.h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold neon-text"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            Hi, I'm <span className="text-primary">Sreekanth</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
          >
            <p className="text-xl md:text-2xl lg:text-3xl font-light text-muted-foreground">
              Junior Developer • React Dev
            </p>
            <p className="text-lg md:text-xl text-primary-glow font-mono">
              Full-Stack Engineer
            </p>
          </motion.div>

          {/* Description */}
          <motion.p
            className="max-w-2xl mx-auto text-base md:text-lg text-muted-foreground leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.3 }}
          >
            I build modern, aesthetic, and performant web experiences. 
            Passionate about 3D interfaces, animations, and creating immersive digital ecosystems.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
          >
            <Link
              to="/projects"
              className="bg-primary flex rounded-lg hover:bg-primary-glow text-primary-foreground font-mono uppercase tracking-wider px-6 py-3 text-base shadow-neon hover-scale"
            >
              View My Work
              <ArrowDown className="ml-2 pt-1 w-5 h-5 animate-bounce" />
            </Link>
            
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-mono uppercase tracking-wider px-8 py-6 text-base neon-border hover-scale"
            >
              <Download className="mr-2 w-5 h-5" />
              Resume
            </Button>
          </motion.div>


        </motion.div>
      </div>
    </section>
  );
}
