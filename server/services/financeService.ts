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
  userId: string,
  options: { search?: string; status?: string; page?: number; pageSize?: number },
) {
  await financeRepo.syncPaymentStatuses(userId);

  if (moduleType === FINANCE_MODULES.RENT) {
    const all = await financeRepo.listRecords(moduleType, userId);
    for (const r of all) {
      await financeRepo.ensureRentMonthlyEntries(r.id, userId);
    }
  }

  const result = await financeRepo.listRecordsFiltered({
    moduleType,
    userId,
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
  userId: string,
  options?: { search?: string; status?: string; page?: number; pageSize?: number },
) {
  return listModuleRecords(FINANCE_MODULES.EMI, userId, options ?? {});
}

export async function listRentRecords(
  userId: string,
  options?: { search?: string; status?: string; page?: number; pageSize?: number },
) {
  return listModuleRecords(FINANCE_MODULES.RENT, userId, options ?? {});
}

export async function listSubscriptionRecords(
  userId: string,
  options?: { search?: string; status?: string; page?: number; pageSize?: number },
) {
  return listModuleRecords(FINANCE_MODULES.SUBSCRIPTION, userId, options ?? {});
}

export async function getFinanceRecord(id: string, userId: string) {
  await financeRepo.syncPaymentStatuses(userId);
  const record = await financeRepo.getRecordById(id, userId);
  if (!record) throw new Error("NOT_FOUND");
  if (record.moduleType === FINANCE_MODULES.RENT) {
    await financeRepo.ensureRentMonthlyEntries(id, userId);
    const refreshed = await financeRepo.getRecordById(id, userId);
    return serializeRecord(refreshed);
  }
  return serializeRecord(record);
}

export async function updateFinanceRecord(
  id: string,
  userId: string,
  data: Record<string, unknown>,
) {
  const updated = await financeRepo.updateRecord(id, userId, data);
  if (!updated) throw new Error("NOT_FOUND");
  return serializeRecord(updated);
}

export async function createEmi(data: CreateEmiInput, userId: string) {
  const record = await financeRepo.createEmi(data, userId);
  return serializeRecord(record);
}

export async function createRent(data: CreateRentInput, userId: string) {
  const record = await financeRepo.createRent(data, userId);
  return serializeRecord(record);
}

export async function createSubscription(data: CreateSubscriptionInput, userId: string) {
  const record = await financeRepo.createSubscription(data, userId);
  return serializeRecord(record);
}

export async function markPaymentPaid(paymentId: string, userId: string) {
  const result = await financeRepo.markPaymentPaid(paymentId, userId);
  if (!result) throw new Error("NOT_FOUND");
  return serializePayment(result);
}

export async function markRecordPaid(
  recordId: string,
  userId: string,
  details: financeRepo.MarkPaidDetails,
) {
  const record = await financeRepo.getRecordById(recordId, userId);
  if (!record) throw new Error("NOT_FOUND");

  const result = await financeRepo.markRecordPaid(recordId, userId, details);
  if (!result) throw new Error("NOT_FOUND");

  const paidAmount = details.amount ?? Number(result.amount);
  const paidDate = details.paidDate ? new Date(details.paidDate) : new Date();

  await syncBudgetFromFinancePayment(
    userId,
    paidAmount,
    record.moduleType,
    record.name,
    paidDate,
  );

  const refreshed = await financeRepo.getRecordById(recordId, userId);
  return serializeRecord(refreshed);
}

export async function markEmiCurrentPaid(
  recordId: string,
  userId: string,
  details?: financeRepo.MarkPaidDetails,
) {
  return markRecordPaid(recordId, userId, details ?? {});
}

export async function markRentCurrentPaid(
  recordId: string,
  userId: string,
  details?: financeRepo.MarkPaidDetails,
) {
  return markRecordPaid(recordId, userId, details ?? {});
}

export async function markSubscriptionPaid(
  recordId: string,
  userId: string,
  details?: financeRepo.MarkPaidDetails,
) {
  return markRecordPaid(recordId, userId, details ?? {});
}

export async function deleteFinanceRecord(id: string, userId: string) {
  const existing = await financeRepo.getRecordById(id, userId);
  if (!existing) throw new Error("NOT_FOUND");
  await financeRepo.deleteRecord(id, userId);
}

export async function getFinanceOverview(userId: string) {
  const data = await financeRepo.getOverviewData(userId);

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

export async function getFinanceNotifications(userId: string) {
  return financeRepo.getFinanceNotifications(userId);
}

export { serializeRecord, serializePayment };
