import type {
  CreateJobApplicationInput,
  UpdateJobApplicationInput,
  UpdateJobStatusInput,
  UpdateJobSalariesInput,
  CreateInterviewInput,
  UpdateInterviewInput,
  CreateJobNoteInput,
  UpdateJobNoteInput,
} from "../lib/validation.js";
import {
  serializeJobApplication,
  serializeJobStatusHistory,
  serializeInterview,
  serializeJobNote,
} from "../lib/serializers.js";
import * as jobRepo from "../repositories/jobRepository.js";
import * as companyRepo from "../repositories/companyRepository.js";

export interface ListJobsParams {
  userId: string;
  search?: string;
  status?: string;
  companyId?: string;
  page?: number;
  pageSize?: number;
}

export async function listJobs(params: ListJobsParams) {
  const result = await jobRepo.listJobApplications(params);
  return {
    items: result.items.map(serializeJobApplication),
    total: result.total,
    page: result.page,
    pageSize: result.pageSize,
  };
}

export async function getJob(id: string, userId: string) {
  const job = await jobRepo.getJobApplicationById(id, userId);
  if (!job) {
    throw new Error("NOT_FOUND");
  }

  const { statusHistory, interviews, notes, company, ...rest } = job;

  return {
    ...serializeJobApplication({ ...rest, company }),
    statusHistory: statusHistory.map(serializeJobStatusHistory),
    interviews: interviews.map(serializeInterview),
    notes: notes.map(serializeJobNote),
  };
}

export async function createJob(data: CreateJobApplicationInput, userId: string) {
  const company = await companyRepo.getCompanyById(data.companyId, userId);
  if (!company) {
    throw new Error("NOT_FOUND");
  }

  const job = await jobRepo.createJobApplication(data, userId);
  return serializeJobApplication(job);
}

export async function updateJob(id: string, data: UpdateJobApplicationInput, userId: string) {
  const existing = await jobRepo.getJobApplicationById(id, userId);
  if (!existing) {
    throw new Error("NOT_FOUND");
  }

  const job = await jobRepo.updateJobApplication(id, data, userId);
  return serializeJobApplication(job);
}

export async function updateJobStatus(id: string, data: UpdateJobStatusInput, userId: string) {
  const existing = await jobRepo.getJobApplicationById(id, userId);
  if (!existing) {
    throw new Error("NOT_FOUND");
  }

  const job = await jobRepo.updateJobStatus(id, data.status, userId);
  const { statusHistory, ...rest } = job;
  return {
    ...serializeJobApplication(rest),
    statusHistory: statusHistory.map(serializeJobStatusHistory),
  };
}

export async function updateJobSalaries(
  id: string,
  data: UpdateJobSalariesInput,
  userId: string,
) {
  const existing = await jobRepo.getJobApplicationById(id, userId);
  if (!existing) {
    throw new Error("NOT_FOUND");
  }

  const job = await jobRepo.updateJobSalaries(id, data, userId);
  return serializeJobApplication(job);
}

export async function deleteJob(id: string, userId: string) {
  const existing = await jobRepo.getJobApplicationById(id, userId);
  if (!existing) {
    throw new Error("NOT_FOUND");
  }

  await jobRepo.deleteJobApplication(id, userId);
}

export async function createInterview(
  jobId: string,
  data: CreateInterviewInput,
  userId: string,
) {
  const job = await jobRepo.getJobApplicationById(jobId, userId);
  if (!job) {
    throw new Error("NOT_FOUND");
  }

  const interview = await jobRepo.createInterview(jobId, data, userId);
  return serializeInterview(interview);
}

export async function updateInterview(
  id: string,
  data: UpdateInterviewInput,
  userId: string,
) {
  const existing = await jobRepo.getInterviewById(id, userId);
  if (!existing) {
    throw new Error("NOT_FOUND");
  }

  const interview = await jobRepo.updateInterview(id, data, userId);
  return serializeInterview(interview);
}

export async function deleteInterview(id: string, userId: string) {
  const existing = await jobRepo.getInterviewById(id, userId);
  if (!existing) {
    throw new Error("NOT_FOUND");
  }

  await jobRepo.deleteInterview(id, userId);
}

export async function createJobNote(jobId: string, data: CreateJobNoteInput, userId: string) {
  const job = await jobRepo.getJobApplicationById(jobId, userId);
  if (!job) {
    throw new Error("NOT_FOUND");
  }

  const note = await jobRepo.createJobNote(jobId, data, userId);
  return serializeJobNote(note);
}

export async function updateJobNote(id: string, data: UpdateJobNoteInput, userId: string) {
  const existing = await jobRepo.getJobNoteById(id, userId);
  if (!existing) {
    throw new Error("NOT_FOUND");
  }

  const note = await jobRepo.updateJobNote(id, data, userId);
  return serializeJobNote(note);
}

export async function deleteJobNote(id: string, userId: string) {
  const existing = await jobRepo.getJobNoteById(id, userId);
  if (!existing) {
    throw new Error("NOT_FOUND");
  }

  await jobRepo.deleteJobNote(id, userId);
}

export async function listInterviews(jobId: string, userId: string) {
  const job = await jobRepo.getJobApplicationById(jobId, userId);
  if (!job) {
    throw new Error("NOT_FOUND");
  }

  const interviews = await jobRepo.listJobInterviews(jobId, userId);
  return interviews.map(serializeInterview);
}

export async function listNotes(jobId: string, userId: string) {
  const job = await jobRepo.getJobApplicationById(jobId, userId);
  if (!job) {
    throw new Error("NOT_FOUND");
  }

  const notes = await jobRepo.listJobNotes(jobId, userId);
  return notes.map(serializeJobNote);
}

export async function listStatusHistory(jobId: string, userId: string) {
  const job = await jobRepo.getJobApplicationById(jobId, userId);
  if (!job) {
    throw new Error("NOT_FOUND");
  }

  const history = await jobRepo.listJobStatusHistory(jobId, userId);
  return history.map(serializeJobStatusHistory);
}
