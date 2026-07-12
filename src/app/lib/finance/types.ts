import type { UrgencyLevel } from "./constants";

export type FinancePaymentStatus = "Pending" | "Paid" | "Overdue";

export interface FinancePayment {
  id: string;
  recordId: string;
  amount: number;
  dueDate: string;
  paidDate: string | null;
  status: FinancePaymentStatus;
  periodLabel: string | null;
  installmentNumber: number | null;
  notes?: string | null;
  transactionReference?: string | null;
  transactionId?: string | null;
  createdBy?: string | null;
  urgency: UrgencyLevel;
  createdAt: string;
  updatedAt: string;
}

export interface FinancePaymentSummary {
  totalPaid: number;
  totalRemaining: number;
  currentMonthStatus: string;
  nextDue: string | null;
  paymentsCompleted: number;
  paymentsPending: number;
}

export interface FinanceRecord {
  id: string;
  moduleType: string;
  name: string;
  amount: number;
  totalAmount: number | null;
  dueDay: number | null;
  totalMonths: number | null;
  remainingMonths: number | null;
  currentInstallment: number | null;
  startDate: string | null;
  websiteUrl: string | null;
  billingCycle: string | null;
  renewalDate: string | null;
  autoRenew: boolean;
  category: string | null;
  notes: string | null;
  type: "Default" | "Demo";
  createdAt: string;
  updatedAt: string;
  status: string;
  dueDate: string | null;
  nextDue: string | null;
  lastPaid: string | null;
  payments: FinancePayment[];
  currentPayment: FinancePayment | null;
  paymentSummary: FinancePaymentSummary;
  progress?: number;
  subscriptionStatus?: string;
  monthlyEquivalent?: number;
}

export interface FinanceModuleStats {
  total: number;
  overdue: number;
  pending: number;
  paid: number;
  totalAmount: number;
}

export interface FinanceListResponse {
  items: FinanceRecord[];
  total: number;
  page: number;
  pageSize: number;
  stats: FinanceModuleStats;
}

export interface FinanceNotifications {
  upcomingCount: number;
  overdueCount: number;
}

export interface FinanceOverview {
  stats: {
    totalMonthlyExpenses: number;
    totalYearlyExpenses: number;
    paidThisMonth: number;
    pendingThisMonth: number;
    upcomingCount: number;
    overdueCount: number;
  };
  breakdown: { moduleType: string; amount: number }[];
  monthlyTrend: { month: string; amount: number }[];
  upcoming: Array<FinancePayment & { recordName: string; moduleType: string }>;
  overdue: Array<FinancePayment & { recordName: string; moduleType: string }>;
  recentlyPaid: Array<FinancePayment & { recordName: string; moduleType: string }>;
  upcomingRenewals: Array<{
    id: string;
    name: string;
    renewalDate: string | null;
    amount: number;
    category: string | null;
    subscriptionStatus: string;
  }>;
  calendar: Array<{
    day: number;
    items: Array<{
      id: string;
      recordName: string;
      moduleType: string;
      amount: number;
      dueDate: string;
      status: string;
      urgency: UrgencyLevel;
    }>;
  }>;
}
