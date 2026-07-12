export const FINANCE_MODULES = {
  EMI: "EMI",
  RENT: "Rent",
  SUBSCRIPTION: "Subscription",
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

export type UrgencyLevel = "safe" | "warning" | "due" | "overdue";

export const URGENCY_CLASSES: Record<UrgencyLevel, string> = {
  safe: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  warning: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  due: "text-red-400 bg-red-500/10 border-red-500/30",
  overdue: "text-red-700 bg-red-900/20 border-red-700/40 dark:text-red-400",
};

export const URGENCY_LABELS: Record<UrgencyLevel, string> = {
  safe: "On track",
  warning: "Due soon",
  due: "Due today",
  overdue: "Overdue",
};

export const DEMO_FINANCE_DELETE_MESSAGE = "Deleting demo finance records is disabled.";
