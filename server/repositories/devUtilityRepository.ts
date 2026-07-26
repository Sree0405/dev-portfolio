import prisma from "../prisma/client.js";
import type { DataType } from "../auth/config.js";
import { MAX_RECENT_UTILITIES } from "../lib/devUtilityIds.js";

export async function listFavorites(dataType: DataType) {
  return prisma.devUtilityFavorite.findMany({
    where: { type: dataType },
    orderBy: { createdAt: "asc" },
  });
}

export async function listRecent(dataType: DataType, limit = MAX_RECENT_UTILITIES) {
  const rows = await prisma.devUtilityRecent.findMany({
    where: { type: dataType },
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

export async function isFavorite(utilityId: string, dataType: DataType) {
  const row = await prisma.devUtilityFavorite.findFirst({
    where: { utilityId, type: dataType },
  });
  return Boolean(row);
}

export async function addFavorite(utilityId: string, dataType: DataType) {
  return prisma.devUtilityFavorite.upsert({
    where: { type_utilityId: { type: dataType, utilityId } },
    create: { utilityId, type: dataType },
    update: {},
  });
}

export async function removeFavorite(utilityId: string, dataType: DataType) {
  return prisma.devUtilityFavorite.deleteMany({
    where: { utilityId, type: dataType },
  });
}

export async function recordRecentUse(utilityId: string, dataType: DataType) {
  await prisma.$transaction(async (tx) => {
    await tx.devUtilityRecent.deleteMany({
      where: { utilityId, type: dataType },
    });

    await tx.devUtilityRecent.create({
      data: { utilityId, type: dataType },
    });

    const overflow = await tx.devUtilityRecent.findMany({
      where: { type: dataType },
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
