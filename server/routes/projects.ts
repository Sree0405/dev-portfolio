import { Router } from "express";
import { requireAuth, getSessionUser, blockDemoDelete } from "../middleware/auth.js";
import { createProjectSchema, updateProjectSchema } from "../lib/validation.js";
import * as projectService from "../services/projectService.js";
import * as invoiceService from "../services/invoiceService.js";

const router = Router();

router.use(requireAuth);

router.get("/", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    const search = typeof req.query.search === "string" ? req.query.search : undefined;
    const sortBy = typeof req.query.sortBy === "string" ? req.query.sortBy : undefined;
    const sortOrder =
      req.query.sortOrder === "asc" || req.query.sortOrder === "desc"
        ? req.query.sortOrder
        : undefined;
    const page = req.query.page ? Number(req.query.page) : undefined;
    const pageSize = req.query.pageSize ? Number(req.query.pageSize) : undefined;

    const result = await projectService.listProjects({
      dataType: user.dataType,
      search,
      sortBy,
      sortOrder,
      page: Number.isFinite(page) ? page : undefined,
      pageSize: Number.isFinite(pageSize) ? pageSize : undefined,
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/:id/invoice", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    const { buffer, filename } = await invoiceService.generateProjectInvoice(
      req.params.id,
      user.dataType,
    );
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(buffer);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    const project = await projectService.getProject(req.params.id, user.dataType);
    res.json(project);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    const parsed = createProjectSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    }

    const project = await projectService.createProject(parsed.data, user.dataType);
    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    const parsed = updateProjectSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    }

    const project = await projectService.updateProject(req.params.id, parsed.data, user.dataType);
    res.json(project);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", blockDemoDelete, async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    await projectService.deleteProject(req.params.id, user.dataType);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;
