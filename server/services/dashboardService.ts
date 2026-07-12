import * as dashboardRepo from "../repositories/dashboardRepository.js";
import type { DataType } from "../auth/config.js";
import { decimalToNumber } from "../lib/serializers.js";

function statusCount(groups: { status: string; _count: { id: number } }[], status: string) {
  return groups.find((g) => g.status === status)?._count.id ?? 0;
}

function formatMonthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function formatMonthLabel(key: string): string {
  const [year, month] = key.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  return new Intl.DateTimeFormat("en-IN", { month: "short", year: "2-digit" }).format(date);
}

export async function getDashboardAnalytics(dataType: DataType) {
  const data = await dashboardRepo.getDashboardAggregates(dataType);

  const totalProjects = data.projectAggregates._count.id;
  const totalPlannedAmount = decimalToNumber(data.projectAggregates._sum.plannedAmount);
  const totalPaidAmount = decimalToNumber(data.projectAggregates._sum.totalPaid);
  const totalRemainingAmount = totalPlannedAmount - totalPaidAmount;

  const completedProjects = statusCount(data.statusGroups, "Completed");
  const activeProjects = statusCount(data.statusGroups, "In Progress");
  const planningProjects = statusCount(data.statusGroups, "Planning");
  const onHoldProjects = statusCount(data.statusGroups, "On Hold");
  const cancelledProjects = statusCount(data.statusGroups, "Cancelled");

  const collectionRate =
    totalPlannedAmount > 0 ? (totalPaidAmount / totalPlannedAmount) * 100 : 0;

  const averageProjectValue = totalProjects > 0 ? totalPlannedAmount / totalProjects : 0;
  const averagePayment =
    data.allPayments.length > 0
      ? data.allPayments.reduce((sum, p) => sum + decimalToNumber(p.amount), 0) /
        data.allPayments.length
      : 0;

  const projectsWithNumbers = data.projects.map((p) => {
    const planned = decimalToNumber(p.plannedAmount);
    const paid = decimalToNumber(p.totalPaid);
    const remaining = planned - paid;
    const progress = planned > 0 ? (paid / planned) * 100 : 0;
    return {
      id: p.id,
      name: p.name,
      clientName: p.clientName,
      status: p.status,
      plannedAmount: planned,
      totalPaid: paid,
      remainingAmount: remaining,
      progress: Math.min(100, Math.round(progress * 10) / 10),
    };
  });

  const receivableProjects = projectsWithNumbers.filter(
    (p) => p.remainingAmount > 0 && p.status !== "Cancelled" && p.status !== "Completed",
  );

  const highestPayingProject = [...projectsWithNumbers].sort((a, b) => b.totalPaid - a.totalPaid)[0] ?? null;
  const highestRemainingProject =
    [...projectsWithNumbers].sort((a, b) => b.remainingAmount - a.remainingAmount)[0] ?? null;

  const projectStatusDistribution = [
    "Planning",
    "In Progress",
    "Completed",
    "On Hold",
    "Cancelled",
  ].map((status) => ({
    status,
    count: statusCount(data.statusGroups, status),
  }));

  const revenueByProject = [...projectsWithNumbers]
    .filter((p) => p.totalPaid > 0)
    .sort((a, b) => b.totalPaid - a.totalPaid)
    .slice(0, 10)
    .map((p) => ({
      projectId: p.id,
      projectName: p.name,
      amount: p.totalPaid,
    }));

  const monthlyMap = new Map<string, number>();
  data.allPayments.forEach((payment) => {
    const key = formatMonthKey(payment.paymentDate);
    const amount = decimalToNumber(payment.amount);
    monthlyMap.set(key, (monthlyMap.get(key) ?? 0) + amount);
  });

  const monthlyPayments = Array.from(monthlyMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, amount]) => ({
      month,
      label: formatMonthLabel(month),
      amount,
    }));

  const recentPayments = data.recentPayments.map((payment) => ({
    id: payment.id,
    date: payment.paymentDate.toISOString(),
    projectId: payment.project.id,
    projectName: payment.project.name,
    clientName: payment.project.clientName,
    amount: decimalToNumber(payment.amount),
    paymentMethod: payment.paymentMethod,
  }));

  const recentNotes = data.recentNotes.map((note) => ({
    id: note.id,
    projectId: note.project.id,
    projectName: note.project.name,
    createdAt: note.createdAt.toISOString(),
    preview: note.content.length > 120 ? `${note.content.slice(0, 120)}…` : note.content,
  }));

  const latestProjects = projectsWithNumbers.slice(0, 8);

  return {
    totalProjects,
    totalCredentials: data.credentialCount,
    totalPlannedAmount,
    totalPaidAmount,
    totalRemainingAmount,
    completedProjects,
    activeProjects,
    planningProjects,
    onHoldProjects,
    cancelledProjects,
    receivableProjectCount: receivableProjects.length,
    collectionRate: Math.round(collectionRate * 10) / 10,
    averageProjectValue: Math.round(averageProjectValue * 100) / 100,
    averagePayment: Math.round(averagePayment * 100) / 100,
    highestPayingProject: highestPayingProject
      ? { id: highestPayingProject.id, name: highestPayingProject.name, amount: highestPayingProject.totalPaid }
      : null,
    highestRemainingProject: highestRemainingProject
      ? {
          id: highestRemainingProject.id,
          name: highestRemainingProject.name,
          amount: highestRemainingProject.remainingAmount,
        }
      : null,
    recentPayments,
    recentNotes,
    latestProjects,
    projectStatusDistribution,
    revenueByProject,
    monthlyPayments,
    financialOverview: {
      received: totalPaidAmount,
      pending: totalRemainingAmount,
      receivedPercent: totalPlannedAmount > 0 ? Math.round((totalPaidAmount / totalPlannedAmount) * 1000) / 10 : 0,
      pendingPercent: totalPlannedAmount > 0 ? Math.round((totalRemainingAmount / totalPlannedAmount) * 1000) / 10 : 0,
    },
  };
}
