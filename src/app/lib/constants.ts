export const PROJECT_STATUSES = [
  "Planning",
  "In Progress",
  "Completed",
  "On Hold",
  "Cancelled",
] as const;

export const PROJECT_TYPES = [
  "Fixed Cost",
  "Hourly",
  "Maintenance",
  "Internal",
  "Other",
] as const;

export const PAYMENT_METHODS = [
  "Cash",
  "Bank Transfer",
  "UPI",
  "Cheque",
  "Other",
] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];
export type ProjectType = (typeof PROJECT_TYPES)[number];
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const PROJECT_SORT_OPTIONS = [
  { value: "createdAt", label: "Created Date" },
  { value: "name", label: "Project Name" },
  { value: "clientName", label: "Client Name" },
  { value: "status", label: "Status" },
  { value: "plannedAmount", label: "Planned Amount" },
  { value: "totalPaid", label: "Total Paid" },
] as const;

export const CREDENTIAL_CATEGORIES = [
  "Development",
  "Hosting",
  "Database",
  "Server",
  "Domain",
  "Email",
  "Cloud",
  "API",
  "Personal",
  "Finance",
  "Social",
  "Payment Gateway",
  "Analytics",
  "Other",
] as const;

export type CredentialCategory = (typeof CREDENTIAL_CATEGORIES)[number];

export const CATEGORY_TYPE_LABELS: Record<string, string> = {
  Development: "Dev Account",
  Hosting: "Hosting",
  Database: "Database",
  Server: "Server",
  Domain: "Domain",
  Email: "Email",
  Cloud: "Cloud",
  API: "API Key",
  Personal: "Personal",
  Finance: "Finance",
  Social: "Social",
  "Payment Gateway": "Payment",
  Analytics: "Analytics",
  Other: "Other",
};

export function getCategoryTypeLabel(category: string): string {
  return CATEGORY_TYPE_LABELS[category] ?? "Login";
}
