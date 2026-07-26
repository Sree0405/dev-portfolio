import { Router } from "express";
import { requireAuth, getSessionUser } from "../middleware/auth.js";
import { devUtilityIdSchema } from "../lib/validation.js";
import * as devUtilityService from "../services/devUtilityService.js";

const router = Router();

router.use(requireAuth);

router.get("/preferences", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    const preferences = await devUtilityService.getDevUtilityPreferences(user.id);
    res.json(preferences);
  } catch (error) {
    next(error);
  }
});

router.put("/favorites/:utilityId", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    const parsed = devUtilityIdSchema.safeParse(req.params.utilityId);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid utility id" });
    }

    const result = await devUtilityService.toggleDevUtilityFavorite(parsed.data, user.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/recent/:utilityId", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    const parsed = devUtilityIdSchema.safeParse(req.params.utilityId);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid utility id" });
    }

    const result = await devUtilityService.trackDevUtilityUse(parsed.data, user.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
