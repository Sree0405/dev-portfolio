import { Router } from "express";
import { requireAuth, getSessionUser, blockDemoDelete } from "../middleware/auth.js";
import { createPaymentSchema, updatePaymentSchema } from "../lib/validation.js";
import * as paymentService from "../services/paymentService.js";

const router = Router({ mergeParams: true });

router.use(requireAuth);

router.get("/", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    const payments = await paymentService.listPayments(req.params.id, user.dataType);
    res.json(payments);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    const parsed = createPaymentSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    }

    const result = await paymentService.createPayment(req.params.id, parsed.data, user.dataType);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

const paymentByIdRouter = Router();

paymentByIdRouter.use(requireAuth);

paymentByIdRouter.put("/:id", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    const parsed = updatePaymentSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    }

    const result = await paymentService.updatePayment(req.params.id, parsed.data, user.dataType);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

paymentByIdRouter.delete("/:id", blockDemoDelete, async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    const result = await paymentService.deletePayment(req.params.id, user.dataType);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export { router as projectPaymentsRouter, paymentByIdRouter };
