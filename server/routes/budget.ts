import { Router } from "express";
import { requireAuth, getSessionUser } from "../middleware/auth.js";
import { createBudgetSchema } from "../lib/validation.js";
import * as budgetService from "../services/budgetService.js";
import { generateBudgetReportPdf } from "../budget/pdf/budgetPdfService.js";
import { DEMO_BUDGET_WRITE_ERROR, isDemoUser } from "../auth/config.js";
import { BUDGET_RULES } from "../budget/constants.js";

const router = Router();

router.use(requireAuth);

function sendPdf(res: import("express").Response, buffer: Buffer, filename: string) {
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.send(buffer);
}

router.get("/rules", (_req, res) => {
  res.json({
    rules: Object.values(BUDGET_RULES).map((r) => ({
      id: r.id,
      label: r.label,
      description: r.description,
      categories: r.categories,
    })),
  });
});

router.get("/current", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    res.json(await budgetService.getCurrentBudget(user.dataType));
  } catch (error) {
    next(error);
  }
});

router.get("/history", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    res.json({ items: await budgetService.getBudgetHistory(user.dataType) });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    res.json(await budgetService.getBudgetDetail(req.params.id, user.dataType));
  } catch (error) {
    next(error);
  }
});

router.get("/:id/pdf", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    const buffer = await generateBudgetReportPdf(req.params.id, user.dataType);
    sendPdf(res, buffer, "Budget_Report.pdf");
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    if (isDemoUser(user)) {
      return res.status(403).json({ error: DEMO_BUDGET_WRITE_ERROR });
    }
    const parsed = createBudgetSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    }
    res.status(201).json(await budgetService.startNewBudget(user.dataType, parsed.data));
  } catch (error) {
    if (error instanceof Error && error.message === "BUDGET_EXISTS") {
      return res.status(409).json({ error: "A budget already exists for this month." });
    }
    next(error);
  }
});

router.post("/reset", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    if (isDemoUser(user)) {
      return res.status(403).json({ error: DEMO_BUDGET_WRITE_ERROR });
    }
    const parsed = createBudgetSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    }
    res.json(await budgetService.resetCurrentBudget(user.dataType, parsed.data));
  } catch (error) {
    next(error);
  }
});

export default router;
