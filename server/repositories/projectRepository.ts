import prisma from "../prisma/client.js";
import type { DataType } from "../auth/config.js";
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
  dataType: DataType;
  search?: string;
  sortBy?: ProjectSortField;
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}

export async function listProjects(options: ListProjectsOptions) {
  const {
    dataType,
    search = "",
    sortBy = "createdAt",
    sortOrder = "desc",
    page = 1,
    pageSize = 10,
  } = options;

  const where = {
    type: dataType,
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

export async function getProjectById(id: string, dataType: DataType) {
  return prisma.project.findFirst({
    where: { id, type: dataType },
  });
}

export async function createProject(data: CreateProjectInput, dataType: DataType) {
  return prisma.project.create({
    data: {
      name: data.name,
      clientName: data.clientName,
      clientNumber: data.clientNumber || null,
      projectLinks: normalizeProjectLinks(data.projectLinks),
      projectType: data.projectType,
      status: data.status,
      plannedAmount: data.plannedAmount,
      type: dataType,
    },
  });
}

export async function updateProject(id: string, data: UpdateProjectInput, dataType: DataType) {
  return prisma.project.update({
    where: { id, type: dataType },
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

export async function deleteProject(id: string, dataType: DataType) {
  return prisma.project.delete({
    where: { id, type: dataType },
  });
}

export async function updateProjectTotalPaid(projectId: string, totalPaid: number, dataType: DataType) {
  return prisma.project.update({
    where: { id: projectId, type: dataType },
    data: { totalPaid },
  });
}
