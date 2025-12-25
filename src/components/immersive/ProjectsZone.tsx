/**
 * PROJECTS ZONE
 * Floating project cards in a showcase arrangement
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

const PROJECTS = [
  { name: 'Portfolio 3D', desc: 'Immersive WebGL', color: '#7f5af0' },
  { name: 'Dashboard', desc: 'React Analytics', color: '#00d4ff' },
  { name: 'E-Commerce', desc: 'Full Stack App', color: '#ff6b9d' },
];

function ProjectCard({ project, index }: { project: typeof PROJECTS[0]; index: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const xOffset = (index - 1) * 3;

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.elapsedTime;
      groupRef.current.position.y = Math.sin(t + index * 0.5) * 0.15;
      groupRef.current.rotation.y = Math.sin(t * 0.3 + index) * 0.05;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.2}>
      <group ref={groupRef} position={[xOffset, 0, 0]}>
        <RoundedBox args={[2, 2.5, 0.15]} radius={0.1}>
          <meshStandardMaterial
            color="#0d0d1a"
            emissive={project.color}
            emissiveIntensity={0.08}
            transparent
            opacity={0.95}
          />
        </RoundedBox>

        {/* Accent bar */}
        <mesh position={[0, 1.05, 0.1]}>
          <boxGeometry args={[1.8, 0.08, 0.02]} />
          <meshBasicMaterial color={project.color} />
        </mesh>

        <Text
          position={[0, 0.3, 0.1]}
          fontSize={0.2}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {project.name}
        </Text>

        <Text
          position={[0, -0.1, 0.1]}
          fontSize={0.12}
          color="#888888"
          anchorX="center"
          anchorY="middle"
        >
          {project.desc}
        </Text>

        {/* Icon placeholder */}
        <mesh position={[0, -0.6, 0.1]}>
          <circleGeometry args={[0.25, 32]} />
          <meshBasicMaterial color={project.color} transparent opacity={0.3} />
        </mesh>
      </group>
    </Float>
  );
}

export function ProjectsZone() {
  return (
    <group position={[0, 10, 0]}>
      {/* Section title */}
      <Text
        position={[0, 3, 0]}
        fontSize={0.5}
        color="#ff6b9d"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.2}
      >
        PROJECTS
      </Text>

      {/* Project cards */}
      {PROJECTS.map((project, i) => (
        <ProjectCard key={project.name} project={project} index={i} />
      ))}

      {/* Decorative elements */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <planeGeometry args={[12, 8, 12, 8]} />
        <meshBasicMaterial color="#7f5af0" wireframe transparent opacity={0.05} />
      </mesh>
    </group>
  );
}
