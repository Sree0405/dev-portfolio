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
