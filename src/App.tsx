import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import ProjectDocumentation from "./pages/apiDocs";
// Layouts
import NormalLayout from "./layouts/NormalLayout";

// Pages
import Home from "./pages/Home";
import ProjectsPage from "./pages/ProjectsPage";
import SkillsPage from "./pages/SkillsPage";
import ContactPage from "./pages/ContactPage";
import ExperiencePage from "./pages/ExperiencePage";
import NotFound from "./pages/NotFound";

import Fieldstack from "./pages/Fieldstack.tsx";
import LifeAdmin from "./pages/LifeAdmin.tsx";

const SreeDevToolPage = lazy(() => import("./pages/SreeDevTool"));

// Dashboard
import LoginPage from "./app/routes/login/LoginPage";
import DashboardLayout from "./app/routes/dashboard/layout/DashboardLayout";
import DashboardPage from "./app/routes/dashboard/DashboardPage";
import DashboardProjectsPage from "./app/routes/dashboard/projects/ProjectsPage";
import ProjectDetailsPage from "./app/routes/dashboard/projects/ProjectDetailsPage";
import CredentialsPage from "./app/routes/dashboard/credentials/CredentialsPage";
import FinanceLayout from "./app/routes/dashboard/finance/layout/FinanceLayout";
import FinanceOverviewPage from "./app/routes/dashboard/finance/FinanceOverviewPage";
import EmiPage from "./app/routes/dashboard/finance/EmiPage";
import RentPage from "./app/routes/dashboard/finance/RentPage";
import SubscriptionsPage from "./app/routes/dashboard/finance/SubscriptionsPage";
import FinanceRecordDetailPage from "./app/routes/dashboard/finance/FinanceRecordDetailPage";
import BudgetPlannerPage from "./app/routes/dashboard/budget/BudgetPlannerPage";
import ResumesPage from "./app/routes/dashboard/resume/ResumesPage";
import ResumeEditorPage from "./app/routes/dashboard/resume/ResumeEditorPage";
import DevUtilitiesHubPage from "./app/routes/dashboard/devUtilities/DevUtilitiesHubPage";
import DevUtilityPage from "./app/routes/dashboard/devUtilities/DevUtilityPage";
import DeveloperPlaygroundPage from "./app/routes/dashboard/playground/DeveloperPlaygroundPage";

const queryClient = new QueryClient();

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Immersive Layout - Isolated 3D experience */}


          {/* Normal Layout - Standard pages with full navigation */}
          <Route element={<NormalLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/experience" element={<ExperiencePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/project/fieldstack" element={<Fieldstack />} />
            <Route path="/project/lifeAdmin" element={<LifeAdmin />} />
            <Route path="/project/sree-dev-tool" element={
              <Suspense fallback={null}>
                <SreeDevToolPage />
              </Suspense>
            } />
            <Route path="/project/devtool" element={<Navigate to="/project/sree-dev-tool" replace />} />            
            <Route path="/skills" element={<SkillsPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>

          {/* Project Management Dashboard */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="projects" element={<DashboardProjectsPage />} />
            <Route path="projects/:id" element={<ProjectDetailsPage />} />
            <Route path="credentials" element={<CredentialsPage />} />
            <Route path="resume" element={<ResumesPage />} />
            <Route path="resume/:id" element={<ResumeEditorPage />} />
            <Route path="dev-utilities" element={<DevUtilitiesHubPage />} />
            <Route path="dev-utilities/:utilityId" element={<DevUtilityPage />} />
            <Route path="playground" element={<DeveloperPlaygroundPage />} />
            <Route path="budget-planner" element={<BudgetPlannerPage />} />
            <Route path="finance" element={<FinanceLayout />}>
              <Route index element={<FinanceOverviewPage />} />
              <Route path="overview" element={<Navigate to="/dashboard/finance" replace />} />
              <Route path="emi" element={<EmiPage />} />
              <Route path="emi/:id" element={<FinanceRecordDetailPage />} />
              <Route path="rent" element={<RentPage />} />
              <Route path="rent/:id" element={<FinanceRecordDetailPage />} />
              <Route path="subscriptions" element={<SubscriptionsPage />} />
              <Route path="subscriptions/:id" element={<FinanceRecordDetailPage />} />
            </Route>
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
