import "dotenv/config";

export const SESSION_USER_KEY = "user";

export type UserRole = "owner" | "demo";
export type DataType = "Default" | "Demo";

export interface SessionUser {
  username: string;
  role: UserRole;
  dataType: DataType;
}

interface AuthUserConfig {
  password: string;
  role: UserRole;
  dataType: DataType;
}

function buildAuthUsers(): Record<string, AuthUserConfig> {
  const users: Record<string, AuthUserConfig> = {
    Demo: {
      password: "Demo@2026",
      role: "demo",
      dataType: "Demo",
    },
  };

  const ownerUsername = process.env.OWNER_USERNAME?.trim();
  const ownerPassword = process.env.OWNER_PASSWORD;

  if (ownerUsername && ownerPassword) {
    users[ownerUsername] = {
      password: ownerPassword,
      role: "owner",
      dataType: "Default",
    };
  } else if (process.env.NODE_ENV === "production") {
    throw new Error("OWNER_USERNAME and OWNER_PASSWORD must be set in production");
  }

  return users;
}

export const AUTH_USERS: Record<string, AuthUserConfig> = buildAuthUsers();

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

export function authenticateUser(
  username: string,
  password: string,
): SessionUser | null {
  const config = AUTH_USERS[username];
  if (!config || config.password !== password) {
    return null;
  }

  return {
    username,
    role: config.role,
    dataType: config.dataType,
  };
}

export function isDemoUser(user: SessionUser): boolean {
  return user.role === "demo";
}
