import { Canvas, useFrame } from "@react-three/fiber"
import { Float, OrbitControls } from "@react-three/drei"
import { useRef, useMemo } from "react"

function Particles() {

  const ref = useRef()

  const particles = useMemo(() => {

    const arr = []

    for (let i = 0; i < 600; i++) {

      arr.push(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      )

    }

    return new Float32Array(arr)

  }, [])

  useFrame(({ clock }) => {
    ref.current.rotation.y = clock.getElapsedTime() * 0.03
  })

  return (

    <points ref={ref}>

      <bufferGeometry>

        <bufferAttribute
          attach="attributes-position"
          array={particles}
          count={particles.length / 3}
          itemSize={3}
        />

      </bufferGeometry>

      <pointsMaterial
        size={0.03}
        color="#6366f1"
        transparent
        opacity={0.6}
      />

    </points>

  )
}



function Core() {

  const mesh = useRef()

  useFrame(({ clock }) => {
    mesh.current.rotation.y = clock.getElapsedTime() * 0.4
  })

  return (

    <mesh ref={mesh}>

      <sphereGeometry args={[0.5,32,32]} />

      <meshStandardMaterial
        color="#6366f1"
        emissive="#6366f1"
        emissiveIntensity={1.5}
      />

    </mesh>

  )
}



function OrbitNode({ position, color }) {

  return (

    <Float speed={2} rotationIntensity={1} floatIntensity={2}>

      <mesh position={position}>

        <icosahedronGeometry args={[0.3,0]} />

        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
        />

      </mesh>

    </Float>

  )

}



export default function SkillsHeroScene() {

  return (

    <Canvas
      camera={{ position:[0,0,5] }}
      className="absolute inset-0"
    >

      <ambientLight intensity={0.6} />

      <pointLight position={[3,3,3]} intensity={2} />

      {/* Particle field */}

      <Particles />

      {/* Core */}

      <Core />

      {/* Orbit nodes */}

      <OrbitNode position={[-2,1,0]} color="#22c55e" />
      <OrbitNode position={[2,-1,0]} color="#06b6d4" />
      <OrbitNode position={[0,2,0]} color="#a855f7" />

      <OrbitControls
        enableZoom={false}
        autoRotate
        autoRotateSpeed={0.3}
      />

    </Canvas>

  )
}