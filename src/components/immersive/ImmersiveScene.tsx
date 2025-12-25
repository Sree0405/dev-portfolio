/**
 * PREMIUM IMMERSIVE SCENE
 * Main orchestrator for the 3D portfolio experience
 */

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';

// Components
import { useImmersiveState } from './useImmersiveState';
import { CameraController } from './CameraController';
import { Environment } from './Environment';
import { HeroZone } from './HeroZone';
import { AboutZone } from './AboutZone';
import { SkillsZone } from './SkillsZone';
import { ProjectsZone } from './ProjectsZone';
import { ContactZone } from './ContactZone';
import { UIOverlay } from './UIOverlay';

function SceneContent({ progress, isMobile }: { progress: number; isMobile: boolean }) {
  return (
    <>
      <Environment isMobile={isMobile} />
      <CameraController progress={progress} />

      {/* Content zones positioned in 3D space */}
      <HeroZone />
      <AboutZone />
      <SkillsZone />
      <ProjectsZone />
      <ContactZone />
    </>
  );
}

export default function ImmersiveScene() {
  const { progress, currentSection, isMobile, isLoaded, goToSection } = useImmersiveState();

  return (
    <div className="relative w-full min-h-screen">
      {/* Scroll space for desktop */}
      {!isMobile && <div className="h-[600vh]" aria-hidden="true" />}

      {/* WebGL Canvas */}
      <div className="fixed inset-0">
        <Canvas
          shadows={!isMobile}
          dpr={isMobile ? 1 : Math.min(2, window.devicePixelRatio)}
          gl={{
            antialias: !isMobile,
            alpha: false,
            powerPreference: isMobile ? 'low-power' : 'high-performance',
          }}
          camera={{
            position: [0, 0, 12],
            fov: 50,
            near: 0.1,
            far: 100,
          }}
        >
          <Suspense fallback={null}>
            <SceneContent progress={progress} isMobile={isMobile} />
          </Suspense>
        </Canvas>
      </div>

      {/* UI Overlay */}
      <UIOverlay
        progress={progress}
        currentSection={currentSection}
        isMobile={isMobile}
        isLoaded={isLoaded}
        onSectionClick={goToSection}
      />
    </div>
  );
}
