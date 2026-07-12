import * as financeRepo from "../repositories/financeRepository.js";
import { syncBudgetFromFinancePayment } from "../budget/financeSync.js";
import { FINANCE_MODULES } from "../finance/constants.js";
import {
  calculateEmiProgress,
  getSubscriptionStatus,
  getUrgencyLevel,
  monthlyAmountFromBilling,
  resolvePaymentStatus,
} from "../finance/engine.js";
import { decimalToNumber } from "../lib/serializers.js";
import type { DataType } from "../auth/config.js";
import type {
  CreateEmiInput,
  CreateRentInput,
  CreateSubscriptionInput,
} from "../repositories/financeRepository.js";

function serializePayment<T extends {
  amount: unknown;
  dueDate: Date;
  paidDate: Date | null;
  status: string;
  notes?: string | null;
  transactionReference?: string | null;
  createdBy?: string | null;
  createdAt: Date;
  updatedAt: Date;
}>(payment: T) {
  const status = resolvePaymentStatus(payment.dueDate, payment.status, payment.paidDate);
  return {
    ...payment,
    amount: decimalToNumber(payment.amount),
    dueDate: payment.dueDate.toISOString(),
    paidDate: payment.paidDate?.toISOString() ?? null,
    status,
    urgency: getUrgencyLevel(payment.dueDate, status),
    transactionId: (payment as { id?: string }).id ?? null,
    createdAt: payment.createdAt.toISOString(),
    updatedAt: payment.updatedAt.toISOString(),
  };
}

function enrichListFields(payments: ReturnType<typeof serializePayment>[]) {
  const paidSorted = payments
    .filter((p) => p.status === "Paid")
    .sort((a, b) => new Date(b.paidDate ?? b.dueDate).getTime() - new Date(a.paidDate ?? a.dueDate).getTime());
  const nextPending = payments.find((p) => p.status !== "Paid");
  const lastPaid = paidSorted[0]?.paidDate ?? null;

  return {
    status: nextPending?.status ?? "Paid",
    dueDate: nextPending?.dueDate ?? paidSorted[0]?.dueDate ?? null,
    nextDue: nextPending?.dueDate ?? null,
    lastPaid,
  };
}

function serializeRecord(record: Awaited<ReturnType<typeof financeRepo.getRecordById>>) {
  if (!record) return null;

  const payments = record.payments.map(serializePayment);
  const currentPayment =
    payments.find((p) => p.status !== "Paid") ?? payments[payments.length - 1] ?? null;
  const listFields = enrichListFields(payments);

  const paidTotal = payments
    .filter((p) => p.status === "Paid")
    .reduce((s, p) => s + p.amount, 0);
  const pendingCount = payments.filter((p) => p.status !== "Paid").length;

  const base = {
    id: record.id,
    moduleType: record.moduleType,
    name: record.name,
    amount: decimalToNumber(record.amount),
    totalAmount: record.totalAmount != null ? decimalToNumber(record.totalAmount) : null,
    dueDay: record.dueDay,
    totalMonths: record.totalMonths,
    remainingMonths: record.remainingMonths,
    currentInstallment: record.currentInstallment,
    startDate: record.startDate?.toISOString() ?? null,
    websiteUrl: record.websiteUrl,
    billingCycle: record.billingCycle,
    renewalDate: record.renewalDate?.toISOString() ?? null,
    autoRenew: record.autoRenew,
    category: record.category,
    notes: record.notes,
    type: record.type,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
    payments,
    currentPayment,
    ...listFields,
    paymentSummary: {
      totalPaid: paidTotal,
      totalRemaining: pendingCount * decimalToNumber(record.amount),
      currentMonthStatus: currentPayment?.status ?? "Paid",
      nextDue: listFields.nextDue,
      paymentsCompleted: payments.filter((p) => p.status === "Paid").length,
      paymentsPending: pendingCount,
    },
  };

  if (record.moduleType === FINANCE_MODULES.EMI) {
    return {
      ...base,
      progress: calculateEmiProgress(record.totalMonths ?? 0, record.remainingMonths ?? 0),
    };
  }

  if (record.moduleType === FINANCE_MODULES.SUBSCRIPTION && record.renewalDate) {
    return {
      ...base,
      subscriptionStatus: getSubscriptionStatus(record.renewalDate),
      monthlyEquivalent: monthlyAmountFromBilling(decimalToNumber(record.amount), record.billingCycle ?? "Monthly"),
    };
  }

  return base;
}

export async function listModuleRecords(
  moduleType: string,
  dataType: DataType,
  options: { search?: string; status?: string; page?: number; pageSize?: number },
) {
  await financeRepo.syncPaymentStatuses(dataType);

  if (moduleType === FINANCE_MODULES.RENT) {
    const all = await financeRepo.listRecords(moduleType, dataType);
    for (const r of all) {
      await financeRepo.ensureRentMonthlyEntries(r.id, dataType);
    }
  }

  const result = await financeRepo.listRecordsFiltered({
    moduleType,
    dataType,
    ...options,
  });

  return {
    items: result.items.map((r) => serializeRecord(r)!),
    total: result.total,
    page: result.page,
    pageSize: result.pageSize,
    stats: computeModuleStats(result.allFiltered.map((r) => serializeRecord(r)!)),
  };
}

function computeModuleStats(items: NonNullable<ReturnType<typeof serializeRecord>>[]) {
  const overdue = items.filter((i) => i.status === "Overdue").length;
  const pending = items.filter((i) => i.status === "Pending").length;
  const paid = items.filter((i) => i.status === "Paid").length;
  const totalAmount = items.reduce((s, i) => s + i.amount, 0);
  return { total: items.length, overdue, pending, paid, totalAmount };
}

export async function listEmiRecords(
  dataType: DataType,
  options?: { search?: string; status?: string; page?: number; pageSize?: number },
) {
  return listModuleRecords(FINANCE_MODULES.EMI, dataType, options ?? {});
}

export async function listRentRecords(
  dataType: DataType,
  options?: { search?: string; status?: string; page?: number; pageSize?: number },
) {
  return listModuleRecords(FINANCE_MODULES.RENT, dataType, options ?? {});
}

export async function listSubscriptionRecords(
  dataType: DataType,
  options?: { search?: string; status?: string; page?: number; pageSize?: number },
) {
  return listModuleRecords(FINANCE_MODULES.SUBSCRIPTION, dataType, options ?? {});
}

export async function getFinanceRecord(id: string, dataType: DataType) {
  await financeRepo.syncPaymentStatuses(dataType);
  const record = await financeRepo.getRecordById(id, dataType);
  if (!record) throw new Error("NOT_FOUND");
  if (record.moduleType === FINANCE_MODULES.RENT) {
    await financeRepo.ensureRentMonthlyEntries(id, dataType);
    const refreshed = await financeRepo.getRecordById(id, dataType);
    return serializeRecord(refreshed);
  }
  return serializeRecord(record);
}

export async function updateFinanceRecord(
  id: string,
  dataType: DataType,
  data: Record<string, unknown>,
) {
  const updated = await financeRepo.updateRecord(id, dataType, data);
  if (!updated) throw new Error("NOT_FOUND");
  return serializeRecord(updated);
}

export async function createEmi(data: CreateEmiInput, dataType: DataType) {
  const record = await financeRepo.createEmi(data, dataType);
  return serializeRecord(record);
}

export async function createRent(data: CreateRentInput, dataType: DataType) {
  const record = await financeRepo.createRent(data, dataType);
  return serializeRecord(record);
}

export async function createSubscription(data: CreateSubscriptionInput, dataType: DataType) {
  const record = await financeRepo.createSubscription(data, dataType);
  return serializeRecord(record);
}

export async function markPaymentPaid(paymentId: string, dataType: DataType) {
  const result = await financeRepo.markPaymentPaid(paymentId, dataType);
  if (!result) throw new Error("NOT_FOUND");
  return serializePayment(result);
}

export async function markRecordPaid(
  recordId: string,
  dataType: DataType,
  details: financeRepo.MarkPaidDetails,
) {
  const record = await financeRepo.getRecordById(recordId, dataType);
  if (!record) throw new Error("NOT_FOUND");

  const result = await financeRepo.markRecordPaid(recordId, dataType, details);
  if (!result) throw new Error("NOT_FOUND");

  const paidAmount = details.amount ?? Number(result.amount);
  const paidDate = details.paidDate ? new Date(details.paidDate) : new Date();

  await syncBudgetFromFinancePayment(
    dataType,
    paidAmount,
    record.moduleType,
    record.name,
    paidDate,
  );

  const refreshed = await financeRepo.getRecordById(recordId, dataType);
  return serializeRecord(refreshed);
}

export async function markEmiCurrentPaid(
  recordId: string,
  dataType: DataType,
  details?: financeRepo.MarkPaidDetails,
) {
  return markRecordPaid(recordId, dataType, details ?? {});
}

export async function markRentCurrentPaid(
  recordId: string,
  dataType: DataType,
  details?: financeRepo.MarkPaidDetails,
) {
  return markRecordPaid(recordId, dataType, details ?? {});
}

export async function markSubscriptionPaid(
  recordId: string,
  dataType: DataType,
  details?: financeRepo.MarkPaidDetails,
) {
  return markRecordPaid(recordId, dataType, details ?? {});
}

export async function deleteFinanceRecord(id: string, dataType: DataType) {
  const existing = await financeRepo.getRecordById(id, dataType);
  if (!existing) throw new Error("NOT_FOUND");
  await financeRepo.deleteRecord(id, dataType);
}

export async function getFinanceOverview(dataType: DataType) {
  const data = await financeRepo.getOverviewData(dataType);

  return {
    stats: data.stats,
    breakdown: data.breakdown,
    monthlyTrend: data.monthlyTrend,
    upcoming: data.upcoming.slice(0, 10).map((p) => ({
      ...serializePayment(p),
      recordName: p.recordName,
      moduleType: p.moduleType,
    })),
    overdue: data.overdue.slice(0, 10).map((p) => ({
      ...serializePayment(p),
      recordName: p.recordName,
      moduleType: p.moduleType,
    })),
    recentlyPaid: data.recentlyPaid.map((p) => ({
      ...serializePayment(p),
      recordName: p.recordName,
      moduleType: p.moduleType,
    })),
    upcomingRenewals: data.upcomingRenewals.map((r) => ({
      id: r.id,
      name: r.name,
      renewalDate: r.renewalDate?.toISOString() ?? null,
      amount: decimalToNumber(r.amount),
      category: r.category,
      subscriptionStatus: r.renewalDate ? getSubscriptionStatus(r.renewalDate) : "Active",
    })),
    calendar: Object.entries(data.calendarByDay).map(([day, items]) => ({
      day: Number(day),
      items: items.map((p) => ({
        id: p.id,
        recordName: p.recordName,
        moduleType: p.moduleType,
        amount: decimalToNumber(p.amount),
        dueDate: p.dueDate.toISOString(),
        status: resolvePaymentStatus(p.dueDate, p.status, p.paidDate),
        urgency: getUrgencyLevel(p.dueDate, resolvePaymentStatus(p.dueDate, p.status, p.paidDate)),
      })),
    })),
  };
}

export async function getFinanceNotifications(dataType: DataType) {
  return financeRepo.getFinanceNotifications(dataType);
}

export { serializeRecord, serializePayment };
