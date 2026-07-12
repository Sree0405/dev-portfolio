import prisma from "../prisma/client.js";
import type { DataType } from "../auth/config.js";
import type { CreateCredentialInput, UpdateCredentialInput } from "../lib/validation.js";

export interface ListCredentialsOptions {
  dataType: DataType;
  search?: string;
  category?: string;
}

export async function listCredentials(options: ListCredentialsOptions) {
  const { dataType, search = "", category } = options;

  const where = {
    type: dataType,
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

export async function countCredentials(dataType: DataType) {
  return prisma.credential.count({ where: { type: dataType } });
}

export async function getCredentialById(id: string, dataType: DataType) {
  return prisma.credential.findFirst({
    where: { id, type: dataType },
  });
}

export async function createCredential(data: CreateCredentialInput, dataType: DataType) {
  return prisma.credential.create({
    data: {
      serviceName: data.serviceName,
      websiteUrl: data.websiteUrl,
      username: data.username,
      password: data.password,
      category: data.category,
      notes: data.notes || null,
      type: dataType,
    },
  });
}

export async function updateCredential(
  id: string,
  data: UpdateCredentialInput,
  dataType: DataType,
) {
  return prisma.credential.update({
    where: { id, type: dataType },
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

export async function deleteCredential(id: string, dataType: DataType) {
  return prisma.credential.delete({
    where: { id, type: dataType },
  });
}
