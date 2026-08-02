import type { PublicReviewInput, UpdateReviewInput } from "../lib/validation.js";
import { serializePortfolioReview } from "../lib/serializers.js";
import prisma from "../prisma/client.js";
import * as reviewRepository from "../repositories/reviewRepository.js";

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

export interface ListReviewsParams {
  userId: string;
  search?: string;
  visible?: boolean;
  page?: number;
  pageSize?: number;
}

export async function listReviews(params: ListReviewsParams) {
  const result = await reviewRepository.listReviews(params);
  return {
    items: result.items.map(serializePortfolioReview),
    total: result.total,
    page: result.page,
    pageSize: result.pageSize,
  };
}

export async function listPublicReviews() {
  const items = await reviewRepository.listPublicReviews(24);
  return items.map(serializePortfolioReview);
}

export async function submitPublicReview(data: PublicReviewInput) {
  const adminUserId = await resolveAdminUserId();
  const review = await reviewRepository.createPublicReview(data, adminUserId);
  return serializePortfolioReview(review);
}

export async function updateReview(id: string, data: UpdateReviewInput, userId: string) {
  const existing = await reviewRepository.getReviewById(id, userId);
  if (!existing) {
    throw new Error("NOT_FOUND");
  }

  const review = await reviewRepository.updateReview(id, data);
  return serializePortfolioReview(review);
}

export async function deleteReview(id: string, userId: string) {
  const existing = await reviewRepository.getReviewById(id, userId);
  if (!existing) {
    throw new Error("NOT_FOUND");
  }

  await reviewRepository.deleteReview(id);
}
