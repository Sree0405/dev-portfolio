export type BudgetCategoryStatus = "safe" | "warning" | "exceeded";

export interface BudgetCategory {
  id: string;
  name: string;
  percentage: number;
  plannedAmount: number;
  actualAmount: number;
  remaining: number;
  financeLink: string | null;
  sortOrder: number;
  status: BudgetCategoryStatus;
  progress: number;
  overBy: number;
}

export interface BudgetAlert {
  categoryId: string;
  categoryName: string;
  message: string;
  overBy: number;
}

export interface BudgetSummary {
  monthlyIncome: number;
  allocatedBudget: number;
  totalSpent: number;
  remainingBudget: number;
  savingsGoal: number;
  currentSavings: number;
  savingsGoalAchieved: boolean;
  alerts: BudgetAlert[];
  historyStatus: "On Track" | "Over Budget" | "Goal Achieved";
}

export interface Budget {
  id: string;
  month: number;
  year: number;
  monthLabel: string;
  income: number;
  ruleType: string;
  ruleLabel: string;
  notes: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  categories: BudgetCategory[];
  summary: BudgetSummary;
}

export interface BudgetHistoryItem {
  id: string;
  month: number;
  year: number;
  monthLabel: string;
  income: number;
  spent: number;
  saved: number;
  status: string;
  ruleLabel: string;
}

export interface BudgetRuleTemplate {
  id: string;
  label: string;
  description: string;
  categories: { name: string; percentage: number; financeLink: string | null }[];
}

export const DEMO_BUDGET_WRITE_MESSAGE =
  "Budget changes are disabled for the Demo account. Explore the showcase data in read-only mode.";

export const BUDGET_STATUS_STYLES: Record<
  BudgetCategoryStatus,
  { label: string; bar: string; card: string; text: string }
> = {
  safe: {
    label: "On Track",
    bar: "bg-emerald-500",
    card: "border-border/60",
    text: "text-emerald-400",
  },
  warning: {
    label: "Near Limit",
    bar: "bg-amber-500",
    card: "border-amber-500/30 bg-amber-500/5",
    text: "text-amber-400",
  },
  exceeded: {
    label: "Exceeded",
    bar: "bg-red-500",
    card: "border-red-500/40 bg-red-500/10",
    text: "text-red-400",
  },
};
