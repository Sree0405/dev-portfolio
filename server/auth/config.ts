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
      password: process.env.DEMO_PASSWORD?.trim() || "Demo@2026",
      role: "demo",
      dataType: "Demo",
    },
  };

  const ownerUsername = process.env.OWNER_USERNAME?.trim();
  const ownerPassword = process.env.OWNER_PASSWORD?.trim();

  if (ownerUsername && ownerPassword) {
    users[ownerUsername] = {
      password: ownerPassword,
      role: "owner",
      dataType: "Default",
    };
  } else if (process.env.NODE_ENV === "production") {
    console.warn(
      "[auth] OWNER_USERNAME and/or OWNER_PASSWORD not set — owner login disabled in production",
    );
  }

  return users;
}

let authUsersCache: Record<string, AuthUserConfig> | null = null;

function getAuthUsers(): Record<string, AuthUserConfig> {
  if (!authUsersCache) {
    authUsersCache = buildAuthUsers();
  }
  return authUsersCache;
}

export function logAuthConfig(): void {
  const users = getAuthUsers();
  const accounts = Object.keys(users);
  console.log(`[auth] Enabled accounts: ${accounts.join(", ") || "none"}`);
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

export function authenticateUser(
  username: string,
  password: string,
): SessionUser | null {
  const users = getAuthUsers();
  const trimmedUsername = username.trim();

  const exactConfig = users[trimmedUsername];
  if (exactConfig && exactConfig.password === password) {
    return {
      username: trimmedUsername,
      role: exactConfig.role,
      dataType: exactConfig.dataType,
    };
  }

  const matchedEntry = Object.entries(users).find(
    ([key]) => key.toLowerCase() === trimmedUsername.toLowerCase(),
  );

  if (!matchedEntry || matchedEntry[1].password !== password) {
    return null;
  }

  const [canonicalUsername, config] = matchedEntry;

  return {
    username: canonicalUsername,
    role: config.role,
    dataType: config.dataType,
  };
}

export function isDemoUser(user: SessionUser): boolean {
  return user.role === "demo";
}
