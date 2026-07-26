import { useQuery } from "@tanstack/react-query";
import { api } from "@/app/lib/api";

export function useAuth() {
  const query = useQuery({
    queryKey: ["auth", "me"],
    queryFn: api.me,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const user = query.data?.user;
  const features = query.data?.features;
  const isDemo = user?.role === "demo";
  const isAdmin = user?.role === "admin";
  const canDelete = !isDemo;
  const canWriteCompanies = !isDemo && (features?.jobTracker ?? false);
  const isJobTrackerEnabled = features?.jobTracker ?? false;

  return {
    ...query,
    user,
    features,
    isDemo,
    isAdmin,
    canDelete,
    canWriteCompanies,
    isJobTrackerEnabled,
  };
}
