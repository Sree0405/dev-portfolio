/**
 * NORMAL LAYOUT
 * - Used for standard pages (home, about, projects, etc.)
 * - Includes full navigation
 */

import { Outlet } from 'react-router-dom';
import Navigation from '@/components/Navigation';

export default function NormalLayout() {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navigation />
      <main className="pt-20">
        <Outlet />
      </main>
    </div>
  );
}
