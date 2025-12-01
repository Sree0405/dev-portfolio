import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Html, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

interface ProjectsZoneProps {
  position: [number, number, number];
}

const projects = [
  {
    name: 'Flixify',
    description: 'Netflix-style streaming platform with custom WordPress theme',
    tech: ['WordPress', 'React', 'REST API', 'MySQL'],
    color: '#e50914',
  },
  {
    name: 'Student DB System',
    description: 'Full-stack CRUD application with Java and MySQL',
    tech: ['Java', 'JDBC', 'MySQL', 'HTML/CSS'],
    color: '#007acc',
  },
  {
    name: 'Interior Design Website',
    description: 'Professional showcase for 5 Star Interior Work & Design',
    tech: ['HTML', 'CSS', 'JS', 'PHP'],
    color: '#ff9800',
  },
  {
    name: '3D Portfolio',
    description: 'Immersive Three.js portfolio with scroll-driven animations',
    tech: ['Three.js', 'React', 'GSAP', 'TypeScript'],
    color: '#7f5af0',
  },
];

function ProjectCard({ 
  project, 
  index, 
  total 
}: { 
  project: typeof projects[0]; 
  index: number;
  total: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (!groupRef.current) return;
    
    const spacing = 6;
    const baseX = (index - total / 2) * spacing;
    
    groupRef.current.position.x = baseX;
    groupRef.current.position.z = hovered ? 2 : 0;
    
    // Gentle floating
    groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() + index) * 0.3;
  });

  return (
    <group 
      ref={groupRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Glass card */}
      <RoundedBox
        args={[3, 4, 0.2]}
        radius={0.1}
        smoothness={4}
        scale={hovered ? 1.1 : 1}
      >
        <meshPhysicalMaterial
          color={project.color}
          emissive={project.color}
          emissiveIntensity={hovered ? 0.5 : 0.2}
          metalness={0.9}
          roughness={0.1}
          transmission={0.5}
          thickness={0.5}
          transparent
          opacity={0.8}
        />
      </RoundedBox>
      
      {/* Project info */}
      <Html
        center
        distanceFactor={6}
        position={[0, 0, 0.3]}
        style={{ pointerEvents: 'none' }}
      >
        <div className="text-center max-w-[200px]">
          <h3 className="text-lg font-bold text-white mb-2">{project.name}</h3>
          <p className="text-xs text-white/80 mb-3">{project.description}</p>
          {hovered && (
            <div className="flex flex-wrap gap-1 justify-center">
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="text-[10px] px-2 py-1 rounded-full"
                  style={{ 
                    backgroundColor: `${project.color}40`,
                    color: 'white'
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
      </Html>
      
      {/* Neon edge glow */}
      {hovered && (
        <>
          <pointLight
            position={[0, 0, 1]}
            color={project.color}
            intensity={2}
            distance={5}
          />
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[3.2, 4.2, 0.1]} />
            <meshBasicMaterial
              color={project.color}
              transparent
              opacity={0.3}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </>
      )}
    </group>
  );
}

function CarouselRail() {
  return (
    <group>
      {/* Top rail */}
      <mesh position={[0, 2.5, -1]}>
        <cylinderGeometry args={[0.05, 0.05, 30, 8]} />
        <meshStandardMaterial
          color="#7f5af0"
          emissive="#7f5af0"
          emissiveIntensity={0.5}
        />
      </mesh>
      
      {/* Bottom rail */}
      <mesh position={[0, -2.5, -1]}>
        <cylinderGeometry args={[0.05, 0.05, 30, 8]} />
        <meshStandardMaterial
          color="#7f5af0"
          emissive="#7f5af0"
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
}

export default function ProjectsZone({ position }: ProjectsZoneProps) {
  const particlesRef = useRef<THREE.Points>(null);
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.z = state.clock.getElapsedTime() * 0.05;
    }
  });

  // Background particles
  const particleCount = 500;
  const particlePositions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    particlePositions[i * 3] = (Math.random() - 0.5) * 40;
    particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5;
  }

  return (
    <group position={position}>
      {/* Title */}
      <Text
        position={[0, 6, 0]}
        fontSize={1}
        color="#7f5af0"
        anchorX="center"
        anchorY="middle"
      >
        PROJECTS
      </Text>
      
      {/* Carousel rail */}
      <CarouselRail />
      
      {/* Project cards */}
      {projects.map((project, index) => (
        <ProjectCard
          key={project.name}
          project={project}
          index={index}
          total={projects.length}
        />
      ))}
      
      {/* Background particles */}
      <points ref={particlesRef} position={[0, 0, -5]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color="#7f5af0"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
