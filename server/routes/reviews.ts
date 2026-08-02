import { Router } from "express";
import { requireAuth, getSessionUser } from "../middleware/auth.js";
import { publicReviewSchema, updateReviewSchema } from "../lib/validation.js";
import { DEMO_REVIEW_DELETE_ERROR, isDemoUser } from "../auth/config.js";
import * as reviewService from "../services/reviewService.js";

const router = Router();

/** Public list — visible reviews only */
router.get("/public", async (_req, res, next) => {
  try {
    const items = await reviewService.listPublicReviews();
    res.json({ items });
  } catch (error) {
    next(error);
  }
});

/** Public submit — published immediately */
router.post("/", async (req, res, next) => {
  try {
    const parsed = publicReviewSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    }

    const review = await reviewService.submitPublicReview(parsed.data);
    res.status(201).json({ success: true, id: review.id });
  } catch (error) {
    next(error);
  }
});

const authed = Router();
authed.use(requireAuth);

authed.get("/", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    const search = typeof req.query.search === "string" ? req.query.search : undefined;
    const visibleParam = typeof req.query.visible === "string" ? req.query.visible : undefined;
    const page = req.query.page ? Number(req.query.page) : 1;
    const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 10;

    let visible: boolean | undefined;
    if (visibleParam === "true") visible = true;
    else if (visibleParam === "false") visible = false;

    const result = await reviewService.listReviews({
      userId: user.id,
      search,
      visible,
      page: Number.isFinite(page) ? page : 1,
      pageSize: Number.isFinite(pageSize) ? pageSize : 10,
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
});

authed.patch("/:id", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    const parsed = updateReviewSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    }

    const review = await reviewService.updateReview(req.params.id, parsed.data, user.id);
    res.json(review);
  } catch (error) {
    next(error);
  }
});

authed.delete("/:id", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    if (isDemoUser(user)) {
      return res.status(403).json({ error: DEMO_REVIEW_DELETE_ERROR });
    }

    await reviewService.deleteReview(req.params.id, user.id);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

router.use(authed);

export default router;
