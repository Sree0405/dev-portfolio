/**
 * NORMAL LAYOUT
 * - Shared premium canvas + nav; pages stay transparent to show global gradient
 */

import { Outlet } from "react-router-dom";
import Navigation from "@/components/Navigation";

export default function NormalLayout() {
  return (
    <div className="app-canvas">
      <Navigation />
      <main className="min-h-0 pt-0">
        <Outlet />
      </main>
    </div>
  );
}
