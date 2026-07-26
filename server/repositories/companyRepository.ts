import prisma from "../prisma/client.js";
import type { CreateCompanyInput, UpdateCompanyInput } from "../lib/validation.js";

export interface ListCompaniesOptions {
  userId: string;
  search?: string;
  applied?: string;
  location?: string;
  category?: string;
  companyType?: string;
  companySize?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}

export async function listCompanies(options: ListCompaniesOptions) {
  const {
    userId,
    search = "",
    applied,
    location,
    category,
    companyType,
    companySize,
    sortBy = "name",
    sortOrder = "asc",
    page = 1,
    pageSize = 15,
  } = options;

  const where = {
    userId,
    ...(applied === "Applied" ? { applied: true } : {}),
    ...(applied === "Not Applied" ? { applied: false } : {}),
    ...(category && category !== "All"
      ? { productCategory: { equals: category, mode: "insensitive" as const } }
      : {}),
    ...(companyType && companyType !== "All"
      ? { companyType: { equals: companyType, mode: "insensitive" as const } }
      : {}),
    ...(companySize && companySize !== "All"
      ? { companySize: { equals: companySize, mode: "insensitive" as const } }
      : {}),
    ...(location && location !== "All"
      ? {
          OR: [
            { headquarters: { equals: location, mode: "insensitive" as const } },
            { officeLocation: { equals: location, mode: "insensitive" as const } },
            { headquarters: { contains: location, mode: "insensitive" as const } },
            { officeLocation: { contains: location, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { headquarters: { contains: search, mode: "insensitive" as const } },
            { officeLocation: { contains: search, mode: "insensitive" as const } },
            { productCategory: { contains: search, mode: "insensitive" as const } },
            { companyType: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const orderBy =
    sortBy === "recent"
      ? { createdAt: sortOrder as "asc" | "desc" }
      : sortBy === "location"
        ? { headquarters: sortOrder as "asc" | "desc" }
        : { name: sortOrder as "asc" | "desc" };

  const [items, total] = await Promise.all([
    prisma.company.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        _count: { select: { jobApplications: true } },
        jobApplications: {
          orderBy: { updatedAt: "desc" },
          take: 1,
          select: { currentStatus: true },
        },
      },
    }),
    prisma.company.count({ where }),
  ]);

  return { items, total, page, pageSize };
}

export async function countCompanies(userId: string) {
  return prisma.company.count({ where: { userId } });
}

export async function countAppliedCompanies(userId: string) {
  return prisma.company.count({ where: { userId, applied: true } });
}

export async function getCompanyById(id: string, userId: string) {
  return prisma.company.findFirst({
    where: { id, userId },
    include: {
      contacts: { orderBy: { createdAt: "asc" } },
      jobApplications: {
        orderBy: { appliedDate: "desc" },
        select: {
          id: true,
          roleName: true,
          currentStatus: true,
          appliedDate: true,
        },
      },
      _count: { select: { jobApplications: true } },
    },
  });
}

export async function getCompanyByName(name: string, userId: string) {
  return prisma.company.findFirst({
    where: {
      userId,
      name: { equals: name, mode: "insensitive" },
    },
  });
}

export async function createCompany(data: CreateCompanyInput, userId: string) {
  return prisma.company.create({
    data: {
      name: data.name,
      linkedinUrl: data.linkedinUrl || null,
      careersUrl: data.careersUrl || null,
      productCategory: data.productCategory || null,
      companyType: data.companyType || null,
      companySize: data.companySize || null,
      headquarters: data.headquarters || null,
      officeLocation: data.officeLocation || null,
      applied: data.applied ?? false,
      hrContact: data.hrContact || null,
      userId,
    },
  });
}

export async function createCompaniesBatch(
  rows: CreateCompanyInput[],
  userId: string,
) {
  const created = [];
  for (const row of rows) {
    const company = await createCompany(row, userId);
    created.push(company);
  }
  return created;
}

export async function updateCompany(id: string, data: UpdateCompanyInput, userId: string) {
  return prisma.company.update({
    where: { id, userId },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.linkedinUrl !== undefined && { linkedinUrl: data.linkedinUrl || null }),
      ...(data.careersUrl !== undefined && { careersUrl: data.careersUrl || null }),
      ...(data.productCategory !== undefined && { productCategory: data.productCategory || null }),
      ...(data.companyType !== undefined && { companyType: data.companyType || null }),
      ...(data.companySize !== undefined && { companySize: data.companySize || null }),
      ...(data.headquarters !== undefined && { headquarters: data.headquarters || null }),
      ...(data.officeLocation !== undefined && { officeLocation: data.officeLocation || null }),
      ...(data.applied !== undefined && { applied: data.applied }),
      ...(data.hrContact !== undefined && { hrContact: data.hrContact || null }),
    },
  });
}

export async function markCompanyApplied(id: string, userId: string) {
  return prisma.company.update({
    where: { id, userId },
    data: { applied: true },
  });
}

export async function deleteCompany(id: string, userId: string) {
  return prisma.company.delete({
    where: { id, userId },
  });
}

export async function getCompanyFilterOptions(userId: string) {
  const companies = await prisma.company.findMany({
    where: { userId },
    select: {
      headquarters: true,
      officeLocation: true,
      productCategory: true,
      companyType: true,
      companySize: true,
    },
  });

  const locations = new Set<string>();
  const categories = new Set<string>();
  const companyTypes = new Set<string>();
  const companySizes = new Set<string>();

  for (const company of companies) {
    if (company.headquarters?.trim()) locations.add(company.headquarters.trim());
    if (company.officeLocation?.trim()) locations.add(company.officeLocation.trim());
    if (company.productCategory?.trim()) categories.add(company.productCategory.trim());
    if (company.companyType?.trim()) companyTypes.add(company.companyType.trim());
    if (company.companySize?.trim()) companySizes.add(company.companySize.trim());
  }

  return {
    locations: Array.from(locations).sort((a, b) => a.localeCompare(b)),
    categories: Array.from(categories).sort((a, b) => a.localeCompare(b)),
    companyTypes: Array.from(companyTypes).sort((a, b) => a.localeCompare(b)),
    companySizes: Array.from(companySizes).sort((a, b) => a.localeCompare(b)),
  };
}
