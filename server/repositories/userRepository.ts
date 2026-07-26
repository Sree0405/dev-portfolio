import prisma from "../prisma/client.js";
import type { AccountRole } from "@prisma/client";

export interface CreateUserInput {
  username: string;
  email: string;
  passwordHash: string;
  displayName?: string | null;
  role?: AccountRole;
}

export interface UpdateUserProfileInput {
  email?: string;
  displayName?: string | null;
}

export async function findUserByUsername(username: string) {
  return prisma.user.findFirst({
    where: {
      username: { equals: username, mode: "insensitive" },
    },
  });
}

export async function findUserByEmail(email: string) {
  return prisma.user.findFirst({
    where: {
      email: { equals: email, mode: "insensitive" },
    },
  });
}

export async function findUserById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

export async function createUser(data: CreateUserInput) {
  return prisma.user.create({
    data: {
      username: data.username,
      email: data.email,
      passwordHash: data.passwordHash,
      displayName: data.displayName ?? null,
      role: data.role ?? "user",
    },
  });
}

export async function updateUserProfile(id: string, data: UpdateUserProfileInput) {
  return prisma.user.update({
    where: { id },
    data: {
      ...(data.email !== undefined && { email: data.email }),
      ...(data.displayName !== undefined && { displayName: data.displayName }),
    },
  });
}

export async function updateUserPassword(id: string, passwordHash: string) {
  return prisma.user.update({
    where: { id },
    data: { passwordHash },
  });
}

export async function listUsers(options?: { search?: string; page?: number; pageSize?: number }) {
  const { search = "", page = 1, pageSize = 20 } = options ?? {};

  const where = search
    ? {
        OR: [
          { username: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
          { displayName: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [items, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        username: true,
        email: true,
        displayName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.user.count({ where }),
  ]);

  return { items, total, page, pageSize };
}
