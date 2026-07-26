import * as noteRepo from "../repositories/noteRepository.js";
import * as projectRepo from "../repositories/projectRepository.js";
import { serializeNote } from "../lib/serializers.js";
import type { CreateNoteInput, UpdateNoteInput } from "../lib/validation.js";

export async function listNotes(projectId: string, userId: string) {
  const project = await projectRepo.getProjectById(projectId, userId);
  if (!project) {
    throw new Error("NOT_FOUND");
  }

  const notes = await noteRepo.listNotesByProject(projectId, userId);
  return notes.map(serializeNote);
}

export async function createNote(projectId: string, data: CreateNoteInput, userId: string) {
  const project = await projectRepo.getProjectById(projectId, userId);
  if (!project) {
    throw new Error("NOT_FOUND");
  }

  const note = await noteRepo.createNote(projectId, data, userId);
  return serializeNote(note);
}

export async function updateNote(id: string, data: UpdateNoteInput, userId: string) {
  const existing = await noteRepo.getNoteById(id, userId);
  if (!existing) {
    throw new Error("NOT_FOUND");
  }

  const note = await noteRepo.updateNote(id, data, userId);
  return serializeNote(note);
}

export async function deleteNote(id: string, userId: string) {
  const existing = await noteRepo.getNoteById(id, userId);
  if (!existing) {
    throw new Error("NOT_FOUND");
  }

  await noteRepo.deleteNote(id, userId);
}
