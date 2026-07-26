import {
  BarChart3,
  Briefcase,
  Building2,
  FileUser,
  FolderKanban,
  Inbox,
  KeyRound,
  LayoutDashboard,
  LayoutGrid,
  PieChart,
  Settings2,
  TerminalSquare,
  UserCircle,
  Users,
  Wrench,
} from "lucide-react";

export const jobTrackerNavItems = [
  {
    label: "Companies",
    to: "/dashboard/companies",
    icon: Building2,
    disabled: false,
    end: false,
  },
  {
    label: "Job Tracker",
    to: "/dashboard/job-status",
    icon: Briefcase,
    disabled: false,
    end: false,
  },
] as const;

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
  {
    label: "Resume",
    to: "/dashboard/resume",
    icon: FileUser,
    disabled: false,
    end: false,
  },
  {
    label: "Dev Utilities",
    to: "/dashboard/dev-utilities",
    icon: Wrench,
    disabled: false,
    end: false,
  },
  {
    label: "Playground",
    to: "/dashboard/playground",
    icon: TerminalSquare,
    disabled: false,
    end: false,
  },
  {
    label: "Forms",
    to: "/dashboard/forms",
    icon: Inbox,
    disabled: false,
    end: false,
  },
] as const;

export const accountNavItems = [
  {
    label: "Profile",
    to: "/dashboard/profile",
    icon: UserCircle,
    disabled: false,
    end: false,
  },
] as const;

export const adminNavItems = [
  {
    label: "Users",
    to: "/dashboard/users",
    icon: Users,
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
    label: "Resume",
    to: "/dashboard/resume",
    icon: FileUser,
    disabled: false,
    end: false,
  },
  {
    label: "Dev Utilities",
    to: "/dashboard/dev-utilities",
    icon: Wrench,
    disabled: false,
    end: false,
  },
  {
    label: "Playground",
    to: "/dashboard/playground",
    icon: TerminalSquare,
    disabled: false,
    end: false,
  },
  {
    label: "Forms",
    to: "/dashboard/forms",
    icon: Inbox,
    disabled: false,
    end: false,
  },
  ...jobTrackerNavItems,
  ...accountNavItems,
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
