/**
 * IMMERSIVE 3D PORTFOLIO SCENE
 * - Self-contained, production-safe
 * - No external side effects
 * - React + R3F lifecycle compliant
 */

import { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

/* ============================================================
   CONSTANTS
   ============================================================ */

const SECTIONS = ['About', 'Skills', 'Experience', 'Projects', 'Contact'] as const;

const CAMERA_PATH = [
  { x: 0, y: 0, z: 15 },
  { x: 0, y: 5, z: 12 },
  { x: 3, y: 12, z: 10 },
  { x: -3, y: 20, z: 12 },
  { x: 5, y: 28, z: 10 },
  { x: 0, y: 35, z: 15 },
];

/* ============================================================
   PARTICLES
   ============================================================ */

function Particles({ count = 500 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 50;
    positions[i * 3 + 1] = Math.random() * 60 - 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
  }

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#7f5af0"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

/* ============================================================
   CAMERA RIG
   ============================================================ */

function CameraRig({ progress }: { progress: number }) {
  const { camera } = useThree();
  const lookTarget = useRef(new THREE.Vector3());

  useFrame(() => {
    const t = progress * (CAMERA_PATH.length - 1);
    const index = Math.min(Math.floor(t), CAMERA_PATH.length - 2);
    const alpha = t - index;

    const a = CAMERA_PATH[index];
    const b = CAMERA_PATH[index + 1];

    const targetPos = new THREE.Vector3(
      THREE.MathUtils.lerp(a.x, b.x, alpha),
      THREE.MathUtils.lerp(a.y, b.y, alpha),
      THREE.MathUtils.lerp(a.z, b.z, alpha)
    );

    camera.position.lerp(targetPos, 0.08);
    lookTarget.current.set(0, camera.position.y * 0.5, 0);
    camera.lookAt(lookTarget.current);
  });

  return null;
}

/* ============================================================
   ORBITING SHAPE
   ============================================================ */

function OrbitingShape({ radius, speed, offset, color, yOffset = 0 }: {
  radius: number;
  speed: number;
  offset: number;
  color: string;
  yOffset?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.elapsedTime * speed + offset;
      meshRef.current.position.x = Math.cos(t) * radius;
      meshRef.current.position.z = Math.sin(t) * radius;
      meshRef.current.rotation.x = t * 0.5;
      meshRef.current.rotation.y = t * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={[0, yOffset, 0]}>
        <octahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          wireframe
        />
      </mesh>
    </Float>
  );
}

/* ============================================================
   ZONE COMPONENTS
   ============================================================ */

function AboutZone() {
  return (
    <group position={[0, 0, 0]}>
      <Text
        fontSize={1.2}
        color="#7f5af0"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#00eaff"
      >
        SREEKANTH
      </Text>
      <Text
        position={[0, -1.5, 0]}
        fontSize={0.35}
        color="#888888"
        anchorX="center"
        anchorY="middle"
      >
        Full Stack Developer
      </Text>
      <OrbitingShape radius={3} speed={0.5} offset={0} color="#7f5af0" />
      <OrbitingShape radius={4} speed={0.3} offset={Math.PI} color="#00eaff" />
      <OrbitingShape radius={3.5} speed={0.4} offset={Math.PI / 2} color="#ff00ff" />
      
      {/* Floor grid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
        <planeGeometry args={[20, 20, 20, 20]} />
        <meshBasicMaterial color="#7f5af0" wireframe transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

function SkillsZone() {
  const skills = ['React', 'TypeScript', 'Three.js', 'Node.js', 'Python'];
  
  return (
    <group position={[0, 8, 0]}>
      <Text
        position={[0, 2, 0]}
        fontSize={0.6}
        color="#00eaff"
        anchorX="center"
        anchorY="middle"
      >
        SKILLS
      </Text>
      {skills.map((skill, i) => (
        <Float key={skill} speed={1.5} floatIntensity={0.3}>
          <mesh position={[(i - 2) * 2, 0, 0]}>
            <boxGeometry args={[0.8, 0.8, 0.8]} />
            <meshStandardMaterial
              color="#7f5af0"
              emissive="#7f5af0"
              emissiveIntensity={0.3}
              wireframe
            />
          </mesh>
          <Text
            position={[(i - 2) * 2, -0.8, 0]}
            fontSize={0.2}
            color="#ffffff"
            anchorX="center"
          >
            {skill}
          </Text>
        </Float>
      ))}
    </group>
  );
}

function ExperienceZone() {
  return (
    <group position={[-2, 18, 0]}>
      <Text
        position={[0, 3, 0]}
        fontSize={0.6}
        color="#ff00ff"
        anchorX="center"
        anchorY="middle"
      >
        EXPERIENCE
      </Text>
      {[0, 1, 2].map((i) => (
        <Float key={i} speed={1} floatIntensity={0.2}>
          <mesh position={[0, -i * 2, 0]}>
            <torusGeometry args={[1, 0.3, 16, 50]} />
            <meshStandardMaterial
              color="#7f5af0"
              emissive="#7f5af0"
              emissiveIntensity={0.4}
              wireframe
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function ProjectsZone() {
  return (
    <group position={[3, 26, 0]}>
      <Text
        position={[0, 3, 0]}
        fontSize={0.6}
        color="#00eaff"
        anchorX="center"
        anchorY="middle"
      >
        PROJECTS
      </Text>
      {[-2, 0, 2].map((x, i) => (
        <Float key={i} speed={1.2} floatIntensity={0.4}>
          <mesh position={[x, 0, 0]}>
            <icosahedronGeometry args={[0.8, 0]} />
            <meshStandardMaterial
              color={['#7f5af0', '#00eaff', '#ff00ff'][i]}
              emissive={['#7f5af0', '#00eaff', '#ff00ff'][i]}
              emissiveIntensity={0.5}
              wireframe
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function ContactZone() {
  return (
    <group position={[0, 34, 0]}>
      <Text
        fontSize={0.8}
        color="#7f5af0"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#00eaff"
      >
        CONTACT
      </Text>
      <Float speed={1} floatIntensity={0.5}>
        <mesh position={[0, -2, 0]}>
          <sphereGeometry args={[1.5, 32, 32]} />
          <MeshDistortMaterial
            color="#7f5af0"
            emissive="#7f5af0"
            emissiveIntensity={0.8}
            distort={0.3}
            speed={2}
            transparent
            opacity={0.7}
          />
        </mesh>
      </Float>
    </group>
  );
}

/* ============================================================
   SCENE CONTENT
   ============================================================ */

function SceneContent({ progress, isMobile }: { progress: number; isMobile: boolean }) {
  return (
    <>
      <color attach="background" args={['#0a0a0f']} />
      <fog attach="fog" args={['#0a0a0f', 10, 60]} />
      
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 20, 5]} intensity={0.8} />
      <pointLight position={[-10, 10, -10]} intensity={0.5} color="#7f5af0" />
      
      <CameraRig progress={progress} />
      <Particles count={isMobile ? 300 : 600} />
      
      {/* Hero sphere */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial
          wireframe
          color="#7f5af0"
          emissive="#7f5af0"
          emissiveIntensity={0.4}
        />
      </mesh>
      
      <AboutZone />
      <SkillsZone />
      <ExperienceZone />
      <ProjectsZone />
      <ContactZone />
    </>
  );
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */

export default function ImmersiveScene() {
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Desktop scroll
  useEffect(() => {
    if (isMobile) return;

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        setProgress(Math.min(Math.max(window.scrollY / scrollHeight, 0), 1));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  // Mobile touch
  useEffect(() => {
    if (!isMobile) return;

    let currentProgress = 0;
    let startY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      currentProgress = progress;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const delta = startY - e.touches[0].clientY;
      currentProgress = Math.min(Math.max(currentProgress + delta * 0.002, 0), 1);
      setProgress(currentProgress);
      startY = e.touches[0].clientY;
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isMobile, progress]);

  const currentSection = Math.min(Math.floor(progress * SECTIONS.length), SECTIONS.length - 1);

  return (
    <div className="relative w-full min-h-screen">
      {/* Scroll space */}
      {!isMobile && <div className="h-[500vh]" />}

      {/* Canvas */}
      <div className="fixed inset-0">
        <Canvas
          shadows={!isMobile}
          dpr={isMobile ? 1 : Math.min(2, window.devicePixelRatio)}
          gl={{ antialias: !isMobile, alpha: false }}
          camera={{ position: [0, 0, 15], fov: 60 }}
        >
          <Suspense fallback={null}>
            <SceneContent progress={progress} isMobile={isMobile} />
          </Suspense>
        </Canvas>
      </div>

      {/* UI */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
        <p className="text-muted-foreground text-sm font-mono animate-pulse">
          {isMobile ? 'Swipe to explore' : 'Scroll to explore'}
        </p>
      </div>

      {!isMobile && (
        <div className="fixed right-8 top-1/2 -translate-y-1/2 z-40 space-y-4">
          {SECTIONS.map((label, i) => (
            <div
              key={label}
              className={`text-xs font-mono uppercase tracking-wider transition-all duration-300 ${
                currentSection === i ? 'text-primary scale-110' : 'text-muted-foreground opacity-50'
              }`}
            >
              {label}
            </div>
          ))}
        </div>
      )}

      {isMobile && (
        <div className="fixed bottom-4 left-4 right-4 z-40">
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all" style={{ width: `${progress * 100}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}
