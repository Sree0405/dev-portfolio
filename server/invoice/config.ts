import type { DataType } from "../auth/config.js";

export interface InvoiceBranding {
  companyName: string;
  tagline: string;
  website: string;
  websiteDisplay: string;
  email: string;
  phone: string;
  location: string;
  watermarkText: string;
  footerThankYou: string;
  footerGeneratedFrom: string;
}

export const INVOICE_BRANDING: InvoiceBranding = {
  companyName: "Sreekanth Freelancing",
  tagline: "Professional Software Development Services",
  website: "https://sreefolio.vercel.app",
  websiteDisplay: "sreefolio.vercel.app",
  email: "sreekanth04052005@gmail.com",
  phone: "+91 9363965927",
  location: "Avadi, Chennai - 600054, Tamil Nadu, India",
  watermarkText: "Sreekanth Freelancing",
  footerThankYou: "Thank you for choosing Sreekanth Freelancing.",
  footerGeneratedFrom:
    "This invoice was generated automatically by the Freelancing Dashboard.",
};

export const INVOICE_BRANDING_DEMO: InvoiceBranding = {
  companyName: "Sreekanth",
  tagline: "Professional Software Development Services",
  website: "https://sreefolio.vercel.app",
  websiteDisplay: "sreefolio.vercel.app",
  email: "sreekanth04052005@gmail.com",
  phone: "+91 9363965927",
  location: "Avadi, Chennai - 600054, Tamil Nadu, India",
  watermarkText: "Sreekanth",
  footerThankYou: "Thank you for choosing Sreekanth.",
  footerGeneratedFrom:
    "This invoice was generated automatically by the Project Management Dashboard.",
};

export function getInvoiceBranding(dataType: DataType): InvoiceBranding {
  return dataType === "Demo" ? INVOICE_BRANDING_DEMO : INVOICE_BRANDING;
}

export const INVOICE_PDF = {
  page: { width: 595.28, height: 841.89 },
  margin: 48,
  sectionGap: 22,
  cardPadding: 16,
  cardRadius: 10,
  logoHeight: 68,
  colors: {
    text: "#1F2937",
    textSecondary: "#4B5563",
    muted: "#6B7280",
    border: "#E5E7EB",
    cardBg: "#F8F9FA",
    cardBorder: "#E5E7EB",
    stripe: "#F3F4F6",
    accent: "#2563EB",
    accentLight: "#EFF6FF",
    paid: "#059669",
    paidBg: "#D1FAE5",
    partial: "#D97706",
    partialBg: "#FEF3C7",
    pending: "#DC2626",
    remaining: "#2563EB",
    remainingBg: "#EFF6FF",
    footer: "#9CA3AF",
    tableHeader: "#374151",
    tableHeaderBg: "#F9FAFB",
  },
} as const;
