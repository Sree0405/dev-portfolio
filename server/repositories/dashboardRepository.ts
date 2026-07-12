import prisma from "../prisma/client.js";
import type { DataType } from "../auth/config.js";

export async function getDashboardAggregates(dataType: DataType) {
  const typeFilter = { type: dataType };

  const [
    projectAggregates,
    statusGroups,
    projects,
    recentPayments,
    recentNotes,
    allPayments,
    credentialCount,
  ] = await Promise.all([
    prisma.project.aggregate({
      where: typeFilter,
      _count: { id: true },
      _sum: { plannedAmount: true, totalPaid: true },
    }),
    prisma.project.groupBy({
      by: ["status"],
      where: typeFilter,
      _count: { id: true },
    }),
    prisma.project.findMany({
      where: typeFilter,
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
      where: typeFilter,
      take: 10,
      orderBy: { paymentDate: "desc" },
      include: {
        project: {
          select: { id: true, name: true, clientName: true },
        },
      },
    }),
    prisma.projectNote.findMany({
      where: typeFilter,
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        project: {
          select: { id: true, name: true },
        },
      },
    }),
    prisma.payment.findMany({
      where: typeFilter,
      select: { amount: true, paymentDate: true },
      orderBy: { paymentDate: "asc" },
    }),
    prisma.credential.count({ where: typeFilter }),
  ]);

  return {
    projectAggregates,
    statusGroups,
    projects,
    recentPayments,
    recentNotes,
    allPayments,
    credentialCount,
  };
}
