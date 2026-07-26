import { Router } from "express";
import { requireAuth, getSessionUser } from "../middleware/auth.js";
import { createFormSubmissionSchema, updateFormSubmissionSchema } from "../lib/validation.js";
import { DEMO_FORM_DELETE_ERROR, isDemoUser } from "../auth/config.js";
import * as formService from "../services/formService.js";

const router = Router();

router.use(requireAuth);

router.get("/", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    const search = typeof req.query.search === "string" ? req.query.search : undefined;
    const status = typeof req.query.status === "string" ? req.query.status : undefined;
    const page = req.query.page ? Number(req.query.page) : 1;
    const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 10;

    const result = await formService.listForms({
      userId: user.id,
      search,
      status,
      page: Number.isFinite(page) ? page : 1,
      pageSize: Number.isFinite(pageSize) ? pageSize : 10,
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    const form = await formService.getForm(req.params.id, user.id);
    res.json(form);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    const parsed = createFormSubmissionSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    }

    const form = await formService.createForm(parsed.data, user.id);
    res.status(201).json(form);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    const parsed = updateFormSubmissionSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    }

    const form = await formService.updateForm(req.params.id, parsed.data, user.id);
    res.json(form);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    if (isDemoUser(user)) {
      return res.status(403).json({ error: DEMO_FORM_DELETE_ERROR });
    }

    await formService.deleteForm(req.params.id, user.id);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;
