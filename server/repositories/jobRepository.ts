import prisma from "../prisma/client.js";
import type {
  CreateJobApplicationInput,
  UpdateJobApplicationInput,
  UpdateJobSalariesInput,
  CreateInterviewInput,
  UpdateInterviewInput,
  CreateJobNoteInput,
  UpdateJobNoteInput,
} from "../lib/validation.js";
import { markCompanyApplied } from "./companyRepository.js";

export interface ListJobsOptions {
  userId: string;
  search?: string;
  status?: string;
  companyId?: string;
  page?: number;
  pageSize?: number;
}

export async function listJobApplications(options: ListJobsOptions) {
  const { userId, search = "", status, companyId, page = 1, pageSize = 15 } = options;

  const where = {
    userId,
    ...(companyId ? { companyId } : {}),
    ...(status && status !== "All" ? { currentStatus: status } : {}),
    ...(search
      ? {
          OR: [
            { roleName: { contains: search, mode: "insensitive" as const } },
            { company: { name: { contains: search, mode: "insensitive" as const } } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.jobApplication.findMany({
      where,
      orderBy: { appliedDate: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        company: { select: { id: true, name: true } },
        interviews: {
          where: { interviewDate: { gte: new Date() } },
          orderBy: { interviewDate: "asc" },
          take: 1,
        },
      },
    }),
    prisma.jobApplication.count({ where }),
  ]);

  return { items, total, page, pageSize };
}

export async function countJobApplications(userId: string) {
  return prisma.jobApplication.count({ where: { userId } });
}

export async function countJobsByStatus(userId: string, status: string) {
  return prisma.jobApplication.count({
    where: { userId, currentStatus: status },
  });
}

export async function getJobApplicationById(id: string, userId: string) {
  return prisma.jobApplication.findFirst({
    where: { id, userId },
    include: {
      company: { select: { id: true, name: true } },
      statusHistory: { orderBy: { createdAt: "asc" } },
      interviews: { orderBy: { interviewDate: "asc" } },
      notes: { orderBy: { createdAt: "desc" } },
    },
  });
}

export async function createJobApplication(data: CreateJobApplicationInput, userId: string) {
  const status = data.currentStatus ?? "Applied";

  const job = await prisma.jobApplication.create({
    data: {
      companyId: data.companyId,
      jobId: data.jobId || null,
      roleName: data.roleName,
      applicationUrl: data.applicationUrl || null,
      appliedThrough: data.appliedThrough || null,
      mailId: data.mailId || null,
      appliedDate: new Date(data.appliedDate),
      currentStatus: status,
      expectedSalary: data.expectedSalary ?? null,
      currentSalary: data.currentSalary ?? null,
      negotiatedSalary: data.negotiatedSalary ?? null,
      offeredSalary: data.offeredSalary ?? null,
      companyStandardSalary: data.companyStandardSalary ?? null,
      userId,
      statusHistory: {
        create: { status, userId },
      },
    },
    include: {
      company: { select: { id: true, name: true } },
    },
  });

  await markCompanyApplied(data.companyId, userId);
  return job;
}

export async function updateJobApplication(
  id: string,
  data: UpdateJobApplicationInput,
  userId: string,
) {
  return prisma.jobApplication.update({
    where: { id, userId },
    data: {
      ...(data.jobId !== undefined && { jobId: data.jobId || null }),
      ...(data.roleName !== undefined && { roleName: data.roleName }),
      ...(data.applicationUrl !== undefined && { applicationUrl: data.applicationUrl || null }),
      ...(data.appliedThrough !== undefined && { appliedThrough: data.appliedThrough || null }),
      ...(data.mailId !== undefined && { mailId: data.mailId || null }),
      ...(data.appliedDate !== undefined && { appliedDate: new Date(data.appliedDate) }),
      ...(data.currentStatus !== undefined && { currentStatus: data.currentStatus }),
      ...(data.expectedSalary !== undefined && { expectedSalary: data.expectedSalary }),
      ...(data.currentSalary !== undefined && { currentSalary: data.currentSalary }),
      ...(data.negotiatedSalary !== undefined && { negotiatedSalary: data.negotiatedSalary }),
      ...(data.offeredSalary !== undefined && { offeredSalary: data.offeredSalary }),
      ...(data.companyStandardSalary !== undefined && {
        companyStandardSalary: data.companyStandardSalary,
      }),
    },
    include: {
      company: { select: { id: true, name: true } },
    },
  });
}

export async function updateJobStatus(id: string, status: string, userId: string) {
  const job = await prisma.jobApplication.update({
    where: { id, userId },
    data: {
      currentStatus: status,
      statusHistory: {
        create: { status, userId },
      },
    },
    include: {
      company: { select: { id: true, name: true } },
      statusHistory: { orderBy: { createdAt: "asc" } },
    },
  });
  return job;
}

export async function updateJobSalaries(
  id: string,
  data: UpdateJobSalariesInput,
  userId: string,
) {
  return prisma.jobApplication.update({
    where: { id, userId },
    data: {
      ...(data.expectedSalary !== undefined && { expectedSalary: data.expectedSalary }),
      ...(data.currentSalary !== undefined && { currentSalary: data.currentSalary }),
      ...(data.negotiatedSalary !== undefined && { negotiatedSalary: data.negotiatedSalary }),
      ...(data.offeredSalary !== undefined && { offeredSalary: data.offeredSalary }),
      ...(data.companyStandardSalary !== undefined && {
        companyStandardSalary: data.companyStandardSalary,
      }),
    },
    include: {
      company: { select: { id: true, name: true } },
    },
  });
}

export async function deleteJobApplication(id: string, userId: string) {
  return prisma.jobApplication.delete({
    where: { id, userId },
  });
}

export async function listUpcomingInterviews(userId: string, limit = 10) {
  const now = new Date();
  return prisma.interviewSchedule.findMany({
    where: {
      userId,
      interviewDate: { gte: now },
    },
    orderBy: { interviewDate: "asc" },
    take: limit,
    include: {
      jobApplication: {
        select: {
          id: true,
          roleName: true,
          company: { select: { id: true, name: true } },
        },
      },
    },
  });
}

export async function getRecentJobActivities(userId: string, limit = 10) {
  return prisma.jobStatusHistory.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      jobApplication: {
        select: {
          id: true,
          roleName: true,
          company: { select: { id: true, name: true } },
        },
      },
    },
  });
}

export async function createInterview(
  jobApplicationId: string,
  data: CreateInterviewInput,
  userId: string,
) {
  return prisma.interviewSchedule.create({
    data: {
      jobApplicationId,
      interviewDate: new Date(data.interviewDate),
      interviewTime: data.interviewTime || null,
      mode: data.mode,
      location: data.location || null,
      interviewer: data.interviewer || null,
      meetingLink: data.meetingLink || null,
      notes: data.notes || null,
      userId,
    },
  });
}

export async function updateInterview(id: string, data: UpdateInterviewInput, userId: string) {
  return prisma.interviewSchedule.update({
    where: { id, userId },
    data: {
      ...(data.interviewDate !== undefined && { interviewDate: new Date(data.interviewDate) }),
      ...(data.interviewTime !== undefined && { interviewTime: data.interviewTime || null }),
      ...(data.mode !== undefined && { mode: data.mode }),
      ...(data.location !== undefined && { location: data.location || null }),
      ...(data.interviewer !== undefined && { interviewer: data.interviewer || null }),
      ...(data.meetingLink !== undefined && { meetingLink: data.meetingLink || null }),
      ...(data.notes !== undefined && { notes: data.notes || null }),
    },
  });
}

export async function deleteInterview(id: string, userId: string) {
  return prisma.interviewSchedule.delete({
    where: { id, userId },
  });
}

export async function getInterviewById(id: string, userId: string) {
  return prisma.interviewSchedule.findFirst({
    where: { id, userId },
  });
}

export async function createJobNote(
  jobApplicationId: string,
  data: CreateJobNoteInput,
  userId: string,
) {
  return prisma.jobNote.create({
    data: {
      jobApplicationId,
      content: data.content,
      userId,
    },
  });
}

export async function updateJobNote(id: string, data: UpdateJobNoteInput, userId: string) {
  return prisma.jobNote.update({
    where: { id, userId },
    data: { content: data.content },
  });
}

export async function deleteJobNote(id: string, userId: string) {
  return prisma.jobNote.delete({
    where: { id, userId },
  });
}

export async function getJobNoteById(id: string, userId: string) {
  return prisma.jobNote.findFirst({
    where: { id, userId },
  });
}

export async function listJobInterviews(jobApplicationId: string, userId: string) {
  return prisma.interviewSchedule.findMany({
    where: { jobApplicationId, userId },
    orderBy: { interviewDate: "asc" },
  });
}

export async function listJobNotes(jobApplicationId: string, userId: string) {
  return prisma.jobNote.findMany({
    where: { jobApplicationId, userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function listJobStatusHistory(jobApplicationId: string, userId: string) {
  return prisma.jobStatusHistory.findMany({
    where: { jobApplicationId, userId },
    orderBy: { createdAt: "asc" },
  });
}
