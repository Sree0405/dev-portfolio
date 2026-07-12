export function formatInvoiceCurrency(amount: number): string {
  const formatted = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return `₹ ${formatted}`;
}

export function formatInvoiceDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function formatInvoiceTime(date: Date | string): string {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(date));
}

export function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9-_ ]/g, "").trim().replace(/\s+/g, "_") || "Project";
}

export type PaymentStatus = "Paid" | "Partially Paid";

export function getPaymentStatus(remainingAmount: number): PaymentStatus {
  return remainingAmount <= 0 ? "Paid" : "Partially Paid";
}
