import prisma from "../prisma/client.js";
import type { CreatePaymentInput, UpdatePaymentInput } from "../lib/validation.js";

export async function listPaymentsByProject(projectId: string, userId: string) {
  return prisma.payment.findMany({
    where: { projectId, userId },
    orderBy: { paymentDate: "desc" },
  });
}

export async function getPaymentById(id: string, userId: string) {
  return prisma.payment.findFirst({
    where: { id, userId },
  });
}

export async function createPayment(
  projectId: string,
  data: CreatePaymentInput,
  userId: string,
) {
  return prisma.payment.create({
    data: {
      projectId,
      amount: data.amount,
      paymentMethod: data.paymentMethod,
      reference: data.reference || null,
      notes: data.notes || null,
      paymentDate: new Date(data.paymentDate),
      userId,
    },
  });
}

export async function updatePayment(id: string, data: UpdatePaymentInput, userId: string) {
  return prisma.payment.update({
    where: { id, userId },
    data: {
      ...(data.amount !== undefined && { amount: data.amount }),
      ...(data.paymentMethod !== undefined && { paymentMethod: data.paymentMethod }),
      ...(data.reference !== undefined && { reference: data.reference || null }),
      ...(data.notes !== undefined && { notes: data.notes || null }),
      ...(data.paymentDate !== undefined && { paymentDate: new Date(data.paymentDate) }),
    },
  });
}

export async function deletePayment(id: string, userId: string) {
  return prisma.payment.delete({
    where: { id, userId },
  });
}

export async function sumPaymentsByProject(projectId: string, userId: string) {
  const result = await prisma.payment.aggregate({
    where: { projectId, userId },
    _sum: { amount: true },
  });
  return Number(result._sum.amount ?? 0);
}
