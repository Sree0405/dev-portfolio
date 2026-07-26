import { Router } from "express";
import { requireAuth, getSessionUser } from "../middleware/auth.js";
import { requireJobTrackerEnabled } from "../middleware/jobTrackerFeature.js";
import {
  createJobApplicationSchema,
  updateJobApplicationSchema,
  updateJobStatusSchema,
  updateJobSalariesSchema,
  createInterviewSchema,
  updateInterviewSchema,
  createJobNoteSchema,
  updateJobNoteSchema,
} from "../lib/validation.js";
import * as jobService from "../services/jobService.js";

const router = Router();

router.use(requireAuth, requireJobTrackerEnabled);

router.get("/", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    const search = typeof req.query.search === "string" ? req.query.search : undefined;
    const status = typeof req.query.status === "string" ? req.query.status : undefined;
    const companyId = typeof req.query.companyId === "string" ? req.query.companyId : undefined;
    const page = req.query.page ? Number(req.query.page) : 1;
    const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 15;

    const result = await jobService.listJobs({
      userId: user.id,
      search,
      status,
      companyId,
      page: Number.isFinite(page) ? page : 1,
      pageSize: Number.isFinite(pageSize) ? pageSize : 15,
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    const job = await jobService.getJob(req.params.id, user.id);
    res.json(job);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    const parsed = createJobApplicationSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    }

    const job = await jobService.createJob(parsed.data, user.id);
    res.status(201).json(job);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    const parsed = updateJobApplicationSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    }

    const job = await jobService.updateJob(req.params.id, parsed.data, user.id);
    res.json(job);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    await jobService.deleteJob(req.params.id, user.id);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

router.post("/:id/status", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    const parsed = updateJobStatusSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    }

    const job = await jobService.updateJobStatus(req.params.id, parsed.data, user.id);
    res.json(job);
  } catch (error) {
    next(error);
  }
});

router.put("/:id/salaries", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    const parsed = updateJobSalariesSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    }

    const job = await jobService.updateJobSalaries(req.params.id, parsed.data, user.id);
    res.json(job);
  } catch (error) {
    next(error);
  }
});

router.get("/:id/interviews", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    const interviews = await jobService.listInterviews(req.params.id, user.id);
    res.json(interviews);
  } catch (error) {
    next(error);
  }
});

router.post("/:id/interviews", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    const parsed = createInterviewSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    }

    const interview = await jobService.createInterview(req.params.id, parsed.data, user.id);
    res.status(201).json(interview);
  } catch (error) {
    next(error);
  }
});

router.get("/:id/notes", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    const notes = await jobService.listNotes(req.params.id, user.id);
    res.json(notes);
  } catch (error) {
    next(error);
  }
});

router.post("/:id/notes", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    const parsed = createJobNoteSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    }

    const note = await jobService.createJobNote(req.params.id, parsed.data, user.id);
    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
});

router.get("/:id/status-history", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    const history = await jobService.listStatusHistory(req.params.id, user.id);
    res.json(history);
  } catch (error) {
    next(error);
  }
});

const interviewByIdRouter = Router();
interviewByIdRouter.use(requireAuth, requireJobTrackerEnabled);

interviewByIdRouter.put("/:id", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    const parsed = updateInterviewSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    }

    const interview = await jobService.updateInterview(req.params.id, parsed.data, user.id);
    res.json(interview);
  } catch (error) {
    next(error);
  }
});

interviewByIdRouter.delete("/:id", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    await jobService.deleteInterview(req.params.id, user.id);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

const jobNoteByIdRouter = Router();
jobNoteByIdRouter.use(requireAuth, requireJobTrackerEnabled);

jobNoteByIdRouter.put("/:id", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    const parsed = updateJobNoteSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    }

    const note = await jobService.updateJobNote(req.params.id, parsed.data, user.id);
    res.json(note);
  } catch (error) {
    next(error);
  }
});

jobNoteByIdRouter.delete("/:id", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    await jobService.deleteJobNote(req.params.id, user.id);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export { router as jobRoutes, interviewByIdRouter, jobNoteByIdRouter };
