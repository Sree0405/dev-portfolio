/**
 * HERO ZONE
 * Central sphere with animated rings and name
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';

export function HeroZone() {
  const groupRef = useRef<THREE.Group>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (sphereRef.current) {
      sphereRef.current.rotation.y = t * 0.1;
      sphereRef.current.rotation.x = Math.sin(t * 0.2) * 0.1;
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * 0.3;
      ring1Ref.current.rotation.z = t * 0.2;
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = t * 0.25;
      ring2Ref.current.rotation.z = -t * 0.15;
    }

    if (ring3Ref.current) {
      ring3Ref.current.rotation.x = -t * 0.2;
      ring3Ref.current.rotation.y = t * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Central sphere */}
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
        <mesh ref={sphereRef}>
          <icosahedronGeometry args={[2, 1]} />
          <meshStandardMaterial
            color="#7f5af0"
            emissive="#7f5af0"
            emissiveIntensity={0.3}
            wireframe
            transparent
            opacity={0.9}
          />
        </mesh>
      </Float>

      {/* Orbital rings */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[3.5, 0.02, 16, 100]} />
        <meshBasicMaterial color="#7f5af0" transparent opacity={0.6} />
      </mesh>

      <mesh ref={ring2Ref}>
        <torusGeometry args={[4.2, 0.015, 16, 100]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.4} />
      </mesh>

      <mesh ref={ring3Ref}>
        <torusGeometry args={[5, 0.01, 16, 100]} />
        <meshBasicMaterial color="#ff6b9d" transparent opacity={0.3} />
      </mesh>

      {/* Name */}
      <Text
        position={[0, -2.5, 0]}
        fontSize={0.8}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.15}
      >
        SREEKANTH
      </Text>

      <Text
        position={[0, -3.3, 0]}
        fontSize={0.25}
        color="#888888"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.3}
      >
        CREATIVE DEVELOPER
      </Text>

      {/* Floor grid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
        <planeGeometry args={[40, 40, 40, 40]} />
        <meshBasicMaterial
          color="#7f5af0"
          wireframe
          transparent
          opacity={0.08}
        />
      </mesh>
    </group>
  );
}
