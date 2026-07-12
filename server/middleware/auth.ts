import type { Request, Response, NextFunction } from "express";
import {
  DEMO_DELETE_ERROR,
  SESSION_USER_KEY,
  isDemoUser,
  type SessionUser,
} from "../auth/config.js";
import { isValidSessionUser, normalizeSessionUser } from "../auth/sessionUser.js";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const user = req.session[SESSION_USER_KEY];
  if (!isValidSessionUser(user)) {
    if (user) {
      req.session.destroy(() => {});
    }
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

export function attachUser(req: Request, _res: Response, next: NextFunction) {
  const user = normalizeSessionUser(req.session[SESSION_USER_KEY]);
  if (user) {
    req.user = user;
  }
  next();
}

export function getSessionUser(req: Request): SessionUser {
  const user = normalizeSessionUser(req.session[SESSION_USER_KEY]);
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}

export function blockDemoDelete(req: Request, res: Response, next: NextFunction) {
  const user = req.session[SESSION_USER_KEY];
  if (user && isDemoUser(user)) {
    return res.status(403).json({ error: DEMO_DELETE_ERROR });
  }
  next();
}
