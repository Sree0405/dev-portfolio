import { Router } from "express";
import authRoutes from "./auth.js";
import projectRoutes from "./projects.js";
import dashboardRoutes from "./dashboard.js";
import credentialRoutes from "./credentials.js";
import financeRoutes from "./finance.js";
import budgetRoutes from "./budget.js";
import { projectPaymentsRouter, paymentByIdRouter } from "./payments.js";
import { projectNotesRouter, noteByIdRouter } from "./notes.js";

export function createApiRouter() {
  const router = Router();

  router.use(authRoutes);
  router.use("/dashboard", dashboardRoutes);
  router.use("/credentials", credentialRoutes);
  router.use("/finance", financeRoutes);
  router.use("/budget", budgetRoutes);
  router.use("/projects", projectRoutes);
  router.use("/projects/:id/payments", projectPaymentsRouter);
  router.use("/projects/:id/notes", projectNotesRouter);
  router.use("/payments", paymentByIdRouter);
  router.use("/notes", noteByIdRouter);

  return router;
}
