import { Router } from "express";
import authRoutes from "./auth.js";
import userRoutes from "./users.js";
import projectRoutes from "./projects.js";
import dashboardRoutes from "./dashboard.js";
import credentialRoutes from "./credentials.js";
import financeRoutes from "./finance.js";
import budgetRoutes from "./budget.js";
import resumeRoutes from "./resumes.js";
import devUtilityRoutes from "./devUtilities.js";
import contactRoutes from "./contact.js";
import formRoutes from "./forms.js";
import reviewRoutes from "./reviews.js";
import { companyRoutes, contactByIdRouter } from "./companies.js";
import { jobRoutes, interviewByIdRouter, jobNoteByIdRouter } from "./jobs.js";
import { projectPaymentsRouter, paymentByIdRouter } from "./payments.js";
import { projectNotesRouter, noteByIdRouter } from "./notes.js";

export function createApiRouter() {
  const router = Router();

  router.use(authRoutes);
  router.use("/users", userRoutes);
  router.use("/dashboard", dashboardRoutes);
  router.use("/credentials", credentialRoutes);
  router.use("/finance", financeRoutes);
  router.use("/budget", budgetRoutes);
  router.use("/resumes", resumeRoutes);
  router.use("/dev-utilities", devUtilityRoutes);
  router.use("/contact", contactRoutes);
  router.use("/forms", formRoutes);
  router.use("/reviews", reviewRoutes);
  router.use("/companies", companyRoutes);
  router.use("/company-contacts", contactByIdRouter);
  router.use("/jobs", jobRoutes);
  router.use("/interviews", interviewByIdRouter);
  router.use("/job-notes", jobNoteByIdRouter);
  router.use("/projects", projectRoutes);
  router.use("/projects/:id/payments", projectPaymentsRouter);
  router.use("/projects/:id/notes", projectNotesRouter);
  router.use("/payments", paymentByIdRouter);
  router.use("/notes", noteByIdRouter);

  return router;
}
