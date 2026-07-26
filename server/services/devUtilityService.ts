import * as devUtilityRepo from "../repositories/devUtilityRepository.js";
import type { DataType } from "../auth/config.js";

export async function getDevUtilityPreferences(dataType: DataType) {
  const [favorites, recent] = await Promise.all([
    devUtilityRepo.listFavorites(dataType),
    devUtilityRepo.listRecent(dataType),
  ]);

  return {
    favorites: favorites.map((row) => row.utilityId),
    recent: recent.map((row) => row.utilityId),
  };
}

export async function toggleDevUtilityFavorite(utilityId: string, dataType: DataType) {
  const isFavorite = await devUtilityRepo.isFavorite(utilityId, dataType);

  if (isFavorite) {
    await devUtilityRepo.removeFavorite(utilityId, dataType);
    return { utilityId, isFavorite: false };
  }

  await devUtilityRepo.addFavorite(utilityId, dataType);
  return { utilityId, isFavorite: true };
}

export async function trackDevUtilityUse(utilityId: string, dataType: DataType) {
  await devUtilityRepo.recordRecentUse(utilityId, dataType);
  const recent = await devUtilityRepo.listRecent(dataType);
  return { utilityId, recent: recent.map((row) => row.utilityId) };
}
