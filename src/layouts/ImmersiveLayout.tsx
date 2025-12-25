/**
 * IMMERSIVE LAYOUT
 * - Used exclusively for /immersive route
 * - Minimal navigation, full-screen 3D experience
 * - Completely isolated from normal page logic
 */

import { Outlet } from 'react-router-dom';
import Navigation from '@/components/Navigation';

export default function ImmersiveLayout() {
  return (
    <>
      <Navigation />
      <Outlet />
    </>
  );
}
