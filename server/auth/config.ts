import "dotenv/config";

export const SESSION_USER_KEY = "user";

export type UserRole = "admin" | "user" | "demo";

export interface SessionUser {
  id: string;
  username: string;
  email: string;
  displayName: string | null;
  role: UserRole;
}

export const DEMO_CREDENTIALS = {
  username: "Demo",
  password: "Demo@2026",
} as const;

export const DEMO_DELETE_ERROR =
  "Deleting demo data is disabled. This dashboard is intended for showcasing the application's capabilities.";

export const DEMO_CREDENTIAL_DELETE_ERROR = "Deleting demo credentials is disabled.";

export const DEMO_FINANCE_DELETE_ERROR = "Deleting demo finance records is disabled.";

export const DEMO_BUDGET_WRITE_ERROR =
  "Budget changes are disabled for the Demo account. Explore the showcase data in read-only mode.";

export const DEMO_RESUME_DELETE_ERROR = "Deleting demo resumes is disabled.";

export const DEMO_FORM_DELETE_ERROR = "Deleting demo form submissions is disabled.";
export const DEMO_REVIEW_DELETE_ERROR = "Deleting demo reviews is disabled.";

export const DEMO_COMPANY_WRITE_ERROR =
  "Company changes are disabled for the Demo account. Explore the showcase data in read-only mode.";

export function isDemoUser(user: SessionUser): boolean {
  return user.role === "demo";
}

export function isAdminUser(user: SessionUser): boolean {
  return user.role === "admin";
}

export function logAuthConfig(): void {
  console.log("[auth] Database-backed authentication enabled (signup + login)");
}
