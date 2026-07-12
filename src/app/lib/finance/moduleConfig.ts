import { Home, Landmark, LayoutDashboard, Repeat, Wallet } from "lucide-react";

export const financeNavGroup = {
  label: "Finance",
  icon: Wallet,
  children: [
    { label: "Overview", to: "/dashboard/finance", end: true, icon: LayoutDashboard },
    { label: "EMI", to: "/dashboard/finance/emi", end: false, icon: Landmark },
    { label: "Rent", to: "/dashboard/finance/rent", end: false, icon: Home },
    {
      label: "Subscriptions",
      to: "/dashboard/finance/subscriptions",
      end: false,
      icon: Repeat,
    },
  ],
} as const;

export function isFinanceRoute(pathname: string) {
  return pathname.startsWith("/dashboard/finance");
}

export const FINANCE_REPORT_RANGES = [
  { value: "current_month", label: "Current Month" },
  { value: "last_2", label: "Last 2 Months" },
  { value: "last_3", label: "Last 3 Months" },
  { value: "last_6", label: "Last 6 Months" },
  { value: "last_12", label: "Last 12 Months" },
  { value: "custom_month", label: "Custom Month" },
  { value: "custom_range", label: "Custom Date Range" },
] as const;

export type FinanceReportRange = (typeof FINANCE_REPORT_RANGES)[number]["value"];

export const FINANCE_MODULE_CONFIG = {
  EMI: {
    moduleType: "EMI",
    label: "EMI",
    singular: "EMI",
    routeBase: "/dashboard/finance/emi",
    queryKey: "emi",
  },
  Rent: {
    moduleType: "Rent",
    label: "Rent",
    singular: "Rent",
    routeBase: "/dashboard/finance/rent",
    queryKey: "rent",
  },
  Subscription: {
    moduleType: "Subscription",
    label: "Subscriptions",
    singular: "Subscription",
    routeBase: "/dashboard/finance/subscriptions",
    queryKey: "subscriptions",
  },
} as const;

export type FinanceModuleKey = keyof typeof FINANCE_MODULE_CONFIG;
