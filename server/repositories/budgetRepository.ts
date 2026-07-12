import prisma from "../prisma/client.js";
import type { DataType } from "../auth/config.js";
import { BUDGET_STATUS, currentBudgetPeriod } from "../budget/constants.js";
import type { CreateBudgetInput } from "../lib/validation.js";

export async function getActiveBudget(dataType: DataType, month?: number, year?: number) {
  const period = month && year ? { month, year } : currentBudgetPeriod();
  return prisma.budget.findFirst({
    where: {
      type: dataType,
      month: period.month,
      year: period.year,
      status: BUDGET_STATUS.ACTIVE,
    },
    include: { categories: { orderBy: { sortOrder: "asc" } } },
  });
}

export async function getBudgetById(id: string, dataType: DataType) {
  return prisma.budget.findFirst({
    where: { id, type: dataType },
    include: { categories: { orderBy: { sortOrder: "asc" } } },
  });
}

export async function listArchivedBudgets(dataType: DataType) {
  return prisma.budget.findMany({
    where: { type: dataType, status: BUDGET_STATUS.ARCHIVED },
    include: { categories: { orderBy: { sortOrder: "asc" } } },
    orderBy: [{ year: "desc" }, { month: "desc" }],
  });
}

export async function createBudget(dataType: DataType, input: CreateBudgetInput) {
  const { month, year } = currentBudgetPeriod();

  const existing = await getActiveBudget(dataType, month, year);
  if (existing) {
    throw new Error("BUDGET_EXISTS");
  }

  return prisma.budget.create({
    data: {
      month,
      year,
      income: input.income,
      ruleType: input.ruleType,
      ruleLabel: input.ruleLabel,
      notes: input.notes ?? null,
      status: BUDGET_STATUS.ACTIVE,
      type: dataType,
      categories: {
        create: input.categories.map((cat, index) => ({
          name: cat.name,
          percentage: cat.percentage,
          plannedAmount: (input.income * cat.percentage) / 100,
          actualAmount: 0,
          financeLink: cat.financeLink ?? null,
          sortOrder: index,
        })),
      },
    },
    include: { categories: { orderBy: { sortOrder: "asc" } } },
  });
}

export async function resetBudget(dataType: DataType, input: CreateBudgetInput) {
  const { month, year } = currentBudgetPeriod();

  return prisma.$transaction(async (tx) => {
    const active = await tx.budget.findFirst({
      where: {
        type: dataType,
        month,
        year,
        status: BUDGET_STATUS.ACTIVE,
      },
    });

    if (active) {
      await tx.budget.update({
        where: { id: active.id },
        data: { status: BUDGET_STATUS.ARCHIVED },
      });
    }

    return tx.budget.create({
      data: {
        month,
        year,
        income: input.income,
        ruleType: input.ruleType,
        ruleLabel: input.ruleLabel,
        notes: input.notes ?? null,
        status: BUDGET_STATUS.ACTIVE,
        type: dataType,
        categories: {
          create: input.categories.map((cat, index) => ({
            name: cat.name,
            percentage: cat.percentage,
            plannedAmount: (input.income * cat.percentage) / 100,
            actualAmount: 0,
            financeLink: cat.financeLink ?? null,
            sortOrder: index,
          })),
        },
      },
      include: { categories: { orderBy: { sortOrder: "asc" } } },
    });
  });
}

export async function archiveAndClearBudget(dataType: DataType) {
  const { month, year } = currentBudgetPeriod();
  const active = await getActiveBudget(dataType, month, year);
  if (!active) return null;

  return prisma.budget.update({
    where: { id: active.id },
    data: { status: BUDGET_STATUS.ARCHIVED },
  });
}

export async function incrementCategoryActual(
  categoryId: string,
  amount: number,
) {
  const category = await prisma.budgetCategory.findUnique({ where: { id: categoryId } });
  if (!category) return null;

  return prisma.budgetCategory.update({
    where: { id: categoryId },
    data: { actualAmount: { increment: amount } },
  });
}

export async function findMatchingCategory(
  budgetId: string,
  moduleType: string,
  recordName: string,
) {
  const categories = await prisma.budgetCategory.findMany({
    where: { budgetId },
    orderBy: { sortOrder: "asc" },
  });

  const normalizedName = recordName.toLowerCase();

  for (const cat of categories) {
    if (cat.financeLink === moduleType) return cat;
    if (cat.name.toLowerCase() === normalizedName) return cat;
    if (normalizedName.includes(cat.name.toLowerCase())) return cat;
    if (cat.name.toLowerCase().includes(normalizedName)) return cat;
  }

  const moduleAliases: Record<string, string[]> = {
    Rent: ["rent"],
    EMI: ["emi"],
    Subscription: ["subscription", "subscriptions"],
  };

  const aliases = moduleAliases[moduleType] ?? [];
  for (const cat of categories) {
    const catLower = cat.name.toLowerCase();
    if (aliases.some((a) => catLower.includes(a))) return cat;
  }

  return categories.find((c) => c.name === "Other") ?? null;
}
