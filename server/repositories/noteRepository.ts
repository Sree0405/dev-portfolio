import prisma from "../prisma/client.js";
import type { CreateNoteInput, UpdateNoteInput } from "../lib/validation.js";

export async function listNotesByProject(projectId: string, userId: string) {
  return prisma.projectNote.findMany({
    where: { projectId, userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getNoteById(id: string, userId: string) {
  return prisma.projectNote.findFirst({
    where: { id, userId },
  });
}

export async function createNote(projectId: string, data: CreateNoteInput, userId: string) {
  return prisma.projectNote.create({
    data: {
      projectId,
      content: data.content,
      userId,
    },
  });
}

export async function updateNote(id: string, data: UpdateNoteInput, userId: string) {
  return prisma.projectNote.update({
    where: { id, userId },
    data: { content: data.content },
  });
}

export async function deleteNote(id: string, userId: string) {
  return prisma.projectNote.delete({
    where: { id, userId },
  });
}
