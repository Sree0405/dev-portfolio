import prisma from "../prisma/client.js";
import type { CreateCredentialInput, UpdateCredentialInput } from "../lib/validation.js";

export interface ListCredentialsOptions {
  userId: string;
  search?: string;
  category?: string;
}

export async function listCredentials(options: ListCredentialsOptions) {
  const { userId, search = "", category } = options;

  const where = {
    userId,
    ...(category && category !== "All" ? { category } : {}),
    ...(search
      ? {
          OR: [
            { serviceName: { contains: search, mode: "insensitive" as const } },
            { websiteUrl: { contains: search, mode: "insensitive" as const } },
            { username: { contains: search, mode: "insensitive" as const } },
            { category: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  return prisma.credential.findMany({
    where,
    orderBy: { updatedAt: "desc" },
  });
}

export async function countCredentials(userId: string) {
  return prisma.credential.count({ where: { userId } });
}

export async function getCredentialById(id: string, userId: string) {
  return prisma.credential.findFirst({
    where: { id, userId },
  });
}

export async function createCredential(data: CreateCredentialInput, userId: string) {
  return prisma.credential.create({
    data: {
      serviceName: data.serviceName,
      websiteUrl: data.websiteUrl,
      username: data.username,
      password: data.password,
      category: data.category,
      notes: data.notes || null,
      userId,
    },
  });
}

export async function updateCredential(
  id: string,
  data: UpdateCredentialInput,
  userId: string,
) {
  return prisma.credential.update({
    where: { id, userId },
    data: {
      ...(data.serviceName !== undefined && { serviceName: data.serviceName }),
      ...(data.websiteUrl !== undefined && { websiteUrl: data.websiteUrl }),
      ...(data.username !== undefined && { username: data.username }),
      ...(data.password !== undefined && { password: data.password }),
      ...(data.category !== undefined && { category: data.category }),
      ...(data.notes !== undefined && { notes: data.notes || null }),
    },
  });
}

export async function deleteCredential(id: string, userId: string) {
  return prisma.credential.delete({
    where: { id, userId },
  });
}
