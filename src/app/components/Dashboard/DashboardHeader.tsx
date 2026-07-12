import { LogOut } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { api } from "@/app/lib/api";
import { useAuth } from "@/app/hooks/useAuth";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function DashboardHeader({ title, description, actions }: DashboardHeaderProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const roleLabel =
    user?.role === "demo" ? "Demo User" : user?.role === "owner" ? "Owner" : "Administrator";

  const logoutMutation = useMutation({
    mutationFn: api.logout,
    onSuccess: () => {
      queryClient.clear();
      toast.success("Logged out successfully");
      navigate("/login");
    },
    onError: () => {
      toast.error("Failed to logout");
    },
  });

  return (
    <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="space-y-2 px-4 py-2.5 md:space-y-4 md:px-8 md:py-4">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-base font-semibold text-foreground md:text-xl">{title}</h2>
            {description && (
              <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground md:line-clamp-2 md:text-sm">
                {description}
              </p>
            )}
          </div>

          <div className="hidden shrink-0 items-center gap-3 md:flex">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{user?.username}</p>
              <p className="text-xs text-muted-foreground">{roleLabel}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 shrink-0 md:hidden"
            aria-label="Logout"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>

        {actions && (
          <div className="flex flex-wrap items-center gap-1.5 [&_button]:text-xs md:gap-2 md:[&_button]:text-sm">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
}
