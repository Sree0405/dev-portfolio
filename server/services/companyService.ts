import type {
  CreateCompanyInput,
  UpdateCompanyInput,
  CompanyImportInput,
} from "../lib/validation.js";
import {
  serializeCompany,
  serializeCompanyContact,
} from "../lib/serializers.js";
import * as companyRepo from "../repositories/companyRepository.js";
import * as contactRepo from "../repositories/companyContactRepository.js";
import type { CreateCompanyContactInput, UpdateCompanyContactInput } from "../lib/validation.js";

export interface ListCompaniesParams {
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

export async function listCompanies(params: ListCompaniesParams) {
  const result = await companyRepo.listCompanies(params);
  return {
    items: result.items.map(serializeCompany),
    total: result.total,
    page: result.page,
    pageSize: result.pageSize,
  };
}

export async function getCompanyFilters(userId: string) {
  return companyRepo.getCompanyFilterOptions(userId);
}

export async function getCompany(id: string, userId: string) {
  const company = await companyRepo.getCompanyById(id, userId);
  if (!company) {
    throw new Error("NOT_FOUND");
  }

  const { contacts, jobApplications, ...rest } = company;
  return {
    ...serializeCompany(rest),
    contacts: contacts.map(serializeCompanyContact),
    jobApplications: jobApplications.map((job) => ({
      ...job,
      appliedDate: job.appliedDate.toISOString(),
    })),
  };
}

export async function createCompany(data: CreateCompanyInput, userId: string) {
  const company = await companyRepo.createCompany(data, userId);
  return serializeCompany(company);
}

export async function importCompanies(data: CompanyImportInput, userId: string) {
  let imported = 0;
  let skipped = 0;
  let duplicates = 0;

  for (const row of data.rows) {
    const name = row.name.trim();
    if (!name) {
      skipped++;
      continue;
    }

    const existing = await companyRepo.getCompanyByName(name, userId);
    if (existing) {
      duplicates++;
      continue;
    }

    await companyRepo.createCompany(
      {
        name,
        linkedinUrl: row.linkedinUrl?.trim() || null,
        careersUrl: row.careersUrl?.trim() || null,
        companyType: row.companyType?.trim() || null,
        productCategory: row.productCategory?.trim() || null,
        companySize: row.companySize?.trim() || null,
        headquarters: row.headquarters?.trim() || null,
        officeLocation: row.officeLocation?.trim() || null,
        applied: row.applied ?? false,
        hrContact: row.hrContact?.trim() || null,
      },
      userId,
    );
    imported++;
  }

  return { imported, skipped, duplicates };
}

export async function updateCompany(id: string, data: UpdateCompanyInput, userId: string) {
  const existing = await companyRepo.getCompanyById(id, userId);
  if (!existing) {
    throw new Error("NOT_FOUND");
  }

  const company = await companyRepo.updateCompany(id, data, userId);
  return serializeCompany(company);
}

export async function deleteCompany(id: string, userId: string) {
  const existing = await companyRepo.getCompanyById(id, userId);
  if (!existing) {
    throw new Error("NOT_FOUND");
  }

  await companyRepo.deleteCompany(id, userId);
}

export async function listContacts(companyId: string, userId: string) {
  const company = await companyRepo.getCompanyById(companyId, userId);
  if (!company) {
    throw new Error("NOT_FOUND");
  }

  const contacts = await contactRepo.listCompanyContacts(companyId, userId);
  return contacts.map(serializeCompanyContact);
}

export async function createContact(
  companyId: string,
  data: CreateCompanyContactInput,
  userId: string,
) {
  const company = await companyRepo.getCompanyById(companyId, userId);
  if (!company) {
    throw new Error("NOT_FOUND");
  }

  const contact = await contactRepo.createCompanyContact(companyId, data, userId);
  return serializeCompanyContact(contact);
}

export async function updateContact(
  id: string,
  data: UpdateCompanyContactInput,
  userId: string,
) {
  const existing = await contactRepo.getCompanyContactById(id, userId);
  if (!existing) {
    throw new Error("NOT_FOUND");
  }

  const contact = await contactRepo.updateCompanyContact(id, data, userId);
  return serializeCompanyContact(contact);
}

export async function deleteContact(id: string, userId: string) {
  const existing = await contactRepo.getCompanyContactById(id, userId);
  if (!existing) {
    throw new Error("NOT_FOUND");
  }

  await contactRepo.deleteCompanyContact(id, userId);
}
