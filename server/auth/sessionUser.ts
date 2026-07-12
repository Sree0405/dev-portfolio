import type { SessionUser } from "../auth/config.js";

export function isValidSessionUser(user: unknown): user is SessionUser {
  if (!user || typeof user !== "object") {
    return false;
  }

  const candidate = user as Partial<SessionUser>;
  return (
    typeof candidate.username === "string" &&
    (candidate.role === "owner" || candidate.role === "demo") &&
    (candidate.dataType === "Default" || candidate.dataType === "Demo")
  );
}

export function normalizeSessionUser(user: unknown): SessionUser | null {
  if (!isValidSessionUser(user)) {
    return null;
  }

  return user;
}
