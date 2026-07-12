import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  Ban,
  Briefcase,
  CheckCircle2,
  Clock,
  FolderKanban,
  IndianRupee,
  KeyRound,
  PauseCircle,
  PlayCircle,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { api } from "@/app/lib/api";
import { formatCurrency, formatDate } from "@/app/lib/format";
import { EmptyState } from "@/app/components/Common/EmptyState";
import { CardSkeleton, TableSkeleton } from "@/app/components/Common/LoadingSkeleton";
import { StatusBadge } from "@/app/components/Common/StatusBadge";
import { DashboardHeader } from "@/app/components/Dashboard/DashboardHeader";
import { DashboardCharts } from "@/app/components/Dashboard/DashboardCharts";
import { FinanceNotificationsBanner } from "@/app/components/Finance/FinanceNotificationsBanner";
import { StatCard } from "@/app/components/Dashboard/StatCard";
import { CountUp } from "@/app/components/Dashboard/CountUp";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

function formatCurrencyStat(amount: number) {
  return formatCurrency(amount);
}

export default function DashboardPage() {
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["dashboard"],
    queryFn: api.getDashboard,
    staleTime: 60 * 1000,
  });

  if (isLoading) {
    return (
      <>
        <DashboardHeader title="Dashboard" description="Business overview and analytics." />
        <main className="min-w-0 space-y-4 p-4 md:space-y-6 md:p-8">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
          <TableSkeleton rows={5} columns={4} />
        </main>
      </>
    );
  }

  if (isError || !data) {
    return (
      <>
        <DashboardHeader title="Dashboard" />
        <main className="p-8">
          <EmptyState
            title="Unable to load dashboard"
            description="Your session may have expired or the server needs a refresh. Try signing in again."
            actionLabel={isFetching ? "Retrying..." : "Try again"}
            onAction={() => refetch()}
          />
        </main>
      </>
    );
  }

  return (
    <>
      <DashboardHeader
        title="Dashboard"
        description="Overview of projects, revenue, and business health."
      />

      <main className="min-w-0 space-y-4 p-4 md:space-y-6 md:p-8">
        <FinanceNotificationsBanner />

        {/* Top Statistics */}
        <section className="grid min-w-0 grid-cols-2 gap-3 xl:grid-cols-4">
          <StatCard
            label="Total Projects"
            value={data.totalProjects}
            suffix={data.totalProjects === 1 ? " Project" : " Projects"}
            icon={FolderKanban}
            accent="primary"
          />
          <StatCard
            label="Stored Credentials"
            value={data.totalCredentials}
            suffix={data.totalCredentials === 1 ? " Credential" : " Credentials"}
            icon={KeyRound}
            accent="primary"
          />
          <StatCard
            label="Total Planned Amount"
            value={data.totalPlannedAmount}
            displayValue={formatCurrencyStat(data.totalPlannedAmount)}
            icon={Briefcase}
          />
          <StatCard
            label="Total Amount Received"
            value={data.totalPaidAmount}
            displayValue={formatCurrencyStat(data.totalPaidAmount)}
            icon={Wallet}
            accent="success"
          />
          <StatCard
            label="Remaining Amount"
            value={data.totalRemainingAmount}
            displayValue={formatCurrencyStat(data.totalRemainingAmount)}
            icon={IndianRupee}
            accent="warning"
          />
          <StatCard label="Completed Projects" value={data.completedProjects} icon={CheckCircle2} accent="success" />
          <StatCard label="In Progress Projects" value={data.activeProjects} icon={PlayCircle} accent="primary" />
          <StatCard label="On Hold Projects" value={data.onHoldProjects} icon={PauseCircle} accent="warning" />
          <StatCard label="Cancelled Projects" value={data.cancelledProjects} icon={Ban} accent="danger" />
        </section>

        {/* Receivables + Insights */}
        <section className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="dashboard-highlight-card min-w-0 overflow-hidden lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-base">Money Yet To Receive</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground md:text-4xl">
                <CountUp value={data.totalRemainingAmount} formatter={formatCurrency} />
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                From{" "}
                <span className="font-semibold text-foreground">
                  {data.receivableProjectCount} Active Project{data.receivableProjectCount !== 1 ? "s" : ""}
                </span>
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-surface-card min-w-0 overflow-hidden lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Financial Insights</CardTitle>
            </CardHeader>
            <CardContent className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { label: "Total Revenue Collected", value: formatCurrency(data.totalPaidAmount) },
                { label: "Remaining Revenue", value: formatCurrency(data.totalRemainingAmount) },
                { label: "Collection Rate", value: `${data.collectionRate}%` },
                { label: "Average Project Value", value: formatCurrency(data.averageProjectValue) },
                { label: "Average Payment", value: formatCurrency(data.averagePayment) },
                {
                  label: "Highest Paying Project",
                  value: data.highestPayingProject?.name ?? "—",
                  sub: data.highestPayingProject ? formatCurrency(data.highestPayingProject.amount) : undefined,
                },
                {
                  label: "Highest Remaining Amount",
                  value: data.highestRemainingProject?.name ?? "—",
                  sub: data.highestRemainingProject
                    ? formatCurrency(data.highestRemainingProject.amount)
                    : undefined,
                },
              ].map((insight) => (
                <div key={insight.label} className="rounded-lg border border-border/50 bg-muted/20 p-3">
                  <p className="text-xs text-muted-foreground">{insight.label}</p>
                  <p className="mt-1 truncate text-sm font-semibold text-foreground">{insight.value}</p>
                  {insight.sub && (
                    <p className="mt-0.5 text-xs font-medium text-primary">{insight.sub}</p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* Charts */}
        <DashboardCharts data={data} />

        {/* Latest Projects */}
        <Card className="dashboard-surface-card">
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="text-base">Latest Projects</CardTitle>
            <Link to="/dashboard/projects" className="shrink-0 text-sm text-primary hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent>
            {data.latestProjects.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">No projects yet.</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {data.latestProjects.map((project) => (
                  <Link
                    key={project.id}
                    to={`/dashboard/projects/${project.id}`}
                    className="dashboard-surface-card block rounded-xl p-4 transition hover:border-primary/30"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate font-medium">{project.name}</p>
                        <p className="truncate text-sm text-muted-foreground">{project.clientName}</p>
                      </div>
                      <StatusBadge status={project.status} />
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <Progress value={project.progress} className="h-2 flex-1" />
                      <span className="shrink-0 text-xs text-muted-foreground">{project.progress}%</span>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Planned {formatCurrency(project.plannedAmount)}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <section className="grid gap-4 md:grid-cols-2">
          <Card className="dashboard-surface-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-4 w-4 text-primary" />
                Recent Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.recentPayments.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">No payments yet.</p>
              ) : (
                <div className="space-y-3">
                  {data.recentPayments.map((payment) => (
                    <Link
                      key={payment.id}
                      to={`/dashboard/projects/${payment.projectId}`}
                      className="flex items-center justify-between gap-3 rounded-lg border border-border/40 bg-muted/10 px-3 py-2.5 transition-colors hover:bg-muted/30"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{payment.projectName}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(payment.date)} · {payment.clientName} · {payment.paymentMethod}
                        </p>
                      </div>
                      <span className="shrink-0 text-sm font-semibold text-emerald-400">
                        {formatCurrency(payment.amount)}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="dashboard-surface-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="h-4 w-4 text-primary" />
                Recent Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.recentNotes.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">No notes yet.</p>
              ) : (
                <div className="space-y-3">
                  {data.recentNotes.map((note) => (
                    <Link
                      key={note.id}
                      to={`/dashboard/projects/${note.projectId}`}
                      className="block rounded-lg border border-border/40 bg-muted/10 px-3 py-2.5 transition-colors hover:bg-muted/30"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-medium">{note.projectName}</p>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {formatDate(note.createdAt)}
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{note.preview}</p>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </main>
    </>
  );
}
