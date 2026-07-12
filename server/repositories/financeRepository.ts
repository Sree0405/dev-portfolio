import prisma from "../prisma/client.js";
import type { DataType } from "../auth/config.js";
import { FINANCE_MODULES, FINANCE_PAYMENT_STATUS } from "../finance/constants.js";
import {
  formatPeriodLabel,
  generateEmiDueDates,
  getCurrentMonthDueDate,
  resolvePaymentStatus,
} from "../finance/engine.js";

export interface CreateEmiInput {
  name: string;
  totalAmount: number;
  emiAmount: number;
  totalMonths: number;
  startDate: string;
  dueDay: number;
  notes?: string | null;
}

export interface CreateRentInput {
  name: string;
  monthlyAmount: number;
  dueDay: number;
  notes?: string | null;
}

export interface CreateSubscriptionInput {
  serviceName: string;
  websiteUrl?: string | null;
  monthlyCost: number;
  billingCycle: string;
  renewalDate: string;
  autoRenew?: boolean;
  category?: string | null;
  notes?: string | null;
}

export async function listRecords(moduleType: string, dataType: DataType) {
  return prisma.financeRecord.findMany({
    where: { moduleType, type: dataType },
    include: {
      payments: { orderBy: { dueDate: "desc" } },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getRecordById(id: string, dataType: DataType) {
  return prisma.financeRecord.findFirst({
    where: { id, type: dataType },
    include: {
      payments: { orderBy: { dueDate: "desc" } },
    },
  });
}

export async function createEmi(data: CreateEmiInput, dataType: DataType) {
  const startDate = new Date(data.startDate);
  const dueDates = generateEmiDueDates(startDate, data.totalMonths, data.dueDay);

  return prisma.$transaction(async (tx) => {
    const record = await tx.financeRecord.create({
      data: {
        moduleType: FINANCE_MODULES.EMI,
        name: data.name,
        amount: data.emiAmount,
        totalAmount: data.totalAmount,
        dueDay: data.dueDay,
        totalMonths: data.totalMonths,
        remainingMonths: data.totalMonths,
        currentInstallment: 1,
        startDate,
        notes: data.notes || null,
        type: dataType,
      },
    });

    await tx.financePaymentHistory.createMany({
      data: dueDates.map((dueDate, index) => ({
        recordId: record.id,
        amount: data.emiAmount,
        dueDate,
        status: FINANCE_PAYMENT_STATUS.PENDING,
        periodLabel: `Installment ${index + 1}`,
        installmentNumber: index + 1,
        type: dataType,
      })),
    });

    return tx.financeRecord.findFirst({
      where: { id: record.id },
      include: { payments: { orderBy: { dueDate: "asc" } } },
    });
  });
}

export async function createRent(data: CreateRentInput, dataType: DataType) {
  return prisma.$transaction(async (tx) => {
    const record = await tx.financeRecord.create({
      data: {
        moduleType: FINANCE_MODULES.RENT,
        name: data.name,
        amount: data.monthlyAmount,
        dueDay: data.dueDay,
        notes: data.notes || null,
        type: dataType,
      },
    });

    const dueDate = getCurrentMonthDueDate(data.dueDay);
    await tx.financePaymentHistory.create({
      data: {
        recordId: record.id,
        amount: data.monthlyAmount,
        dueDate,
        status: FINANCE_PAYMENT_STATUS.PENDING,
        periodLabel: formatPeriodLabel(dueDate),
        type: dataType,
      },
    });

    return tx.financeRecord.findFirst({
      where: { id: record.id },
      include: { payments: { orderBy: { dueDate: "desc" } } },
    });
  });
}

export async function createSubscription(data: CreateSubscriptionInput, dataType: DataType) {
  const renewalDate = new Date(data.renewalDate);

  return prisma.$transaction(async (tx) => {
    const record = await tx.financeRecord.create({
      data: {
        moduleType: FINANCE_MODULES.SUBSCRIPTION,
        name: data.serviceName,
        amount: data.monthlyCost,
        websiteUrl: data.websiteUrl || null,
        billingCycle: data.billingCycle,
        renewalDate,
        autoRenew: data.autoRenew ?? true,
        category: data.category || null,
        notes: data.notes || null,
        type: dataType,
      },
    });

    await tx.financePaymentHistory.create({
      data: {
        recordId: record.id,
        amount: data.monthlyCost,
        dueDate: renewalDate,
        status: FINANCE_PAYMENT_STATUS.PENDING,
        periodLabel: formatPeriodLabel(renewalDate),
        type: dataType,
      },
    });

    return tx.financeRecord.findFirst({
      where: { id: record.id },
      include: { payments: { orderBy: { dueDate: "desc" } } },
    });
  });
}

export async function ensureRentMonthlyEntries(recordId: string, dataType: DataType) {
  const record = await prisma.financeRecord.findFirst({
    where: { id: recordId, type: dataType, moduleType: FINANCE_MODULES.RENT },
  });
  if (!record || !record.dueDay) return;

  const dueDate = getCurrentMonthDueDate(record.dueDay);
  const periodLabel = formatPeriodLabel(dueDate);

  const existing = await prisma.financePaymentHistory.findFirst({
    where: {
      recordId,
      type: dataType,
      periodLabel,
    },
  });

  if (!existing) {
    await prisma.financePaymentHistory.create({
      data: {
        recordId,
        amount: record.amount,
        dueDate,
        status: FINANCE_PAYMENT_STATUS.PENDING,
        periodLabel,
        type: dataType,
      },
    });
  }
}

export async function syncPaymentStatuses(dataType: DataType) {
  const pending = await prisma.financePaymentHistory.findMany({
    where: {
      type: dataType,
      status: { in: [FINANCE_PAYMENT_STATUS.PENDING, FINANCE_PAYMENT_STATUS.OVERDUE] },
    },
  });

  for (const payment of pending) {
    const nextStatus = resolvePaymentStatus(payment.dueDate, payment.status, payment.paidDate);
    if (nextStatus !== payment.status) {
      await prisma.financePaymentHistory.update({
        where: { id: payment.id },
        data: { status: nextStatus },
      });
    }
  }
}

export interface ListFinanceOptions {
  moduleType: string;
  dataType: DataType;
  search?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

export interface MarkPaidDetails {
  amount?: number;
  paidDate?: string;
  notes?: string | null;
  transactionReference?: string | null;
  createdBy?: string;
}

export async function listRecordsFiltered(options: ListFinanceOptions) {
  const { moduleType, dataType, search = "", status, page = 1, pageSize = 10 } = options;

  const where = {
    moduleType,
    type: dataType,
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { category: { contains: search, mode: "insensitive" as const } },
            { notes: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const records = await prisma.financeRecord.findMany({
    where,
    include: { payments: { orderBy: { dueDate: "desc" } } },
    orderBy: { updatedAt: "desc" },
  });

  let filtered = records;
  if (status && status !== "All") {
    filtered = records.filter((r) => {
      const pending = r.payments.find((p) => p.status !== FINANCE_PAYMENT_STATUS.PAID);
      const st = pending
        ? resolvePaymentStatus(pending.dueDate, pending.status, pending.paidDate)
        : FINANCE_PAYMENT_STATUS.PAID;
      return st === status;
    });
  }

  const total = filtered.length;
  const items = filtered.slice((page - 1) * pageSize, page * pageSize);

  return { items, total, page, pageSize, allFiltered: filtered };
}

export async function updateRecord(
  id: string,
  dataType: DataType,
  data: Record<string, unknown>,
) {
  const existing = await prisma.financeRecord.findFirst({ where: { id, type: dataType } });
  if (!existing) return null;

  return prisma.financeRecord.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: String(data.name) }),
      ...(data.amount !== undefined && { amount: Number(data.amount) }),
      ...(data.totalAmount !== undefined && { totalAmount: Number(data.totalAmount) }),
      ...(data.dueDay !== undefined && { dueDay: Number(data.dueDay) }),
      ...(data.notes !== undefined && { notes: (data.notes as string) || null }),
      ...(data.category !== undefined && { category: (data.category as string) || null }),
      ...(data.websiteUrl !== undefined && { websiteUrl: (data.websiteUrl as string) || null }),
      ...(data.billingCycle !== undefined && { billingCycle: data.billingCycle as string }),
      ...(data.renewalDate !== undefined && { renewalDate: new Date(data.renewalDate as string) }),
      ...(data.autoRenew !== undefined && { autoRenew: Boolean(data.autoRenew) }),
    },
    include: { payments: { orderBy: { dueDate: "desc" } } },
  });
}

export async function findPendingPayment(recordId: string, dataType: DataType) {
  const record = await prisma.financeRecord.findFirst({
    where: { id: recordId, type: dataType },
    include: { payments: { orderBy: { dueDate: "asc" } } },
  });
  if (!record) return null;

  if (record.moduleType === FINANCE_MODULES.EMI) {
    return (
      record.payments.find(
        (p) =>
          p.status !== FINANCE_PAYMENT_STATUS.PAID &&
          (p.installmentNumber === record.currentInstallment ||
            p.installmentNumber === (record.currentInstallment ?? 1)),
      ) ?? record.payments.find((p) => p.status !== FINANCE_PAYMENT_STATUS.PAID)
    );
  }

  if (record.moduleType === FINANCE_MODULES.RENT) {
    await ensureRentMonthlyEntries(recordId, dataType);
    const refreshed = await prisma.financeRecord.findFirst({
      where: { id: recordId, type: dataType },
      include: { payments: { orderBy: { dueDate: "desc" } } },
    });
    const now = new Date();
    return refreshed?.payments.find(
      (p) =>
        p.dueDate.getMonth() === now.getMonth() &&
        p.dueDate.getFullYear() === now.getFullYear() &&
        p.status !== FINANCE_PAYMENT_STATUS.PAID,
    );
  }

  return record.payments.find((p) => p.status !== FINANCE_PAYMENT_STATUS.PAID) ?? null;
}

export async function markRecordPaid(
  recordId: string,
  dataType: DataType,
  details: MarkPaidDetails = {},
) {
  const pending = await findPendingPayment(recordId, dataType);
  if (!pending) return null;
  return markPaymentPaid(pending.id, dataType, details);
}

export async function getPaymentsInRange(
  dataType: DataType,
  moduleType: string,
  from: Date,
  to: Date,
  recordId?: string,
) {
  return prisma.financePaymentHistory.findMany({
    where: {
      type: dataType,
      dueDate: { gte: from, lte: to },
      record: {
        moduleType,
        ...(recordId ? { id: recordId } : {}),
      },
    },
    include: { record: true },
    orderBy: { dueDate: "asc" },
  });
}

export async function markPaymentPaid(
  paymentId: string,
  dataType: DataType,
  details: MarkPaidDetails = {},
) {
  const payment = await prisma.financePaymentHistory.findFirst({
    where: { id: paymentId, type: dataType },
    include: { record: true },
  });
  if (!payment) return null;

  const paidDate = details.paidDate ? new Date(details.paidDate) : new Date();
  const paidAmount = details.amount ?? Number(payment.amount);

  return prisma.$transaction(async (tx) => {
    await tx.financePaymentHistory.update({
      where: { id: paymentId },
      data: {
        status: FINANCE_PAYMENT_STATUS.PAID,
        paidDate,
        amount: paidAmount,
        notes: details.notes ?? payment.notes,
        transactionReference: details.transactionReference ?? payment.transactionReference,
        createdBy: details.createdBy ?? payment.createdBy,
      },
    });

    const record = payment.record;

    if (record.moduleType === FINANCE_MODULES.EMI && record.remainingMonths != null) {
      const remaining = Math.max(0, record.remainingMonths - 1);
      await tx.financeRecord.update({
        where: { id: record.id },
        data: {
          remainingMonths: remaining,
          currentInstallment: (record.currentInstallment ?? 1) + 1,
        },
      });
    }

    if (record.moduleType === FINANCE_MODULES.SUBSCRIPTION && record.renewalDate) {
      const { calculateNextRenewalDate } = await import("../finance/engine.js");
      const nextRenewal = calculateNextRenewalDate(record.renewalDate, record.billingCycle ?? "Monthly");
      await tx.financeRecord.update({
        where: { id: record.id },
        data: { renewalDate: nextRenewal },
      });
      await tx.financePaymentHistory.create({
        data: {
          recordId: record.id,
          amount: record.amount,
          dueDate: nextRenewal,
          status: FINANCE_PAYMENT_STATUS.PENDING,
          periodLabel: formatPeriodLabel(nextRenewal),
          type: dataType,
        },
      });
    }

    return tx.financePaymentHistory.findFirst({
      where: { id: paymentId },
      include: { record: { include: { payments: { orderBy: { dueDate: "desc" } } } } },
    });
  });
}

export async function markEmiCurrentMonthPaid(recordId: string, dataType: DataType) {
  const record = await prisma.financeRecord.findFirst({
    where: { id: recordId, type: dataType, moduleType: FINANCE_MODULES.EMI },
    include: { payments: { orderBy: { dueDate: "asc" } } },
  });
  if (!record) return null;

  const current = record.payments.find(
    (p) =>
      p.status !== FINANCE_PAYMENT_STATUS.PAID &&
      (p.installmentNumber === record.currentInstallment ||
        p.installmentNumber === (record.currentInstallment ?? 1)),
  ) ?? record.payments.find((p) => p.status !== FINANCE_PAYMENT_STATUS.PAID);

  if (!current) return null;
  return markPaymentPaid(current.id, dataType);
}

export async function deleteRecord(id: string, dataType: DataType) {
  return prisma.financeRecord.delete({
    where: { id, type: dataType },
  });
}

export async function getOverviewData(dataType: DataType) {
  await syncPaymentStatuses(dataType);

  const records = await prisma.financeRecord.findMany({
    where: { type: dataType },
    include: { payments: true },
  });

  const allPayments = records.flatMap((r) =>
    r.payments.map((p) => ({ ...p, recordName: r.name, moduleType: r.moduleType })),
  );

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  const yearStart = new Date(now.getFullYear(), 0, 1);

  const monthlyTotal = allPayments
    .filter((p) => p.dueDate >= monthStart && p.dueDate <= monthEnd)
    .reduce((s, p) => s + Number(p.amount), 0);

  const yearlyTotal = allPayments
    .filter((p) => p.dueDate >= yearStart)
    .reduce((s, p) => s + Number(p.amount), 0);

  const paidThisMonth = allPayments
    .filter(
      (p) =>
        p.status === FINANCE_PAYMENT_STATUS.PAID &&
        p.paidDate &&
        p.paidDate >= monthStart &&
        p.paidDate <= monthEnd,
    )
    .reduce((s, p) => s + Number(p.amount), 0);

  const pendingThisMonth = allPayments
    .filter(
      (p) =>
        p.dueDate >= monthStart &&
        p.dueDate <= monthEnd &&
        p.status !== FINANCE_PAYMENT_STATUS.PAID,
    )
    .reduce((s, p) => s + Number(p.amount), 0);

  const upcoming = allPayments
    .filter(
      (p) =>
        p.status !== FINANCE_PAYMENT_STATUS.PAID &&
        p.dueDate >= now,
    )
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());

  const overdue = allPayments
    .filter((p) => p.status === FINANCE_PAYMENT_STATUS.OVERDUE)
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());

  const breakdown = Object.entries(
    records.reduce<Record<string, number>>((acc, r) => {
      const monthly = Number(r.amount);
      acc[r.moduleType] = (acc[r.moduleType] ?? 0) + monthly;
      return acc;
    }, {}),
  ).map(([moduleType, amount]) => ({ moduleType, amount }));

  const trendMap = new Map<string, number>();
  for (const p of allPayments) {
    const key = `${p.dueDate.getFullYear()}-${String(p.dueDate.getMonth() + 1).padStart(2, "0")}`;
    trendMap.set(key, (trendMap.get(key) ?? 0) + Number(p.amount));
  }
  const monthlyTrend = Array.from(trendMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([key, amount]) => ({ month: key, amount }));

  const recentlyPaid = allPayments
    .filter((p) => p.status === FINANCE_PAYMENT_STATUS.PAID && p.paidDate)
    .sort((a, b) => (b.paidDate?.getTime() ?? 0) - (a.paidDate?.getTime() ?? 0))
    .slice(0, 8);

  const upcomingRenewals = records
    .filter((r) => r.moduleType === FINANCE_MODULES.SUBSCRIPTION && r.renewalDate)
    .sort((a, b) => (a.renewalDate?.getTime() ?? 0) - (b.renewalDate?.getTime() ?? 0))
    .slice(0, 8);

  const calendarMonth = now.getMonth();
  const calendarYear = now.getFullYear();
  const calendarPayments = allPayments.filter(
    (p) =>
      p.dueDate.getMonth() === calendarMonth &&
      p.dueDate.getFullYear() === calendarYear &&
      p.status !== FINANCE_PAYMENT_STATUS.PAID,
  );

  const calendarByDay = calendarPayments.reduce<Record<number, typeof calendarPayments>>(
    (acc, p) => {
      const day = p.dueDate.getDate();
      if (!acc[day]) acc[day] = [];
      acc[day].push(p);
      return acc;
    },
    {},
  );

  return {
    records,
    allPayments,
    stats: {
      totalMonthlyExpenses: monthlyTotal,
      totalYearlyExpenses: yearlyTotal,
      paidThisMonth,
      pendingThisMonth,
      upcomingCount: upcoming.length,
      overdueCount: overdue.length,
    },
    breakdown,
    monthlyTrend,
    upcoming,
    overdue,
    recentlyPaid,
    upcomingRenewals,
    calendarByDay,
  };
}

export async function getFinanceNotifications(dataType: DataType) {
  await syncPaymentStatuses(dataType);
  const payments = await prisma.financePaymentHistory.findMany({
    where: { type: dataType },
    include: { record: true },
  });

  const now = startOfDayHelper(new Date());
  const upcoming = payments.filter(
    (p) =>
      p.status !== FINANCE_PAYMENT_STATUS.PAID &&
      startOfDayHelper(p.dueDate) >= now,
  );
  const overdue = payments.filter((p) => p.status === FINANCE_PAYMENT_STATUS.OVERDUE);

  return { upcomingCount: upcoming.length, overdueCount: overdue.length };
}

function startOfDayHelper(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}
