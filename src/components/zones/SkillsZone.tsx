import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';

interface SkillsZoneProps {
  position: [number, number, number];
}

const skills = [
  { name: 'React', color: '#61dafb' },
  { name: 'Three.js', color: '#7f5af0' },
  { name: 'JavaScript', color: '#f7df1e' },
  { name: 'TypeScript', color: '#3178c6' },
  { name: 'PHP', color: '#777bb4' },
  { name: 'MySQL', color: '#00758f' },
  { name: 'WordPress', color: '#21759b' },
  { name: 'GSAP', color: '#88ce02' },
  { name: 'HTML5', color: '#e34f26' },
  { name: 'CSS3', color: '#1572b6' },
];

function SkillNode({ 
  skill, 
  position, 
  index 
}: { 
  skill: typeof skills[0]; 
  position: [number, number, number];
  index: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    if (!hovered) {
      // Orbital motion
      const radius = 6;
      const speed = 0.3;
      const offset = (index / skills.length) * Math.PI * 2;
      
      meshRef.current.position.x = Math.cos(time * speed + offset) * radius;
      meshRef.current.position.y = Math.sin(time * speed + offset) * radius;
      meshRef.current.position.z = Math.sin(time * speed * 0.5 + offset) * 3;
    }
    
    // Gentle rotation
    meshRef.current.rotation.y = time * 0.5;
  });

  return (
    <group>
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={hovered ? 2 : 0.5}>
        <mesh
          ref={meshRef}
          position={position}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          scale={hovered ? 1.5 : 1}
        >
          <icosahedronGeometry args={[0.4, 0]} />
          <meshStandardMaterial
            color={skill.color}
            emissive={skill.color}
            emissiveIntensity={hovered ? 1 : 0.5}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        
        <Text
          position={[0, -0.8, 0]}
          fontSize={0.25}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {skill.name}
        </Text>
      </Float>
      
      {/* Glow effect when hovered */}
      {hovered && (
        <pointLight
          position={position}
          color={skill.color}
          intensity={2}
          distance={5}
        />
      )}
    </group>
  );
}

function ConnectingLines() {
  const linesRef = useRef<THREE.LineSegments>(null);
  
  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    }
  });

  const points: number[] = [];
  const connections = 20;
  
  for (let i = 0; i < connections; i++) {
    const angle1 = (i / connections) * Math.PI * 2;
    const angle2 = ((i + 1) / connections) * Math.PI * 2;
    const radius = 6;
    
    points.push(
      Math.cos(angle1) * radius,
      Math.sin(angle1) * radius,
      0,
      Math.cos(angle2) * radius,
      Math.sin(angle2) * radius,
      0
    );
  }

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length / 3}
          array={new Float32Array(points)}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color="#7f5af0"
        transparent
        opacity={0.2}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
}

export default function SkillsZone({ position }: SkillsZoneProps) {
  return (
    <group position={position}>
      {/* Title */}
      <Text
        position={[0, 8, 0]}
        fontSize={1}
        color="#7f5af0"
        anchorX="center"
        anchorY="middle"
      >
        SKILLS MATRIX
      </Text>
      
      {/* Connecting lines */}
      <ConnectingLines />
      
      {/* Skill nodes */}
      {skills.map((skill, index) => (
        <SkillNode
          key={skill.name}
          skill={skill}
          position={[0, 0, 0]}
          index={index}
        />
      ))}
      
      {/* Center core */}
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color="#0d0d0d"
          emissive="#7f5af0"
          emissiveIntensity={0.3}
          wireframe
        />
      </mesh>
    </group>
  );
}
