import type { DataType } from "../../auth/config.js";
import { getInvoiceBranding, type InvoiceBranding } from "../../invoice/config.js";

export interface FinanceBranding extends InvoiceBranding {
  dashboardTagline: string;
  footerSubtitle: string;
  footerSystemLine: string;
}

export function getFinanceBranding(dataType: DataType): FinanceBranding {
  const base = getInvoiceBranding(dataType);
  return {
    ...base,
    dashboardTagline: "Professional Financial Management Dashboard",
    footerThankYou: "Thank you for using",
    footerSubtitle: `${base.companyName} Dashboard`,
    footerSystemLine: "Professional Project & Financial Management System",
    footerGeneratedFrom: "Generated automatically by the Finance Hub.",
  };
}

export const FINANCE_PDF = {
  page: { width: 595.28, height: 841.89 },
  margin: 40,
  sectionGap: 20,
  cardPadding: 16,
  cardRadius: 10,
  logoHeight: 56,
  heroHeight: 132,
  colors: {
    text: "#1F2937",
    textSecondary: "#4B5563",
    muted: "#6B7280",
    border: "#E5E7EB",
    cardBg: "#F8FAFC",
    cardBorder: "#E5E7EB",
    heroBg: "#F8FAFC",
    stripe: "#F1F5F9",
    accent: "#2563EB",
    accentLight: "#EFF6FF",
    success: "#22C55E",
    successBg: "#DCFCE7",
    successText: "#15803D",
    warning: "#F59E0B",
    warningBg: "#FEF3C7",
    warningText: "#B45309",
    danger: "#EF4444",
    dangerBg: "#FEE2E2",
    dangerText: "#B91C1C",
    info: "#2563EB",
    infoBg: "#DBEAFE",
    infoText: "#1D4ED8",
    footer: "#9CA3AF",
    tableHeader: "#374151",
    tableHeaderBg: "#F8FAFC",
  },
} as const;

export const FINANCE_STATUS_STYLES: Record<
  string,
  { bg: string; text: string; dot: string; label: string }
> = {
  Paid: {
    bg: FINANCE_PDF.colors.successBg,
    text: FINANCE_PDF.colors.successText,
    dot: FINANCE_PDF.colors.success,
    label: "Paid",
  },
  Pending: {
    bg: FINANCE_PDF.colors.warningBg,
    text: FINANCE_PDF.colors.warningText,
    dot: FINANCE_PDF.colors.warning,
    label: "Pending",
  },
  Overdue: {
    bg: FINANCE_PDF.colors.dangerBg,
    text: FINANCE_PDF.colors.dangerText,
    dot: FINANCE_PDF.colors.danger,
    label: "Overdue",
  },
  Active: {
    bg: FINANCE_PDF.colors.infoBg,
    text: FINANCE_PDF.colors.infoText,
    dot: FINANCE_PDF.colors.info,
    label: "Active",
  },
};
