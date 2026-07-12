import prisma from "../prisma/client.js";
import type { DataType } from "../auth/config.js";

export async function generateInvoiceNumber(
  projectId: string,
  dataType: DataType,
): Promise<string> {
  const project = await prisma.project.findFirst({
    where: { id: projectId, type: dataType },
    select: { createdAt: true, id: true },
  });

  if (!project) {
    throw new Error("NOT_FOUND");
  }

  const sequence = await prisma.project.count({
    where: {
      type: dataType,
      OR: [
        { createdAt: { lt: project.createdAt } },
        { createdAt: project.createdAt, id: { lte: project.id } },
      ],
    },
  });

  return `INV-${String(sequence).padStart(6, "0")}`;
}
