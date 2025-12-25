/* ============================================================
   IMMERSIVE 3D PORTFOLIO SCENE
   ------------------------------------------------------------
   - React Three Fiber
   - Scroll + Touch camera navigation
   - Desktop & Mobile support
   - Fully production-safe (no mocks, no hook violations)
   ============================================================ */

import { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import AboutZone from './zones/AboutZone';
import SkillsZone from './zones/SkillsZone';
import ExperienceZone from './zones/ExperienceZone';
import ProjectsZone from './zones/ProjectsZone';
import ContactZone from './zones/ContactZone';
import ParticleField from './ParticleField';

/* ============================================================
   MOBILE DETECTION HOOK
   ============================================================ */

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return isMobile;
}

/* ============================================================
   CAMERA RIG
   ============================================================ */

function CameraRig({ isMobile }: { isMobile: boolean }) {
  const { camera } = useThree();

  /* ---------- REFS ---------- */

  const scrollProgress = useRef(0);
  const touchProgress = useRef(0);

  const lookTarget = useRef(new THREE.Vector3());
  const lookCurrent = useRef(new THREE.Vector3());

  /* ---------- CAMERA PATH ---------- */

  const cameraPath = useMemo(
    () => [
      { x: 0, y: 0, z: 20 },     // About
      { x: 0, y: 2, z: 14 },     // Skills
      { x: 4, y: 8, z: 11 },     // Experience
      { x: -3, y: 18, z: 13 },  // Projects
      { x: 12, y: 15, z: 9 },   // Contact
      { x: 0, y: 25, z: 15 },   // Outro
    ],
    []
  );

  /* ============================================================
     SCROLL / TOUCH INPUT
     ============================================================ */

  useEffect(() => {
    if (isMobile) {
      let startY = 0;

      const onTouchStart = (e: TouchEvent) => {
        startY = e.touches[0].clientY;
      };

      const onTouchMove = (e: TouchEvent) => {
        const delta = startY - e.touches[0].clientY;
        touchProgress.current = THREE.MathUtils.clamp(
          touchProgress.current + delta / 280,
          0,
          cameraPath.length - 1
        );
        startY = e.touches[0].clientY;
      };

      window.addEventListener('touchstart', onTouchStart, { passive: true });
      window.addEventListener('touchmove', onTouchMove, { passive: true });

      return () => {
        window.removeEventListener('touchstart', onTouchStart);
        window.removeEventListener('touchmove', onTouchMove);
      };
    }

    const onScroll = () => {
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress.current = max > 0 ? window.scrollY / max : 0;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, [isMobile, cameraPath.length]);

  /* ============================================================
     FRAME LOOP
     ============================================================ */

  useFrame(() => {
    const t = isMobile
      ? touchProgress.current
      : scrollProgress.current * (cameraPath.length - 1);

    const index = Math.floor(t);
    const next = Math.min(index + 1, cameraPath.length - 1);
    const alpha = t - index;

    const a = cameraPath[index];
    const b = cameraPath[next];

    /* ---------- POSITION ---------- */

    camera.position.lerp(
      new THREE.Vector3(
        THREE.MathUtils.lerp(a.x, b.x, alpha),
        THREE.MathUtils.lerp(a.y, b.y, alpha),
        THREE.MathUtils.lerp(a.z, b.z, alpha)
      ),
      0.1
    );

    /* ---------- LOOK AT ---------- */

    lookTarget.current.set(0, camera.position.y * 0.3, 0);

    camera.getWorldDirection(lookCurrent.current);
    lookCurrent.current.multiplyScalar(10).add(camera.position);
    lookCurrent.current.lerp(lookTarget.current, 0.05);

    camera.lookAt(lookCurrent.current);
  });

  return null;
}

/* ============================================================
   CURSOR LIGHT (DESKTOP ONLY)
   ============================================================ */

function CursorLight() {
  const lightRef = useRef<THREE.SpotLight>(null!);
  const target = useRef(new THREE.Vector3());
  const current = useRef(new THREE.Vector3());

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      target.current.set(x * 10, y * 10, 0);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useFrame(() => {
    if (!lightRef.current) return;
    current.current.lerp(target.current, 0.1);
    lightRef.current.target.position.copy(current.current);
    lightRef.current.target.updateMatrixWorld();
  });

  return (
    <spotLight
      ref={lightRef}
      position={[0, 12, 12]}
      angle={0.35}
      penumbra={1}
      intensity={0.9}
      color="#7f5af0"
      castShadow
    />
  );
}

/* ============================================================
   ATMOSPHERE
   ============================================================ */

function Atmosphere() {
  return (
    <>
      <color attach="background" args={['#0d0d0d']} />
      <fog attach="fog" args={['#0d0d0d', 20, 100]} />
    </>
  );
}

/* ============================================================
   MAIN SCENE
   ============================================================ */

export default function ImmersiveScene() {
  const isMobile = useIsMobile();
  const [scrollProgress, setScrollProgress] = useState(0);

  /* ---------- UI SCROLL PROGRESS ---------- */

  useEffect(() => {
    const onScroll = () => {
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(max > 0 ? window.scrollY / max : 0);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const currentSection = Math.floor(scrollProgress * 5);

  /* ============================================================
     RENDER
     ============================================================ */

  return (
    <div className="relative w-full min-h-screen">
      {/* Scroll Space */}
      <div className="scroll-container h-[500vh]" />

      {/* WebGL */}
      <div className="fixed inset-0">
        <Canvas
          shadows={!isMobile}
          dpr={isMobile ? 1 : 2}
          gl={{ antialias: !isMobile }}
        >
          <PerspectiveCamera makeDefault position={[0, 0, 20]} />

          <Atmosphere />

          {/* Lights */}
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 20, 5]} intensity={0.8} />
          {!isMobile && <CursorLight />}

          {/* Camera */}
          <CameraRig isMobile={isMobile} />

          {/* Background */}
          <ParticleField count={isMobile ? 400 : 1000} />

          {/* Debug Mesh */}
          <mesh>
            <sphereGeometry args={[2, 32, 32]} />
            <meshStandardMaterial
              wireframe
              color="#7f5af0"
              emissive="#7f5af0"
              emissiveIntensity={0.4}
            />
          </mesh>

          {/* Zones */}
          <AboutZone position={[0, 0, 0]} />
          <SkillsZone position={[0, 10, -5]} />
          <ExperienceZone position={[-5, 20, 0]} />
          <ProjectsZone position={[10, 15, -3]} />
          <ContactZone position={[0, 30, 0]} />
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
        <p className="text-gray-400 text-sm font-mono">
          {isMobile ? 'Swipe to explore' : 'Scroll to explore'}
        </p>
      </div>

      {/* Section Labels */}
      {!isMobile && (
        <div className="fixed right-8 top-1/2 -translate-y-1/2 z-40 space-y-4">
          {['About', 'Skills', 'Experience', 'Projects', 'Contact'].map(
            (label, i) => (
              <div
                key={label}
                style={{
                  opacity: currentSection === i ? 1 : 0.4,
                  color: currentSection === i ? '#7f5af0' : '#888',
                }}
                className="text-xs font-mono uppercase tracking-wider"
              >
                {label}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
