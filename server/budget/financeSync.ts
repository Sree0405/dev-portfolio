import type { DataType } from "../auth/config.js";
import * as budgetRepo from "../repositories/budgetRepository.js";
import { currentBudgetPeriod } from "../budget/constants.js";

/**
 * When a Finance Hub payment is marked paid, increment the matching budget category.
 */
export async function syncBudgetFromFinancePayment(
  dataType: DataType,
  amount: number,
  moduleType: string,
  recordName: string,
  paidDate?: Date,
) {
  const { month, year } = currentBudgetPeriod();
  const paymentDate = paidDate ?? new Date();

  if (
    paymentDate.getMonth() + 1 !== month ||
    paymentDate.getFullYear() !== year
  ) {
    return;
  }

  const budget = await budgetRepo.getActiveBudget(dataType, month, year);
  if (!budget) return;

  const category = await budgetRepo.findMatchingCategory(budget.id, moduleType, recordName);
  if (!category) return;

  await budgetRepo.incrementCategoryActual(category.id, amount);
}
