import { Router } from "express";
import { requireAuth, getSessionUser } from "../middleware/auth.js";
import { requireJobTrackerEnabled } from "../middleware/jobTrackerFeature.js";
import {
  createCompanySchema,
  updateCompanySchema,
  companyImportSchema,
  createCompanyContactSchema,
  updateCompanyContactSchema,
  createJobApplicationSchema,
} from "../lib/validation.js";
import { DEMO_COMPANY_WRITE_ERROR, isDemoUser } from "../auth/config.js";
import * as companyService from "../services/companyService.js";
import * as jobService from "../services/jobService.js";

const router = Router();

router.use(requireAuth, requireJobTrackerEnabled);

function blockDemoCompanyWrite(req: import("express").Request, res: import("express").Response) {
  const user = getSessionUser(req);
  if (isDemoUser(user)) {
    res.status(403).json({ error: DEMO_COMPANY_WRITE_ERROR });
    return true;
  }
  return false;
}

router.get("/", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    const search = typeof req.query.search === "string" ? req.query.search : undefined;
    const applied = typeof req.query.applied === "string" ? req.query.applied : undefined;
    const location = typeof req.query.location === "string" ? req.query.location : undefined;
    const category = typeof req.query.category === "string" ? req.query.category : undefined;
    const companyType = typeof req.query.companyType === "string" ? req.query.companyType : undefined;
    const companySize = typeof req.query.companySize === "string" ? req.query.companySize : undefined;
    const sortBy = typeof req.query.sortBy === "string" ? req.query.sortBy : "name";
    const sortOrder = req.query.sortOrder === "desc" ? "desc" : "asc";
    const page = req.query.page ? Number(req.query.page) : 1;
    const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 15;

    const result = await companyService.listCompanies({
      userId: user.id,
      search,
      applied,
      location,
      category,
      companyType,
      companySize,
      sortBy,
      sortOrder,
      page: Number.isFinite(page) ? page : 1,
      pageSize: Number.isFinite(pageSize) ? pageSize : 15,
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/filters", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    const filters = await companyService.getCompanyFilters(user.id);
    res.json(filters);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    if (blockDemoCompanyWrite(req, res)) return;

    const user = getSessionUser(req);
    const parsed = createCompanySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    }

    const company = await companyService.createCompany(parsed.data, user.id);
    res.status(201).json(company);
  } catch (error) {
    next(error);
  }
});

router.post("/import", async (req, res, next) => {
  try {
    if (blockDemoCompanyWrite(req, res)) return;

    const user = getSessionUser(req);
    const parsed = companyImportSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    }

    const summary = await companyService.importCompanies(parsed.data, user.id);
    res.json(summary);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    const company = await companyService.getCompany(req.params.id, user.id);
    res.json(company);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    if (blockDemoCompanyWrite(req, res)) return;

    const user = getSessionUser(req);
    const parsed = updateCompanySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    }

    const company = await companyService.updateCompany(req.params.id, parsed.data, user.id);
    res.json(company);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    if (blockDemoCompanyWrite(req, res)) return;

    const user = getSessionUser(req);
    await companyService.deleteCompany(req.params.id, user.id);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

router.get("/:id/contacts", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    const contacts = await companyService.listContacts(req.params.id, user.id);
    res.json(contacts);
  } catch (error) {
    next(error);
  }
});

router.post("/:id/contacts", async (req, res, next) => {
  try {
    if (blockDemoCompanyWrite(req, res)) return;

    const user = getSessionUser(req);
    const parsed = createCompanyContactSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    }

    const contact = await companyService.createContact(req.params.id, parsed.data, user.id);
    res.status(201).json(contact);
  } catch (error) {
    next(error);
  }
});

router.post("/:id/jobs", async (req, res, next) => {
  try {
    const user = getSessionUser(req);
    const parsed = createJobApplicationSchema.safeParse({
      ...req.body,
      companyId: req.params.id,
    });
    if (!parsed.success) {
      return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    }

    const job = await jobService.createJob(parsed.data, user.id);
    res.status(201).json(job);
  } catch (error) {
    next(error);
  }
});

export { router as companyRoutes };

const contactByIdRouter = Router();
contactByIdRouter.use(requireAuth, requireJobTrackerEnabled);

contactByIdRouter.put("/:id", async (req, res, next) => {
  try {
    if (blockDemoCompanyWrite(req, res)) return;

    const user = getSessionUser(req);
    const parsed = updateCompanyContactSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    }

    const contact = await companyService.updateContact(req.params.id, parsed.data, user.id);
    res.json(contact);
  } catch (error) {
    next(error);
  }
});

contactByIdRouter.delete("/:id", async (req, res, next) => {
  try {
    if (blockDemoCompanyWrite(req, res)) return;

    const user = getSessionUser(req);
    await companyService.deleteContact(req.params.id, user.id);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export { contactByIdRouter };
