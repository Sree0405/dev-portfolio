import {
  BarChart3,
  FolderKanban,
  KeyRound,
  LayoutDashboard,
  LayoutGrid,
  PieChart,
  Settings2,
} from "lucide-react";

export const dashboardNavItems = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: LayoutDashboard,
    disabled: false,
    end: true,
  },
  {
    label: "Projects",
    to: "/dashboard/projects",
    icon: FolderKanban,
    disabled: false,
    end: false,
  },
  {
    label: "Credentials",
    to: "/dashboard/credentials",
    icon: KeyRound,
    disabled: false,
    end: false,
  },
] as const;

/** Primary mobile bottom nav — keep to 4 slots (with Finance + More submenus). */
export const mobilePrimaryNavItems = [
  dashboardNavItems[0],
  dashboardNavItems[1],
] as const;

export { financeNavGroup, isFinanceRoute } from "@/app/lib/finance/moduleConfig";

/** Overflow items for mobile "More" menu — add future modules here. */
export const mobileMoreNavItems = [
  {
    label: "Credentials",
    to: "/dashboard/credentials",
    icon: KeyRound,
    disabled: false,
    end: false,
  },
  {
    label: "Budget Planner",
    to: "/dashboard/budget-planner",
    icon: PieChart,
    disabled: false,
  },
  {
    label: "Analytics",
    to: "/dashboard/analytics",
    icon: BarChart3,
    disabled: true,
  },
  {
    label: "Settings",
    to: "/dashboard/settings",
    icon: Settings2,
    disabled: true,
  },
] as const;

export const mobileNavActions = {
  more: {
    label: "More",
    icon: LayoutGrid,
  },
} as const;
