import { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AboutZone from './zones/AboutZone';
import SkillsZone from './zones/SkillsZone';
import ExperienceZone from './zones/ExperienceZone';
import ProjectsZone from './zones/ProjectsZone';
import ContactZone from './zones/ContactZone';
import ParticleField from './ParticleField';

gsap.registerPlugin(ScrollTrigger);

// Camera path control based on scroll
function CameraRig() {
  const { camera } = useThree();
  const cameraRef = useRef(camera);

  useEffect(() => {
    // Define camera journey positions for each zone
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
      x: 5,
      y: 8,
      z: 10,
      duration: 1,
    });

    // Zone 3: Experience (Spiral up)
    timeline.to(cameraRef.current.position, {
      x: -3,
      y: 18,
      z: 12,
      duration: 1,
    });

    // Zone 4: Projects (Side track)
    timeline.to(cameraRef.current.position, {
      x: 15,
      y: 15,
      z: 8,
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
  }, []);

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
  return (
    <div className="relative w-full">
      {/* Scroll container for GSAP ScrollTrigger */}
      <div className="scroll-container h-[500vh]" />

      {/* Fixed WebGL Canvas */}
      <div className="fixed inset-0 w-full h-screen">
        <Canvas
          shadows
          gl={{ 
            antialias: true, 
            alpha: false,
            powerPreference: 'high-performance'
          }}
        >
          <PerspectiveCamera makeDefault position={[0, 0, 20]} fov={65} />
          
          <VolumetricFog />
          
          {/* Global lighting */}
          <ambientLight intensity={0.3} />
          <directionalLight position={[10, 20, 5]} intensity={0.5} color="#ffffff" />
          
          {/* Accent lights */}
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#7f5af0" distance={30} />
          <pointLight position={[-10, 5, 5]} intensity={1.2} color="#00eaff" distance={25} />
          <pointLight position={[0, 30, 0]} intensity={1} color="#ff00ff" distance={40} />
          
          <CursorLight />
          <CameraRig />
          
          {/* Background particles */}
          <ParticleField />
          
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
          <p className="text-muted-foreground text-sm font-mono mb-2">Scroll to explore</p>
          <div className="w-6 h-10 border-2 border-primary/50 rounded-full mx-auto relative">
            <motion.div
              className="w-1 h-2 bg-primary rounded-full absolute left-1/2 -translate-x-1/2 top-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </div>

      {/* Section labels */}
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
    </div>
  );
}
