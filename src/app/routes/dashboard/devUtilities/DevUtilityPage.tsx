import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Loader2, Star } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/app/lib/api";
import { getDevUtility, isDevUtilityId } from "@/app/lib/devUtilities/registry";
import { DEV_UTILITY_COMPONENTS } from "@/app/components/DevUtilities/utilityComponentMap";
import { DashboardHeader } from "@/app/components/Dashboard/DashboardHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function DevUtilityPage() {
  const { utilityId } = useParams<{ utilityId: string }>();
  const queryClient = useQueryClient();

  if (!utilityId || !isDevUtilityId(utilityId)) {
    return <Navigate to="/dashboard/dev-utilities" replace />;
  }

  const utility = getDevUtility(utilityId);
  if (!utility) {
    return <Navigate to="/dashboard/dev-utilities" replace />;
  }

  const ToolComponent = DEV_UTILITY_COMPONENTS[utilityId];
  const Icon = utility.icon;

  const { data: preferences } = useQuery({
    queryKey: ["dev-utilities", "preferences"],
    queryFn: api.getDevUtilityPreferences,
  });

  const trackMutation = useMutation({
    mutationFn: () => api.trackDevUtilityUse(utilityId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dev-utilities", "preferences"] });
    },
  });

  const favoriteMutation = useMutation({
    mutationFn: () => api.toggleDevUtilityFavorite(utilityId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dev-utilities", "preferences"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  useEffect(() => {
    trackMutation.mutate();
  }, [utilityId]);

  const isFavorite = preferences?.favorites.includes(utilityId) ?? false;

  return (
    <>
      <DashboardHeader
        title={utility.name}
        description={utility.description}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/dashboard/dev-utilities">
                <ArrowLeft className="mr-1.5 h-4 w-4" />
                All Utilities
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => favoriteMutation.mutate()}
              disabled={favoriteMutation.isPending}
            >
              <Star className={cn("mr-1.5 h-4 w-4", isFavorite && "fill-amber-400 text-amber-400")} />
              {isFavorite ? "Favorited" : "Favorite"}
            </Button>
            <Badge variant="outline">{utility.category}</Badge>
          </div>
        }
      />

      <div className="px-4 py-6 md:px-8">
        <div className="rounded-2xl border border-border/60 bg-card/40 p-4 backdrop-blur-sm md:p-6">
          <div className="mb-6 flex items-center gap-3 border-b border-border/50 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">{utility.name}</h2>
              <p className="text-sm text-muted-foreground">{utility.description}</p>
            </div>
          </div>

          {trackMutation.isPending && !preferences ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <ToolComponent />
          )}
        </div>
      </div>
    </>
  );
}
