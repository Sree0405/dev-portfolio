import * as budgetService from "../../services/budgetService.js";
import { renderFinanceReportTemplate } from "../../finance/pdf/template/renderFinanceReportTemplate.js";
import { formatFinanceDate, formatFinanceReportId, formatFinanceTime } from "../../finance/pdf/format.js";
import type { DataType } from "../../auth/config.js";
export async function generateBudgetReportPdf(budgetId: string, dataType: DataType) {
  const budget = await budgetService.getBudgetDetail(budgetId, dataType);
  const now = new Date();

  const rows = budget.categories.map((cat) => ({
    date: budget.monthLabel,
    periodLabel: cat.name,
    type: "Budget",
    name: cat.name,
    amount: cat.actualAmount,
    status: cat.status === "exceeded" ? "Overdue" : cat.status === "warning" ? "Pending" : "Paid",
    reference: `${cat.percentage}%`,
    notes: `Planned ${cat.plannedAmount} · Remaining ${cat.remaining}`,
  }));

  const paidAmounts = budget.categories.map((c) => c.actualAmount).filter((a) => a > 0);

  return renderFinanceReportTemplate(
    {
      title: `Budget Report — ${budget.monthLabel}`,
      module: "Budget Planner",
      periodLabel: budget.monthLabel,
      from: budget.monthLabel,
      to: budget.monthLabel,
      reportId: formatFinanceReportId(now),
      generatedDate: formatFinanceDate(now),
      generatedTime: formatFinanceTime(now),
      rows,
      summary: {
        totalRecords: budget.categories.length,
        totalPaid: budget.summary.totalSpent,
        pendingPayments: budget.categories.filter((c) => c.status !== "safe").length,
        averagePayment: paidAmounts.length
          ? paidAmounts.reduce((s, a) => s + a, 0) / paidAmounts.length
          : 0,
        highestPayment: paidAmounts.length ? Math.max(...paidAmounts) : 0,
        lowestPayment: paidAmounts.length ? Math.min(...paidAmounts) : 0,
        monthlyBreakdown: [
          { label: "Income", amount: budget.summary.monthlyIncome },
          { label: "Spent", amount: budget.summary.totalSpent },
          { label: "Saved", amount: budget.summary.currentSavings },
        ],
      },
      detailInfo: {
        name: budget.monthLabel,
        amount: budget.summary.monthlyIncome,
        status: budget.summary.historyStatus,
        category: budget.ruleLabel,
        notes: budget.notes,
        totalPaid: budget.summary.totalSpent,
        totalRemaining: budget.summary.remainingBudget,
        paymentsCompleted: budget.categories.filter((c) => c.actualAmount > 0).length,
        paymentsPending: budget.categories.filter((c) => c.actualAmount === 0).length,
      },
    },
    dataType,
  );
}
