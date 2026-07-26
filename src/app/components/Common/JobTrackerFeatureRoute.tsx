import { Navigate } from "react-router-dom";
import { useAuth } from "@/app/hooks/useAuth";
import { CardSkeleton } from "@/app/components/Common/LoadingSkeleton";

export function JobTrackerFeatureRoute({ children }: { children: React.ReactNode }) {
  const { isLoading, isJobTrackerEnabled } = useAuth();

  if (isLoading) {
    return (
      <div className="p-8">
        <CardSkeleton />
      </div>
    );
  }

  if (!isJobTrackerEnabled) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
