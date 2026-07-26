import * as projectRepo from "../repositories/projectRepository.js";
import { serializeProject } from "../lib/serializers.js";
import type { CreateProjectInput, UpdateProjectInput } from "../lib/validation.js";
import type { ProjectSortField } from "../repositories/projectRepository.js";

export async function listProjects(params: {
  userId: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}) {
  const allowedSortFields: ProjectSortField[] = [
    "name",
    "clientName",
    "status",
    "plannedAmount",
    "totalPaid",
    "createdAt",
  ];

  const sortBy = allowedSortFields.includes(params.sortBy as ProjectSortField)
    ? (params.sortBy as ProjectSortField)
    : "createdAt";

  const result = await projectRepo.listProjects({
    userId: params.userId,
    search: params.search,
    sortBy,
    sortOrder: params.sortOrder ?? "desc",
    page: params.page ?? 1,
    pageSize: params.pageSize ?? 10,
  });

  return {
    ...result,
    items: result.items.map(serializeProject),
  };
}

export async function getProject(id: string, userId: string) {
  const project = await projectRepo.getProjectById(id, userId);
  if (!project) {
    throw new Error("NOT_FOUND");
  }
  return serializeProject(project);
}

export async function createProject(data: CreateProjectInput, userId: string) {
  const project = await projectRepo.createProject(data, userId);
  return serializeProject(project);
}

export async function updateProject(id: string, data: UpdateProjectInput, userId: string) {
  const existing = await projectRepo.getProjectById(id, userId);
  if (!existing) {
    throw new Error("NOT_FOUND");
  }
  const project = await projectRepo.updateProject(id, data, userId);
  return serializeProject(project);
}

export async function deleteProject(id: string, userId: string) {
  const existing = await projectRepo.getProjectById(id, userId);
  if (!existing) {
    throw new Error("NOT_FOUND");
  }
  await projectRepo.deleteProject(id, userId);
}
