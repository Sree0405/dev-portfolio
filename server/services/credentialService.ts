import * as credentialRepo from "../repositories/credentialRepository.js";
import { getCategoryTypeLabel } from "../lib/credentialCategories.js";
import { serializeCredential } from "../lib/serializers.js";
import type { DataType } from "../auth/config.js";
import type { CreateCredentialInput, UpdateCredentialInput } from "../lib/validation.js";

export async function listCredentials(params: {
  dataType: DataType;
  search?: string;
  category?: string;
}) {
  const items = await credentialRepo.listCredentials(params);
  return items.map(serializeCredential);
}

export async function getCredential(id: string, dataType: DataType) {
  const credential = await credentialRepo.getCredentialById(id, dataType);
  if (!credential) {
    throw new Error("NOT_FOUND");
  }
  return serializeCredential(credential);
}

export async function createCredential(data: CreateCredentialInput, dataType: DataType) {
  const credential = await credentialRepo.createCredential(data, dataType);
  return serializeCredential(credential);
}

export async function updateCredential(
  id: string,
  data: UpdateCredentialInput,
  dataType: DataType,
) {
  const existing = await credentialRepo.getCredentialById(id, dataType);
  if (!existing) {
    throw new Error("NOT_FOUND");
  }
  const credential = await credentialRepo.updateCredential(id, data, dataType);
  return serializeCredential(credential);
}

export async function deleteCredential(id: string, dataType: DataType) {
  const existing = await credentialRepo.getCredentialById(id, dataType);
  if (!existing) {
    throw new Error("NOT_FOUND");
  }
  await credentialRepo.deleteCredential(id, dataType);
}

export { getCategoryTypeLabel };
