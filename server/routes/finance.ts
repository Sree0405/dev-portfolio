import { Router } from "express";
import { requireAuth, getSessionUser } from "../middleware/auth.js";
import {
  createEmiSchema,
  createRentSchema,
  createSubscriptionSchema,
  markPaidSchema,
  financeReportQuerySchema,
} from "../lib/validation.js";
import * as financeService from "../services/financeService.js";
import { FINANCE_MODULES } from "../finance/constants.js";
import {
  generateModuleReportPdf,
  generateRecordReportPdf,
} from "../finance/pdf/financePdfService.js";
import { DEMO_FINANCE_DELETE_ERROR, isDemoUser } from "../auth/config.js";

const router = Router();

router.use(requireAuth);

function listQuery(req: { query: Record<string, unknown> }) {
  return {
    search: typeof req.query.search === "string" ? req.query.search : undefined,
    status: typeof req.query.status === "string" ? req.query.status : undefined,
    page: req.query.page ? Number(req.query.page) : 1,
    pageSize: req.query.pageSize ? Number(req.query.pageSize) : 10,
  };
}

function sendPdf(res: import("express").Response, buffer: Buffer, filename: string) {
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.send(buffer);
}

router.get("/notifications", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    res.json(await financeService.getFinanceNotifications(user.dataType));
  } catch (error) {
    next(error);
  }
});

router.get("/overview", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    res.json(await financeService.getFinanceOverview(user.dataType));
  } catch (error) {
    next(error);
  }
});

// EMI
router.get("/emi", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    res.json(await financeService.listEmiRecords(user.dataType, listQuery(req)));
  } catch (error) {
    next(error);
  }
});

router.get("/emi/report/pdf", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    const parsed = financeReportQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid report parameters" });
    }
    const buffer = await generateModuleReportPdf(FINANCE_MODULES.EMI, user.dataType, parsed.data);
    sendPdf(res, buffer, "EMI_Finance_Report.pdf");
  } catch (error) {
    next(error);
  }
});

router.get("/emi/:id", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    res.json(await financeService.getFinanceRecord(req.params.id, user.dataType));
  } catch (error) {
    next(error);
  }
});

router.post("/emi", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    const parsed = createEmiSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    }
    res.status(201).json(await financeService.createEmi(parsed.data, user.dataType));
  } catch (error) {
    next(error);
  }
});

router.put("/emi/:id", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    res.json(await financeService.updateFinanceRecord(req.params.id, user.dataType, req.body));
  } catch (error) {
    next(error);
  }
});

router.post("/emi/:id/mark-paid", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    const parsed = markPaidSchema.safeParse(req.body ?? {});
    if (!parsed.success) {
      return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    }
    res.json(
      await financeService.markEmiCurrentPaid(req.params.id, user.dataType, {
        ...parsed.data,
        createdBy: user.username,
      }),
    );
  } catch (error) {
    next(error);
  }
});

router.get("/emi/:id/pdf", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    const range = financeReportQuerySchema.safeParse(req.query);
    const buffer = await generateRecordReportPdf(
      req.params.id,
      user.dataType,
      range.success ? range.data : undefined,
    );
    sendPdf(res, buffer, "EMI_Detail_Report.pdf");
  } catch (error) {
    next(error);
  }
});

router.delete("/emi/:id", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    if (isDemoUser(user)) {
      return res.status(403).json({ error: DEMO_FINANCE_DELETE_ERROR });
    }
    await financeService.deleteFinanceRecord(req.params.id, user.dataType);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// Rent
router.get("/rent", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    res.json(await financeService.listRentRecords(user.dataType, listQuery(req)));
  } catch (error) {
    next(error);
  }
});

router.get("/rent/report/pdf", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    const parsed = financeReportQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid report parameters" });
    }
    const buffer = await generateModuleReportPdf(FINANCE_MODULES.RENT, user.dataType, parsed.data);
    sendPdf(res, buffer, "Rent_Finance_Report.pdf");
  } catch (error) {
    next(error);
  }
});

router.get("/rent/:id", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    res.json(await financeService.getFinanceRecord(req.params.id, user.dataType));
  } catch (error) {
    next(error);
  }
});

router.post("/rent", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    const parsed = createRentSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    }
    res.status(201).json(await financeService.createRent(parsed.data, user.dataType));
  } catch (error) {
    next(error);
  }
});

router.put("/rent/:id", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    res.json(await financeService.updateFinanceRecord(req.params.id, user.dataType, req.body));
  } catch (error) {
    next(error);
  }
});

router.post("/rent/:id/mark-paid", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    const parsed = markPaidSchema.safeParse(req.body ?? {});
    if (!parsed.success) {
      return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    }
    res.json(
      await financeService.markRentCurrentPaid(req.params.id, user.dataType, {
        ...parsed.data,
        createdBy: user.username,
      }),
    );
  } catch (error) {
    next(error);
  }
});

router.get("/rent/:id/pdf", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    const range = financeReportQuerySchema.safeParse(req.query);
    const buffer = await generateRecordReportPdf(
      req.params.id,
      user.dataType,
      range.success ? range.data : undefined,
    );
    sendPdf(res, buffer, "Rent_Detail_Report.pdf");
  } catch (error) {
    next(error);
  }
});

router.delete("/rent/:id", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    if (isDemoUser(user)) {
      return res.status(403).json({ error: DEMO_FINANCE_DELETE_ERROR });
    }
    await financeService.deleteFinanceRecord(req.params.id, user.dataType);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// Subscriptions
router.get("/subscriptions", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    res.json(await financeService.listSubscriptionRecords(user.dataType, listQuery(req)));
  } catch (error) {
    next(error);
  }
});

router.get("/subscriptions/report/pdf", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    const parsed = financeReportQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid report parameters" });
    }
    const buffer = await generateModuleReportPdf(
      FINANCE_MODULES.SUBSCRIPTION,
      user.dataType,
      parsed.data,
    );
    sendPdf(res, buffer, "Subscription_Finance_Report.pdf");
  } catch (error) {
    next(error);
  }
});

router.get("/subscriptions/:id", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    res.json(await financeService.getFinanceRecord(req.params.id, user.dataType));
  } catch (error) {
    next(error);
  }
});

router.post("/subscriptions", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    const parsed = createSubscriptionSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    }
    res.status(201).json(
      await financeService.createSubscription(
        { ...parsed.data, websiteUrl: parsed.data.websiteUrl || null },
        user.dataType,
      ),
    );
  } catch (error) {
    next(error);
  }
});

router.put("/subscriptions/:id", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    res.json(await financeService.updateFinanceRecord(req.params.id, user.dataType, req.body));
  } catch (error) {
    next(error);
  }
});

router.post("/subscriptions/:id/mark-paid", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    const parsed = markPaidSchema.safeParse(req.body ?? {});
    if (!parsed.success) {
      return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    }
    res.json(
      await financeService.markSubscriptionPaid(req.params.id, user.dataType, {
        ...parsed.data,
        createdBy: user.username,
      }),
    );
  } catch (error) {
    next(error);
  }
});

router.get("/subscriptions/:id/pdf", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    const range = financeReportQuerySchema.safeParse(req.query);
    const buffer = await generateRecordReportPdf(
      req.params.id,
      user.dataType,
      range.success ? range.data : undefined,
    );
    sendPdf(res, buffer, "Subscription_Detail_Report.pdf");
  } catch (error) {
    next(error);
  }
});

router.delete("/subscriptions/:id", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    if (isDemoUser(user)) {
      return res.status(403).json({ error: DEMO_FINANCE_DELETE_ERROR });
    }
    await financeService.deleteFinanceRecord(req.params.id, user.dataType);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;
