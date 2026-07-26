import prisma from "../prisma/client.js";
import type { CreateFormSubmissionInput, UpdateFormSubmissionInput } from "../lib/validation.js";

export interface ListFormsOptions {
  userId: string;
  search?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

export async function listFormSubmissions(options: ListFormsOptions) {
  const { userId, search = "", status, page = 1, pageSize = 10 } = options;

  const where = {
    userId,
    ...(status && status !== "All" ? { status } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
            { subject: { contains: search, mode: "insensitive" as const } },
            { message: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.contactFormSubmission.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.contactFormSubmission.count({ where }),
  ]);

  return { items, total, page, pageSize };
}

export async function countFormSubmissions(userId: string) {
  return prisma.contactFormSubmission.count({ where: { userId } });
}

export async function getFormSubmissionById(id: string, userId: string) {
  return prisma.contactFormSubmission.findFirst({
    where: { id, userId },
  });
}

export async function createFormSubmission(
  data: CreateFormSubmissionInput,
  userId: string,
  source = "dashboard",
) {
  return prisma.contactFormSubmission.create({
    data: {
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      source: data.source ?? source,
      userId,
    },
  });
}

export async function createPublicContactSubmission(
  data: CreateFormSubmissionInput,
  userId: string,
) {
  return prisma.contactFormSubmission.create({
    data: {
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      source: "contact_page",
      userId,
    },
  });
}

export async function updateFormSubmission(
  id: string,
  data: UpdateFormSubmissionInput,
  userId: string,
) {
  return prisma.contactFormSubmission.update({
    where: { id, userId },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.email !== undefined && { email: data.email }),
      ...(data.subject !== undefined && { subject: data.subject }),
      ...(data.message !== undefined && { message: data.message }),
      ...(data.status !== undefined && { status: data.status }),
    },
  });
}

export async function markFormSubmissionRead(id: string, userId: string) {
  return prisma.contactFormSubmission.updateMany({
    where: { id, userId, status: "new" },
    data: { status: "read" },
  });
}

export async function deleteFormSubmission(id: string, userId: string) {
  return prisma.contactFormSubmission.delete({
    where: { id, userId },
  });
}
