import type { Decimal } from "@prisma/client/runtime/library";
import { normalizeLatexSource } from "../resume/normalizeLatex.js";

export function decimalToNumber(value: Decimal | number | string | null | undefined): number {
  if (value === null || value === undefined) return 0;
  return Number(value);
}

export function computeRemaining(plannedAmount: Decimal | number, totalPaid: Decimal | number): number {
  return decimalToNumber(plannedAmount) - decimalToNumber(totalPaid);
}

export function serializeProject<T extends {
  plannedAmount: Decimal | number;
  totalPaid: Decimal | number;
  createdAt: Date;
  updatedAt: Date;
}>(project: T) {
  const planned = decimalToNumber(project.plannedAmount);
  const paid = decimalToNumber(project.totalPaid);

  return {
    ...project,
    plannedAmount: planned,
    totalPaid: paid,
    remainingAmount: planned - paid,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
  };
}

export function serializePayment<T extends {
  amount: Decimal | number;
  paymentDate: Date;
  createdAt: Date;
}>(payment: T) {
  return {
    ...payment,
    amount: decimalToNumber(payment.amount),
    paymentDate: payment.paymentDate.toISOString(),
    createdAt: payment.createdAt.toISOString(),
  };
}

export function serializeNote<T extends { createdAt: Date; updatedAt: Date }>(note: T) {
  return {
    ...note,
    createdAt: note.createdAt.toISOString(),
    updatedAt: note.updatedAt.toISOString(),
  };
}

export function serializeCredential<T extends { createdAt: Date; updatedAt: Date }>(credential: T) {
  return {
    ...credential,
    createdAt: credential.createdAt.toISOString(),
    updatedAt: credential.updatedAt.toISOString(),
  };
}

export function serializeFormSubmission<T extends { createdAt: Date; updatedAt: Date }>(form: T) {
  return {
    ...form,
    createdAt: form.createdAt.toISOString(),
    updatedAt: form.updatedAt.toISOString(),
  };
}

export function serializePortfolioReview<
  T extends { name: string; createdAt: Date; updatedAt: Date },
>(review: T) {
  const trimmed = review.name.trim();
  return {
    ...review,
    name: trimmed.length > 0 ? trimmed : "Anonymous",
    createdAt: review.createdAt.toISOString(),
    updatedAt: review.updatedAt.toISOString(),
  };
}

export function serializeResume<
  T extends {
    createdAt: Date;
    updatedAt: Date;
    lastCompiledAt: Date | null;
    compiledPdf?: Buffer | Uint8Array | null;
  },
>(resume: T) {
  const { compiledPdf: _compiledPdf, ...rest } = resume;
  return {
    ...rest,
    latexSource: normalizeLatexSource(rest.latexSource as string),
    hasCompiledPdf: Boolean(resume.compiledPdf && resume.compiledPdf.length > 0),
    createdAt: resume.createdAt.toISOString(),
    updatedAt: resume.updatedAt.toISOString(),
    lastCompiledAt: resume.lastCompiledAt?.toISOString() ?? null,
  };
}

function serializeSalaryFields<T extends {
  expectedSalary?: Decimal | number | null;
  currentSalary?: Decimal | number | null;
  negotiatedSalary?: Decimal | number | null;
  offeredSalary?: Decimal | number | null;
  companyStandardSalary?: Decimal | number | null;
}>(entity: T) {
  return {
    expectedSalary: entity.expectedSalary != null ? decimalToNumber(entity.expectedSalary) : null,
    currentSalary: entity.currentSalary != null ? decimalToNumber(entity.currentSalary) : null,
    negotiatedSalary: entity.negotiatedSalary != null ? decimalToNumber(entity.negotiatedSalary) : null,
    offeredSalary: entity.offeredSalary != null ? decimalToNumber(entity.offeredSalary) : null,
    companyStandardSalary:
      entity.companyStandardSalary != null ? decimalToNumber(entity.companyStandardSalary) : null,
  };
}

export function serializeCompanyContact<T extends { createdAt: Date; updatedAt: Date }>(contact: T) {
  return {
    ...contact,
    createdAt: contact.createdAt.toISOString(),
    updatedAt: contact.updatedAt.toISOString(),
  };
}

export function serializeCompany<
  T extends {
    createdAt: Date;
    updatedAt: Date;
    jobApplications?: { currentStatus: string }[];
    _count?: { jobApplications: number };
  },
>(company: T) {
  const jobCount = company._count?.jobApplications ?? company.jobApplications?.length ?? 0;
  const latestStatus =
    company.jobApplications && company.jobApplications.length > 0
      ? company.jobApplications[0].currentStatus
      : null;

  const { jobApplications: _jobs, _count: _count, ...rest } = company;

  return {
    ...rest,
    jobApplicationCount: jobCount,
    latestJobStatus: latestStatus,
    createdAt: company.createdAt.toISOString(),
    updatedAt: company.updatedAt.toISOString(),
  };
}

export function serializeJobStatusHistory<T extends { createdAt: Date }>(entry: T) {
  return {
    ...entry,
    createdAt: entry.createdAt.toISOString(),
  };
}

export function serializeInterview<T extends { interviewDate: Date; createdAt: Date; updatedAt: Date }>(
  interview: T,
) {
  return {
    ...interview,
    interviewDate: interview.interviewDate.toISOString(),
    createdAt: interview.createdAt.toISOString(),
    updatedAt: interview.updatedAt.toISOString(),
  };
}

export function serializeJobNote<T extends { createdAt: Date; updatedAt: Date }>(note: T) {
  return {
    ...note,
    createdAt: note.createdAt.toISOString(),
    updatedAt: note.updatedAt.toISOString(),
  };
}

export function serializeJobApplication<
  T extends {
    appliedDate: Date;
    createdAt: Date;
    updatedAt: Date;
    expectedSalary?: Decimal | number | null;
    currentSalary?: Decimal | number | null;
    negotiatedSalary?: Decimal | number | null;
    offeredSalary?: Decimal | number | null;
    companyStandardSalary?: Decimal | number | null;
    company?: { id: string; name: string };
    interviews?: { interviewDate: Date }[];
  },
>(job: T) {
  const upcomingInterview =
    job.interviews && job.interviews.length > 0
      ? job.interviews.sort((a, b) => a.interviewDate.getTime() - b.interviewDate.getTime())[0]
      : null;

  const { interviews: _interviews, company: _company, ...rest } = job;

  return {
    ...rest,
    ...serializeSalaryFields(job),
    appliedDate: job.appliedDate.toISOString(),
    companyName: job.company?.name ?? null,
    nextInterviewDate: upcomingInterview?.interviewDate.toISOString() ?? null,
    createdAt: job.createdAt.toISOString(),
    updatedAt: job.updatedAt.toISOString(),
  };
}
