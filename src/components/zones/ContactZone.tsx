import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Html, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

interface ContactZoneProps {
  position: [number, number, number];
}

function OrbitingOrb({ 
  radius, 
  speed, 
  offset, 
  color 
}: { 
  radius: number; 
  speed: number; 
  offset: number;
  color: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.getElapsedTime() * speed + offset;
    meshRef.current.position.x = Math.cos(time) * radius;
    meshRef.current.position.y = Math.sin(time * 0.7) * (radius * 0.5);
    meshRef.current.position.z = Math.sin(time) * radius;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.2, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.5}
      />
      <pointLight color={color} intensity={1} distance={3} />
    </mesh>
  );
}

function HologramPanel() {
  const panelRef = useRef<THREE.Group>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  
  useFrame((state) => {
    if (!panelRef.current) return;
    
    // Gentle floating
    panelRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.2;
    
    // Follow cursor slightly
    panelRef.current.rotation.y = cursorPos.x * 0.1;
    panelRef.current.rotation.x = -cursorPos.y * 0.1;
  });
  
  const handleMouseMove = (e: MouseEvent) => {
    setCursorPos({
      x: (e.clientX / window.innerWidth) * 2 - 1,
      y: (e.clientY / window.innerHeight) * 2 - 1,
    });
  };
  
  useState(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  });

  return (
    <group ref={panelRef}>
      {/* Main panel */}
      <RoundedBox
        args={[6, 8, 0.3]}
        radius={0.2}
        smoothness={4}
      >
        <meshPhysicalMaterial
          color="#1a1a1a"
          emissive="#7f5af0"
          emissiveIntensity={0.2}
          metalness={0.9}
          roughness={0.1}
          transmission={0.7}
          thickness={1}
          transparent
          opacity={0.6}
        />
      </RoundedBox>
      
      {/* Holographic scanlines */}
      <mesh position={[0, 0, 0.2]}>
        <planeGeometry args={[6, 8, 1, 20]} />
        <meshBasicMaterial
          color="#7f5af0"
          transparent
          opacity={0.1}
          wireframe
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Contact form HTML overlay */}
      <Html
        center
        distanceFactor={8}
        position={[0, 0, 0.3]}
        style={{ width: '400px' }}
      >
        <div className="glass-panel p-6">
          <h2 className="text-2xl font-bold neon-text mb-6 text-center">
            GET IN TOUCH
          </h2>
          
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <input
                type="text"
                placeholder="Your Name"
                className="w-full bg-background/50 border border-primary/30 rounded px-4 py-2 text-foreground focus:border-primary focus:outline-none transition-all"
              />
            </div>
            
            <div>
              <input
                type="email"
                placeholder="Your Email"
                className="w-full bg-background/50 border border-primary/30 rounded px-4 py-2 text-foreground focus:border-primary focus:outline-none transition-all"
              />
            </div>
            
            <div>
              <textarea
                placeholder="Your Message"
                rows={4}
                className="w-full bg-background/50 border border-primary/30 rounded px-4 py-2 text-foreground focus:border-primary focus:outline-none transition-all resize-none"
              />
            </div>
            
            <button
              type="submit"
              className="w-full cyber-button py-3"
            >
              Send Message
            </button>
          </form>
          
          <div className="mt-6 pt-6 border-t border-primary/20 text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              <span className="text-primary">Email:</span> sreekanth@example.com
            </p>
            <p className="text-sm text-muted-foreground">
              <span className="text-primary">Location:</span> India
            </p>
          </div>
        </div>
      </Html>
      
      {/* Corner accents */}
      {[
        [-2.8, 3.8, 0.2],
        [2.8, 3.8, 0.2],
        [-2.8, -3.8, 0.2],
        [2.8, -3.8, 0.2],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <boxGeometry args={[0.3, 0.3, 0.1]} />
          <meshStandardMaterial
            color="#00eaff"
            emissive="#00eaff"
            emissiveIntensity={1}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function ContactZone({ position }: ContactZoneProps) {
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
        CONTACT
      </Text>
      
      {/* Holographic panel */}
      <HologramPanel />
      
      {/* Orbiting orbs */}
      <OrbitingOrb radius={5} speed={0.5} offset={0} color="#7f5af0" />
      <OrbitingOrb radius={5} speed={0.4} offset={Math.PI / 2} color="#00eaff" />
      <OrbitingOrb radius={5} speed={0.6} offset={Math.PI} color="#ff00ff" />
      <OrbitingOrb radius={5} speed={0.3} offset={Math.PI * 1.5} color="#00ff88" />
      
      {/* Ambient particles */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={200}
            array={new Float32Array(
              Array.from({ length: 600 }, () => (Math.random() - 0.5) * 20)
            )}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color="#7f5af0"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
