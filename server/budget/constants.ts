export const BUDGET_STATUS = {
  ACTIVE: "Active",
  ARCHIVED: "Archived",
} as const;

export const BUDGET_RULES = {
  RULE_50_30_20: {
    id: "50_30_20",
    label: "50 / 30 / 20",
    description: "50% Needs · 30% Wants · 20% Savings",
    categories: [
      { name: "Rent", percentage: 20, financeLink: "Rent" },
      { name: "Food", percentage: 15, financeLink: null },
      { name: "Utilities", percentage: 8, financeLink: null },
      { name: "Medical", percentage: 7, financeLink: null },
      { name: "Travel", percentage: 10, financeLink: null },
      { name: "Entertainment", percentage: 10, financeLink: null },
      { name: "Shopping", percentage: 10, financeLink: null },
      { name: "Savings", percentage: 15, financeLink: null },
      { name: "Investment", percentage: 5, financeLink: null },
    ],
  },
  RULE_60_20_20: {
    id: "60_20_20",
    label: "60 / 20 / 20",
    description: "60% Needs · 20% Savings · 20% Investments",
    categories: [
      { name: "Rent", percentage: 25, financeLink: "Rent" },
      { name: "Food", percentage: 15, financeLink: null },
      { name: "Fuel", percentage: 8, financeLink: null },
      { name: "Utilities", percentage: 7, financeLink: null },
      { name: "EMI", percentage: 5, financeLink: "EMI" },
      { name: "Savings", percentage: 20, financeLink: null },
      { name: "Investment", percentage: 20, financeLink: null },
    ],
  },
  RULE_70_20_10: {
    id: "70_20_10",
    label: "70 / 20 / 10",
    description: "70% Needs · 20% Savings · 10% Emergency Fund",
    categories: [
      { name: "Rent", percentage: 30, financeLink: "Rent" },
      { name: "Food", percentage: 15, financeLink: null },
      { name: "Utilities", percentage: 10, financeLink: null },
      { name: "Medical", percentage: 8, financeLink: null },
      { name: "Fuel", percentage: 7, financeLink: null },
      { name: "Savings", percentage: 20, financeLink: null },
      { name: "Emergency Fund", percentage: 10, financeLink: null },
    ],
  },
} as const;

export const SAVINGS_CATEGORY_NAMES = ["Savings", "Investment", "Emergency Fund", "Investments"];

export const FINANCE_MODULE_TO_BUDGET: Record<string, string[]> = {
  Rent: ["Rent"],
  EMI: ["EMI"],
  Subscription: ["Subscriptions", "Subscription"],
};

export type BudgetCategoryStatus = "safe" | "warning" | "exceeded";

export function getCategoryStatus(
  planned: number,
  actual: number,
): { status: BudgetCategoryStatus; progress: number; overBy: number } {
  if (planned <= 0) {
    return { status: "safe", progress: 0, overBy: 0 };
  }
  const progress = Math.round((actual / planned) * 100);
  if (actual > planned) {
    return { status: "exceeded", progress, overBy: actual - planned };
  }
  if (progress >= 80) {
    return { status: "warning", progress, overBy: 0 };
  }
  return { status: "safe", progress, overBy: 0 };
}

export function formatBudgetMonth(month: number, year: number): string {
  return new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric" }).format(
    new Date(year, month - 1, 1),
  );
}

export function currentBudgetPeriod() {
  const now = new Date();
  return { month: now.getMonth() + 1, year: now.getFullYear() };
}
