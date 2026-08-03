import prisma from "../prisma/client.js";
import type { PublicReviewInput, UpdateReviewInput } from "../lib/validation.js";

export interface ListReviewsOptions {
  userId: string;
  search?: string;
  visible?: boolean;
  page?: number;
  pageSize?: number;
}

export async function listReviews(options: ListReviewsOptions) {
  const { userId, search = "", visible, page = 1, pageSize = 10 } = options;

  const where = {
    userId,
    ...(visible !== undefined ? { visible } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { role: { contains: search, mode: "insensitive" as const } },
            { relationship: { contains: search, mode: "insensitive" as const } },
            { message: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.portfolioReview.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.portfolioReview.count({ where }),
  ]);

  return { items, total, page, pageSize };
}

export async function listPublicReviews(limit = 24) {
  return prisma.portfolioReview.findMany({
    where: { visible: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getReviewById(id: string, userId: string) {
  return prisma.portfolioReview.findFirst({
    where: { id, userId },
  });
}

export async function createPublicReview(data: PublicReviewInput, userId: string) {
  const role = data.role?.trim() || null;
  return prisma.portfolioReview.create({
    data: {
      name: data.name?.trim() ?? "",
      role,
      relationship: data.relationship,
      message: data.message.trim(),
      visible: true,
      source: "portfolio",
      userId,
    },
  });
}

export async function updateReview(id: string, data: UpdateReviewInput) {
  return prisma.portfolioReview.update({
    where: { id },
    data: {
      ...(data.visible !== undefined && { visible: data.visible }),
      ...(data.name !== undefined && { name: data.name.trim() }),
      ...(data.role !== undefined && {
        role: data.role?.trim() ? data.role.trim() : null,
      }),
      ...(data.relationship !== undefined && { relationship: data.relationship }),
      ...(data.message !== undefined && { message: data.message.trim() }),
    },
  });
}

export async function deleteReview(id: string) {
  return prisma.portfolioReview.delete({
    where: { id },
  });
}
