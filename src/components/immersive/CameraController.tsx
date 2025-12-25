/**
 * CAMERA CONTROLLER
 * Smooth interpolated camera movement along section path
 */

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { SECTIONS } from './types';

interface CameraControllerProps {
  progress: number;
}

export function CameraController({ progress }: CameraControllerProps) {
  const { camera } = useThree();
  const targetPosition = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3());
  const currentLookAt = useRef(new THREE.Vector3());

  useFrame(() => {
    const t = progress * (SECTIONS.length - 1);
    const index = Math.min(Math.floor(t), SECTIONS.length - 2);
    const alpha = t - index;

    // Smooth easing
    const easedAlpha = alpha * alpha * (3 - 2 * alpha);

    const currentSection = SECTIONS[index];
    const nextSection = SECTIONS[index + 1];

    // Interpolate position
    targetPosition.current.set(
      THREE.MathUtils.lerp(currentSection.camera.position[0], nextSection.camera.position[0], easedAlpha),
      THREE.MathUtils.lerp(currentSection.camera.position[1], nextSection.camera.position[1], easedAlpha),
      THREE.MathUtils.lerp(currentSection.camera.position[2], nextSection.camera.position[2], easedAlpha)
    );

    // Interpolate lookAt
    targetLookAt.current.set(
      THREE.MathUtils.lerp(currentSection.camera.lookAt[0], nextSection.camera.lookAt[0], easedAlpha),
      THREE.MathUtils.lerp(currentSection.camera.lookAt[1], nextSection.camera.lookAt[1], easedAlpha),
      THREE.MathUtils.lerp(currentSection.camera.lookAt[2], nextSection.camera.lookAt[2], easedAlpha)
    );

    // Smooth camera movement
    camera.position.lerp(targetPosition.current, 0.06);
    currentLookAt.current.lerp(targetLookAt.current, 0.06);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
