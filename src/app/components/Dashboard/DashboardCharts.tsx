import { Cell, Pie, PieChart, Bar, BarChart, Line, LineChart, XAxis, YAxis, CartesianGrid } from "recharts";
import type { DashboardAnalytics } from "@/app/lib/types";
import { formatCurrency } from "@/app/lib/format";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const STATUS_COLORS: Record<string, string> = {
  Planning: "hsl(217 91% 60%)",
  "In Progress": "hsl(262 100% 56%)",
  Completed: "hsl(142 71% 45%)",
  "On Hold": "hsl(38 92% 50%)",
  Cancelled: "hsl(0 72% 51%)",
};

/** Fixed-height wrapper — avoids aspect-ratio width blowout on narrow screens */
const CHART_SIZES = {
  pie: "aspect-auto h-[200px] w-full min-w-0 max-w-full sm:h-[230px] md:h-[260px]",
  wide: "aspect-auto h-[220px] w-full min-w-0 max-w-full sm:h-[250px] md:h-[280px]",
} as const;

interface DashboardChartsProps {
  data: DashboardAnalytics;
}

export function DashboardCharts({ data }: DashboardChartsProps) {
  const financialData = [
    { name: "received", label: "Received", value: data.financialOverview.received, fill: "hsl(142 71% 45%)" },
    { name: "pending", label: "Pending", value: data.financialOverview.pending, fill: "hsl(38 92% 50%)" },
  ].filter((item) => item.value > 0);

  const statusData = data.projectStatusDistribution.filter((item) => item.count > 0);

  const revenueData = data.revenueByProject.map((item) => ({
    name: item.projectName.length > 10 ? `${item.projectName.slice(0, 10)}…` : item.projectName,
    fullName: item.projectName,
    amount: item.amount,
  }));

  const monthlyData = data.monthlyPayments.map((item) => ({
    label: item.label,
    amount: item.amount,
  }));

  return (
    <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2">
      <Card className="dashboard-surface-card min-w-0 overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Financial Overview</CardTitle>
        </CardHeader>
        <CardContent className="min-w-0 overflow-hidden">
          {financialData.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">No financial data yet.</p>
          ) : (
            <ChartContainer
              config={{
                received: { label: "Received", color: "hsl(142 71% 45%)" },
                pending: { label: "Pending", color: "hsl(38 92% 50%)" },
              }}
              className={CHART_SIZES.pie}
            >
              <PieChart margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name, item) => {
                        const total = data.totalPlannedAmount;
                        const pct = total > 0 ? ((Number(value) / total) * 100).toFixed(1) : "0";
                        return (
                          <div className="flex w-full flex-col gap-0.5">
                            <span className="font-medium">{formatCurrency(Number(value))}</span>
                            <span className="text-muted-foreground">
                              {pct}% · {String(item.payload?.label ?? name)}
                            </span>
                          </div>
                        );
                      }}
                    />
                  }
                />
                <Pie
                  data={financialData}
                  dataKey="value"
                  nameKey="label"
                  innerRadius="52%"
                  outerRadius="78%"
                  paddingAngle={3}
                  strokeWidth={2}
                  cx="50%"
                  cy="50%"
                >
                  {financialData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          )}
          <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 text-center text-xs sm:text-sm">
            <span className="text-emerald-400">Received {data.financialOverview.receivedPercent}%</span>
            <span className="text-amber-400">Pending {data.financialOverview.pendingPercent}%</span>
          </div>
        </CardContent>
      </Card>

      <Card className="dashboard-surface-card min-w-0 overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Project Status Distribution</CardTitle>
        </CardHeader>
        <CardContent className="min-w-0 overflow-hidden">
          {statusData.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">No projects yet.</p>
          ) : (
            <ChartContainer
              config={Object.fromEntries(
                statusData.map((s) => [s.status, { label: s.status, color: STATUS_COLORS[s.status] }]),
              )}
              className={CHART_SIZES.pie}
            >
              <PieChart margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
                <ChartTooltip content={<ChartTooltipContent nameKey="status" />} />
                <Pie
                  data={statusData}
                  dataKey="count"
                  nameKey="status"
                  innerRadius="48%"
                  outerRadius="78%"
                  paddingAngle={2}
                  strokeWidth={2}
                  cx="50%"
                  cy="50%"
                >
                  {statusData.map((entry) => (
                    <Cell key={entry.status} fill={STATUS_COLORS[entry.status] ?? "hsl(var(--primary))"} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      <Card className="dashboard-surface-card col-span-1 min-w-0 overflow-hidden lg:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Revenue Overview</CardTitle>
        </CardHeader>
        <CardContent className="min-w-0 overflow-hidden">
          {revenueData.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">No payments recorded yet.</p>
          ) : (
            <ChartContainer
              config={{ amount: { label: "Received", color: "hsl(262 100% 56%)" } }}
              className={CHART_SIZES.wide}
            >
              <BarChart
                data={revenueData}
                margin={{ top: 8, right: 4, left: -12, bottom: 4 }}
                barCategoryGap="20%"
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  fontSize={10}
                  interval={0}
                  angle={-35}
                  textAnchor="end"
                  height={52}
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  fontSize={10}
                  width={36}
                  tickFormatter={(v) => `${Math.round(v / 1000)}k`}
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName ?? ""}
                      formatter={(value) => formatCurrency(Number(value))}
                    />
                  }
                />
                <Bar dataKey="amount" fill="hsl(262 100% 56%)" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      <Card className="dashboard-surface-card col-span-1 min-w-0 overflow-hidden lg:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Monthly Payments</CardTitle>
        </CardHeader>
        <CardContent className="min-w-0 overflow-hidden">
          {monthlyData.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">No payment history yet.</p>
          ) : (
            <ChartContainer
              config={{ amount: { label: "Payments", color: "hsl(195 100% 50%)" } }}
              className={CHART_SIZES.wide}
            >
              <LineChart data={monthlyData} margin={{ top: 8, right: 4, left: -12, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  fontSize={10}
                  interval="preserveStartEnd"
                  minTickGap={8}
                  angle={monthlyData.length > 4 ? -35 : 0}
                  textAnchor={monthlyData.length > 4 ? "end" : "middle"}
                  height={monthlyData.length > 4 ? 52 : 28}
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  fontSize={10}
                  width={36}
                  tickFormatter={(v) => `${Math.round(v / 1000)}k`}
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <ChartTooltip
                  content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value))} />}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="hsl(195 100% 50%)"
                  strokeWidth={2}
                  dot={{ fill: "hsl(195 100% 50%)", r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
