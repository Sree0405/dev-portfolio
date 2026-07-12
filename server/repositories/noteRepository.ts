import prisma from "../prisma/client.js";
import type { DataType } from "../auth/config.js";
import type { CreateNoteInput, UpdateNoteInput } from "../lib/validation.js";

export async function listNotesByProject(projectId: string, dataType: DataType) {
  return prisma.projectNote.findMany({
    where: { projectId, type: dataType },
    orderBy: { createdAt: "desc" },
  });
}

export async function getNoteById(id: string, dataType: DataType) {
  return prisma.projectNote.findFirst({
    where: { id, type: dataType },
  });
}

export async function createNote(projectId: string, data: CreateNoteInput, dataType: DataType) {
  return prisma.projectNote.create({
    data: {
      projectId,
      content: data.content,
      type: dataType,
    },
  });
}

export async function updateNote(id: string, data: UpdateNoteInput, dataType: DataType) {
  return prisma.projectNote.update({
    where: { id, type: dataType },
    data: { content: data.content },
  });
}

export async function deleteNote(id: string, dataType: DataType) {
  return prisma.projectNote.delete({
    where: { id, type: dataType },
  });
}
