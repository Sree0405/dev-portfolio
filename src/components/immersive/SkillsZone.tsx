/**
 * SKILLS ZONE
 * Floating skill cubes in orbital arrangement
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';

const SKILLS = [
  { name: 'React', color: '#61dafb' },
  { name: 'TypeScript', color: '#3178c6' },
  { name: 'Three.js', color: '#ffffff' },
  { name: 'Node.js', color: '#68a063' },
  { name: 'Python', color: '#ffd43b' },
  { name: 'AWS', color: '#ff9900' },
];

function SkillCube({ skill, index, total }: { skill: typeof SKILLS[0]; index: number; total: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const angle = (index / total) * Math.PI * 2;
  const radius = 3;

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.elapsedTime;
      meshRef.current.rotation.x = t * 0.5;
      meshRef.current.rotation.y = t * 0.3;
      meshRef.current.position.y = Math.sin(t + index) * 0.2;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <group position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]}>
        <mesh ref={meshRef}>
          <boxGeometry args={[0.6, 0.6, 0.6]} />
          <meshStandardMaterial
            color={skill.color}
            emissive={skill.color}
            emissiveIntensity={0.3}
            wireframe
          />
        </mesh>
        <Text
          position={[0, -0.6, 0]}
          fontSize={0.15}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {skill.name}
        </Text>
      </group>
    </Float>
  );
}

export function SkillsZone() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group position={[0, 5, 0]}>
      {/* Section title */}
      <Text
        position={[0, 2.5, 0]}
        fontSize={0.5}
        color="#7f5af0"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.2}
      >
        SKILLS
      </Text>

      {/* Rotating skill ring */}
      <group ref={groupRef}>
        {SKILLS.map((skill, i) => (
          <SkillCube key={skill.name} skill={skill} index={i} total={SKILLS.length} />
        ))}
      </group>

      {/* Center indicator */}
      <mesh>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial
          color="#7f5af0"
          emissive="#7f5af0"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Connecting lines */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.8, 3.2, 64]} />
        <meshBasicMaterial color="#7f5af0" transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
