import { FINANCE_MODULES } from "../constants.js";
import {
  formatPeriodLabel,
  resolvePaymentStatus,
} from "../engine.js";
import * as financeRepo from "../../repositories/financeRepository.js";
import { renderFinanceReportTemplate } from "./template/renderFinanceReportTemplate.js";
import type { FinanceReportTemplateInput } from "./types.js";
import {
  formatFinanceDate,
  formatFinanceReportId,
  formatFinanceTime,
} from "./format.js";
import { decimalToNumber } from "../../lib/serializers.js";
import type { DataType } from "../../auth/config.js";

export type FinanceReportRange =
  | "current_month"
  | "last_2"
  | "last_3"
  | "last_6"
  | "last_12"
  | "custom_month"
  | "custom_range";

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function endOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

export function resolveDateRange(params: {
  range: FinanceReportRange;
  month?: string;
  from?: string;
  to?: string;
}): { from: Date; to: Date; label: string } {
  const now = new Date();
  const end = endOfDay(now);

  switch (params.range) {
    case "current_month": {
      const from = new Date(now.getFullYear(), now.getMonth(), 1);
      return { from, to: end, label: formatPeriodLabel(from) };
    }
    case "last_2":
    case "last_3":
    case "last_6":
    case "last_12": {
      const months = { last_2: 2, last_3: 3, last_6: 6, last_12: 12 }[params.range];
      const from = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);
      return {
        from,
        to: end,
        label: `Last ${months} Months`,
      };
    }
    case "custom_month": {
      const [y, m] = (params.month ?? "").split("-").map(Number);
      const from = new Date(y, m - 1, 1);
      const to = endOfDay(new Date(y, m, 0));
      return { from, to, label: formatPeriodLabel(from) };
    }
    case "custom_range":
    default: {
      const from = params.from ? startOfDay(new Date(params.from)) : startOfDay(now);
      const to = params.to ? endOfDay(new Date(params.to)) : end;
      return { from, to, label: `${formatFinanceDate(from)} – ${formatFinanceDate(to)}` };
    }
  }
}

function buildSummary(rows: { amount: number; status: string }[]) {
  const paid = rows.filter((r) => r.status === "Paid");
  const pending = rows.filter((r) => r.status !== "Paid");
  const amounts = paid.map((r) => r.amount);
  const totalPaid = amounts.reduce((s, a) => s + a, 0);
  return {
    totalRecords: rows.length,
    totalPaid,
    pendingPayments: pending.length,
    averagePayment: amounts.length ? totalPaid / amounts.length : 0,
    highestPayment: amounts.length ? Math.max(...amounts) : 0,
    lowestPayment: amounts.length ? Math.min(...amounts) : 0,
  };
}

function buildReportMeta(periodLabel: string) {
  const now = new Date();
  return {
    reportId: formatFinanceReportId(now),
    generatedDate: formatFinanceDate(now),
    generatedTime: formatFinanceTime(now),
    periodLabel,
  };
}

export async function generateModuleReportPdf(
  moduleType: string,
  dataType: DataType,
  rangeParams: Parameters<typeof resolveDateRange>[0],
) {
  const { from, to, label } = resolveDateRange(rangeParams);
  await financeRepo.syncPaymentStatuses(dataType);

  const payments = await financeRepo.getPaymentsInRange(dataType, moduleType, from, to);
  const rows = payments.map((p) => {
    const payment = p as typeof p & {
      notes?: string | null;
      transactionReference?: string | null;
    };
    return {
      date: formatFinanceDate(p.paidDate ?? p.dueDate),
      periodLabel: p.periodLabel,
      type: p.record.moduleType,
      name: p.record.name,
      amount: decimalToNumber(p.amount),
      status: resolvePaymentStatus(p.dueDate, p.status, p.paidDate),
      reference: payment.transactionReference ?? null,
      notes: payment.notes ?? null,
    };
  });

  const monthlyMap = new Map<string, number>();
  for (const p of payments.filter((x) => x.status === "Paid")) {
    const d = p.paidDate ?? p.dueDate;
    const key = formatPeriodLabel(d);
    monthlyMap.set(key, (monthlyMap.get(key) ?? 0) + decimalToNumber(p.amount));
  }

  const moduleLabel =
    moduleType === FINANCE_MODULES.EMI
      ? "EMI Payments"
      : moduleType === FINANCE_MODULES.RENT
        ? "Rent Payments"
        : "Subscription Payments";

  const meta = buildReportMeta(label);

  const input: FinanceReportTemplateInput = {
    title: moduleLabel,
    module: moduleType,
    periodLabel: meta.periodLabel,
    from: formatFinanceDate(from),
    to: formatFinanceDate(to),
    reportId: meta.reportId,
    generatedDate: meta.generatedDate,
    generatedTime: meta.generatedTime,
    rows,
    summary: {
      ...buildSummary(rows),
      monthlyBreakdown: Array.from(monthlyMap.entries()).map(([l, amount]) => ({
        label: l,
        amount,
      })),
    },
  };

  return renderFinanceReportTemplate(input, dataType);
}

export async function generateRecordReportPdf(
  recordId: string,
  dataType: DataType,
  rangeParams?: Parameters<typeof resolveDateRange>[0],
) {
  const record = await financeRepo.getRecordById(recordId, dataType);
  if (!record) throw new Error("NOT_FOUND");

  await financeRepo.syncPaymentStatuses(dataType);

  let payments = record.payments;
  if (rangeParams) {
    const { from, to } = resolveDateRange(rangeParams);
    payments = payments.filter((p) => p.dueDate >= from && p.dueDate <= to);
  }

  const rows = payments.map((p) => {
    const payment = p as typeof p & {
      notes?: string | null;
      transactionReference?: string | null;
    };
    return {
      date: formatFinanceDate(p.paidDate ?? p.dueDate),
      periodLabel: p.periodLabel,
      type: record.moduleType,
      name: record.name,
      amount: decimalToNumber(p.amount),
      status: resolvePaymentStatus(p.dueDate, p.status, p.paidDate),
      reference: payment.transactionReference ?? null,
      notes: payment.notes ?? null,
    };
  });

  const paidPayments = record.payments.filter((p) => p.status === "Paid");
  const totalPaid = paidPayments.reduce((s, p) => s + decimalToNumber(p.amount), 0);
  const pendingCount = record.payments.filter((p) => p.status !== "Paid").length;
  const current = record.payments.find((p) => p.status !== "Paid");

  const range = rangeParams
    ? resolveDateRange(rangeParams)
    : {
        from: record.payments[record.payments.length - 1]?.dueDate ?? new Date(),
        to: new Date(),
        label: "All Time",
      };

  const meta = buildReportMeta(range.label);

  const input: FinanceReportTemplateInput = {
    title: record.name,
    module: record.moduleType,
    periodLabel: meta.periodLabel,
    from: formatFinanceDate(range.from),
    to: formatFinanceDate(range.to),
    reportId: meta.reportId,
    generatedDate: meta.generatedDate,
    generatedTime: meta.generatedTime,
    rows,
    summary: buildSummary(rows),
    detailInfo: {
      name: record.name,
      amount: decimalToNumber(record.amount),
      status: current
        ? resolvePaymentStatus(current.dueDate, current.status, current.paidDate)
        : "Paid",
      dueDay: record.dueDay,
      dueDate: current ? formatFinanceDate(current.dueDate) : null,
      category: record.category,
      notes: record.notes,
      createdAt: formatFinanceDate(record.createdAt),
      updatedAt: formatFinanceDate(record.updatedAt),
      totalPaid,
      totalRemaining: pendingCount * decimalToNumber(record.amount),
      paymentsCompleted: paidPayments.length,
      paymentsPending: pendingCount,
    },
  };

  return renderFinanceReportTemplate(input, dataType);
}
