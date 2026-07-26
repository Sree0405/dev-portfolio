import { Router } from "express";
import { requireAuth, getSessionUser } from "../middleware/auth.js";
import {
  createResumeSchema,
  saveResumeSchema,
  updateResumeSchema,
} from "../lib/validation.js";
import * as resumeService from "../services/resumeService.js";
import { DEMO_RESUME_DELETE_ERROR, isDemoUser } from "../auth/config.js";

const router = Router();

router.use(requireAuth);

function sendPdf(res: import("express").Response, buffer: Buffer, filename: string) {
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.send(buffer);
}

function handleResumeError(
  error: unknown,
  res: import("express").Response,
  next: import("express").NextFunction,
) {
  if (error instanceof Error && error.message === "NOT_FOUND") {
    return res.status(404).json({ error: "Resume not found" });
  }
  return next(error);
}

router.get("/", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    const search = typeof req.query.search === "string" ? req.query.search : undefined;
    const items = await resumeService.listResumes({ userId: user.id, search });
    res.json({ items });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    const resume = await resumeService.getResume(req.params.id, user.id);
    res.json(resume);
  } catch (error) {
    return handleResumeError(error, res, next);
  }
});

router.get("/:id/pdf", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    const { buffer, filename } = await resumeService.getResumePdfBuffer(
      req.params.id,
      user.id,
    );
    sendPdf(res, buffer, filename);
  } catch (error) {
    if (error instanceof Error && error.message === "PDF_NOT_READY") {
      return res.status(404).json({ error: "PDF not available. Save or compile the resume first." });
    }
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const user = getSessionUser(req);

    const parsed = createResumeSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    }

    const resume = await resumeService.createResume(parsed.data, user.id);
    res.status(201).json(resume);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const user = getSessionUser(req);

    const parsed = updateResumeSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    }

    const resume = await resumeService.updateResume(req.params.id, parsed.data, user.id);
    res.json(resume);
  } catch (error) {
    next(error);
  }
});

router.put("/:id/save", async (req, res, next) => {
  try {
    const user = getSessionUser(req);

    const parsed = saveResumeSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    }

    const resume = await resumeService.saveResumeWithPdf(
      req.params.id,
      user.id,
      parsed.data,
    );
    res.json(resume);
  } catch (error) {
    next(error);
  }
});

router.post("/:id/compile", async (req, res, next) => {
  try {
    const user = getSessionUser(req);

    const resume = await resumeService.compileResumePdf(req.params.id, user.id);
    res.json(resume);
  } catch (error) {
    if (error instanceof Error && error.message === "LATEX_NOT_INSTALLED") {
      return res.status(501).json({
        error: "Server LaTeX is not installed. Use Download PDF from the preview instead.",
      });
    }
    if (error instanceof Error && error.message === "COMPILE_FAILED") {
      return res.status(422).json({ error: "LaTeX compilation failed. Check the source for errors." });
    }
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    if (isDemoUser(user)) {
      return res.status(403).json({ error: DEMO_RESUME_DELETE_ERROR });
    }

    await resumeService.deleteResume(req.params.id, user.id);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;
