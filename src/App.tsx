import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense, useEffect, type ReactNode } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import NormalLayout from "./layouts/NormalLayout";

const Home = lazy(() => import("./pages/Home"));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage"));
const SkillsPage = lazy(() => import("./pages/SkillsPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const ExperiencePage = lazy(() => import("./pages/ExperiencePage"));
const ThemeExplorerPage = lazy(() => import("./pages/ThemeExplorerPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Fieldstack = lazy(() => import("./pages/Fieldstack.tsx"));
const LifeAdmin = lazy(() => import("./pages/LifeAdmin.tsx"));
const SreeDevToolPage = lazy(() => import("./pages/SreeDevTool"));
const PublicResume = lazy(() => import("./pages/PublicResume"));

const LoginPage = lazy(() => import("./app/routes/login/LoginPage"));
const SignupPage = lazy(() => import("./app/routes/signup/SignupPage"));
const DashboardLayout = lazy(
  () => import("./app/routes/dashboard/layout/DashboardLayout"),
);
const DashboardPage = lazy(() => import("./app/routes/dashboard/DashboardPage"));
const DashboardProjectsPage = lazy(
  () => import("./app/routes/dashboard/projects/ProjectsPage"),
);
const ProjectDetailsPage = lazy(
  () => import("./app/routes/dashboard/projects/ProjectDetailsPage"),
);
const CredentialsPage = lazy(
  () => import("./app/routes/dashboard/credentials/CredentialsPage"),
);
const FinanceLayout = lazy(
  () => import("./app/routes/dashboard/finance/layout/FinanceLayout"),
);
const FinanceOverviewPage = lazy(
  () => import("./app/routes/dashboard/finance/FinanceOverviewPage"),
);
const EmiPage = lazy(() => import("./app/routes/dashboard/finance/EmiPage"));
const RentPage = lazy(() => import("./app/routes/dashboard/finance/RentPage"));
const SubscriptionsPage = lazy(
  () => import("./app/routes/dashboard/finance/SubscriptionsPage"),
);
const FinanceRecordDetailPage = lazy(
  () => import("./app/routes/dashboard/finance/FinanceRecordDetailPage"),
);
const BudgetPlannerPage = lazy(
  () => import("./app/routes/dashboard/budget/BudgetPlannerPage"),
);
const ResumesPage = lazy(
  () => import("./app/routes/dashboard/resume/ResumesPage"),
);
const ResumeEditorPage = lazy(
  () => import("./app/routes/dashboard/resume/ResumeEditorPage"),
);
const DevUtilitiesHubPage = lazy(
  () => import("./app/routes/dashboard/devUtilities/DevUtilitiesHubPage"),
);
const DevUtilityPage = lazy(
  () => import("./app/routes/dashboard/devUtilities/DevUtilityPage"),
);
const DeveloperPlaygroundPage = lazy(
  () => import("./app/routes/dashboard/playground/DeveloperPlaygroundPage"),
);
const FormsPage = lazy(() => import("./app/routes/dashboard/forms/FormsPage"));
const ReviewsPage = lazy(
  () => import("./app/routes/dashboard/reviews/ReviewsPage"),
);
const CompaniesPage = lazy(
  () => import("./app/routes/dashboard/companies/CompaniesPage"),
);
const CompanyDetailsPage = lazy(
  () => import("./app/routes/dashboard/companies/CompanyDetailsPage"),
);
const JobStatusPage = lazy(
  () => import("./app/routes/dashboard/jobTracker/JobStatusPage"),
);
const JobDetailsPage = lazy(
  () => import("./app/routes/dashboard/jobTracker/JobDetailsPage"),
);
const ProfilePage = lazy(
  () => import("./app/routes/dashboard/profile/ProfilePage"),
);
const UsersPage = lazy(() => import("./app/routes/dashboard/users/UsersPage"));

import { JobTrackerFeatureRoute } from "./app/components/Common/JobTrackerFeatureRoute";
import { AdminRoute } from "./app/components/Common/AdminRoute";

const queryClient = new QueryClient();

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}

function RouteFallback() {
  return (
    <div
      className="flex min-h-[40vh] items-center justify-center"
      aria-busy="true"
      aria-label="Loading page"
    >
      <div className="h-8 w-8 animate-pulse rounded-full bg-primary/30" />
    </div>
  );
}

function Lazy({ children }: { children: ReactNode }) {
  return <Suspense fallback={<RouteFallback />}>{children}</Suspense>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<NormalLayout />}>
            <Route
              path="/"
              element={
                <Lazy>
                  <Home />
                </Lazy>
              }
            />
            <Route
              path="/experience"
              element={
                <Lazy>
                  <ExperiencePage />
                </Lazy>
              }
            />
            <Route
              path="/projects"
              element={
                <Lazy>
                  <ProjectsPage />
                </Lazy>
              }
            />
            <Route
              path="/project/fieldstack"
              element={
                <Lazy>
                  <Fieldstack />
                </Lazy>
              }
            />
            <Route
              path="/project/lifeAdmin"
              element={
                <Lazy>
                  <LifeAdmin />
                </Lazy>
              }
            />
            <Route
              path="/project/sree-dev-tool"
              element={
                <Lazy>
                  <SreeDevToolPage />
                </Lazy>
              }
            />
            <Route
              path="/project/devtool"
              element={<Navigate to="/project/sree-dev-tool" replace />}
            />
            <Route
              path="/skills"
              element={
                <Lazy>
                  <SkillsPage />
                </Lazy>
              }
            />
            <Route
              path="/contact"
              element={
                <Lazy>
                  <ContactPage />
                </Lazy>
              }
            />
            <Route
              path="/cv"
              element={
                <Lazy>
                  <PublicResume />
                </Lazy>
              }
            />
            <Route
              path="/theme"
              element={
                <Lazy>
                  <ThemeExplorerPage />
                </Lazy>
              }
            />
          </Route>

          <Route
            path="/login"
            element={
              <Lazy>
                <LoginPage />
              </Lazy>
            }
          />
          <Route
            path="/signup"
            element={
              <Lazy>
                <SignupPage />
              </Lazy>
            }
          />
          <Route
            path="/profile"
            element={<Navigate to="/dashboard/profile" replace />}
          />
          <Route
            path="/dashboard"
            element={
              <Lazy>
                <DashboardLayout />
              </Lazy>
            }
          >
            <Route
              index
              element={
                <Lazy>
                  <DashboardPage />
                </Lazy>
              }
            />
            <Route
              path="projects"
              element={
                <Lazy>
                  <DashboardProjectsPage />
                </Lazy>
              }
            />
            <Route
              path="projects/:id"
              element={
                <Lazy>
                  <ProjectDetailsPage />
                </Lazy>
              }
            />
            <Route
              path="credentials"
              element={
                <Lazy>
                  <CredentialsPage />
                </Lazy>
              }
            />
            <Route
              path="resume"
              element={
                <Lazy>
                  <ResumesPage />
                </Lazy>
              }
            />
            <Route
              path="resume/:id"
              element={
                <Lazy>
                  <ResumeEditorPage />
                </Lazy>
              }
            />
            <Route
              path="dev-utilities"
              element={
                <Lazy>
                  <DevUtilitiesHubPage />
                </Lazy>
              }
            />
            <Route
              path="dev-utilities/:utilityId"
              element={
                <Lazy>
                  <DevUtilityPage />
                </Lazy>
              }
            />
            <Route
              path="playground"
              element={
                <Lazy>
                  <DeveloperPlaygroundPage />
                </Lazy>
              }
            />
            <Route
              path="forms"
              element={
                <Lazy>
                  <FormsPage />
                </Lazy>
              }
            />
            <Route
              path="reviews"
              element={
                <Lazy>
                  <ReviewsPage />
                </Lazy>
              }
            />
            <Route
              path="profile"
              element={
                <Lazy>
                  <ProfilePage />
                </Lazy>
              }
            />
            <Route
              path="users"
              element={
                <AdminRoute>
                  <Lazy>
                    <UsersPage />
                  </Lazy>
                </AdminRoute>
              }
            />
            <Route
              path="companies"
              element={
                <JobTrackerFeatureRoute>
                  <Lazy>
                    <CompaniesPage />
                  </Lazy>
                </JobTrackerFeatureRoute>
              }
            />
            <Route
              path="companies/:companyId"
              element={
                <JobTrackerFeatureRoute>
                  <Lazy>
                    <CompanyDetailsPage />
                  </Lazy>
                </JobTrackerFeatureRoute>
              }
            />
            <Route
              path="job-status"
              element={
                <JobTrackerFeatureRoute>
                  <Lazy>
                    <JobStatusPage />
                  </Lazy>
                </JobTrackerFeatureRoute>
              }
            />
            <Route
              path="job-status/:jobId"
              element={
                <JobTrackerFeatureRoute>
                  <Lazy>
                    <JobDetailsPage />
                  </Lazy>
                </JobTrackerFeatureRoute>
              }
            />
            <Route
              path="budget-planner"
              element={
                <Lazy>
                  <BudgetPlannerPage />
                </Lazy>
              }
            />
            <Route
              path="finance"
              element={
                <Lazy>
                  <FinanceLayout />
                </Lazy>
              }
            >
              <Route
                index
                element={
                  <Lazy>
                    <FinanceOverviewPage />
                  </Lazy>
                }
              />
              <Route
                path="overview"
                element={<Navigate to="/dashboard/finance" replace />}
              />
              <Route
                path="emi"
                element={
                  <Lazy>
                    <EmiPage />
                  </Lazy>
                }
              />
              <Route
                path="emi/:id"
                element={
                  <Lazy>
                    <FinanceRecordDetailPage />
                  </Lazy>
                }
              />
              <Route
                path="rent"
                element={
                  <Lazy>
                    <RentPage />
                  </Lazy>
                }
              />
              <Route
                path="rent/:id"
                element={
                  <Lazy>
                    <FinanceRecordDetailPage />
                  </Lazy>
                }
              />
              <Route
                path="subscriptions"
                element={
                  <Lazy>
                    <SubscriptionsPage />
                  </Lazy>
                }
              />
              <Route
                path="subscriptions/:id"
                element={
                  <Lazy>
                    <FinanceRecordDetailPage />
                  </Lazy>
                }
              />
            </Route>
          </Route>

          <Route
            path="*"
            element={
              <Lazy>
                <NotFound />
              </Lazy>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
