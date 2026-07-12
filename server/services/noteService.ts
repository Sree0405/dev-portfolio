import * as noteRepo from "../repositories/noteRepository.js";
import * as projectRepo from "../repositories/projectRepository.js";
import { serializeNote } from "../lib/serializers.js";
import type { DataType } from "../auth/config.js";
import type { CreateNoteInput, UpdateNoteInput } from "../lib/validation.js";

export async function listNotes(projectId: string, dataType: DataType) {
  const project = await projectRepo.getProjectById(projectId, dataType);
  if (!project) {
    throw new Error("NOT_FOUND");
  }

  const notes = await noteRepo.listNotesByProject(projectId, dataType);
  return notes.map(serializeNote);
}

export async function createNote(projectId: string, data: CreateNoteInput, dataType: DataType) {
  const project = await projectRepo.getProjectById(projectId, dataType);
  if (!project) {
    throw new Error("NOT_FOUND");
  }

  const note = await noteRepo.createNote(projectId, data, dataType);
  return serializeNote(note);
}

export async function updateNote(id: string, data: UpdateNoteInput, dataType: DataType) {
  const existing = await noteRepo.getNoteById(id, dataType);
  if (!existing) {
    throw new Error("NOT_FOUND");
  }

  const note = await noteRepo.updateNote(id, data, dataType);
  return serializeNote(note);
}

export async function deleteNote(id: string, dataType: DataType) {
  const existing = await noteRepo.getNoteById(id, dataType);
  if (!existing) {
    throw new Error("NOT_FOUND");
  }

  await noteRepo.deleteNote(id, dataType);
}
