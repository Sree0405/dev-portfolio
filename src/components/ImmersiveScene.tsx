import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useIsMobile } from '@/hooks/use-mobile';
import AboutZone from './zones/AboutZone';
import SkillsZone from './zones/SkillsZone';
import ExperienceZone from './zones/ExperienceZone';
import ProjectsZone from './zones/ProjectsZone';
import ContactZone from './zones/ContactZone';
import ParticleField from './ParticleField';

gsap.registerPlugin(ScrollTrigger);

// Camera path control based on scroll and touch
function CameraRig({ isMobile }: { isMobile: boolean }) {
  const { camera } = useThree();
  const cameraRef = useRef(camera);
  const [touchProgress, setTouchProgress] = useState(0);

  useEffect(() => {
    if (isMobile) {
      // Touch-based navigation for mobile
      let touchStartY = 0;
      let currentProgress = 0;

      const handleTouchStart = (e: TouchEvent) => {
        touchStartY = e.touches[0].clientY;
      };

      const handleTouchMove = (e: TouchEvent) => {
        const touchY = e.touches[0].clientY;
        const deltaY = touchStartY - touchY;
        currentProgress = Math.max(0, Math.min(4, currentProgress + deltaY / 200));
        setTouchProgress(currentProgress);
        touchStartY = touchY;
      };

      window.addEventListener('touchstart', handleTouchStart);
      window.addEventListener('touchmove', handleTouchMove);

      return () => {
        window.removeEventListener('touchstart', handleTouchStart);
        window.removeEventListener('touchmove', handleTouchMove);
      };
    } else {
      // Scroll-based navigation for desktop
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: '.scroll-container',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.5,
        },
      });

      // Zone 1: About (Entry)
      timeline.to(cameraRef.current.position, {
        x: 0,
        y: 2,
        z: 15,
        duration: 1,
      });

      // Zone 2: Skills (Move forward and up)
      timeline.to(cameraRef.current.position, {
        x: isMobile ? 3 : 5,
        y: 8,
        z: isMobile ? 12 : 10,
        duration: 1,
      });

      // Zone 3: Experience (Spiral up)
      timeline.to(cameraRef.current.position, {
        x: isMobile ? -2 : -3,
        y: 18,
        z: 12,
        duration: 1,
      });

      // Zone 4: Projects (Side track)
      timeline.to(cameraRef.current.position, {
        x: isMobile ? 10 : 15,
        y: 15,
        z: isMobile ? 10 : 8,
        duration: 1,
      });

      // Zone 5: Contact (Final approach)
      timeline.to(cameraRef.current.position, {
        x: 0,
        y: 25,
        z: 15,
        duration: 1,
      });

      return () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    }
  }, [isMobile]);

  // Mobile touch-based camera positioning
  useEffect(() => {
    if (isMobile) {
      const positions = [
        { x: 0, y: 0, z: 20 },
        { x: 0, y: 2, z: 15 },
        { x: 3, y: 8, z: 12 },
        { x: -2, y: 18, z: 12 },
        { x: 10, y: 15, z: 10 },
        { x: 0, y: 25, z: 15 },
      ];

      const index = Math.floor(touchProgress);
      const nextIndex = Math.min(index + 1, positions.length - 1);
      const t = touchProgress - index;

      const current = positions[index];
      const next = positions[nextIndex];

      gsap.to(cameraRef.current.position, {
        x: current.x + (next.x - current.x) * t,
        y: current.y + (next.y - current.y) * t,
        z: current.z + (next.z - current.z) * t,
        duration: 0.5,
        ease: 'power2.out',
      });
    }
  }, [touchProgress, isMobile]);

  useFrame(() => {
    // Smooth camera look-at with lerp
    const target = new THREE.Vector3(0, cameraRef.current.position.y - 5, 0);
    cameraRef.current.lookAt(target);
  });

  return null;
}

// Cursor-reactive spotlight
function CursorLight() {
  const lightRef = useRef<THREE.SpotLight>(null);
  const targetRef = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      targetRef.current.set(x * 10, y * 10, 0);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame(() => {
    if (lightRef.current) {
      lightRef.current.target.position.lerp(targetRef.current, 0.1);
      lightRef.current.target.updateMatrixWorld();
    }
  });

  return (
    <spotLight
      ref={lightRef}
      position={[0, 10, 10]}
      angle={0.4}
      penumbra={1}
      intensity={0.8}
      color="#7f5af0"
      castShadow
    />
  );
}

// Volumetric fog effect
function VolumetricFog() {
  return (
    <>
      <fog attach="fog" args={['#050505', 10, 80]} />
      <color attach="background" args={['#0d0d0d']} />
    </>
  );
}

export default function ImmersiveScene() {
  const isMobile = useIsMobile();

  return (
    <div className="relative w-full">
      {/* Scroll container for GSAP ScrollTrigger */}
      <div className="scroll-container h-[500vh]" />

      {/* Fixed WebGL Canvas */}
      <div className="fixed inset-0 w-full h-screen">
        <Canvas
          shadows={!isMobile}
          gl={{ 
            antialias: !isMobile,
            alpha: false,
            powerPreference: isMobile ? 'low-power' : 'high-performance',
          }}
          dpr={isMobile ? [1, 1.5] : [1, 2]}
        >
          <PerspectiveCamera makeDefault position={[0, 0, 20]} fov={isMobile ? 75 : 65} />
          
          <VolumetricFog />
          
          {/* Global lighting */}
          <ambientLight intensity={isMobile ? 0.5 : 0.3} />
          <directionalLight position={[10, 20, 5]} intensity={isMobile ? 0.3 : 0.5} color="#ffffff" />
          
          {/* Accent lights - reduced for mobile */}
          {!isMobile && (
            <>
              <pointLight position={[10, 10, 10]} intensity={1.5} color="#7f5af0" distance={30} />
              <pointLight position={[-10, 5, 5]} intensity={1.2} color="#00eaff" distance={25} />
              <pointLight position={[0, 30, 0]} intensity={1} color="#ff00ff" distance={40} />
            </>
          )}
          
          {!isMobile && <CursorLight />}
          <CameraRig isMobile={isMobile} />
          
          {/* Background particles */}
          <ParticleField count={isMobile ? 500 : 1000} />
          
          {/* Zone sections */}
          <AboutZone position={[0, 0, 0]} />
          <SkillsZone position={[0, 10, -5]} />
          <ExperienceZone position={[-5, 20, 0]} />
          <ProjectsZone position={[10, 15, -3]} />
          <ContactZone position={[0, 30, 0]} />
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="text-center"
        >
          <p className="text-muted-foreground text-sm font-mono mb-2">
            {isMobile ? 'Swipe to explore' : 'Scroll to explore'}
          </p>
          {!isMobile && (
            <div className="w-6 h-10 border-2 border-primary/50 rounded-full mx-auto relative">
              <motion.div
                className="w-1 h-2 bg-primary rounded-full absolute left-1/2 -translate-x-1/2 top-2"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          )}
          {isMobile && (
            <div className="flex gap-2 justify-center mt-2">
              <motion.div
                className="w-2 h-2 bg-primary rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="w-2 h-2 bg-primary rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
              />
              <motion.div
                className="w-2 h-2 bg-primary rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
              />
            </div>
          )}
        </motion.div>
      </div>

      {/* Section labels - hidden on mobile */}
      {!isMobile && (
        <div className="fixed right-8 top-1/2 -translate-y-1/2 z-40 space-y-4">
          {['About', 'Skills', 'Experience', 'Projects', 'Contact'].map((label, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="text-right"
            >
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                {label}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
