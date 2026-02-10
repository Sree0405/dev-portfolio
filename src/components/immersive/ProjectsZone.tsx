/**
 * PROJECTS ZONE
 * Floating project cards in a showcase arrangement
 */


import myuipic from "@/assets/3dui.png";
import My3DUIVideo from "@/assets/videos/my3dui.mp4";

import NetflixImg from "@/assets/netflixImg.png"
import Netflixvideo from "@/assets/videos/netflix.mp4";

import fieldstackimg from "@/assets/Dashboard.png";
import fieldstackvideo from "@/assets/videos/fieldstack.mp4";

import EVPortalPic from "@/assets/evpic.png";
import EVPortalVideo from "@/assets/videos/evportal.mp4";

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { useTexture } from "@react-three/drei";

const projects = [
  {
    title: "My3DUI — 3D Component Library",
    description:
      "An open-source 3D UI system built with React and Three.js.",
    image: myuipic,
    video: My3DUIVideo,
    url: "https://my3dui.vercel.app/",
    gitHub: "https://github.com/Sree0405/my3dui",
    docs: "https://my3dui.vercel.app/docs",
    color: "#4facfe",
  },

  {
    title: "Flixify — Backend Framework Dashboard",
    description:
      "Production-ready headless CMS framework.",
    image: fieldstackimg,
    video: fieldstackvideo,
    url: "https://fieldstack.onrender.com/",
    gitHub: "https://github.com/Sree0405/fieldstack",
    docs: "/project/fieldstack",
    color: "#7f5af0",
  },

  {
    title: "EV Portal — EV Showcase",
    description:
      "Interactive EV platform with 3D visuals.",
    image: EVPortalPic,
    video: EVPortalVideo,
    url: "https://ev-portal.vercel.app/",
    gitHub: "https://github.com/Sree0405/ev-portal",
    docs: "/project/ev-portal",
    color: "#43cea2",
  },

  {
    title: "Netflix Clone — Full Stack App",
    description:
      "Netflix clone with auth and backend.",
          image: NetflixImg,

    video: Netflixvideo,
    url: "https://sree-netflix.vercel.app/",
    gitHub: "https://github.com/Sree0405/netflix-clone",
    docs: "/project/netflix-clone",
    color: "#e50914",
  },
];
function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  // Load project image as texture
  const texture = useTexture(project.image);

  const xOffset = (index - (projects.length - 1) / 2) * 3;

  useFrame((state) => {
    if (!groupRef.current) return;

    const t = state.clock.elapsedTime;

    groupRef.current.position.y =
      Math.sin(t + index * 0.6) * 0.15;

    groupRef.current.rotation.y =
      Math.sin(t * 0.3 + index) * 0.06;
  });

  return (
    <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
      <group ref={groupRef} position={[xOffset, 0, 0]}>

        {/* Card Base */}
        <RoundedBox args={[2.3, 3, 0.15]} radius={0.12}>
          <meshStandardMaterial
            color="#0b0b16"
            roughness={0.4}
            metalness={0.3}
          />
        </RoundedBox>

        {/* Image Panel */}
        <mesh position={[0, 0.3, 0.09]}>
          <planeGeometry args={[2, 1.6]} />

          <meshStandardMaterial
            map={texture}
            roughness={0}
            metalness={0}
          />
        </mesh>

        {/* Accent Bar */}
        <mesh position={[0, 1.25, 0.08]}>
          <boxGeometry args={[2, 0.07, 0.02]} />
          <meshBasicMaterial color={project.color} />
        </mesh>

        {/* Title */}
        <Text
          position={[0, -0.7, 0.1]}
          fontSize={0.16}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.9}
        >
          {project.title}
        </Text>

        {/* Glow */}
        <mesh position={[0, -1.2, 0.1]}>
          <circleGeometry args={[0.25, 32]} />
          <meshBasicMaterial
            color={project.color}
            transparent
            opacity={0.35}
          />
        </mesh>

      </group>
    </Float>
  );
}


export function ProjectsZone() {
  return (
    <group position={[0, 10, 0]}>

      {/* Title */}
      <Text
        position={[0, 3.2, 0]}
        fontSize={0.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.15}
      >
        PROJECTS
      </Text>

      <Text
        position={[0, 2.7, 0]}
        fontSize={0.14}
        color="#888"
        anchorX="center"
        anchorY="middle"
      >
        Selected Work & Experiments
      </Text>

      {/* Cards */}
      {projects.map((project, i) => (
        <ProjectCard
          key={project.title}
          project={project}
          index={i}
        />
      ))}

      {/* Floor */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -2, 0]}
      >
        <planeGeometry args={[14, 10, 12, 12]} />
        <meshBasicMaterial
          color="#7f5af0"
          wireframe
          transparent
          opacity={0.04}
        />
      </mesh>

    </group>
  );
}
