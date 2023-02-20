import { prisma } from "~/db.server";

export async function getGame(name: string) {
  return prisma.game.findUnique({
    where: { name: name },
    include: { categories: true },
  });
}
export async function getGames() {
  return prisma.game.findMany();
}

export async function createGame(name: string) {
  const gameExists = await getGame(name);
  if (gameExists) {
    return null;
  }
  return prisma.game.create({ data: { name: name } });
}
