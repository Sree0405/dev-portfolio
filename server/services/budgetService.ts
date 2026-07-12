import type { DataType } from "../auth/config.js";
import * as budgetRepo from "../repositories/budgetRepository.js";
import {
  formatBudgetMonth,
  getCategoryStatus,
  SAVINGS_CATEGORY_NAMES,
} from "../budget/constants.js";
import { decimalToNumber } from "../lib/serializers.js";

function serializeCategory(cat: {
  id: string;
  name: string;
  percentage: unknown;
  plannedAmount: unknown;
  actualAmount: unknown;
  financeLink: string | null;
  sortOrder: number;
}) {
  const planned = decimalToNumber(cat.plannedAmount);
  const actual = decimalToNumber(cat.actualAmount);
  const { status, progress, overBy } = getCategoryStatus(planned, actual);

  return {
    id: cat.id,
    name: cat.name,
    percentage: decimalToNumber(cat.percentage),
    plannedAmount: planned,
    actualAmount: actual,
    remaining: planned - actual,
    financeLink: cat.financeLink,
    sortOrder: cat.sortOrder,
    status,
    progress,
    overBy,
  };
}

function computeSummary(
  income: number,
  categories: ReturnType<typeof serializeCategory>[],
) {
  const totalPlanned = categories.reduce((s, c) => s + c.plannedAmount, 0);
  const totalSpent = categories.reduce((s, c) => s + c.actualAmount, 0);
  const remaining = income - totalSpent;

  const savingsCategories = categories.filter((c) =>
    SAVINGS_CATEGORY_NAMES.some((n) => c.name.toLowerCase().includes(n.toLowerCase())),
  );
  const savingsTarget = savingsCategories.reduce((s, c) => s + c.plannedAmount, 0);
  const savingsSpent = savingsCategories.reduce((s, c) => s + c.actualAmount, 0);
  const currentSavings = Math.max(0, income - totalSpent);

  const alerts = categories
    .filter((c) => c.status === "exceeded")
    .map((c) => ({
      categoryId: c.id,
      categoryName: c.name,
      message: `You have exceeded your planned budget for ${c.name} by ₹${c.overBy.toLocaleString("en-IN")}.`,
      overBy: c.overBy,
    }));

  let historyStatus: "On Track" | "Over Budget" | "Goal Achieved" = "On Track";
  if (alerts.length > 0) historyStatus = "Over Budget";
  else if (currentSavings >= savingsTarget && savingsTarget > 0) historyStatus = "Goal Achieved";

  return {
    monthlyIncome: income,
    allocatedBudget: totalPlanned,
    totalSpent,
    remainingBudget: remaining,
    savingsGoal: savingsTarget,
    currentSavings,
    savingsGoalAchieved: savingsTarget > 0 && currentSavings >= savingsTarget,
    alerts,
    historyStatus,
  };
}

export function serializeBudget(budget: NonNullable<Awaited<ReturnType<typeof budgetRepo.getBudgetById>>>) {
  const income = decimalToNumber(budget.income);
  const categories = budget.categories.map(serializeCategory);
  const summary = computeSummary(income, categories);

  return {
    id: budget.id,
    month: budget.month,
    year: budget.year,
    monthLabel: formatBudgetMonth(budget.month, budget.year),
    income,
    ruleType: budget.ruleType,
    ruleLabel: budget.ruleLabel,
    notes: budget.notes,
    status: budget.status,
    createdAt: budget.createdAt.toISOString(),
    updatedAt: budget.updatedAt.toISOString(),
    categories,
    summary,
  };
}

export async function getCurrentBudget(dataType: DataType) {
  const budget = await budgetRepo.getActiveBudget(dataType);
  if (!budget) return null;
  return serializeBudget(budget);
}

export async function getBudgetDetail(id: string, dataType: DataType) {
  const budget = await budgetRepo.getBudgetById(id, dataType);
  if (!budget) throw new Error("NOT_FOUND");
  return serializeBudget(budget);
}

export async function getBudgetHistory(dataType: DataType) {
  const budgets = await budgetRepo.listArchivedBudgets(dataType);
  return budgets.map((b) => {
    const income = decimalToNumber(b.income);
    const categories = b.categories.map(serializeCategory);
    const summary = computeSummary(income, categories);
    return {
      id: b.id,
      month: b.month,
      year: b.year,
      monthLabel: formatBudgetMonth(b.month, b.year),
      income,
      spent: summary.totalSpent,
      saved: summary.currentSavings,
      status: summary.historyStatus,
      ruleLabel: b.ruleLabel,
    };
  });
}

export async function startNewBudget(dataType: DataType, input: import("../lib/validation.js").CreateBudgetInput) {
  const budget = await budgetRepo.createBudget(dataType, input);
  return serializeBudget(budget);
}

export async function resetCurrentBudget(
  dataType: DataType,
  input: import("../lib/validation.js").CreateBudgetInput,
) {
  const budget = await budgetRepo.resetBudget(dataType, input);
  return serializeBudget(budget);
}

export { computeSummary, serializeCategory };
