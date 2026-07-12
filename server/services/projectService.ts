import * as projectRepo from "../repositories/projectRepository.js";
import { serializeProject } from "../lib/serializers.js";
import type { DataType } from "../auth/config.js";
import type { CreateProjectInput, UpdateProjectInput } from "../lib/validation.js";
import type { ProjectSortField } from "../repositories/projectRepository.js";

export async function listProjects(params: {
  dataType: DataType;
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
    dataType: params.dataType,
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

export async function getProject(id: string, dataType: DataType) {
  const project = await projectRepo.getProjectById(id, dataType);
  if (!project) {
    throw new Error("NOT_FOUND");
  }
  return serializeProject(project);
}

export async function createProject(data: CreateProjectInput, dataType: DataType) {
  const project = await projectRepo.createProject(data, dataType);
  return serializeProject(project);
}

export async function updateProject(id: string, data: UpdateProjectInput, dataType: DataType) {
  const existing = await projectRepo.getProjectById(id, dataType);
  if (!existing) {
    throw new Error("NOT_FOUND");
  }
  const project = await projectRepo.updateProject(id, data, dataType);
  return serializeProject(project);
}

export async function deleteProject(id: string, dataType: DataType) {
  const existing = await projectRepo.getProjectById(id, dataType);
  if (!existing) {
    throw new Error("NOT_FOUND");
  }
  await projectRepo.deleteProject(id, dataType);
}
