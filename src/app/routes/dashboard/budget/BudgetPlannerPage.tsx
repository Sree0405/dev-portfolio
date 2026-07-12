import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  CheckCircle2,
  FileDown,
  PiggyBank,
  Plus,
  RefreshCw,
  Search,
  Target,
  TrendingDown,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { api, ApiClientError } from "@/app/lib/api";
import { useAuth } from "@/app/hooks/useAuth";
import { formatCurrency } from "@/app/lib/format";
import { DEMO_BUDGET_WRITE_MESSAGE } from "@/app/lib/budget/types";
import type { BudgetSetupFormValues } from "@/app/lib/validation";
import { ConfirmDialog } from "@/app/components/Common/ConfirmDialog";
import { EmptyState } from "@/app/components/Common/EmptyState";
import { CardSkeleton } from "@/app/components/Common/LoadingSkeleton";
import { DashboardHeader } from "@/app/components/Dashboard/DashboardHeader";
import { StatCard } from "@/app/components/Dashboard/StatCard";
import { BudgetCategoryCard } from "@/app/components/Budget/BudgetCategoryCard";
import { BudgetSetupModal } from "@/app/components/Budget/BudgetSetupModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function BudgetPlannerPage() {
  const queryClient = useQueryClient();
  const { isDemo } = useAuth();
  const [tab, setTab] = useState("current");
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);

  const { data: budget, isLoading } = useQuery({
    queryKey: ["budget", "current"],
    queryFn: api.getCurrentBudget,
  });

  const { data: historyData, isLoading: historyLoading } = useQuery({
    queryKey: ["budget", "history"],
    queryFn: api.getBudgetHistory,
  });

  const { data: historyDetail } = useQuery({
    queryKey: ["budget", selectedHistoryId],
    queryFn: () => api.getBudget(selectedHistoryId!),
    enabled: !!selectedHistoryId,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["budget"] });
  };

  const createMutation = useMutation({
    mutationFn: api.createBudget,
    onSuccess: () => {
      invalidate();
      setCreateOpen(false);
      toast.success("Budget started for this month");
    },
    onError: (e: Error) => {
      if (e instanceof ApiClientError && e.status === 403) toast.error(DEMO_BUDGET_WRITE_MESSAGE);
      else toast.error(e.message);
    },
  });

  const resetMutation = useMutation({
    mutationFn: api.resetBudget,
    onSuccess: () => {
      invalidate();
      setResetOpen(false);
      setConfirmReset(false);
      toast.success("Budget reset and archived");
    },
    onError: (e: Error) => {
      if (e instanceof ApiClientError && e.status === 403) toast.error(DEMO_BUDGET_WRITE_MESSAGE);
      else toast.error(e.message);
    },
  });

  const filteredCategories = useMemo(() => {
    if (!budget) return [];
    const q = search.trim().toLowerCase();
    if (!q) return budget.categories;
    return budget.categories.filter((c) => c.name.toLowerCase().includes(q));
  }, [budget, search]);

  const handleSetup = async (values: BudgetSetupFormValues) => {
    if (createOpen) await createMutation.mutateAsync(values);
    else await resetMutation.mutateAsync(values);
  };

  const setupInitialValues: Partial<BudgetSetupFormValues> | undefined = budget
    ? {
        income: budget.income,
        ruleType: budget.ruleType as BudgetSetupFormValues["ruleType"],
        ruleLabel: budget.ruleLabel,
        notes: budget.notes ?? "",
        categories: budget.categories.map((c) => ({
          name: c.name,
          percentage: c.percentage,
          financeLink: c.financeLink,
        })),
      }
    : undefined;

  return (
    <>
      <DashboardHeader
        title="Budget Planner"
        description="Plan monthly income, track spending, and compare against Finance Hub payments."
        actions={
          <>
            {budget && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => api.downloadBudgetPdf(budget.id).catch((e) => toast.error(e.message))}
              >
                <FileDown className="mr-1.5 h-4 w-4" />
                Print PDF
              </Button>
            )}
            {!isDemo && (
              <>
                <Button
                  variant="sreeDev"
                  size="sm"
                  disabled={!!budget}
                  onClick={() => setCreateOpen(true)}
                >
                  <Plus className="mr-1.5 h-4 w-4" />
                  Start New Budget
                </Button>
                {budget && (
                  <Button variant="outline" size="sm" onClick={() => setConfirmReset(true)}>
                    <RefreshCw className="mr-1.5 h-4 w-4" />
                    Reset Budget
                  </Button>
                )}
              </>
            )}
          </>
        }
      />

      <main className="min-w-0 space-y-4 p-4 md:space-y-6 md:p-8">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="current">Current Budget</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="mt-4 space-y-4">
            {isLoading ? (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            ) : !budget ? (
              <EmptyState
                title="No budget for this month"
                description={
                  isDemo
                    ? "Demo data will appear after seeding. Owner accounts can start a new budget."
                    : "Start a new budget to allocate your monthly income across categories."
                }
                actionLabel={isDemo ? undefined : "Start New Budget"}
                onAction={isDemo ? undefined : () => setCreateOpen(true)}
              />
            ) : (
              <>
                <Card className="dashboard-surface-card border-primary/20">
                  <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        Current Month Budget
                      </p>
                      <p className="text-xl font-semibold">{budget.monthLabel}</p>
                      <p className="text-sm text-muted-foreground">Rule: {budget.ruleLabel}</p>
                    </div>
                    <Badge variant="outline" className="text-primary">
                      {budget.status}
                    </Badge>
                  </CardContent>
                </Card>

                {budget.summary.alerts.length > 0 && (
                  <section className="space-y-2">
                    {budget.summary.alerts.map((alert) => (
                      <div
                        key={alert.categoryId}
                        className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4"
                      >
                        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
                        <p className="text-sm text-red-200">{alert.message}</p>
                      </div>
                    ))}
                  </section>
                )}

                <section className="grid min-w-0 grid-cols-2 gap-3 xl:grid-cols-5">
                  <StatCard
                    label="Monthly Income"
                    value={budget.summary.monthlyIncome}
                    displayValue={formatCurrency(budget.summary.monthlyIncome)}
                    icon={Wallet}
                  />
                  <StatCard
                    label="Allocated Budget"
                    value={budget.summary.allocatedBudget}
                    displayValue={formatCurrency(budget.summary.allocatedBudget)}
                    icon={Target}
                  />
                  <StatCard
                    label="Total Spent"
                    value={budget.summary.totalSpent}
                    displayValue={formatCurrency(budget.summary.totalSpent)}
                    icon={TrendingDown}
                    accent="warning"
                  />
                  <StatCard
                    label="Remaining Budget"
                    value={budget.summary.remainingBudget}
                    displayValue={formatCurrency(budget.summary.remainingBudget)}
                    icon={PiggyBank}
                    accent={budget.summary.remainingBudget >= 0 ? "success" : "danger"}
                  />
                  <StatCard
                    label="Savings Goal"
                    value={budget.summary.savingsGoal}
                    displayValue={formatCurrency(budget.summary.savingsGoal)}
                    icon={CheckCircle2}
                    accent="primary"
                  />
                </section>

                <Card className="dashboard-surface-card">
                  <CardHeader>
                    <CardTitle className="text-base">Monthly Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                    <SummaryItem label="Income" value={formatCurrency(budget.summary.monthlyIncome)} />
                    <SummaryItem label="Spent" value={formatCurrency(budget.summary.totalSpent)} />
                    <SummaryItem label="Remaining" value={formatCurrency(budget.summary.remainingBudget)} />
                    <SummaryItem label="Savings Target" value={formatCurrency(budget.summary.savingsGoal)} />
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        Current Savings
                      </p>
                      <p className="mt-1 text-lg font-semibold">
                        {formatCurrency(budget.summary.currentSavings)}
                      </p>
                      {budget.summary.savingsGoalAchieved && (
                        <p className="mt-1 text-xs font-medium text-emerald-400">✔ Goal Achieved</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search categories..."
                    className="pl-9"
                  />
                </div>

                <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredCategories.map((category) => (
                    <BudgetCategoryCard key={category.id} category={category} />
                  ))}
                </section>
              </>
            )}
          </TabsContent>

          <TabsContent value="history" className="mt-4 space-y-4">
            {historyLoading ? (
              <CardSkeleton />
            ) : !historyData?.items.length ? (
              <EmptyState title="No budget history" description="Archived budgets will appear here." />
            ) : (
              <>
                <div className="overflow-hidden rounded-xl border border-border/60 bg-card/50">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Month</TableHead>
                        <TableHead>Income</TableHead>
                        <TableHead>Spent</TableHead>
                        <TableHead>Saved</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {historyData.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.monthLabel}</TableCell>
                          <TableCell>{formatCurrency(item.income)}</TableCell>
                          <TableCell>{formatCurrency(item.spent)}</TableCell>
                          <TableCell>{formatCurrency(item.saved)}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{item.status}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedHistoryId(item.id)}
                            >
                              View Report
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {historyDetail && selectedHistoryId && (
                  <Card className="dashboard-surface-card">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-base">{historyDetail.monthLabel} Report</CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          api.downloadBudgetPdf(historyDetail.id).catch((e) => toast.error(e.message))
                        }
                      >
                        <FileDown className="mr-1.5 h-4 w-4" />
                        Print PDF
                      </Button>
                    </CardHeader>
                    <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      {historyDetail.categories.map((cat) => (
                        <BudgetCategoryCard key={cat.id} category={cat} />
                      ))}
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <BudgetSetupModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        mode="create"
        loading={createMutation.isPending}
        onSubmit={handleSetup}
      />

      <BudgetSetupModal
        open={resetOpen}
        onOpenChange={setResetOpen}
        mode="reset"
        loading={resetMutation.isPending}
        initialValues={setupInitialValues}
        onSubmit={handleSetup}
      />

      <ConfirmDialog
        open={confirmReset}
        onOpenChange={setConfirmReset}
        title="Reset budget?"
        description="This will archive the current month's budget and create a fresh budget. Historical budget reports will remain available."
        confirmLabel="Reset Budget"
        onConfirm={() => {
          setConfirmReset(false);
          setResetOpen(true);
        }}
      />
    </>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  );
}
