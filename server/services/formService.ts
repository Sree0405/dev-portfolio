import type { CreateFormSubmissionInput, UpdateFormSubmissionInput } from "../lib/validation.js";
import { serializeFormSubmission } from "../lib/serializers.js";
import prisma from "../prisma/client.js";
import * as formRepository from "../repositories/formRepository.js";

async function resolveAdminUserId(): Promise<string> {
  const admin = await prisma.user.findFirst({
    where: { role: "admin" },
    select: { id: true },
  });
  if (!admin) {
    throw new Error("ADMIN_USER_NOT_FOUND");
  }
  return admin.id;
}

export interface ListFormsParams {
  userId: string;
  search?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

export async function listForms(params: ListFormsParams) {
  const result = await formRepository.listFormSubmissions(params);
  return {
    items: result.items.map(serializeFormSubmission),
    total: result.total,
    page: result.page,
    pageSize: result.pageSize,
  };
}

export async function getForm(id: string, userId: string) {
  const form = await formRepository.getFormSubmissionById(id, userId);
  if (!form) {
    throw new Error("NOT_FOUND");
  }

  await formRepository.markFormSubmissionRead(id, userId);
  const refreshed = await formRepository.getFormSubmissionById(id, userId);
  return serializeFormSubmission(refreshed ?? form);
}

export async function createForm(data: CreateFormSubmissionInput, userId: string) {
  const form = await formRepository.createFormSubmission(data, userId);
  return serializeFormSubmission(form);
}

export async function submitPublicContactForm(data: CreateFormSubmissionInput) {
  const adminUserId = await resolveAdminUserId();
  const form = await formRepository.createPublicContactSubmission(data, adminUserId);
  return serializeFormSubmission(form);
}

export async function updateForm(id: string, data: UpdateFormSubmissionInput, userId: string) {
  const existing = await formRepository.getFormSubmissionById(id, userId);
  if (!existing) {
    throw new Error("NOT_FOUND");
  }

  const form = await formRepository.updateFormSubmission(id, data, userId);
  return serializeFormSubmission(form);
}

export async function deleteForm(id: string, userId: string) {
  const existing = await formRepository.getFormSubmissionById(id, userId);
  if (!existing) {
    throw new Error("NOT_FOUND");
  }

  await formRepository.deleteFormSubmission(id, userId);
}
