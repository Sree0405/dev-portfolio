import * as paymentRepo from "../repositories/paymentRepository.js";
import * as projectRepo from "../repositories/projectRepository.js";
import { serializePayment, serializeProject } from "../lib/serializers.js";
import type { DataType } from "../auth/config.js";
import type { CreatePaymentInput, UpdatePaymentInput } from "../lib/validation.js";

async function recalculateTotalPaid(projectId: string, dataType: DataType) {
  const totalPaid = await paymentRepo.sumPaymentsByProject(projectId, dataType);
  await projectRepo.updateProjectTotalPaid(projectId, totalPaid, dataType);
  return totalPaid;
}

export async function listPayments(projectId: string, dataType: DataType) {
  const project = await projectRepo.getProjectById(projectId, dataType);
  if (!project) {
    throw new Error("NOT_FOUND");
  }

  const payments = await paymentRepo.listPaymentsByProject(projectId, dataType);
  return payments.map(serializePayment);
}

export async function createPayment(
  projectId: string,
  data: CreatePaymentInput,
  dataType: DataType,
) {
  const project = await projectRepo.getProjectById(projectId, dataType);
  if (!project) {
    throw new Error("NOT_FOUND");
  }

  const payment = await paymentRepo.createPayment(projectId, data, dataType);
  await recalculateTotalPaid(projectId, dataType);

  const updatedProject = await projectRepo.getProjectById(projectId, dataType);
  return {
    payment: serializePayment(payment),
    project: updatedProject ? serializeProject(updatedProject) : null,
  };
}

export async function updatePayment(id: string, data: UpdatePaymentInput, dataType: DataType) {
  const existing = await paymentRepo.getPaymentById(id, dataType);
  if (!existing) {
    throw new Error("NOT_FOUND");
  }

  const payment = await paymentRepo.updatePayment(id, data, dataType);
  await recalculateTotalPaid(existing.projectId, dataType);

  const updatedProject = await projectRepo.getProjectById(existing.projectId, dataType);
  return {
    payment: serializePayment(payment),
    project: updatedProject ? serializeProject(updatedProject) : null,
  };
}

export async function deletePayment(id: string, dataType: DataType) {
  const existing = await paymentRepo.getPaymentById(id, dataType);
  if (!existing) {
    throw new Error("NOT_FOUND");
  }

  await paymentRepo.deletePayment(id, dataType);
  await recalculateTotalPaid(existing.projectId, dataType);

  const updatedProject = await projectRepo.getProjectById(existing.projectId, dataType);
  return {
    project: updatedProject ? serializeProject(updatedProject) : null,
  };
}
