import { prisma } from "~/db.server";

export async function getRunsForGame(gameName: string) {
  return prisma.run.findMany({ where: { gameName: gameName } });
}

export async function getRunsForPlayer(playerId: string) {
  return prisma.run.findMany({ where: { users: { some: { id: playerId } } } });
}
