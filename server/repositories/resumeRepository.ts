import prisma from "../prisma/client.js";
import type { CreateResumeInput, UpdateResumeInput } from "../lib/validation.js";

export interface ListResumesOptions {
  userId: string;
  search?: string;
}

export async function listResumes(options: ListResumesOptions) {
  const { userId, search = "" } = options;

  return prisma.resume.findMany({
    where: {
      userId,
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

export async function getResumeById(id: string, userId: string) {
  return prisma.resume.findFirst({
    where: { id, userId },
  });
}

export async function createResume(data: CreateResumeInput, userId: string) {
  return prisma.resume.create({
    data: {
      title: data.title,
      description: data.description ?? null,
      latexSource: data.latexSource,
      userId,
    },
  });
}

export async function updateResume(id: string, data: UpdateResumeInput, userId: string) {
  const existing = await getResumeById(id, userId);
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
  userId: string,
  payload: {
    compiledPdf: Buffer;
    pdfFilename: string;
    compileStatus: string;
    compileLog?: string | null;
  },
) {
  const existing = await getResumeById(id, userId);
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
  userId: string,
  compileLog: string,
) {
  const existing = await getResumeById(id, userId);
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

export async function deleteResume(id: string, userId: string) {
  const existing = await getResumeById(id, userId);
  if (!existing) {
    throw new Error("NOT_FOUND");
  }

  return prisma.resume.delete({
    where: { id: existing.id },
  });
}

export async function getResumePdf(id: string, userId: string) {
  return prisma.resume.findFirst({
    where: { id, userId },
    select: {
      compiledPdf: true,
      pdfFilename: true,
      title: true,
    },
  });
}
