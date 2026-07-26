import prisma from "../prisma/client.js";
import type { CreateProjectInput, UpdateProjectInput } from "../lib/validation.js";
import { normalizeProjectLinks } from "../lib/projectLinks.js";

export type ProjectSortField =
  | "name"
  | "clientName"
  | "status"
  | "plannedAmount"
  | "totalPaid"
  | "createdAt";

export interface ListProjectsOptions {
  userId: string;
  search?: string;
  sortBy?: ProjectSortField;
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}

export async function listProjects(options: ListProjectsOptions) {
  const {
    userId,
    search = "",
    sortBy = "createdAt",
    sortOrder = "desc",
    page = 1,
    pageSize = 10,
  } = options;

  const where = {
    userId,
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { clientName: { contains: search, mode: "insensitive" as const } },
            { clientNumber: { contains: search, mode: "insensitive" as const } },
            { projectLinks: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.project.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.project.count({ where }),
  ]);

  return { items, total, page, pageSize };
}

export async function getProjectById(id: string, userId: string) {
  return prisma.project.findFirst({
    where: { id, userId },
  });
}

export async function createProject(data: CreateProjectInput, userId: string) {
  return prisma.project.create({
    data: {
      name: data.name,
      clientName: data.clientName,
      clientNumber: data.clientNumber || null,
      projectLinks: normalizeProjectLinks(data.projectLinks),
      projectType: data.projectType,
      status: data.status,
      plannedAmount: data.plannedAmount,
      userId,
    },
  });
}

export async function updateProject(id: string, data: UpdateProjectInput, userId: string) {
  return prisma.project.update({
    where: { id, userId },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.clientName !== undefined && { clientName: data.clientName }),
      ...(data.clientNumber !== undefined && { clientNumber: data.clientNumber || null }),
      ...(data.projectLinks !== undefined && {
        projectLinks: normalizeProjectLinks(data.projectLinks),
      }),
      ...(data.projectType !== undefined && { projectType: data.projectType }),
      ...(data.status !== undefined && { status: data.status }),
      ...(data.plannedAmount !== undefined && { plannedAmount: data.plannedAmount }),
    },
  });
}

export async function deleteProject(id: string, userId: string) {
  return prisma.project.delete({
    where: { id, userId },
  });
}

export async function updateProjectTotalPaid(projectId: string, totalPaid: number, userId: string) {
  return prisma.project.update({
    where: { id: projectId, userId },
    data: { totalPaid },
  });
}
