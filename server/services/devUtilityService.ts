import * as devUtilityRepo from "../repositories/devUtilityRepository.js";

export async function getDevUtilityPreferences(userId: string) {
  const [favorites, recent] = await Promise.all([
    devUtilityRepo.listFavorites(userId),
    devUtilityRepo.listRecent(userId),
  ]);

  return {
    favorites: favorites.map((row) => row.utilityId),
    recent: recent.map((row) => row.utilityId),
  };
}

export async function toggleDevUtilityFavorite(utilityId: string, userId: string) {
  const isFavorite = await devUtilityRepo.isFavorite(utilityId, userId);

  if (isFavorite) {
    await devUtilityRepo.removeFavorite(utilityId, userId);
    return { utilityId, isFavorite: false };
  }

  await devUtilityRepo.addFavorite(utilityId, userId);
  return { utilityId, isFavorite: true };
}

export async function trackDevUtilityUse(utilityId: string, userId: string) {
  await devUtilityRepo.recordRecentUse(utilityId, userId);
  const recent = await devUtilityRepo.listRecent(userId);
  return { utilityId, recent: recent.map((row) => row.utilityId) };
}
