/**
 * SCENE ENVIRONMENT
 * Atmosphere, lighting, and ambient effects
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Environment({ isMobile }: { isMobile: boolean }) {
  return (
    <>
      {/* Dark space background */}
      <color attach="background" args={['#050510']} />
      <fog attach="fog" args={['#050510', 8, 50]} />

      {/* Ambient fill */}
      <ambientLight intensity={0.15} color="#ffffff" />

      {/* Key light - warm */}
      <directionalLight
        position={[10, 15, 10]}
        intensity={0.4}
        color="#ffeedd"
      />

      {/* Fill light - cool */}
      <directionalLight
        position={[-10, 10, -5]}
        intensity={0.2}
        color="#aaccff"
      />

      {/* Accent lights */}
      <pointLight position={[5, 0, 5]} intensity={0.5} color="#7f5af0" distance={15} />
      <pointLight position={[-5, 5, -5]} intensity={0.3} color="#00d4ff" distance={12} />

      {/* Particles */}
      <StarField count={isMobile ? 200 : 500} />
    </>
  );
}

function StarField({ count }: { count: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const radius = 20 + Math.random() * 30;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.cos(phi);
    positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    sizes[i] = 0.5 + Math.random() * 1.5;
  }

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.01;
      pointsRef.current.rotation.x = state.clock.elapsedTime * 0.005;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#ffffff"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}
