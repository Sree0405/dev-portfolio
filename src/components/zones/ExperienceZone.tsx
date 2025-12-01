import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import * as THREE from 'three';

interface ExperienceZoneProps {
  position: [number, number, number];
}

const experiences = [
  {
    year: '2024 - Present',
    role: 'WordPress Developer',
    company: 'EWall Solutions',
    description: 'Custom CMS solutions, API integrations, theme development',
  },
  {
    year: '2023',
    role: 'Junior Full Stack Trainee',
    company: 'Greens Technology',
    description: 'Java, DBMS, DSA, system design foundations',
  },
  {
    year: '2022 - 2024',
    role: 'Freelance Developer',
    company: 'Independent',
    description: 'Web development, UI/UX design, client projects',
  },
];

function TimelineBlock({ 
  experience, 
  index, 
  total 
}: { 
  experience: typeof experiences[0]; 
  index: number;
  total: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (!groupRef.current) return;
    
    const time = state.clock.getElapsedTime();
    const heightOffset = (index / total) * 15;
    const spiralRadius = 4;
    const angle = (index / total) * Math.PI * 4 + time * 0.1;
    
    groupRef.current.position.x = Math.cos(angle) * spiralRadius;
    groupRef.current.position.y = heightOffset;
    groupRef.current.position.z = Math.sin(angle) * spiralRadius;
    
    // Face camera
    groupRef.current.lookAt(0, heightOffset, 0);
  });

  return (
    <group 
      ref={groupRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Block */}
      <mesh scale={hovered ? 1.2 : 1}>
        <boxGeometry args={[2, 1.5, 0.2]} />
        <meshStandardMaterial
          color={hovered ? '#7f5af0' : '#1a1a1a'}
          emissive="#7f5af0"
          emissiveIntensity={hovered ? 0.5 : 0.1}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Holographic projection when hovered */}
      {hovered && (
        <Html
          center
          distanceFactor={8}
          position={[0, 0, 0.5]}
        >
          <div className="glass-panel p-4 min-w-[300px]">
            <p className="text-xs text-primary font-mono mb-1">{experience.year}</p>
            <h3 className="text-lg font-bold text-foreground mb-1">{experience.role}</h3>
            <p className="text-sm text-accent mb-2">{experience.company}</p>
            <p className="text-xs text-muted-foreground">{experience.description}</p>
          </div>
        </Html>
      )}
      
      {/* Connecting beam */}
      <mesh position={[0, -0.75, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 1.5, 8]} />
        <meshBasicMaterial
          color="#7f5af0"
          transparent
          opacity={0.5}
        />
      </mesh>
      
      {/* Node marker */}
      <mesh position={[0, -1.5, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial
          color="#00eaff"
          emissive="#00eaff"
          emissiveIntensity={1}
        />
      </mesh>
    </group>
  );
}

function SpiralHelix() {
  const points: THREE.Vector3[] = [];
  const spiralHeight = 20;
  const spiralRadius = 4;
  const turns = 4;
  const segments = 100;
  
  for (let i = 0; i < segments; i++) {
    const t = i / segments;
    const angle = t * Math.PI * 2 * turns;
    const y = t * spiralHeight;
    const x = Math.cos(angle) * spiralRadius;
    const z = Math.sin(angle) * spiralRadius;
    points.push(new THREE.Vector3(x, y, z));
  }
  
  const curve = new THREE.CatmullRomCurve3(points);
  const helixPoints = curve.getPoints(200);

  return (
    <mesh>
      <tubeGeometry args={[curve, 200, 0.02, 8, false]} />
      <meshBasicMaterial
        color="#7f5af0"
        transparent
        opacity={0.3}
      />
    </mesh>
  );
}

import { useState } from 'react';

export default function ExperienceZone({ position }: ExperienceZoneProps) {
  return (
    <group position={position}>
      {/* Title */}
      <Text
        position={[0, 16, 0]}
        fontSize={1}
        color="#7f5af0"
        anchorX="center"
        anchorY="middle"
      >
        EXPERIENCE
      </Text>
      
      {/* Spiral helix guide */}
      <SpiralHelix />
      
      {/* Timeline blocks */}
      {experiences.map((exp, index) => (
        <TimelineBlock
          key={index}
          experience={exp}
          index={index}
          total={experiences.length}
        />
      ))}
      
      {/* Central axis */}
      <mesh position={[0, 7.5, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 15, 8]} />
        <meshBasicMaterial
          color="#7f5af0"
          transparent
          opacity={0.2}
        />
      </mesh>
    </group>
  );
}
