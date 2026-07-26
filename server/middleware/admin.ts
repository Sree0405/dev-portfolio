import type { Request, Response, NextFunction } from "express";
import { isAdminUser } from "../auth/config.js";
import { getSessionUser } from "./auth.js";

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const user = getSessionUser(req);
    if (!isAdminUser(user)) {
      return res.status(403).json({ error: "Admin access required" });
    }
    next();
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
}
