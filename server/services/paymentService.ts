import * as paymentRepo from "../repositories/paymentRepository.js";
import * as projectRepo from "../repositories/projectRepository.js";
import { serializePayment, serializeProject } from "../lib/serializers.js";
import type { CreatePaymentInput, UpdatePaymentInput } from "../lib/validation.js";

async function recalculateTotalPaid(projectId: string, userId: string) {
  const totalPaid = await paymentRepo.sumPaymentsByProject(projectId, userId);
  await projectRepo.updateProjectTotalPaid(projectId, totalPaid, userId);
  return totalPaid;
}

export async function listPayments(projectId: string, userId: string) {
  const project = await projectRepo.getProjectById(projectId, userId);
  if (!project) {
    throw new Error("NOT_FOUND");
  }

  const payments = await paymentRepo.listPaymentsByProject(projectId, userId);
  return payments.map(serializePayment);
}

export async function createPayment(
  projectId: string,
  data: CreatePaymentInput,
  userId: string,
) {
  const project = await projectRepo.getProjectById(projectId, userId);
  if (!project) {
    throw new Error("NOT_FOUND");
  }

  const payment = await paymentRepo.createPayment(projectId, data, userId);
  await recalculateTotalPaid(projectId, userId);

  const updatedProject = await projectRepo.getProjectById(projectId, userId);
  return {
    payment: serializePayment(payment),
    project: updatedProject ? serializeProject(updatedProject) : null,
  };
}

export async function updatePayment(id: string, data: UpdatePaymentInput, userId: string) {
  const existing = await paymentRepo.getPaymentById(id, userId);
  if (!existing) {
    throw new Error("NOT_FOUND");
  }

  const payment = await paymentRepo.updatePayment(id, data, userId);
  await recalculateTotalPaid(existing.projectId, userId);

  const updatedProject = await projectRepo.getProjectById(existing.projectId, userId);
  return {
    payment: serializePayment(payment),
    project: updatedProject ? serializeProject(updatedProject) : null,
  };
}

export async function deletePayment(id: string, userId: string) {
  const existing = await paymentRepo.getPaymentById(id, userId);
  if (!existing) {
    throw new Error("NOT_FOUND");
  }

  await paymentRepo.deletePayment(id, userId);
  await recalculateTotalPaid(existing.projectId, userId);

  const updatedProject = await projectRepo.getProjectById(existing.projectId, userId);
  return {
    project: updatedProject ? serializeProject(updatedProject) : null,
  };
}
