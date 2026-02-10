/**
 * CONTACT ZONE
 * Final section with contact info and closing animation
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

export function ContactZone() {
  const sphereRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Generate particles
  const particleCount = 100;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    const radius = 3 + Math.random() * 3;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.cos(phi);
    positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
  }

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (sphereRef.current) {
      sphereRef.current.rotation.y = t * 0.2;
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 0.05;
      particlesRef.current.rotation.x = t * 0.03;
    }
  });

  return (
    <group position={[0, 15, 0]}>
      {/* Section title */}
      <Text
        position={[0, 4, 0]}
        fontSize={0.5}
        color="#ffd700"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.2}
      >
        GET IN TOUCH
      </Text>

      {/* Animated sphere */}
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.4}>
        <mesh ref={sphereRef} position={[0, 0, 0]}>
          <sphereGeometry args={[1.5, 64, 64]} />
          <MeshDistortMaterial
            color="#7f5af0"
            emissive="#7f5af0"
            emissiveIntensity={0.4}
            distort={0.25}
            speed={2}
            transparent
            opacity={0.85}
          />
        </mesh>
      </Float>

      {/* Contact info */}
      <Text
        position={[0, -2.5, 0]}
        fontSize={0.2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        sreekanth04052005@gmail.com
      </Text>

      <Text
        position={[0, -3, 0]}
        fontSize={0.15}
        color="#888888"
        anchorX="center"
        anchorY="middle"
      >
        Available for freelance & collaboration
      </Text>

      {/* Floating particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.04}
          color="#7f5af0"
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>

      {/* Orbital rings */}
      <mesh rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[2.5, 0.01, 16, 100]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.3} />
      </mesh>

      <mesh rotation={[Math.PI / 6, Math.PI / 4, 0]}>
        <torusGeometry args={[3, 0.01, 16, 100]} />
        <meshBasicMaterial color="#ff6b9d" transparent opacity={0.2} />
      </mesh>
    </group>
  );
}
