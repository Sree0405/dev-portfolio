import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface AboutZoneProps {
  position: [number, number, number];
}

function OrbitingShape({ radius, speed, offset, color }: any) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime() * speed + offset;
      meshRef.current.position.x = Math.cos(time) * radius;
      meshRef.current.position.z = Math.sin(time) * radius;
      meshRef.current.rotation.x = time * 0.5;
      meshRef.current.rotation.y = time * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} castShadow>
        <octahedronGeometry args={[0.5, 0]} />
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

function HologramName() {
  const textRef = useRef<any>(null);
  
  useFrame((state) => {
    if (textRef.current) {
      textRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.2;
    }
  });

  return (
    <group ref={textRef}>
      <Text
        fontSize={1.5}
        color="#7f5af0"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#00eaff"
      >
        SREEKANTH
      </Text>
      
      {/* Hologram scanlines effect */}
      <mesh position={[0, 0, -0.1]}>
        <planeGeometry args={[8, 2]} />
        <meshBasicMaterial
          color="#7f5af0"
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

function NeonFloorGrid() {
  const gridRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (gridRef.current) {
      (gridRef.current.material as THREE.Material).opacity = 
        0.3 + Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
    }
  });

  return (
    <mesh ref={gridRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
      <planeGeometry args={[30, 30, 30, 30]} />
      <meshBasicMaterial
        color="#7f5af0"
        wireframe
        transparent
        opacity={0.3}
      />
    </mesh>
  );
}

export default function AboutZone({ position }: AboutZoneProps) {
  return (
    <group position={position}>
      {/* Holographic name */}
      <HologramName />
      
      {/* Orbiting abstract shapes */}
      <OrbitingShape radius={4} speed={0.5} offset={0} color="#7f5af0" />
      <OrbitingShape radius={5} speed={0.3} offset={Math.PI} color="#00eaff" />
      <OrbitingShape radius={4.5} speed={0.4} offset={Math.PI / 2} color="#ff00ff" />
      <OrbitingShape radius={3.5} speed={0.6} offset={Math.PI * 1.5} color="#7f5af0" />
      
      {/* Neon floor grid */}
      <NeonFloorGrid />
      
      {/* Subtitle text */}
      <Text
        position={[0, -1.5, 0]}
        fontSize={0.4}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        Web Developer • Three.js Enthusiast
      </Text>
      
      {/* Central glow sphere */}
      <Float speed={1} rotationIntensity={0} floatIntensity={1}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.3, 32, 32]} />
          <MeshDistortMaterial
            color="#7f5af0"
            emissive="#7f5af0"
            emissiveIntensity={1.5}
            distort={0.3}
            speed={2}
            transparent
            opacity={0.8}
          />
        </mesh>
      </Float>
    </group>
  );
}
