import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, CalendarClock } from "lucide-react";
import { api } from "@/app/lib/api";
import { financeNavGroup } from "@/app/components/Sidebar/dashboardNavItems";
import { Card, CardContent } from "@/components/ui/card";

export function FinanceNotificationsBanner() {
  const { data } = useQuery({
    queryKey: ["finance", "notifications"],
    queryFn: api.getFinanceNotifications,
    staleTime: 60_000,
  });

  if (!data || (data.upcomingCount === 0 && data.overdueCount === 0)) {
    return null;
  }

  return (
    <section className="grid gap-3 sm:grid-cols-2">
      {data.upcomingCount > 0 && (
        <Card className="dashboard-surface-card border-primary/20">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <CalendarClock className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">Upcoming Payments</p>
              <p className="text-2xl font-bold text-primary">{data.upcomingCount}</p>
            </div>
            <Link
              to={financeNavGroup.children[0].to}
              className="shrink-0 text-xs text-primary hover:underline"
            >
              View Finance
            </Link>
          </CardContent>
        </Card>
      )}
      {data.overdueCount > 0 && (
        <Card className="dashboard-surface-card border-red-500/30">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/15 text-red-400">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">Overdue Payments</p>
              <p className="text-2xl font-bold text-red-400">{data.overdueCount}</p>
            </div>
            <Link
              to={financeNavGroup.children[0].to}
              className="shrink-0 text-xs text-red-400 hover:underline"
            >
              View Finance
            </Link>
          </CardContent>
        </Card>
      )}
    </section>
  );
}
