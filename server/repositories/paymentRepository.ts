import prisma from "../prisma/client.js";
import type { DataType } from "../auth/config.js";
import type { CreatePaymentInput, UpdatePaymentInput } from "../lib/validation.js";

export async function listPaymentsByProject(projectId: string, dataType: DataType) {
  return prisma.payment.findMany({
    where: { projectId, type: dataType },
    orderBy: { paymentDate: "desc" },
  });
}

export async function getPaymentById(id: string, dataType: DataType) {
  return prisma.payment.findFirst({
    where: { id, type: dataType },
  });
}

export async function createPayment(
  projectId: string,
  data: CreatePaymentInput,
  dataType: DataType,
) {
  return prisma.payment.create({
    data: {
      projectId,
      amount: data.amount,
      paymentMethod: data.paymentMethod,
      reference: data.reference || null,
      notes: data.notes || null,
      paymentDate: new Date(data.paymentDate),
      type: dataType,
    },
  });
}

export async function updatePayment(id: string, data: UpdatePaymentInput, dataType: DataType) {
  return prisma.payment.update({
    where: { id, type: dataType },
    data: {
      ...(data.amount !== undefined && { amount: data.amount }),
      ...(data.paymentMethod !== undefined && { paymentMethod: data.paymentMethod }),
      ...(data.reference !== undefined && { reference: data.reference || null }),
      ...(data.notes !== undefined && { notes: data.notes || null }),
      ...(data.paymentDate !== undefined && { paymentDate: new Date(data.paymentDate) }),
    },
  });
}

export async function deletePayment(id: string, dataType: DataType) {
  return prisma.payment.delete({
    where: { id, type: dataType },
  });
}

export async function sumPaymentsByProject(projectId: string, dataType: DataType) {
  const result = await prisma.payment.aggregate({
    where: { projectId, type: dataType },
    _sum: { amount: true },
  });
  return Number(result._sum.amount ?? 0);
}
