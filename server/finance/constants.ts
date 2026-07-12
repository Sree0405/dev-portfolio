export const FINANCE_MODULES = {
  EMI: "EMI",
  RENT: "Rent",
  SUBSCRIPTION: "Subscription",
} as const;

export type FinanceModuleType = (typeof FINANCE_MODULES)[keyof typeof FINANCE_MODULES];

export const FINANCE_PAYMENT_STATUS = {
  PENDING: "Pending",
  PAID: "Paid",
  OVERDUE: "Overdue",
} as const;

export const BILLING_CYCLES = ["Monthly", "Quarterly", "Half Yearly", "Yearly"] as const;

export const SUBSCRIPTION_CATEGORIES = [
  "Development",
  "Design",
  "Hosting",
  "Cloud",
  "Entertainment",
  "Productivity",
  "Other",
] as const;

export const SUBSCRIPTION_STATUS = {
  ACTIVE: "Active",
  EXPIRING_SOON: "Expiring Soon",
  EXPIRED: "Expired",
} as const;

export type UrgencyLevel = "safe" | "warning" | "due" | "overdue";

export const URGENCY_COLORS: Record<UrgencyLevel, string> = {
  safe: "text-emerald-400",
  warning: "text-amber-400",
  due: "text-red-400",
  overdue: "text-red-700 dark:text-red-500",
};

export const URGENCY_BG: Record<UrgencyLevel, string> = {
  safe: "bg-emerald-500/15 border-emerald-500/30",
  warning: "bg-amber-500/15 border-amber-500/30",
  due: "bg-red-500/15 border-red-500/30",
  overdue: "bg-red-900/20 border-red-700/40",
};

export const DEMO_FINANCE_DELETE_ERROR = "Deleting demo finance records is disabled.";
