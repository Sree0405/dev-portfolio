import { Router } from "express";
import { requireAuth, getSessionUser } from "../middleware/auth.js";
import * as dashboardService from "../services/dashboardService.js";

const router = Router();

router.use(requireAuth);

router.get("/", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    const analytics = await dashboardService.getDashboardAnalytics(user.id);
    res.json(analytics);
  } catch (error) {
    next(error);
  }
});

export default router;
