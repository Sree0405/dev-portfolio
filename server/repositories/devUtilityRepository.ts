import prisma from "../prisma/client.js";
import { MAX_RECENT_UTILITIES } from "../lib/devUtilityIds.js";

export async function listFavorites(userId: string) {
  return prisma.devUtilityFavorite.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });
}

export async function listRecent(userId: string, limit = MAX_RECENT_UTILITIES) {
  const rows = await prisma.devUtilityRecent.findMany({
    where: { userId },
    orderBy: { usedAt: "desc" },
    take: limit,
  });

  const seen = new Set<string>();
  return rows.filter((row) => {
    if (seen.has(row.utilityId)) return false;
    seen.add(row.utilityId);
    return true;
  });
}

export async function isFavorite(utilityId: string, userId: string) {
  const row = await prisma.devUtilityFavorite.findFirst({
    where: { utilityId, userId },
  });
  return Boolean(row);
}

export async function addFavorite(utilityId: string, userId: string) {
  return prisma.devUtilityFavorite.upsert({
    where: { userId_utilityId: { userId, utilityId } },
    create: { utilityId, userId },
    update: {},
  });
}

export async function removeFavorite(utilityId: string, userId: string) {
  return prisma.devUtilityFavorite.deleteMany({
    where: { utilityId, userId },
  });
}

export async function recordRecentUse(utilityId: string, userId: string) {
  await prisma.$transaction(async (tx) => {
    await tx.devUtilityRecent.deleteMany({
      where: { utilityId, userId },
    });

    await tx.devUtilityRecent.create({
      data: { utilityId, userId },
    });

    const overflow = await tx.devUtilityRecent.findMany({
      where: { userId },
      orderBy: { usedAt: "desc" },
      skip: MAX_RECENT_UTILITIES,
      select: { id: true },
    });

    if (overflow.length > 0) {
      await tx.devUtilityRecent.deleteMany({
        where: { id: { in: overflow.map((row) => row.id) } },
      });
    }
  });
}
