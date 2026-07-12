import { Router } from "express";
import {
  requireAuth,
  getSessionUser,
} from "../middleware/auth.js";
import { createCredentialSchema, updateCredentialSchema } from "../lib/validation.js";
import * as credentialService from "../services/credentialService.js";
import { DEMO_CREDENTIAL_DELETE_ERROR, isDemoUser } from "../auth/config.js";

const router = Router();

router.use(requireAuth);

router.get("/", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    const search = typeof req.query.search === "string" ? req.query.search : undefined;
    const category = typeof req.query.category === "string" ? req.query.category : undefined;

    const items = await credentialService.listCredentials({
      dataType: user.dataType,
      search,
      category,
    });

    res.json({ items });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    const credential = await credentialService.getCredential(req.params.id, user.dataType);
    res.json(credential);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    const parsed = createCredentialSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    }

    const credential = await credentialService.createCredential(parsed.data, user.dataType);
    res.status(201).json(credential);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    const parsed = updateCredentialSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    }

    const credential = await credentialService.updateCredential(
      req.params.id,
      parsed.data,
      user.dataType,
    );
    res.json(credential);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    if (isDemoUser(user)) {
      return res.status(403).json({ error: DEMO_CREDENTIAL_DELETE_ERROR });
    }

    await credentialService.deleteCredential(req.params.id, user.dataType);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;
