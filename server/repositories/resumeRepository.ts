import prisma from "../prisma/client.js";
import type { DataType } from "../auth/config.js";
import type { CreateResumeInput, UpdateResumeInput } from "../lib/validation.js";

export interface ListResumesOptions {
  dataType: DataType;
  search?: string;
}

export async function listResumes(options: ListResumesOptions) {
  const { dataType, search = "" } = options;

  return prisma.resume.findMany({
    where: {
      type: dataType,
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" as const } },
              { description: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {}),
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getResumeById(id: string, dataType: DataType) {
  return prisma.resume.findFirst({
    where: { id, type: dataType },
  });
}

export async function createResume(data: CreateResumeInput, dataType: DataType) {
  return prisma.resume.create({
    data: {
      title: data.title,
      description: data.description ?? null,
      latexSource: data.latexSource,
      type: dataType,
    },
  });
}

export async function updateResume(id: string, data: UpdateResumeInput, dataType: DataType) {
  const existing = await getResumeById(id, dataType);
  if (!existing) {
    throw new Error("NOT_FOUND");
  }

  return prisma.resume.update({
    where: { id: existing.id },
    data: {
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.description !== undefined ? { description: data.description } : {}),
      ...(data.latexSource !== undefined ? { latexSource: data.latexSource } : {}),
    },
  });
}

export async function updateResumeCompiledPdf(
  id: string,
  dataType: DataType,
  payload: {
    compiledPdf: Buffer;
    pdfFilename: string;
    compileStatus: string;
    compileLog?: string | null;
  },
) {
  const existing = await getResumeById(id, dataType);
  if (!existing) {
    throw new Error("NOT_FOUND");
  }

  return prisma.resume.update({
    where: { id: existing.id },
    data: {
      compiledPdf: payload.compiledPdf,
      pdfFilename: payload.pdfFilename,
      compileStatus: payload.compileStatus,
      compileLog: payload.compileLog ?? null,
      lastCompiledAt: new Date(),
    },
  });
}

export async function updateResumeCompileError(
  id: string,
  dataType: DataType,
  compileLog: string,
) {
  const existing = await getResumeById(id, dataType);
  if (!existing) {
    throw new Error("NOT_FOUND");
  }

  return prisma.resume.update({
    where: { id: existing.id },
    data: {
      compileStatus: "error",
      compileLog,
      lastCompiledAt: new Date(),
    },
  });
}

export async function deleteResume(id: string, dataType: DataType) {
  const existing = await getResumeById(id, dataType);
  if (!existing) {
    throw new Error("NOT_FOUND");
  }

  return prisma.resume.delete({
    where: { id: existing.id },
  });
}

export async function getResumePdf(id: string, dataType: DataType) {
  return prisma.resume.findFirst({
    where: { id, type: dataType },
    select: {
      compiledPdf: true,
      pdfFilename: true,
      title: true,
    },
  });
}
