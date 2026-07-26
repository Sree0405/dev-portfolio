import type { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";

function isPayloadTooLarge(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const candidate = err as { type?: string; name?: string; status?: number };
  return (
    candidate.type === "entity.too.large" ||
    candidate.name === "PayloadTooLargeError" ||
    candidate.status === 413
  );
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.error(err);

  if (isPayloadTooLarge(err)) {
    return res.status(413).json({
      error: "Request payload is too large. Try saving without the PDF attachment or shorten the LaTeX source.",
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Resource not found" });
    }
    if (err.code === "P2021" || err.code === "P1014") {
      return res.status(503).json({
        error: "Database schema is out of date. Run prisma migrate deploy or db push.",
      });
    }
  }

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
