import * as resumeRepo from "../repositories/resumeRepository.js";
import { serializeResume } from "../lib/serializers.js";
import { compileLatexToPdf, isLatexInstalledError } from "../resume/latexCompile.js";
import { DEFAULT_RESUME_LATEX } from "../resume/defaultTemplate.js";
import { normalizeLatexSource } from "../resume/normalizeLatex.js";
import type { DataType } from "../auth/config.js";
import type { CreateResumeInput, UpdateResumeInput } from "../lib/validation.js";

function slugifyFilename(title: string): string {
  return title
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "_")
    .slice(0, 80) || "Resume";
}

export async function listResumes(params: { dataType: DataType; search?: string }) {
  const items = await resumeRepo.listResumes(params);
  return items.map(serializeResume);
}

export async function getResume(id: string, dataType: DataType) {
  const resume = await resumeRepo.getResumeById(id, dataType);
  if (!resume) {
    throw new Error("NOT_FOUND");
  }
  return serializeResume(resume);
}

export async function createResume(data: CreateResumeInput, dataType: DataType) {
  const resume = await resumeRepo.createResume(
    {
      title: data.title,
      description: data.description,
      latexSource: normalizeLatexSource(
        data.latexSource?.trim() ? data.latexSource : DEFAULT_RESUME_LATEX,
      ),
    },
    dataType,
  );
  return serializeResume(resume);
}

export async function updateResume(id: string, data: UpdateResumeInput, dataType: DataType) {
  const existing = await resumeRepo.getResumeById(id, dataType);
  if (!existing) {
    throw new Error("NOT_FOUND");
  }

  const resume = await resumeRepo.updateResume(id, data, dataType);
  return serializeResume(resume);
}

export async function saveResumeWithPdf(
  id: string,
  dataType: DataType,
  payload: UpdateResumeInput & { compiledPdfBase64?: string },
) {
  const existing = await resumeRepo.getResumeById(id, dataType);
  if (!existing) {
    throw new Error("NOT_FOUND");
  }

  await resumeRepo.updateResume(id, payload, dataType);

  if (payload.compiledPdfBase64) {
    try {
      const pdfBuffer = Buffer.from(payload.compiledPdfBase64, "base64");
      const title = payload.title ?? existing.title;
      await resumeRepo.updateResumeCompiledPdf(id, dataType, {
        compiledPdf: pdfBuffer,
        pdfFilename: `${slugifyFilename(title)}.pdf`,
        compileStatus: "success",
        compileLog: "Generated from client preview.",
      });
    } catch {
      // LaTeX source is saved even when preview PDF persistence fails.
    }
  }

  const resume = await resumeRepo.getResumeById(id, dataType);
  return serializeResume(resume!);
}

export async function compileResumePdf(id: string, dataType: DataType) {
  const resume = await resumeRepo.getResumeById(id, dataType);
  if (!resume) {
    throw new Error("NOT_FOUND");
  }

  try {
    const { pdf, log } = await compileLatexToPdf(resume.latexSource);
    const pdfFilename = `${slugifyFilename(resume.title)}.pdf`;

    const updated = await resumeRepo.updateResumeCompiledPdf(id, dataType, {
      compiledPdf: pdf,
      pdfFilename,
      compileStatus: "success",
      compileLog: log.slice(-4000),
    });

    return serializeResume(updated);
  } catch (error) {
    const message = isLatexInstalledError(error)
      ? "LaTeX is not installed on the server. Use client PDF download or deploy with TeX Live."
      : error instanceof Error
        ? error.message.slice(-4000)
        : "LaTeX compilation failed";

    await resumeRepo.updateResumeCompileError(id, dataType, message);

    if (isLatexInstalledError(error)) {
      throw new Error("LATEX_NOT_INSTALLED");
    }

    throw new Error("COMPILE_FAILED");
  }
}

export async function getResumePdfBuffer(id: string, dataType: DataType) {
  const resume = await resumeRepo.getResumePdf(id, dataType);
  if (!resume) {
    throw new Error("NOT_FOUND");
  }
  if (!resume.compiledPdf) {
    throw new Error("PDF_NOT_READY");
  }

  return {
    buffer: Buffer.from(resume.compiledPdf),
    filename: resume.pdfFilename ?? `${slugifyFilename(resume.title)}.pdf`,
  };
}

export async function deleteResume(id: string, dataType: DataType) {
  const existing = await resumeRepo.getResumeById(id, dataType);
  if (!existing) {
    throw new Error("NOT_FOUND");
  }
  await resumeRepo.deleteResume(id, dataType);
}
