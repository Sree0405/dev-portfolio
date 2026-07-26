import { Router } from "express";
import { contactFormSchema } from "../lib/validation.js";
import * as formService from "../services/formService.js";

const router = Router();

router.post("/", async (req, res, next) => {
  try {
    const parsed = contactFormSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    }

    const form = await formService.submitPublicContactForm(parsed.data);
    res.status(201).json({ success: true, id: form.id });
  } catch (error) {
    next(error);
  }
});

export default router;
