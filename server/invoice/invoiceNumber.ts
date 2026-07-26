import prisma from "../prisma/client.js";

export async function generateInvoiceNumber(
  projectId: string,
  userId: string,
): Promise<string> {
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId },
    select: { createdAt: true, id: true },
  });

  if (!project) {
    throw new Error("NOT_FOUND");
  }

  const sequence = await prisma.project.count({
    where: {
      userId,
      OR: [
        { createdAt: { lt: project.createdAt } },
        { createdAt: project.createdAt, id: { lte: project.id } },
      ],
    },
  });

  return `INV-${String(sequence).padStart(6, "0")}`;
}
