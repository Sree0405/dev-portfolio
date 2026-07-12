import {
  FINANCE_PAYMENT_STATUS,
  type UrgencyLevel,
} from "./constants.js";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function daysBetween(from: Date, to: Date): number {
  return Math.floor((startOfDay(to).getTime() - startOfDay(from).getTime()) / MS_PER_DAY);
}

export function formatPeriodLabel(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric" }).format(date);
}

export function buildDueDate(year: number, month: number, dueDay: number): Date {
  const lastDay = new Date(year, month + 1, 0).getDate();
  const day = Math.min(dueDay, lastDay);
  return new Date(year, month, day, 12, 0, 0, 0);
}

export function resolvePaymentStatus(
  dueDate: Date,
  currentStatus: string,
  paidDate?: Date | null,
): string {
  if (currentStatus === FINANCE_PAYMENT_STATUS.PAID || paidDate) {
    return FINANCE_PAYMENT_STATUS.PAID;
  }
  const today = startOfDay(new Date());
  const due = startOfDay(dueDate);
  if (due < today) return FINANCE_PAYMENT_STATUS.OVERDUE;
  return FINANCE_PAYMENT_STATUS.PENDING;
}

export function getUrgencyLevel(dueDate: Date, status: string): UrgencyLevel {
  if (status === FINANCE_PAYMENT_STATUS.PAID) return "safe";

  const days = daysBetween(startOfDay(new Date()), startOfDay(dueDate));

  if (days < 0) return "overdue";
  if (days === 0) return "due";
  if (days <= 10) return "warning";
  return "safe";
}

export function calculateEmiProgress(totalMonths: number, remainingMonths: number): number {
  if (totalMonths <= 0) return 0;
  const completed = totalMonths - remainingMonths;
  return Math.min(100, Math.max(0, Math.round((completed / totalMonths) * 100)));
}

export function calculateNextRenewalDate(current: Date, billingCycle: string): Date {
  const next = new Date(current);
  switch (billingCycle) {
    case "Quarterly":
      next.setMonth(next.getMonth() + 3);
      break;
    case "Half Yearly":
      next.setMonth(next.getMonth() + 6);
      break;
    case "Yearly":
      next.setFullYear(next.getFullYear() + 1);
      break;
    default:
      next.setMonth(next.getMonth() + 1);
      break;
  }
  return next;
}

export function getSubscriptionStatus(renewalDate: Date): string {
  const days = daysBetween(startOfDay(new Date()), startOfDay(renewalDate));
  if (days < 0) return "Expired";
  if (days <= 10) return "Expiring Soon";
  return "Active";
}

export function generateEmiDueDates(startDate: Date, totalMonths: number, dueDay: number): Date[] {
  const dates: Date[] = [];
  const start = new Date(startDate);
  for (let i = 0; i < totalMonths; i++) {
    const month = start.getMonth() + i;
    const year = start.getFullYear() + Math.floor(month / 12);
    const normalizedMonth = month % 12;
    dates.push(buildDueDate(year, normalizedMonth, dueDay));
  }
  return dates;
}

export function getCurrentMonthDueDate(dueDay: number, reference = new Date()): Date {
  return buildDueDate(reference.getFullYear(), reference.getMonth(), dueDay);
}

export function monthlyAmountFromBilling(amount: number, billingCycle: string): number {
  switch (billingCycle) {
    case "Quarterly":
      return amount / 3;
    case "Half Yearly":
      return amount / 6;
    case "Yearly":
      return amount / 12;
    default:
      return amount;
  }
}
