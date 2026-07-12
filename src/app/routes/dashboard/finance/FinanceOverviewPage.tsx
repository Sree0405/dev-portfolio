import { useQuery } from "@tanstack/react-query";
import { AlertCircle, CalendarClock, CheckCircle2, Clock, TrendingUp, Wallet } from "lucide-react";
import { Bar, BarChart, Cell, Pie, PieChart, XAxis, YAxis, CartesianGrid } from "recharts";
import { api } from "@/app/lib/api";
import { formatCurrency, formatDate } from "@/app/lib/format";
import { CardSkeleton } from "@/app/components/Common/LoadingSkeleton";
import { EmptyState } from "@/app/components/Common/EmptyState";
import { DashboardHeader } from "@/app/components/Dashboard/DashboardHeader";
import { FinanceCalendar } from "@/app/components/Finance/FinanceCalendar";
import { FinanceUrgencyBadge } from "@/app/components/Finance/FinanceUrgencyBadge";
import { StatCard } from "@/app/components/Dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const MODULE_COLORS: Record<string, string> = {
  EMI: "hsl(262 100% 56%)",
  Rent: "hsl(217 91% 60%)",
  Subscription: "hsl(142 71% 45%)",
};

export default function FinanceOverviewPage() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["finance", "overview"],
    queryFn: api.getFinanceOverview,
    staleTime: 30_000,
  });

  if (isLoading) {
    return (
      <>
        <DashboardHeader title="Finance Overview" description="Your personal finance dashboard." />
        <main className="min-w-0 space-y-4 p-4 md:space-y-6 md:p-8">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </main>
      </>
    );
  }

  if (isError || !data) {
    return (
      <>
        <DashboardHeader title="Finance Overview" />
        <main className="p-8">
          <EmptyState
            title="Unable to load finance overview"
            description="Try refreshing the page."
            actionLabel="Retry"
            onAction={() => refetch()}
          />
        </main>
      </>
    );
  }

  const breakdownData = data.breakdown.map((item) => ({
    name: item.moduleType,
    value: item.amount,
    fill: MODULE_COLORS[item.moduleType] ?? "hsl(220 10% 50%)",
  }));

  const trendData = data.monthlyTrend.map((item) => ({
    label: item.month.slice(5),
    amount: item.amount,
  }));

  return (
    <>
      <DashboardHeader
        title="Finance Overview"
        description="Track expenses, upcoming payments, and monthly trends across all modules."
      />
      <main className="min-w-0 space-y-4 p-4 md:space-y-6 md:p-8">
      <section className="grid min-w-0 grid-cols-2 gap-3 xl:grid-cols-3">
        <StatCard
          label="Monthly Expenses"
          value={data.stats.totalMonthlyExpenses}
          displayValue={formatCurrency(data.stats.totalMonthlyExpenses)}
          icon={Wallet}
        />
        <StatCard
          label="Yearly Expenses"
          value={data.stats.totalYearlyExpenses}
          displayValue={formatCurrency(data.stats.totalYearlyExpenses)}
          icon={TrendingUp}
        />
        <StatCard
          label="Paid This Month"
          value={data.stats.paidThisMonth}
          displayValue={formatCurrency(data.stats.paidThisMonth)}
          icon={CheckCircle2}
          accent="success"
        />
        <StatCard
          label="Pending This Month"
          value={data.stats.pendingThisMonth}
          displayValue={formatCurrency(data.stats.pendingThisMonth)}
          icon={Clock}
          accent="warning"
        />
        <StatCard
          label="Upcoming Payments"
          value={data.stats.upcomingCount}
          suffix={data.stats.upcomingCount === 1 ? " Payment" : " Payments"}
          icon={CalendarClock}
          accent="primary"
        />
        <StatCard
          label="Overdue Payments"
          value={data.stats.overdueCount}
          suffix={data.stats.overdueCount === 1 ? " Payment" : " Payments"}
          icon={AlertCircle}
          accent="danger"
        />
      </section>

      <section className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="dashboard-surface-card min-w-0 overflow-hidden">
          <CardHeader>
            <CardTitle className="text-base">Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="min-w-0 overflow-hidden">
            {breakdownData.length === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">No expense data yet.</p>
            ) : (
              <ChartContainer config={{}} className="aspect-auto h-[240px] w-full min-w-0">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Pie data={breakdownData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80}>
                    {breakdownData.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card className="dashboard-surface-card min-w-0 overflow-hidden">
          <CardHeader>
            <CardTitle className="text-base">Monthly Expense Trend</CardTitle>
          </CardHeader>
          <CardContent className="min-w-0 overflow-hidden">
            {trendData.length === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">No trend data yet.</p>
            ) : (
              <ChartContainer config={{}} className="aspect-auto h-[240px] w-full min-w-0">
                <BarChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} width={48} />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent formatter={(value) => formatCurrency(Number(value))} />
                    }
                  />
                  <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </section>

      <FinanceCalendar days={data.calendar} />

      <section className="grid gap-4 md:grid-cols-2">
        <Card className="dashboard-surface-card">
          <CardHeader>
            <CardTitle className="text-base">Recently Paid</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.recentlyPaid.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent payments.</p>
            ) : (
              data.recentlyPaid.slice(0, 6).map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between gap-2 rounded-lg border border-border/40 bg-muted/10 px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{p.recordName}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.paidDate ? formatDate(p.paidDate) : "—"} · {p.moduleType}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-emerald-400">
                    {formatCurrency(p.amount)}
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="dashboard-surface-card">
          <CardHeader>
            <CardTitle className="text-base">Upcoming Renewals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.upcomingRenewals.length === 0 ? (
              <p className="text-sm text-muted-foreground">No upcoming renewals.</p>
            ) : (
              data.upcomingRenewals.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-2 rounded-lg border border-border/40 bg-muted/10 px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.renewalDate ? formatDate(item.renewalDate) : "—"}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span className="text-sm font-semibold">{formatCurrency(item.amount)}</span>
                    <span className="text-[10px] text-muted-foreground">{item.subscriptionStatus}</span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </section>

      {data.upcoming.length > 0 && (
        <Card className="dashboard-surface-card">
          <CardHeader>
            <CardTitle className="text-base">Upcoming Payments Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.upcoming.map((p) => (
              <div
                key={p.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/40 px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium">{p.recordName}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(p.dueDate)} · {p.moduleType}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{formatCurrency(p.amount)}</span>
                  <FinanceUrgencyBadge urgency={p.urgency} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </main>
    </>
  );
}
