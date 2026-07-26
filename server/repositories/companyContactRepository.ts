import prisma from "../prisma/client.js";
import type {
  CreateCompanyContactInput,
  UpdateCompanyContactInput,
} from "../lib/validation.js";

export async function listCompanyContacts(companyId: string, userId: string) {
  return prisma.companyContact.findMany({
    where: { companyId, userId },
    orderBy: { createdAt: "asc" },
  });
}

export async function getCompanyContactById(id: string, userId: string) {
  return prisma.companyContact.findFirst({
    where: { id, userId },
  });
}

export async function createCompanyContact(
  companyId: string,
  data: CreateCompanyContactInput,
  userId: string,
) {
  return prisma.companyContact.create({
    data: {
      companyId,
      name: data.name,
      designation: data.designation || null,
      email: data.email || null,
      phone: data.phone || null,
      notes: data.notes || null,
      userId,
    },
  });
}

export async function updateCompanyContact(
  id: string,
  data: UpdateCompanyContactInput,
  userId: string,
) {
  return prisma.companyContact.update({
    where: { id, userId },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.designation !== undefined && { designation: data.designation || null }),
      ...(data.email !== undefined && { email: data.email || null }),
      ...(data.phone !== undefined && { phone: data.phone || null }),
      ...(data.notes !== undefined && { notes: data.notes || null }),
    },
  });
}

export async function deleteCompanyContact(id: string, userId: string) {
  return prisma.companyContact.delete({
    where: { id, userId },
  });
}
