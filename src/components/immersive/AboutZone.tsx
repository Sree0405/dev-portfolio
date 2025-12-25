/**
 * ABOUT ZONE
 * Floating bio card with decorative elements
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

export function AboutZone() {
  const orbitRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (orbitRef.current) {
      orbitRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group position={[0, 2, 0]}>
      {/* Section title */}
      <Text
        position={[0, 3, 0]}
        fontSize={0.5}
        color="#00d4ff"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.2}
      >
        ABOUT ME
      </Text>

      {/* Central element */}
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.4}>
        <RoundedBox args={[3, 2, 0.1]} radius={0.1} position={[0, 0, 0]}>
          <meshStandardMaterial
            color="#1a1a2e"
            emissive="#7f5af0"
            emissiveIntensity={0.05}
            transparent
            opacity={0.9}
          />
        </RoundedBox>
        <Text
          position={[0, 0.4, 0.1]}
          fontSize={0.18}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          maxWidth={2.5}
        >
          Full-stack developer
        </Text>
        <Text
          position={[0, 0, 0.1]}
          fontSize={0.14}
          color="#aaaaaa"
          anchorX="center"
          anchorY="middle"
          maxWidth={2.5}
        >
          crafting immersive web
        </Text>
        <Text
          position={[0, -0.35, 0.1]}
          fontSize={0.14}
          color="#aaaaaa"
          anchorX="center"
          anchorY="middle"
          maxWidth={2.5}
        >
          experiences with React & Three.js
        </Text>
      </Float>

      {/* Orbiting elements */}
      <group ref={orbitRef}>
        {[0, 1, 2, 3].map((i) => (
          <mesh
            key={i}
            position={[
              Math.cos((i / 4) * Math.PI * 2) * 4,
              Math.sin((i / 4) * Math.PI * 2) * 1,
              Math.sin((i / 4) * Math.PI * 2) * 2,
            ]}
          >
            <octahedronGeometry args={[0.2, 0]} />
            <meshStandardMaterial
              color={['#7f5af0', '#00d4ff', '#ff6b9d', '#ffd700'][i]}
              emissive={['#7f5af0', '#00d4ff', '#ff6b9d', '#ffd700'][i]}
              emissiveIntensity={0.5}
              wireframe
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
