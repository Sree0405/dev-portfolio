import type { Decimal } from "@prisma/client/runtime/library";

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
