import { prisma } from "~/db.server";

export async function getRunBySlug(slug: string) {
  return prisma.run.findUnique({ where: { slug: slug } });
}

export async function getRunsForGame(gameName: string) {
  return prisma.run.findMany({ where: { gameName: gameName.toLowerCase() } });
}

export async function getRunsForPlayer(playerId: string) {
  return prisma.run.findMany({ where: { users: { some: { id: playerId } } } });
}
