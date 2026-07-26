import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Search } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/app/lib/api";
import { useAuth } from "@/app/hooks/useAuth";
import { DEV_UTILITIES, getDevUtility } from "@/app/lib/devUtilities/registry";
import { DevUtilityCard } from "@/app/components/DevUtilities/DevUtilityCard";
import { DashboardHeader } from "@/app/components/Dashboard/DashboardHeader";
import { EmptyState } from "@/app/components/Common/EmptyState";
import { Input } from "@/components/ui/input";

export default function DevUtilitiesHubPage() {
  const queryClient = useQueryClient();
  const { isDemo } = useAuth();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const handleSearchChange = (value: string) => {
    setSearch(value);
    window.clearTimeout((window as unknown as { __devUtilSearchTimer?: number }).__devUtilSearchTimer);
    (window as unknown as { __devUtilSearchTimer?: number }).__devUtilSearchTimer = window.setTimeout(
      () => setDebouncedSearch(value),
      300,
    );
  };

  const { data: preferences, isLoading } = useQuery({
    queryKey: ["dev-utilities", "preferences"],
    queryFn: api.getDevUtilityPreferences,
  });

  const favoriteMutation = useMutation({
    mutationFn: api.toggleDevUtilityFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dev-utilities", "preferences"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const favorites = new Set(preferences?.favorites ?? []);
  const recentIds = preferences?.recent ?? [];

  const filteredUtilities = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();
    if (!query) return DEV_UTILITIES;
    return DEV_UTILITIES.filter(
      (utility) =>
        utility.name.toLowerCase().includes(query) ||
        utility.description.toLowerCase().includes(query) ||
        utility.category.toLowerCase().includes(query) ||
        utility.keywords.some((keyword) => keyword.includes(query)),
    );
  }, [debouncedSearch]);

  const favoriteUtilities = DEV_UTILITIES.filter((utility) => favorites.has(utility.id));
  const recentUtilities = recentIds
    .map((id) => getDevUtility(id))
    .filter((utility): utility is NonNullable<typeof utility> => Boolean(utility));

  return (
    <>
      <DashboardHeader
        title="Dev Utilities"
        description="Small, frequently used developer tools in one place."
      />

      {isDemo && (
        <div className="border-b border-amber-500/20 bg-amber-500/10 px-4 py-2 text-xs text-amber-100 md:px-8">
          Demo mode: all utilities are available. Favorites and recent tools are saved for your demo workspace.
        </div>
      )}

      <div className="space-y-8 px-4 py-6 md:px-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder="Search utilities..."
            className="pl-9"
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {favoriteUtilities.length > 0 && !debouncedSearch ? (
              <section className="space-y-4">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Favorites</h2>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {favoriteUtilities.map((utility) => (
                    <DevUtilityCard
                      key={utility.id}
                      utility={utility}
                      isFavorite
                      onToggleFavorite={(id) => favoriteMutation.mutate(id)}
                    />
                  ))}
                </div>
              </section>
            ) : null}

            {recentUtilities.length > 0 && !debouncedSearch ? (
              <section className="space-y-4">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Recently Used</h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {recentUtilities.map((utility) => (
                    <DevUtilityCard
                      key={utility.id}
                      utility={utility}
                      compact
                      isFavorite={favorites.has(utility.id)}
                      onToggleFavorite={(id) => favoriteMutation.mutate(id)}
                    />
                  ))}
                </div>
              </section>
            ) : null}

            <section className="space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">All Utilities</h2>
              {filteredUtilities.length === 0 ? (
                <EmptyState
                  title="No utilities found"
                  description="Try a different search term."
                />
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredUtilities.map((utility) => (
                    <DevUtilityCard
                      key={utility.id}
                      utility={utility}
                      isFavorite={favorites.has(utility.id)}
                      onToggleFavorite={(id) => favoriteMutation.mutate(id)}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </>
  );
}
