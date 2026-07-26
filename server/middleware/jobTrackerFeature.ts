import type { Request, Response, NextFunction } from "express";
import { isJobTrackerEnabled } from "../lib/featureFlags.js";

export function requireJobTrackerEnabled(_req: Request, res: Response, next: NextFunction) {
  if (!isJobTrackerEnabled()) {
    return res.status(404).json({ error: "Not found" });
  }
  next();
}
