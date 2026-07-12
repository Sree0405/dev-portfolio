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
  const isDemo = user?.role === "demo";
  const isOwner = user?.role === "owner";
  const canDelete = isOwner;

  return {
    ...query,
    user,
    isDemo,
    isOwner,
    canDelete,
  };
}
