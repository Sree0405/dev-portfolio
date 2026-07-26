import * as credentialRepo from "../repositories/credentialRepository.js";
import { getCategoryTypeLabel } from "../lib/credentialCategories.js";
import { serializeCredential } from "../lib/serializers.js";
import type { CreateCredentialInput, UpdateCredentialInput } from "../lib/validation.js";

export async function listCredentials(params: {
  userId: string;
  search?: string;
  category?: string;
}) {
  const items = await credentialRepo.listCredentials(params);
  return items.map(serializeCredential);
}

export async function getCredential(id: string, userId: string) {
  const credential = await credentialRepo.getCredentialById(id, userId);
  if (!credential) {
    throw new Error("NOT_FOUND");
  }
  return serializeCredential(credential);
}

export async function createCredential(data: CreateCredentialInput, userId: string) {
  const credential = await credentialRepo.createCredential(data, userId);
  return serializeCredential(credential);
}

export async function updateCredential(
  id: string,
  data: UpdateCredentialInput,
  userId: string,
) {
  const existing = await credentialRepo.getCredentialById(id, userId);
  if (!existing) {
    throw new Error("NOT_FOUND");
  }
  const credential = await credentialRepo.updateCredential(id, data, userId);
  return serializeCredential(credential);
}

export async function deleteCredential(id: string, userId: string) {
  const existing = await credentialRepo.getCredentialById(id, userId);
  if (!existing) {
    throw new Error("NOT_FOUND");
  }
  await credentialRepo.deleteCredential(id, userId);
}

export { getCategoryTypeLabel };
