import type { SessionUser } from "../auth/config.js";

export function isValidSessionUser(user: unknown): user is SessionUser {
  if (!user || typeof user !== "object") {
    return false;
  }

  const candidate = user as Partial<SessionUser>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.username === "string" &&
    typeof candidate.email === "string" &&
    (candidate.displayName === null || typeof candidate.displayName === "string") &&
    (candidate.role === "admin" || candidate.role === "user" || candidate.role === "demo")
  );
}

export function normalizeSessionUser(user: unknown): SessionUser | null {
  if (!isValidSessionUser(user)) {
    return null;
  }

  return user;
}
