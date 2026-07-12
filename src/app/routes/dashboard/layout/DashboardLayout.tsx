import { Outlet } from "react-router-dom";
import { ProtectedRoute } from "@/app/components/Common/ProtectedRoute";
import { DashboardSidebar } from "@/app/components/Sidebar/DashboardSidebar";
import { DashboardMobileNav } from "@/app/components/Sidebar/DashboardMobileNav";

export default function DashboardLayout() {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-background">
        <div className="hidden md:block">
          <DashboardSidebar />
        </div>
        <div className="flex min-h-screen flex-1 flex-col overflow-x-hidden pb-[calc(3.25rem+env(safe-area-inset-bottom))] md:pb-0">
          <Outlet />
        </div>
        <DashboardMobileNav />
      </div>
    </ProtectedRoute>
  );
}
