import type { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.error(err);

  if (err instanceof Error && err.name === "ZodError") {
    return res.status(400).json({ error: "Validation failed", details: err.message });
  }

  if (err instanceof Error && err.message === "NOT_FOUND") {
    return res.status(404).json({ error: "Resource not found" });
  }

  if (err instanceof Error && err.message === "UNAUTHORIZED") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  return res.status(500).json({ error: "Internal server error" });
}
