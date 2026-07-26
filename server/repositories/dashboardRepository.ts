import prisma from "../prisma/client.js";
import { isJobTrackerEnabled } from "../lib/featureFlags.js";

export async function getDashboardAggregates(userId: string) {
  const userFilter = { userId };

  const baseQueries = [
    prisma.project.aggregate({
      where: userFilter,
      _count: { id: true },
      _sum: { plannedAmount: true, totalPaid: true },
    }),
    prisma.project.groupBy({
      by: ["status"],
      where: userFilter,
      _count: { id: true },
    }),
    prisma.project.findMany({
      where: userFilter,
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        name: true,
        clientName: true,
        status: true,
        plannedAmount: true,
        totalPaid: true,
        updatedAt: true,
      },
    }),
    prisma.payment.findMany({
      where: userFilter,
      take: 10,
      orderBy: { paymentDate: "desc" },
      include: {
        project: {
          select: { id: true, name: true, clientName: true },
        },
      },
    }),
    prisma.projectNote.findMany({
      where: userFilter,
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        project: {
          select: { id: true, name: true },
        },
      },
    }),
    prisma.payment.findMany({
      where: userFilter,
      select: { amount: true, paymentDate: true },
      orderBy: { paymentDate: "asc" },
    }),
    prisma.credential.count({ where: userFilter }),
  ] as const;

  const jobQueries = isJobTrackerEnabled()
    ? [
        prisma.company.count({ where: userFilter }),
        prisma.company.count({ where: { ...userFilter, applied: true } }),
        prisma.jobApplication.count({ where: userFilter }),
        prisma.jobApplication.count({
          where: { ...userFilter, currentStatus: "Offer Received" },
        }),
        prisma.jobApplication.count({
          where: { ...userFilter, currentStatus: "Rejected" },
        }),
        prisma.interviewSchedule.findMany({
          where: { ...userFilter, interviewDate: { gte: new Date() } },
          orderBy: { interviewDate: "asc" },
          take: 5,
          include: {
            jobApplication: {
              select: {
                id: true,
                roleName: true,
                company: { select: { id: true, name: true } },
              },
            },
          },
        }),
        prisma.jobStatusHistory.findMany({
          where: userFilter,
          orderBy: { createdAt: "desc" },
          take: 8,
          include: {
            jobApplication: {
              select: {
                id: true,
                roleName: true,
                company: { select: { id: true, name: true } },
              },
            },
          },
        }),
      ]
    : [];

  const results = await Promise.all([...baseQueries, ...jobQueries]);

  const [
    projectAggregates,
    statusGroups,
    projects,
    recentPayments,
    recentNotes,
    allPayments,
    credentialCount,
  ] = results;

  const jobTracker = isJobTrackerEnabled()
    ? {
        totalCompanies: results[7] as number,
        appliedCompanies: results[8] as number,
        totalJobApplications: results[9] as number,
        offersReceived: results[10] as number,
        rejectedJobs: results[11] as number,
        upcomingInterviews: results[12] as Awaited<
          ReturnType<typeof prisma.interviewSchedule.findMany>
        >,
        latestJobActivities: results[13] as Awaited<
          ReturnType<typeof prisma.jobStatusHistory.findMany>
        >,
      }
    : null;

  return {
    projectAggregates,
    statusGroups,
    projects,
    recentPayments,
    recentNotes,
    allPayments,
    credentialCount,
    jobTracker,
  };
}
