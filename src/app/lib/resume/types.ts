import type { DataType } from "../types";

export type ResumeCompileStatus = "idle" | "success" | "error" | "pending";

export interface Resume {
  id: string;
  title: string;
  description: string | null;
  latexSource: string;
  compileStatus: ResumeCompileStatus;
  compileLog: string | null;
  pdfFilename: string | null;
  hasCompiledPdf: boolean;
  lastCompiledAt: string | null;
  type: DataType;
  createdAt: string;
  updatedAt: string;
}

export interface ResumesListResponse {
  items: Resume[];
}

export const DEMO_RESUME_DELETE_MESSAGE = "Deleting demo resumes is disabled.";
